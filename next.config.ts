import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // No asset on the site is rendered wider than ~1400 CSS px, so the huge
    // 3840 candidate only ever cost encode time and bandwidth.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384, 512],
  },
};

export default nextConfig;
