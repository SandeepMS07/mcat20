/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out", // optional, but keeps Dockerfile and serve command aligned
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
