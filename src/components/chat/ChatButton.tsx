"use client";

import { useState, lazy, Suspense } from "react";
import { useChatOpen } from "@/hooks/useChatOpen";
import type { ChatMessage } from "@/lib/chatConstants";

// 懒加载 ChatPanel（面板打开时才加载）
const ChatPanel = lazy(() => import("./ChatPanel"));

// 懒加载 Spline 运行时（必须在模块顶层，不能放在组件函数体内）
const SplineComponent = lazy(() =>
  import("@splinetool/react-spline").then((mod) => ({
    default: mod.default,
  }))
);

// ─── Spline 场景 URL（替换为你的 Spline 场景） ───
const SPLINE_SCENE_URL = "";

// ─── CSS Fallback 脉冲按钮 ───
function PulseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI chat"
      className="group relative w-14 h-14 rounded-full bg-[#3498db] text-white
                 flex items-center justify-center cursor-pointer
                 shadow-lg shadow-[#3498db]/30
                 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#3498db]/40
                 transition-all duration-300"
    >
      {/* 脉冲光环 */}
      <span className="absolute inset-0 rounded-full bg-[#3498db] animate-chat-pulse" />

      {/* 图标 */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="relative z-10 group-hover:scale-110 transition-transform duration-200"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        {/* AI 闪电标记 */}
        <path d="M12 7v4M10 9h4" strokeLinecap="round" />
      </svg>

      {/* Tooltip */}
      <span
        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                   px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm
                   text-white/90 text-xs border border-white/10
                   opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100
                   transition-all duration-200 pointer-events-none"
      >
        Chat with AI
      </span>
    </button>
  );
}

// ─── Spline 3D 按钮（当场景 URL 可用时） ───
function SplineButton({ onClick }: { onClick: () => void }) {
  const [loadFailed, setLoadFailed] = useState(false);

  // 没有场景 URL 或加载失败 → 使用 fallback
  if (!SPLINE_SCENE_URL || loadFailed) {
    return <PulseButton onClick={onClick} />;
  }

  return (
    <button
      onClick={onClick}
      aria-label="Open AI chat"
      className="group relative w-16 h-16 cursor-pointer hover:-translate-y-0.5 transition-transform duration-300"
    >
      <Suspense fallback={<PulseButton onClick={onClick} />}>
        <SplineComponent
          scene={SPLINE_SCENE_URL}
          onError={() => setLoadFailed(true)}
        />
      </Suspense>

      {/* Tooltip */}
      <span
        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                   px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm
                   text-white/90 text-xs border border-white/10
                   opacity-0 group-hover:opacity-100 transition-all duration-200
                   pointer-events-none"
      >
        Chat with AI
      </span>
    </button>
  );
}

// ─── 主组件：状态提升容器 ───
export default function ChatButton() {
  const { open, toggle, close } = useChatOpen();
  // 消息状态在这里持有 — 关闭面板不丢失历史
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Chat 面板 */}
      {open && (
        <Suspense
          fallback={
            <div className="w-[400px] h-[600px] rounded-2xl bg-[rgba(26,31,46,0.95)] border border-[rgba(52,152,219,0.3)] flex items-center justify-center">
              <div className="typing-dot" />
              <div className="typing-dot" style={{ animationDelay: "0.15s" }} />
              <div className="typing-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          }
        >
          <ChatPanel
            messages={messages}
            setMessages={setMessages}
            onClose={close}
          />
        </Suspense>
      )}

      {/* 触发按钮 */}
      {!open && <SplineButton onClick={toggle} />}
    </div>
  );
}
