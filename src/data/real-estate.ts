// ─── 地产营销站数据层 ───
// 已上线楼盘营销站，打包为一个项目：/products 作品网格一张项目卡 +
// /products/real-estate 聚合详情页（卡片外链真实站点）。
// 旧盘详情页 slug 在 next.config.js 中 permanent:true（= 308）重定向到聚合页。
// 收录纪律：只收已上线的盘 — 未上线站点（域名未解析）不进这份数组

export interface RealEstateSite {
  /** 用于 React key 与旧路由 301 对照 */
  slug: string;
  name: string;
  location: string;
  /** 一句话简介（模块卡片展示用） */
  description: string;
  /** 2-3 个关键能力标签 */
  highlights: string[];
  /** 真实站点外链 */
  url: string;
  logo: string;
}

export const realEstateSites: RealEstateSite[] = [
  {
    slug: 'avella',
    name: 'Avella Townhomes',
    location: 'Aurora, ON',
    description:
      'VIP registration site for a Treasure Hill townhome community — warm Italian-inspired design system, bilingual scripted assistant, and automated lead capture with email confirmation.',
    highlights: [
      'Bilingual assistant (EN & 中文)',
      'VIP lead capture',
      'Custom design system',
    ],
    url: 'https://www.liveatavella.ca',
    logo: '/product/avella.png',
  },
  {
    slug: 'kingshaven',
    name: 'Kingshaven',
    location: 'Markham, ON',
    description:
      "Six-page marketing site for Ontario's first agri-community of freehold towns — one source-of-truth data file drives the UI, the Gemini-powered AI assistant, and the SEO structured data.",
    highlights: [
      'Gemini AI assistant (EN & 中文)',
      'Single source-of-truth data',
      'JSON-LD structured data',
    ],
    url: 'https://www.kingshavenuppermarkham.ca',
    logo: '/product/kingshaven.png',
  },
  {
    slug: 'woodbine-parkside',
    name: 'Woodbine Parkside',
    location: 'Markham, ON',
    description:
      'Premium dark-theme site for luxury freehold homes — 24/7 AI chat answers buyer questions in real time, and an online booking system schedules private viewings.',
    highlights: ['24/7 AI chat', 'Event booking system', 'Luxury dark design'],
    url: 'https://www.woodbineparkside.ca',
    logo: '/product/woodbine-parkside.svg',
  },
  {
    slug: 'unionglens',
    name: 'UnionGlens',
    location: 'Markham, ON',
    description:
      'Pre-construction marketing presence for a master-planned community — immersive visual storytelling with pipeline-integrated lead capture, launched in under three weeks.',
    highlights: [
      '3-week launch',
      'Pipeline-integrated leads',
      '95+ Lighthouse score',
    ],
    url: 'https://www.unionglens.com',
    logo: '/product/unionglens.svg',
  },
  {
    slug: 'rosaleen',
    name: 'Rosaleen',
    location: 'Richmond Hill, ON',
    description:
      'Print-inspired marketing site for a semi-town collection at Auden Grand — serif editorial typography, engraved linework, a six-page architecture, and modal-driven lead capture.',
    highlights: [
      'Print-inspired design',
      'Six-page site',
      'Modal lead capture',
    ],
    url: 'https://www.rosaleenataudengrand.ca',
    logo: '/product/rosaleen.svg',
  },
  {
    slug: 'quitowns',
    name: 'QUI Modern Towns',
    location: 'Markham, ON',
    description:
      'Six-page launch site for a two-collection towns development across from Mount Joy GO — weekend preview dates derive themselves from the calendar each week, backed by VIP registration and automated email confirmation.',
    highlights: [
      'Self-advancing event dates',
      'Two home collections',
      'VIP registration',
    ],
    url: 'https://www.quitownsmarkham.ca',
    logo: '/product/quitowns.png',
  },
  {
    slug: 'bridle-path',
    name: 'The Bridle Path Condos',
    location: 'Toronto, ON',
    description:
      "Two-address condominium launch in Toronto's Bridle Path — a single dynamic route renders both buildings from one fact sheet, each carrying its own typographic voice, with priority registration throughout.",
    highlights: [
      'Two addresses, one route',
      'Dual typographic voices',
      'Priority registration',
    ],
    url: 'https://www.thebridlepathcondos.ca',
    logo: '/product/bridle-path.svg',
  },
  {
    slug: 'montara',
    name: 'Montara',
    location: 'Aurora, ON',
    description:
      'Golf-side townhome collection backing onto Magna Golf Club — a five-page site pairing a floor plan and elevation library with neighbourhood storytelling and a registration pipeline wired to automated follow-up.',
    highlights: [
      'Plan & elevation library',
      'Five-page site',
      'Automated lead follow-up',
    ],
    url: 'https://www.auroramontarahomes.ca',
    logo: '/product/montara.svg',
  },
];
