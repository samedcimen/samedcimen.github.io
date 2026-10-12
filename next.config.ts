import type { NextConfig } from "next";

// samedcimen.github.io bir kullanıcı sitesi olduğu için kök dizinden yayınlanır (basePath gerekmez).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        // next/font'un ürettiği iç CSS'e dokunma; yoksa `next dev` font URL'lerini çözemez
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
