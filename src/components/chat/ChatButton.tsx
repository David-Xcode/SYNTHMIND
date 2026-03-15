'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { useChatOpen } from '@/hooks/useChatOpen';
import type { ChatMessage } from '@/lib/chatConstants';

// 懒加载 ChatPanel（面板打开时才加载）
const ChatPanel = lazy(() => import('./ChatPanel'));

// ── UUID v4 生成（兼容旧版 Safari / 微信 WebView）──
function generateUUID(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // 设置 version 4 和 variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
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
  const [sessionId, setSessionId] = useState('');

  // 仅在客户端初始化 sessionId — 避免 SSR/client 值不一致导致 hydration mismatch
  useEffect(() => {
    const KEY = 'synthmind_chat_session_id';
    let id: string | null = null;
    try {
      id = sessionStorage.getItem(KEY);
      if (!id) {
        id = generateUUID();
        sessionStorage.setItem(KEY, id);
      }
    } catch {
      // sessionStorage 不可用时（隐私模式等）回退到内存 UUID
      id = generateUUID();
    }
    setSessionId(id);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Chat 面板 */}
      {open && sessionId && (
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
            sessionId={sessionId}
          />
        </Suspense>
      )}

      {/* 触发按钮 */}
      {!open && <PulseButton onClick={toggle} />}
    </div>
  );
}
