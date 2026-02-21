// ─── 导航结构常量 ───
// SiteHeader 和 SiteFooter 共用，单一来源

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: 'About', href: '/about' },
  {
    label: 'Industries',
    href: '#',
    children: [
      { label: 'Insurance', href: '/industries/insurance' },
      { label: 'Real Estate', href: '/industries/real-estate' },
      { label: 'Accounting & Tax', href: '/industries/accounting-tax' },
      { label: 'Construction', href: '/industries/construction' },
    ],
  },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Case Studies', href: '/case-studies' },
  ],
  industries: [
    { label: 'Insurance', href: '/industries/insurance' },
    { label: 'Real Estate', href: '/industries/real-estate' },
    { label: 'Accounting & Tax', href: '/industries/accounting-tax' },
    { label: 'Construction', href: '/industries/construction' },
  ],
  projects: [
    { label: 'Easy-Sign', href: '/case-studies/easy-sign' },
    { label: 'T-ONE Submit', href: '/case-studies/t-one-submit' },
    { label: 'Onest Insurance', href: '/case-studies/onest-insurance' },
    { label: 'BrokerTool.ai', href: '/case-studies/brokertool-ai' },
    { label: 'UnionGlens', href: '/case-studies/unionglens' },
    { label: 'GetAX', href: '/case-studies/getax' },
  ],
};
