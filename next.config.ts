import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/jet",
  assetPrefix: "/jet",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;