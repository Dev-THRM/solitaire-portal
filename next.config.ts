import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
