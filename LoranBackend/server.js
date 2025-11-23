// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
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

// Load environment variables
dotenv.config();

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

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/catalogue", catalogueRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/designers", designersRoutes);

// AI Route with file upload
app.use("/api/ai", upload.single("file"), aiRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Loran Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB connected successfully");

    console.log(`Attempting to listen on port ${PORT}...`);
    const server = app.listen(PORT, () => {
      console.log(`✅ Server successfully listening on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error("❌ Server bind error:", err.message);
      process.exit(1);
    });

    server.on('listening', () => {
      console.log("✅ Server is listening");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

console.log("Starting Loran Backend...");
startServer();