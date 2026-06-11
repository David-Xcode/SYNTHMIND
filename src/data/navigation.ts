// ─── 导航结构常量 ───
// SiteHeader 和 SiteFooter 共用，单一来源

interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

// footer 与主导航链接一致，直接复用，避免两份数组漂移
export const footerNav = {
  company: mainNav,
};
