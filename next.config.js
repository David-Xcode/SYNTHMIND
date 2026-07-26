/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 路由重命名：case-studies → products
      { source: '/case-studies', destination: '/products', permanent: true },
      { source: '/case-studies/:slug', destination: '/products/:slug', permanent: true },
      // 地产盘旧详情页已打包为聚合详情页 /products/real-estate；
      // avella/rosaleen 从未有过详情页，但补上让 5 盘 slug 空间统一可解析（防猜测 URL 404）
      { source: '/products/unionglens', destination: '/products/real-estate', permanent: true },
      { source: '/products/woodbine-parkside', destination: '/products/real-estate', permanent: true },
      { source: '/products/kingshaven', destination: '/products/real-estate', permanent: true },
      { source: '/products/avella', destination: '/products/real-estate', permanent: true },
      { source: '/products/rosaleen', destination: '/products/real-estate', permanent: true },
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