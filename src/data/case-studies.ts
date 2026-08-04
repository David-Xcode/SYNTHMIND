// ─── 产品数据层 ───
// 4 个软件产品案例，供产品展示页与详情页使用
// 地产营销站见 real-estate.ts（清单不在此复述——手抄的盘名必然过期）
// ⚠️ BrokerTool 已于 2026-08-03 移出：它是**在建**旗舰平台（AI 原生 BMS），
// 不属于 shipped 口径——旧条目把它写成已交付的 AI 客服助理，与现实冲突。
// 它的介绍住 InDevelopmentShowcase + /products/brokerage-platform + brokertool.ca
// 产品站（2026-08-04 换址到 .ca，同日改名去掉 `.ai` 后缀——产品名与地址现在
// 只差一个 `.ca`，但仍是两样东西）；
// 旧详情页 slug 在 next.config.js 308 到 /products/brokerage-platform

/** 成果条目 — 大数字上不上卡由文案作者**显式授权**，不再由正则从散文反解。
 * 带 `value` → StatCard 大数字卡（value 在上、label 在下）；
 * 只有 `label` → bullet 直排整句。
 * 🚨 铁律：不虚构数字——没写 value 就是 bullet，宁可少一张卡也不猜。
 * 2026-07-27 退役了原 ResultsSection 里 200+ 行的启发式解析器：它会把
 * 改造前的旧基线、裸年份读成成果度量，改一个措辞就静默改掉对外页面上的
 * 大数字，且仓库无测试基建兜底。数字写什么，就在这里写死。 */
