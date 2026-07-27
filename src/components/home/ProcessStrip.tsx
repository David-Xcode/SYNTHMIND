// ─── 首页 03 · 方法带 · Blueprint ───
// 说服链第三段（IA v1 §3）：回答「你们怎么做」——四步流程的紧凑单行版
// （编号 + 词 + 一句话）。**非卡片**：四个步骤是同一条时间线上的刻度，
// 不是四个可数实体，包卡会让它与 02 的产品卡抢同一层级（判据一）。
// 顶部 hairline = 制图刻度线，承担分栏而不是靠卡片边框。
// 数据同源 src/data/process.ts（about 页 04 用同一套的 description 长版）
// Server Component：交互全在 client 叶子（AnimateOnScroll）

import Link from 'next/link';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import ArrowRightIcon from '@/components/shared/ArrowRightIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { processSteps } from '@/data/process';

export default function ProcessStrip() {
  return (
    <section className="relative py-24 px-4">
      <hr className="ruled-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="03"
            eyebrow="HOW WE WORK"
            light="From Idea to"
            bold="Production"
            subtitle="Four steps, weeks not months — the same sequence behind every project above."
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <AnimateOnScroll key={step.title} delay={index * 80 + 100}>
              <div className="border-t border-[var(--border-default)] pt-4">
                {/* 步骤号 = 真实序列（全站统一序号形态） */}
                <span className="font-mono text-sm font-semibold text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-base font-medium text-txt-primary tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-txt-secondary text-base leading-relaxed">
                  {step.summary}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* 段出口 — 每段给一个去处（说服链纪律） */}
        <AnimateOnScroll delay={processSteps.length * 80 + 180}>
          <div className="mt-10">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-accent text-sm font-medium transition-all duration-300 hover:gap-1.5"
            >
              More about us
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
