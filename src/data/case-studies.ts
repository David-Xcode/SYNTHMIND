// ─── 案例研究数据层 ───
// 6 个真实客户项目，按行业分类，供模板页和筛选函数使用

export type IndustrySlug = 'insurance' | 'real-estate' | 'accounting-tax' | 'construction';

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  industry?: IndustrySlug;
  industryLabel?: string;
  url: string;
  logo: string;
  challenge: string[];
  solution: string[];
  results: string[];
  techStack: string[];
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'easy-sign',
    title: 'Easy-Sign',
    tagline: 'Affordable e-signature platform built for Canadian small businesses.',
    url: 'https://www.easy-sign.ca/',
    logo: '/product/easy-sign.png',
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
      'Reduced document turnaround from days to under 15 minutes',
      'Full audit trail for compliance — every signature timestamped and verifiable',
      'Flat-rate pricing saved businesses 60%+ compared to per-envelope platforms',
      'Trusted by hundreds of small businesses across Canada',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS S3', 'PDF.js'],
    featured: true,
  },
  {
    slug: 't-one-submit',
    title: 'T-ONE Submit',
    tagline: 'AI-powered construction document submission system.',
    industry: 'construction',
    industryLabel: 'Construction',
    url: 'https://www.t-onegroup.com/',
    logo: '/product/T_One.png',
    challenge: [
      'Construction companies submit hundreds of documents per project — permits, drawings, change orders, RFIs — each with different formatting requirements from different municipalities and general contractors.',
      'Manual document preparation was error-prone: missing fields, wrong formats, and incomplete submissions caused delays and rework.',
      'Project managers spent hours per week organizing, formatting, and tracking the status of document submissions.',
    ],
    solution: [
      'Built an AI-powered submission system that automatically validates document completeness, checks formatting against municipality requirements, and flags missing information before submission.',
      'Developed intelligent document templates that adapt to each municipality\'s requirements, auto-populating fields from project data.',
      'Created a real-time tracking dashboard for submission status, with automated reminders for pending approvals and resubmissions.',
    ],
    results: [
      'Cut document preparation time by 70%',
      'Reduced submission rejections due to formatting errors by 85%',
      'Real-time tracking eliminated manual follow-up emails',
      'Scaled across multiple active construction projects simultaneously',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Gemini AI', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    featured: true,
  },
  {
    slug: 'onest-insurance',
    title: 'Onest Insurance',
    tagline: 'Streamlined quote intake and automated policy notification system for insurance brokers.',
    industry: 'insurance',
    industryLabel: 'Insurance',
    url: 'https://www.onestinsurance.ca/',
    logo: '/product/onest-logo-cropped.svg',
    challenge: [
      'Brokers relied on phone calls and emails to collect client information for insurance quotes — a slow, error-prone process that created data entry bottlenecks.',
      'Once policies were prepared and ready in the carrier portal, brokers had to manually notify each client individually, consuming valuable time on routine follow-up.',
      'The lack of a self-service intake channel meant brokers spent more time on administrative communication than on advising clients and closing deals.',
    ],
    solution: [
      'Built an online quote request platform where clients can submit their insurance needs and personal details directly, replacing manual phone and email intake.',
      'Developed an automated email notification system that alerts clients when their policy documents are ready, directing them to download from the insurance company\'s portal.',
      'Streamlined the end-to-end workflow from initial quote request to policy delivery notification, freeing brokers to focus on client advising rather than administrative tasks.',
    ],
    results: [
      'Eliminated manual client intake — clients self-serve via online quote request form',
      'Automated policy-ready notifications removed repetitive broker follow-up work',
      'Faster turnaround from quote request to client notification',
      'Brokers handle more clients with significantly less administrative overhead',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Email Automation', 'Tailwind CSS', 'Vercel'],
    featured: true,
  },
  {
    slug: 'brokertool-ai',
    title: 'BrokerTool.ai',
    tagline: 'AI assistant purpose-built for insurance brokers.',
    industry: 'insurance',
    industryLabel: 'Insurance',
    url: 'https://brokertool.ai/',
    logo: '/product/brokertool.png',
    challenge: [
      'Insurance brokers spend significant time answering repetitive client questions about coverage details, policy terms, and claim procedures.',
      'New brokers face a steep learning curve — insurance products are complex, and training takes months before they can confidently handle client inquiries.',
      'After-hours client inquiries went unanswered until the next business day, risking lost leads.',
    ],
    solution: [
      'Built an AI assistant trained on insurance industry knowledge that handles common client inquiries 24/7, from coverage explanations to claims guidance.',
      'Developed a broker-facing knowledge base that helps new brokers quickly find policy details and comparison points during client calls.',
      'Implemented lead capture and qualification — the AI identifies high-intent prospects and routes them to the appropriate broker with context.',
    ],
    results: [
      'Automated 60% of repetitive client inquiries',
      'Reduced new broker training time by providing instant knowledge access',
      '24/7 lead capture with intelligent qualification',
      'Seamless handoff from AI to human broker with full context preserved',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Gemini AI', 'Tailwind CSS', 'Vercel'],
    featured: false,
  },
  {
    slug: 'unionglens',
    title: 'UnionGlens',
    tagline: 'Marketing website for a master-planned community in Markham.',
    industry: 'real-estate',
    industryLabel: 'Real Estate',
    url: 'https://www.unionglens.com/',
    logo: '/product/unionglens.svg',
    challenge: [
      'A new master-planned community in Markham needed a digital presence that could showcase the development vision and capture buyer interest before construction began.',
      'The developer needed to convey premium positioning and community lifestyle through the website, competing against established builders with larger marketing budgets.',
      'Traditional real estate websites are static brochure-ware — the developer wanted something that felt modern and would stand out to potential buyers.',
    ],
    solution: [
      'Designed and built a premium marketing website with immersive visual storytelling — showcasing the community vision through carefully crafted layouts, renderings, and neighborhood highlights.',
      'Implemented a lead capture system integrated with the developer\'s sales pipeline, allowing prospective buyers to register interest and receive updates.',
      'Built with performance-first architecture — fast loading times and SEO optimization to capture organic search traffic for "new homes in Markham" queries.',
    ],
    results: [
      'Launched pre-construction marketing presence in under 3 weeks',
      'Lead capture integrated directly with sales pipeline',
      'Mobile-first design with 95+ Lighthouse performance score',
      'SEO-optimized for local real estate search queries',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'SEO'],
    featured: false,
  },
  {
    slug: 'getax',
    title: 'GetAX',
    tagline: 'Professional website for a CPA firm in Toronto.',
    industry: 'accounting-tax',
    industryLabel: 'Accounting & Tax',
    url: 'https://www.getax.ca/',
    logo: '/product/getax.png',
    challenge: [
      'A Toronto-based CPA firm needed a professional web presence to attract new clients, but their existing site was outdated and not generating any inbound leads.',
      'Tax and accounting services are commoditized — the firm needed a way to differentiate from larger competitors and convey their personalized approach.',
      'Most of their client acquisition came from referrals, leaving significant growth potential from online channels untapped.',
    ],
    solution: [
      'Built a modern, trust-building website that highlights the firm\'s personal approach, credentials, and service specializations — positioning them as accessible experts rather than a faceless firm.',
      'Implemented a multi-channel lead generation system: contact forms, service-specific inquiry flows, and a consultation booking mechanism.',
      'Optimized for local SEO targeting "accountant Toronto", "tax services Toronto", and related queries to capture organic search traffic.',
    ],
    results: [
      'New professional web presence launched in 2 weeks',
      'Lead generation forms capturing qualified prospects monthly',
      'Local SEO positioning for key accounting search terms',
      'Mobile-responsive design with professional credibility signals',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'SEO'],
    featured: false,
  },
];

// ─── 查询函数 ───

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getCaseStudiesByIndustry(industry: IndustrySlug): CaseStudy[] {
  return caseStudies.filter((cs) => cs.industry === industry);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((cs) => cs.featured);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
