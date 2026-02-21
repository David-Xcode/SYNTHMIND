"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import type { ChatMessage as ChatMessageType } from "@/lib/chatConstants";
import {
  WELCOME_MESSAGE,
  MAX_DISPLAY_MESSAGES,
} from "@/lib/chatConstants";

interface Props {
  messages: ChatMessageType[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  onClose: () => void;
  sessionId: string;
}

export default function ChatPanel({ messages, setMessages, onClose, sessionId }: Props) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 始终指向最新 messages，避免 useCallback 闭包捕获过期快照
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // 组件卸载时取消进行中的 fetch
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ── 从 DB 恢复聊天历史（首次打开面板时）──
  const historyLoadedRef = useRef(false);
  useEffect(() => {
    if (historyLoadedRef.current || messages.length > 0) return;
    historyLoadedRef.current = true;

    fetch(`/api/chat/history?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          const restored: ChatMessageType[] = data.messages.map(
            (m: { role: string; content: string; created_at: string }, i: number) => ({
              id: `history-${i}`,
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp: new Date(m.created_at).getTime(),
            }),
          );
          setMessages(restored.slice(-MAX_DISPLAY_MESSAGES));
        }
      })
      .catch(() => {
        // 历史加载失败不影响正常使用
      });
  }, [sessionId, messages.length, setMessages]);

  // 自动聚焦输入框
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // Escape 关闭面板
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // 所有显示的消息（含欢迎消息）
  const displayMessages =
    messages.length === 0 ? [WELCOME_MESSAGE] : messages;

  // 是否显示 Quick Replies（仅无用户消息时）
  const showQuickReplies = !messages.some((m) => m.role === "user");

  // 发送消息
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // 取消之前的请求
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userMessage: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const next = [...prev, userMessage];
        // 客户端最多保留 MAX_DISPLAY_MESSAGES 条
        return next.slice(-MAX_DISPLAY_MESSAGES);
      });
      setInput("");
      setIsLoading(true);

      try {
        // 发送单条消息 + sessionId（上下文从 DB 加载，不再传全部历史）
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            message: trimmed,
          }),
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Request failed");
        }

        const aiMessage: ChatMessageType = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: Date.now(),
        };

        setMessages((prev) =>
          [...prev, aiMessage].slice(-MAX_DISPLAY_MESSAGES)
        );
      } catch (err: unknown) {
        if ((err as Error).name === "AbortError") return;

        const errorMessage: ChatMessageType = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            (err as Error).message ||
            "Something went wrong. Please try again.",
          timestamp: Date.now(),
        };

        setMessages((prev) =>
          [...prev, errorMessage].slice(-MAX_DISPLAY_MESSAGES)
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setMessages, sessionId]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Enter 发送，Shift+Enter 换行
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      ref={panelRef}
      className="chat-panel-enter flex flex-col
                 w-[calc(100vw-2rem)] sm:w-[400px]
                 h-[80vh] sm:h-[600px]
                 rounded-2xl overflow-hidden
                 border border-[rgba(52,152,219,0.3)]
                 shadow-2xl shadow-black/40"
      style={{
        background: "rgba(26, 31, 46, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3498db] flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <div>
            <p className="text-white text-sm font-medium">Synthmind AI</p>
            <p className="text-green-400 text-[10px] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
              Online now
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-1"
          aria-label="Close chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ─── Messages ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scrollbar">
        {displayMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* 打字指示器 */}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3498db] flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Quick Replies ─── */}
      {showQuickReplies && !isLoading && (
        <QuickReplies onSelect={sendMessage} />
      )}

      {/* ─── Input ─── */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 px-4 py-3 border-t border-white/10"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm text-white
                     bg-white/5 focus:bg-white/10 border border-white/10
                     focus:border-[rgba(52,152,219,0.5)] focus:outline-none
                     transition-all duration-200 placeholder:text-white/30
                     max-h-[100px]"
          style={{ minHeight: "40px" }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3498db]
                     flex items-center justify-center text-white
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-[#2980b9] transition-all duration-200"
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
