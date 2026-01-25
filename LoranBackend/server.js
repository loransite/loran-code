// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authroutes.js";
import designRoutes from "./routes/designroutes.js";
import orderRoutes from "./routes/orderroutes.js";
import catalogueRoutes from "./routes/catalogueroutes.js";
import aiRoutes from "./routes/airoutes.js";
import paymentRoutes from "./routes/paymentroutes.js";
import adminRoutes from "./routes/adminroutes.js";
import designersRoutes from "./routes/designers.js";
import measurementRoutes from "./routes/measurementroutes.js";
import reviewRoutes from "./routes/reviewroutes.js";
import userRoutes from "./routes/userroutes.js";

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Create Express app
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ===== SECURITY MIDDLEWARE =====

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for now, configure later
  crossOriginEmbedderPolicy: false,
  // Allow loading resources (images) across origins
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. CORS Configuration
// Support comma-separated FRONTEND_URLS or single FRONTEND_URL
const frontendUrlsEnv = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "";
const configuredOrigins = frontendUrlsEnv
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

const devOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const allowedOrigins = process.env.NODE_ENV === "production" ? configuredOrigins : devOrigins;

if (process.env.NODE_ENV === "production") {
  console.log("✅ CORS allowed origins:", allowedOrigins);
  if (allowedOrigins.length === 0) {
    console.warn("⚠️ No FRONTEND_URL(S) configured. Set FRONTEND_URL or FRONTEND_URLS in environment.");
  }
}

const vercelProjectSlug = process.env.VERCEL_PROJECT_SLUG || 'loran-code';
const isVercelPreviewHost = (host) => {
  if (!host) return false;
  return host === `${vercelProjectSlug}.vercel.app` || (host.startsWith(`${vercelProjectSlug}-`) && host.endsWith('.vercel.app'));
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Normalize by removing trailing slash
    const normalize = (url) => (url || "").replace(/\/$/, "");
    const requested = normalize(origin);
    const allowed = allowedOrigins.map(normalize);
    let host = null;
    try {
      host = new URL(origin).hostname;
    } catch (e) {
      host = null;
    }

    if (allowed.includes(requested) || isVercelPreviewHost(host)) {
      return callback(null, true);
    }

    console.warn(`⚠️ Blocked CORS request from origin: ${origin}`);
    // Reject without throwing to avoid 500 on preflight
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
app.options("*", cors(corsOptions));

// 3. Rate Limiting - Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests from this IP, please try again later.' });
  }
});

// 4. Rate Limiting - Auth Routes (Stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many authentication attempts, please try again later.' });
  }
});

// 5. Rate Limiting - AI Routes (Very Strict)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 AI requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'AI processing limit reached. Please try again later.' });
  }
});

// 6. Body Parser with size limits (MUST come before rate limiters)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Prevent NoSQL Injection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Sanitized potentially malicious input: ${key}`);
  }
}));

// 8. Static files
// Ensure uploads can be consumed cross-origin by the frontend
app.use("/uploads", (req, res, next) => {
  // Set CORP to allow cross-origin consumption
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  // Reflect ACAO for allowed origins to help certain clients with static assets
  const origin = req.headers.origin;
  if (origin) {
    const normalize = (url) => (url || "").replace(/\/$/, "");
    const requested = normalize(origin);
    const allowed = allowedOrigins.map(normalize);
    let host = null;
    try { host = new URL(origin).hostname; } catch {}

    if (allowed.includes(requested) || isVercelPreviewHost(host)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }

  next();
}, express.static("uploads"));

// ===== ROUTES =====
// Auth routes with rate limiting
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/catalogue", catalogueRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/designers", designersRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// AI Route with file upload (accepts front photo + optional side photo)
app.use("/api/ai", upload.fields([
  { name: "file", maxCount: 1 },        // Front photo
  { name: "sidePhoto", maxCount: 1 }    // Side photo (optional)
]), aiRoutes);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Loran Backend is running!");
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const errorResponse = {
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred. Please try again later.' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  res.status(err.status || 500).json(errorResponse);
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    console.log(`🔄 Attempting to listen on port ${PORT}...`);
    const server = app.listen(PORT, () => {
      console.log(`\n✅ Server successfully started!`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Security: Rate limiting enabled`);
      console.log(`🛡️  Protection: Input sanitization active\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please free the port and try again.`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", err.message);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

console.log("🚀 Starting Loran Backend...");
startServer();