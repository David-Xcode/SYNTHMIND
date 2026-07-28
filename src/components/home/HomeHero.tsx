// ─── 首页 Hero · Blueprint ───
// 左文案 + 右轴测物件的不对称分栏；视频背景已移除（LCP 减重 + 消除微信 WebView 包袱）
// Server Component — 动效走 CSS（word-reveal / animate-reveal / hero-tilt）与
// client 叶子（HeroObjectPhysics 弹簧物理，桌面专属）
// 副标题为 Server 直出词级 CSS 入场：不依赖 hydration——微信 WebView JS 失效时
// 仍完整渲染（TextReveal 的 JS 可见性路径在该渠道真机翻过车，2026-07-26）
// 移动端（<lg）：物件为横陈 ELEV. 变体，与文案同屏构成首屏叙事（v3 定案）

import { Fragment } from 'react';
import ModuleButton from '@/components/shared/ModuleButton';
import SheetLabel from '@/components/shared/SheetLabel';
import BlueprintObject from './BlueprintObject';
import HeroObjectPhysics from './HeroObjectPhysics';
import HeroObjectViewportGate from './HeroObjectViewportGate';

// 首页讲「我们做什么」；「我们为何存在」归 About hero——两处副标题
// 不再逐字重复（v7 文案审计定案），身份标签全站回避
const SUBTITLE_WORDS =
  'We build AI tools that actually work — workflow automation, legacy modernization, and custom software for insurance, real estate, accounting, and construction.'.split(
    ' ',
  );

export default function HomeHero() {
  return (
    // overflow-clip-safe：clip 不创建 scroll container，保证 view() 时间轴找到根滚动器
    // 移动端 items-start：items-center 在 <lg 会把超高内容推出折叠线（v2 实测缺陷）
    // 背景 = layout 级 fixed 深空引力场（VoidField，内容从背景前滚过），本节不再持有底色与网格
    <section className="relative flex min-h-svh-safe items-start overflow-clip-safe lg:items-center">
      {/* 背景光晕装饰 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* 主光晕 — 顶部偏左 */}
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-accent/[0.04] blur-[120px]" />
        {/* 辅助光晕 — 右下 */}
        <div className="absolute top-1/3 right-[10%] h-[320px] w-[320px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      {/* 内容区 — 不对称分栏（左 7 / 右 5）；移动端节奏收紧保证首屏同屏 */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-24 pb-16 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:pt-28 lg:pb-24">
        {/* 左：文案 */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* 图签眉标 */}
          {/* animate-reveal 的 shorthand 已含 fill both，只需覆写 delay */}
          <div
            className="mb-6 animate-reveal"
            style={{ animationDelay: '0.1s' }}
          >
            <SheetLabel>AI-Powered Software</SheetLabel>
          </div>

          {/* 标题 — LCP 元素：首帧即满不透明渲染，不加入场动画（沿用既有 LCP 纪律） */}
          <h1 className="text-display tracking-tight">
            <span className="font-sans font-light text-txt-primary">
              Unleash Human{' '}
            </span>
            <span className="font-display font-semibold stretch-wide text-txt-primary">
              Potential
            </span>
            <br className="hidden sm:block" />
            <span className="font-sans font-light text-txt-primary">
              {' '}
              with{' '}
            </span>
            <span className="font-display font-semibold stretch-wide text-accent">
              AI.
            </span>
          </h1>

          {/* 副标题 — Server 直出词级 CSS 交错入场（零 JS 依赖，无 hydration 也可见）
              <sm 用 text-base：5 行 subtitle 会把物件挤出微信 WebView 折叠线 */}
          <p className="mt-6 max-w-xl text-base text-txt-secondary sm:text-subtitle">
            {SUBTITLE_WORDS.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                {/* 分隔空格放在 inline-block 外面的兄弟文本节点：行尾正常折叠
                    （放进 span 里要用 NBSP 防尾部裁剪，但行尾不裁会让居中行偏移） */}
                {i > 0 && ' '}
                <span
                  className="word-reveal"
                  style={{ animationDelay: `${(400 + i * 40) / 1000}s` }}
                >
                  {word}
                </span>
              </Fragment>
            ))}
          </p>

          {/* CTA 按钮 — ModuleButton 嵌槽键（v4.2 起 rest 齐平嵌槽、hover 顶出；phase 呼吸已退役）。
              frame 不需要 flex 类：.btn-module-frame 的 inline-flex 按源序
              压过 utility，且作为外层 flex item 本就被 blockify */}
          <div
            className="mt-8 flex w-full max-w-xs animate-reveal flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center lg:mt-10 lg:justify-start"
            style={{ animationDelay: '0.7s' }}
          >
            <ModuleButton href="/contact" arrow className="w-full sm:w-auto">
              Book a Free Consultation
            </ModuleButton>
            <ModuleButton
              href="/products"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              View Our Work
            </ModuleButton>
          </div>
        </div>

        {/* 右：Blueprint Object
            桌面（≥lg）：竖塔变体 + 弹簧物理 + 滚动 hero-tilt 抬起
            移动（<lg）：横陈 ELEV. 变体，纯 Server 静态场景（无 client 组件——
            物理本就是桌面专属，双实例挂载只会白白重复监听）
            min-w-0：<lg 轨道（grid-cols-1 = minmax(0,1fr)）本不受 300px 抬高；
            ≥lg 的 [7fr_5fr] 轨道最小值是 auto，min-w-0 才是那里的护栏——
            v3 物件 360px 后 1024px 断点下 5fr 份额 ≈386px 余量已趋零，
            这道护栏正在承重，勿删；<340px 真兜底 = scale(0.85)
            HeroObjectViewportGate：物件离开视口即暂停整棵场景子树的动画
            （物件的无限动画一条都无法合成，不门控时滚出视口仍烧主线程——
            实测数据与选择器口径见该组件与 globals.css .bp-object-scene 注释）。
            包住两个变体：桌面/移动各自的 scene 都在门控内 */}
        <HeroObjectViewportGate className="min-w-0">
          <div className="hero-tilt hidden lg:block">
            <HeroObjectPhysics>
              <BlueprintObject />
            </HeroObjectPhysics>
          </div>
          <div className="mt-2 lg:hidden">
            <div
              className="bp-object-scene bp-object-scene--mobile"
              aria-hidden="true"
            >
              {/* 背光/投影 — 物件旋转链外，光源固定（与桌面同构） */}
              <div className="bp-object-backglow" />
              <div className="bp-object-shadow" />
              <BlueprintObject variant="mobile" />
            </div>
          </div>
        </HeroObjectViewportGate>
      </div>

      {/* 角落坐标标注 — 藏在细节里的多伦多坐标 */}
      <span
        className="annotation absolute bottom-8 left-8 hidden md:block"
        aria-hidden="true"
      >
        TORONTO, CA / 43.65°N 79.38°W
      </span>

      {/* 滚动指示器 — 桌面专属（移动端与物件基座同落点，视觉冲突且占首屏预算） */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-txt-quaternary/40 p-1.5">
          <div className="h-2 w-0.5 animate-scroll-pulse rounded-full bg-txt-quaternary" />
        </div>
      </div>
    </section>
  );
}
