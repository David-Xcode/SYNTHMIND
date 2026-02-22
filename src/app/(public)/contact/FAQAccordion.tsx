'use client';

// ─── FAQ 手风琴组件 ───
// smooth height 动画 + 旋转 +/- 图标

import { useState } from 'react';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        return (
          <AnimateOnScroll key={index} delay={index * 60}>
            <div className="card-surface rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors duration-200 hover:bg-accent/[0.04]"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-sm font-medium text-txt-primary">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-txt-quaternary transition-transform duration-300 ease-out-expo ${isOpen ? 'rotate-45' : ''}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </button>

              {/* 可折叠内容区 — 使用 grid rows 实现 smooth height */}
              <section
                id={panelId}
                className="grid transition-all duration-300 ease-out-expo"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-txt-tertiary text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </section>
            </div>
          </AnimateOnScroll>
        );
      })}
    </div>
  );
}
