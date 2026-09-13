import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "facility-optimize";

// Cho phép tùy biến basePath qua biến môi trường hoặc mặc định theo tên repo khi deploy production
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : isProd
    ? `/${repoName}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
