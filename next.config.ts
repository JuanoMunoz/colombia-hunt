import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CDN de UploadThing (ver `design.md` §4): optimización AVIF/WebP al servir.
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "*.uploadthing.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
