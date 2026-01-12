/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    API_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'notice-board-backend-sigma.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
