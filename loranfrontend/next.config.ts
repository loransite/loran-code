import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even with ESLint warnings
    // Errors will still block the build, but we downgrade problematic rules to warnings
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Keep TypeScript checks enabled
    ignoreBuildErrors: false,
  },
  images: {
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
    ],
  },
};

export default nextConfig;