export interface CaseStudyResult {
  /** 统计值原文，如 '15 minutes' / '90%' / '2 weeks'；省略即走 bullet。
   * 形如「整数 + 非数字后缀」的值会被 StatCard 做 count-up，其余原样静态输出 */
  value?: string;
  /** 有 value 时 = 数字下方的说明标签；无 value 时 = bullet 整句 */
  label: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  /** 行业眉标（mono 大写展示用，如 "INSURANCE"）— 卡片与详情页元数据行消费。
   * 注意：这是展示标签，不是「服务行业数」的计数源，后者见 INDUSTRIES_SERVED */
  industry: string;
  url: string;
  logo: string;
  /** 首页 02 精选段收录标记 — 精选口径 = 覆盖 BMS 三块已上线的核心能力
   * （AI 文档处理 / 电子签署 / 保险运营自动化），各占一个不同行业。
   * 2026-08-03 起「保险」名额由 Onest Insurance 承担（BrokerTool 移出
   * shipped 后，精选只收真正已交付的产品） */
  featured?: boolean;
  challenge: string[];
  solution: string[];
  results: CaseStudyResult[];
  techStack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'easy-sign',
    title: 'Easy-Sign',
    tagline:
      'Affordable e-signature platform built for Canadian small businesses.',
    industry: 'Small business',
    url: 'https://www.easy-sign.ca/',
    logo: '/product/easy-sign.png',
    featured: true,
    challenge: [
      'Small businesses relied on printing, mailing, and scanning paper documents for client signatures — a process that could take days for contracts, onboarding forms, and service agreements.',
      'Compliance requirements meant every signed document needed to be stored securely with a full audit trail, but most small businesses were using filing cabinets or loosely organized shared drives.',
      'Existing e-signature platforms like DocuSign were too expensive per-envelope for the volume of documents small businesses handle.',
    ],
    solution: [
      'Built a purpose-designed e-signature platform tailored to small business workflows — contracts, intake forms, and service agreements each have a dedicated template and signing flow.',
      'Implemented secure document storage with automatic audit trail generation, including timestamps, IP addresses, and signer verification for compliance.',
      'Developed a flat-rate pricing model that makes unlimited signatures affordable for small businesses, removing the per-envelope cost barrier.',
    ],
    results: [
      {
        value: 'under 15 minutes',
        label: 'Reduced document turnaround from days',
      },
      {
        label:
          'Full audit trail for compliance — every signature timestamped and verifiable',
      },
      { label: 'Flat-rate pricing costs a fraction of per-envelope platforms' },
      { label: 'Serving small businesses across Canada' },
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'AWS S3',
      'PDF.js',
    ],
  },
  {
    slug: 't-one-submit',
    title: 'T-ONE Submit',
    tagline: 'AI-powered construction document submission system.',
    industry: 'Construction',
    url: 'https://www.t-onegroup.com/',
    logo: '/product/T_One.png',
    featured: true,
    challenge: [
      'Construction companies submit hundreds of documents per project — permits, drawings, change orders, RFIs — each with different formatting requirements from different municipalities and general contractors.',
      'Manual document preparation was error-prone: missing fields, wrong formats, and incomplete submissions caused delays and rework.',
      'Project managers spent hours per week organizing, formatting, and tracking the status of document submissions.',
    ],
    solution: [
      'Built an AI-powered submission system that automatically validates document completeness, checks formatting against municipality requirements, and flags missing information before submission.',
      "Developed intelligent document templates that adapt to each municipality's requirements, auto-populating fields from project data.",
      'Created a real-time tracking dashboard for submission status, with automated reminders for pending approvals and resubmissions.',
    ],
    results: [
      { label: 'Cut document preparation from hours to minutes' },
      { label: 'Sharply reduced submission rejections from formatting errors' },
      { label: 'Real-time tracking eliminated manual follow-up emails' },
      {
        label:
          'Scaled across multiple active construction projects simultaneously',
      },
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Gemini AI',
      'Node.js',
      'PostgreSQL',
      'Tailwind CSS',
    ],
  },
  {
    slug: 'onest-insurance',
    title: 'Onest Insurance',
    tagline:
      'Streamlined quote intake and automated policy notification system for insurance brokers.',
    industry: 'Insurance',
    url: 'https://www.onestinsurance.ca/',
    logo: '/product/onest-logo-cropped.svg',
    featured: true,
    challenge: [
      'Brokers relied on phone calls and emails to collect client information for insurance quotes — a slow, error-prone process that created data entry bottlenecks.',
      'Once policies were prepared and ready in the carrier portal, brokers had to manually notify each client individually, consuming valuable time on routine follow-up.',
      'The lack of a self-service intake channel meant brokers spent more time on administrative communication than on advising clients and closing deals.',
    ],
    solution: [
      'Built an online quote request platform where clients can submit their insurance needs and personal details directly, replacing manual phone and email intake.',
      "Developed an automated email notification system that alerts clients when their policy documents are ready, directing them to download from the insurance company's portal.",
      'Streamlined the end-to-end workflow from initial quote request to policy delivery notification, freeing brokers to focus on client advising rather than administrative tasks.',
    ],
    results: [
      {
        label:
          'Eliminated manual client intake — clients self-serve via online quote request form',
      },
      {
        label:
          'Automated policy-ready notifications removed repetitive broker follow-up work',
      },
      { label: 'Faster turnaround from quote request to client notification' },
      {
        label:
          'Brokers handle more clients with significantly less administrative overhead',
      },
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Email Automation',
      'Tailwind CSS',
      'Vercel',
    ],
  },
  {
    slug: 'getax',
    title: 'GE Tax',
    tagline:
      'Professional website & bookkeeping app for a CPA firm in Toronto.',
    industry: 'Accounting & tax',
    url: 'https://www.getax.ca/',
    logo: '/product/getax.png',
    challenge: [
      'A Toronto-based CPA firm needed a professional web presence to attract new clients, but their existing site was outdated and not generating any inbound leads.',
      'Tax and accounting services are commoditized — the firm needed a way to differentiate from larger competitors and convey their personalized approach.',
      'Most of their client acquisition came from referrals, leaving significant growth potential from online channels untapped.',
      'Clients relied on shoeboxes of paper receipts and manual data entry for bookkeeping — accounting staff spent hours each month chasing down missing records before they could start actual tax work.',
    ],
    solution: [
      "Built a modern, trust-building website that highlights the firm's personal approach, credentials, and service specializations — positioning them as accessible experts rather than a faceless firm.",
      'Implemented a multi-channel lead generation system: contact forms, service-specific inquiry flows, and a consultation booking mechanism.',
      'Optimized for local SEO targeting "accountant Toronto", "tax services Toronto", and related queries to capture organic search traffic.',
      'Developed a bookkeeping app that lets clients snap photos of receipts, automatically extract transaction details via OCR, and sync records directly to the accounting firm — eliminating manual data entry and reducing back-and-forth.',
    ],
    results: [
      { value: '2 weeks', label: 'New professional web presence launched' },
      { label: 'Lead generation forms capturing qualified prospects monthly' },
      { label: 'Local SEO positioning for key accounting search terms' },
      {
        label: 'Mobile-responsive design with professional credibility signals',
      },
      {
        label:
          'Receipt-to-ledger time cut from days to minutes with photo-scan bookkeeping',
      },
    ],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vercel',
      'SEO',
      'OCR',
    ],
  },
];

// ─── 查询函数 ───

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}

/** 首页 02 精选段 — 数组顺序即展示顺序，取消 featured 标记即从首页下架 */
export const featuredCaseStudies = caseStudies.filter((cs) => cs.featured);

/** 详情页页尾闭环：相邻案例（顺序派生，首尾环绕成闭环，永不出现死胡同） */
export function getAdjacentCaseStudies(slug: string): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
} {
  const index = caseStudies.findIndex((cs) => cs.slug === slug);
  const size = caseStudies.length;
  // 未收录（理论上不可达：详情页先 notFound）或只有一条时不给导航
  if (index === -1 || size < 2) return { prev: null, next: null };
  // 恰好两条：环绕会让 prev 与 next 指向同一条，并排渲染成两张同链接的卡
  // ——只给 next（另一条仍是「下一站」，页尾不回退成死胡同）
  if (size === 2) return { prev: null, next: caseStudies[(index + 1) % 2] };
  return {
    prev: caseStudies[(index - 1 + size) % size],
    next: caseStudies[(index + 1) % size],
  };
}
