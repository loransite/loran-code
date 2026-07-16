import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public variables are embedded at build time. The fallback keeps the
  // deployed frontend connected to the Render API if a Vercel environment
  // variable has not yet been added in the project dashboard.
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://loran-code.onrender.com",
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure Turbopack uses the frontend folder as the workspace root
  // to avoid multi-lockfile root inference issues.
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
  turbopack: {
    root: __dirname,
  },
  images: {
    // Needed for local backend uploads (http://localhost:5000/uploads/*) during development.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "https",
        hostname: "loran-code.onrender.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
