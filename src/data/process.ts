// ─── 交付流程数据层 ───
// 四步流程，两处消费同源（IA v1 §3）：about 页 04 Process 四卡用 description，
// 首页 03 方法带用 summary（紧凑单行版，一句话）。此前只存在于 about 页面
// 常量里——首页要复述同一套流程，不复制第二份文案。

export interface ProcessStep {
  title: string;
  /** 一句话版 — 首页紧凑方法带专用（非卡片形态，不能超过一行阅读量） */
  summary: string;
  /** 完整说明 — about 页流程卡专用 */
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Discover',
    summary: 'We shadow your team and map where the week actually goes.',
    description:
      'We observe your team in action — shadowing workflows, mapping pain points, and identifying the highest-impact automation opportunities.',
  },
  {
    title: 'Design',
    summary: 'Working prototypes instead of wireframes, so feedback is real.',
    description:
      'Rapid prototyping with real UI, not wireframes. You interact with working mockups so feedback is concrete and cycles are short.',
  },
  {
    title: 'Build',
    summary: 'Weekly demos of production-quality code — no handoffs.',
    description:
      'Iterative development with weekly demos. Our engineers ship production-quality code every sprint — no handoffs, no waiting.',
  },
  {
    title: 'Scale',
    summary: 'We stay on after launch to tune and extend what shipped.',
    description:
      'Deployment, monitoring, and continuous optimization. We stay engaged post-launch to tune performance and extend capabilities as your needs grow.',
  },
];
