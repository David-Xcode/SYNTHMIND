// ─── 行业数据层 ───
// 4 个垂直行业，各含痛点描述和概述，关联到 case-studies.ts 中的项目

import type { IndustrySlug } from './case-studies';

export interface PainPoint {
  title: string;
  description: string;
}

export interface Industry {
  slug: IndustrySlug;
  name: string;
  headline: string;
  description: string;
  painPoints: PainPoint[];
  ctaText: string;
}

export const industries: Industry[] = [
  {
    slug: 'insurance',
    name: 'Insurance',
    headline: 'AI Solutions for Insurance Brokerages',
    description:
      'Insurance is still powered by paper forms, manual data entry, and fragmented carrier portals. Synthmind builds tools that automate the repetitive parts — so brokers can focus on clients, not paperwork.',
    painPoints: [
      {
        title: 'Manual Document Processing',
        description:
          'Printing, scanning, mailing documents for signatures. Every policy change means another round of paper shuffling that takes days instead of minutes.',
      },
      {
        title: 'Fragmented Carrier Systems',
        description:
          'Brokers log into 4-6 different carrier portals daily, re-entering the same client data each time. No single source of truth.',
      },
      {
        title: 'Slow Quoting Turnaround',
        description:
          'Comparing quotes across carriers is a manual spreadsheet exercise. Clients expect instant answers but getting quotes takes hours.',
      },
      {
        title: 'Lead Follow-up Gaps',
        description:
          "After-hours inquiries go unanswered. New leads slip through the cracks because there's no system for 24/7 engagement.",
      },
    ],
    ctaText: 'Ready to modernize your insurance workflows?',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    headline: 'Digital Experiences for Real Estate Developers',
    description:
      "In real estate, first impressions are everything. Synthmind builds high-performance marketing websites and lead capture systems that match the quality of what you're building — from pre-construction launches to established communities.",
    painPoints: [
      {
        title: 'Weak Digital Presence',
        description:
          "Most developer websites are static brochure-ware that don't convert. In a market where buyers research online first, a generic site means lost leads.",
      },
      {
        title: 'Pre-Construction Marketing Gap',
        description:
          "Selling before the building exists requires compelling digital storytelling. Flyers and PDFs don't create the excitement needed to drive registrations.",
      },
      {
        title: 'Disconnected Lead Pipelines',
        description:
          'Website inquiries, walk-ins, and agent referrals live in separate systems. No unified view of the buyer journey.',
      },
    ],
    ctaText: 'Ready to elevate your real estate marketing?',
  },
  {
    slug: 'accounting-tax',
    name: 'Accounting & Tax',
    headline: 'Modern Web Presence for Accounting Firms',
    description:
      'Accounting firms compete on trust and expertise, but outdated websites undermine both. Synthmind builds professional, lead-generating websites that position your firm as the accessible expert clients are searching for.',
    painPoints: [
      {
        title: 'Outdated Web Presence',
        description:
          'Your website looks like it was built in 2010. Potential clients judge credibility by your online presence before they ever call.',
      },
      {
        title: 'Referral-Only Growth',
        description:
          'Most client acquisition comes from word-of-mouth. Online channels — the biggest growth opportunity — remain completely untapped.',
      },
      {
        title: 'No Online Lead Capture',
        description:
          'Potential clients visit your site, see a phone number, and leave. No forms, no booking system, no way to capture intent outside business hours.',
      },
    ],
    ctaText: 'Ready to grow your accounting practice online?',
  },
  {
    slug: 'construction',
    name: 'Construction',
    headline: 'AI Automation for Construction Companies',
    description:
      'Construction runs on documents — permits, drawings, change orders, RFIs. Synthmind builds AI-powered systems that handle the paperwork so your project managers can focus on building.',
    painPoints: [
      {
        title: 'Document Submission Chaos',
        description:
          'Every municipality and GC has different formatting requirements. Manual document preparation eats hours per week and errors mean costly resubmissions.',
      },
      {
        title: 'No Submission Tracking',
        description:
          'Once documents are submitted, tracking approval status means emails, phone calls, and spreadsheets. No real-time visibility.',
      },
      {
        title: 'Scaling Pain',
        description:
          'Adding a new project means adding more admin overhead. The document management process that works for 2 projects breaks at 5.',
      },
    ],
    ctaText: 'Ready to automate your construction workflows?',
  },
];

// ─── 查询函数 ───

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((ind) => ind.slug === slug);
}

export function getAllIndustrySlugs(): IndustrySlug[] {
  return industries.map((ind) => ind.slug);
}
