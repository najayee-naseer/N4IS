import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

/**
 * CMS images are served from Supabase Storage and still go through next/image
 * optimisation. The host is derived from NEXT_PUBLIC_SUPABASE_URL, so the
 * allow-list always matches whichever project the site is connected to.
 */
function storagePattern(): RemotePattern[] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return [];
  try {
    const { protocol, hostname, port } = new URL(url);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // No asset on the site is rendered wider than ~1400 CSS px, so the huge
    // 3840 candidate only ever cost encode time and bandwidth.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384, 512],
    remotePatterns: storagePattern(),
  },
  experimental: {
    // media uploads go browser → Storage directly; actions only carry JSON
    serverActions: { bodySizeLimit: "1mb" },
  },
};

export default nextConfig;
