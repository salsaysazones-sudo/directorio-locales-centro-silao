import type { NextConfig } from "next";

// Modo estático para Cloudflare: BUILD_STATIC=1 bun run build
// En dev (next dev) todo funciona normal con APIs + SQLite
const isStaticBuild = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  // Cuando BUILD_STATIC=1 generamos sitio estático en ./out/
  ...(isStaticBuild
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: false,
      }
    : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
