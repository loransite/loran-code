import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
