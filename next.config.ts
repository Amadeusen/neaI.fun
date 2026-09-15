import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://<owner>.github.io/<repo>/, so a
// static export needs every asset/link prefixed with the repo name.
const repoName = "neaI.fun";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isGithubPages
    ? { basePath: `/${repoName}`, assetPrefix: `/${repoName}/` }
    : {}),
};

export default nextConfig;
