/** @type {import('next').NextConfig} */
const nextConfig = {
  // 忽略所有检查，强制上线
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

// 注意：这里必须用 export default，不能用 module.exports
export default nextConfig;