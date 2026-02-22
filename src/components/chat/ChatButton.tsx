'use client';

import { lazy, Suspense, useRef, useState } from 'react';
import { useChatOpen } from '@/hooks/useChatOpen';
import type { ChatMessage } from '@/lib/chatConstants';

// 懒加载 ChatPanel（面板打开时才加载）
const ChatPanel = lazy(() => import('./ChatPanel'));

// ── Session ID 管理：sessionStorage 持久化，刷新保持 ──
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  const KEY = 'synthmind_chat_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

// ─── 脉冲按钮 ───
function PulseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open AI chat"
      className="group relative w-14 h-14 rounded-full bg-accent text-white
                 flex items-center justify-center cursor-pointer
                 shadow-lg shadow-accent/30
                 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40
                 transition-all duration-300"
    >
      {/* 脉冲光环 */}
      <span className="absolute inset-0 rounded-full bg-accent animate-chat-pulse" />

      {/* 图标 */}
      <svg
        aria-hidden="true"
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

// ─── 主组件：状态提升容器 ───
export default function ChatButton() {
  const { open, toggle, close } = useChatOpen();
  // 消息状态在这里持有 — 关闭面板不丢失历史
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // sessionId 用 ref 避免每次渲染重新生成
  const sessionIdRef = useRef<string | null>(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current = getOrCreateSessionId();
  }

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Chat 面板 */}
      {open && (
        <Suspense
          fallback={
            <div className="w-[400px] h-[600px] rounded-2xl bg-[rgba(10,12,18,0.96)] border border-accent/20 flex items-center justify-center">
              <div className="typing-dot" />
              <div className="typing-dot" style={{ animationDelay: '0.15s' }} />
              <div className="typing-dot" style={{ animationDelay: '0.3s' }} />
            </div>
          }
        >
          <ChatPanel
            messages={messages}
            setMessages={setMessages}
            onClose={close}
            sessionId={sessionIdRef.current}
          />
        </Suspense>
      )}

      {/* 触发按钮 */}
      {!open && <PulseButton onClick={toggle} />}
    </div>
  );
}
