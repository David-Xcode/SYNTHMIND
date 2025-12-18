/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14+ 默认使用 App Router，无需 experimental.appDir
  eslint: {
    // 使用 ESLint 9 flat config
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 