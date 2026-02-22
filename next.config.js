/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // lint 由 Biome 处理，跳过 Next.js 内置 ESLint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 