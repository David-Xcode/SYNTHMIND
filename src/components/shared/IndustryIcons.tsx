// ─── 行业自定义图标 · Neural ───
// 统一 API: viewBox="0 0 24 24", stroke, strokeWidth=1.5
// 适配 w-5 (卡片) 到 w-80 (Hero 水印) 尺寸

import type { ComponentType, SVGProps } from 'react';

// 保险: 盾牌 + 心电图脉冲线 — 保障与生命
function InsuranceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* 盾牌轮廓 */}
      <path d="M12 2l7.5 3.5v5c0 5.25-3.15 9.5-7.5 11.5C7.65 20 4.5 15.75 4.5 10.5v-5L12 2z" />
      {/* ECG 脉冲线 */}
      <polyline points="6.5,13 9,13 10,10 12,16 14,11 15,13 17.5,13" />
    </svg>
  );
}

// 房地产: 多层建筑 + 窗户网格 — 几何建筑质感
function RealEstateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* 建筑主体 */}
      <rect x="4" y="3" width="10" height="18" rx="1" />
      {/* 附楼 */}
      <path d="M14 9h5a1 1 0 011 1v11H14" />
      {/* 主楼窗户: 2×3 网格 */}
      <line x1="7" y1="6.5" x2="7" y2="7.5" />
      <line x1="11" y1="6.5" x2="11" y2="7.5" />
      <line x1="7" y1="10" x2="7" y2="11" />
      <line x1="11" y1="10" x2="11" y2="11" />
      <line x1="7" y1="13.5" x2="7" y2="14.5" />
      <line x1="11" y1="13.5" x2="11" y2="14.5" />
      {/* 附楼窗户 */}
      <line x1="17" y1="12.5" x2="17" y2="13.5" />
      <line x1="17" y1="16" x2="17" y2="17" />
      {/* 入口门 */}
      <path d="M8 21v-3h2v3" />
    </svg>
  );
}

// 会计税务: 账本 + 美元符号 — 财务文档
function AccountingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* 账本封面 */}
      <path d="M4 4a1 1 0 011-1h10a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      {/* 书脊装饰 */}
      <line x1="7" y1="3" x2="7" y2="21" />
      {/* 账本横线 */}
      <line x1="9.5" y1="7" x2="13.5" y2="7" />
      <line x1="9.5" y1="10" x2="13.5" y2="10" />
      <line x1="9.5" y1="13" x2="12" y2="13" />
      {/* 美元符号 (右侧) */}
      <path d="M19 8.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5" />
      <line x1="17.5" y1="6" x2="17.5" y2="7" />
      <line x1="17.5" y1="13" x2="17.5" y2="14" />
    </svg>
  );
}

// 建筑工程: 塔吊 — 几何线条 Neural 美学
function ConstructionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* 塔身 (垂直) */}
      <line x1="8" y1="6" x2="8" y2="21" />
      {/* 底座 */}
      <line x1="5" y1="21" x2="11" y2="21" />
      {/* 悬臂 (水平) */}
      <line x1="3" y1="6" x2="20" y2="6" />
      {/* 配重斜撑 */}
      <line x1="3" y1="6" x2="6" y2="10" />
      {/* 前臂斜撑 */}
      <line x1="8" y1="10" x2="20" y2="6" />
      {/* 塔身加强斜线 */}
      <line x1="8" y1="10" x2="8" y2="10" />
      {/* 吊绳 */}
      <line x1="17" y1="6" x2="17" y2="11" />
      {/* 吊钩 */}
      <path d="M15.5 11h3M17 11v1.5a1.5 1.5 0 01-3 0" />
    </svg>
  );
}

// 导出统一映射 — key 匹配 industry.slug
export const industryIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  insurance: InsuranceIcon,
  'real-estate': RealEstateIcon,
  'accounting-tax': AccountingIcon,
  construction: ConstructionIcon,
};
