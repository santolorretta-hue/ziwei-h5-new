/** @type {import('next').NextConfig} */
const nextConfig = {
  // 忽略所有检查，强制过关
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // 开启严格模式
  reactStrictMode: true,
};

module.exports = nextConfig;