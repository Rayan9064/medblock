/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores all ESLint errors during the build
  },
};

module.exports = nextConfig;
