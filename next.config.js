/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // lint 由 Biome 处理，跳过 Next.js 内置 ESLint
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // 路由重命名：case-studies → products
      { source: '/case-studies', destination: '/products', permanent: true },
      { source: '/case-studies/:slug', destination: '/products/:slug', permanent: true },
      // 已删除路由：industries → products 列表页
      // 旧 slug (insurance, real-estate, accounting-tax, construction) 无对应 product，统一到列表页
      { source: '/industries', destination: '/products', permanent: true },
      { source: '/industries/:path*', destination: '/products', permanent: true },
      // 已移除的 admin 后台
      { source: '/admin', destination: '/', permanent: true },
      { source: '/admin/:path*', destination: '/', permanent: true },
    ];
  },
}

module.exports = nextConfig 