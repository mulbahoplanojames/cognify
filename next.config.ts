import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
        port: "",
      },
    ],
  },
};

export default nextConfig;
