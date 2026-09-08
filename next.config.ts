import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/jet-skills",
  assetPrefix: "/jet-skills/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;