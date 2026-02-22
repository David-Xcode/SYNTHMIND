"use client";

import { ALLOWED_LINK_DOMAINS } from "@/lib/chatConstants";
import type { ChatMessage as ChatMessageType } from "@/lib/chatConstants";

interface Props {
  message: ChatMessageType;
}

/**
 * 轻量 Markdown 渲染：粗体 + 安全链接
 * 不引入 react-markdown，避免依赖膨胀
 */
function renderContent(text: string): JSX.Element[] {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // 解析行内元素：**bold** 和 [text](url)
    const parts: (string | JSX.Element)[] = [];
    let remaining = line;
    let partKey = 0;

    while (remaining.length > 0) {
      // 匹配 **bold**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // 匹配 [text](url)
      const linkMatch = remaining.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);

      // 找最早出现的匹配
      const boldIdx = boldMatch?.index ?? Infinity;
      const linkIdx = linkMatch?.index ?? Infinity;

      if (boldIdx === Infinity && linkIdx === Infinity) {
        // 没有更多匹配
        parts.push(remaining);
        break;
      }

      if (boldIdx <= linkIdx && boldMatch) {
        // bold 先出现
        if (boldIdx > 0) parts.push(remaining.slice(0, boldIdx));
        parts.push(
          <strong key={`b-${lineIdx}-${partKey++}`} className="font-semibold">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldIdx + boldMatch[0].length);
      } else if (linkMatch) {
        // link 先出现
        const idx = linkIdx;
        if (idx > 0) parts.push(remaining.slice(0, idx));

        const url = linkMatch[2];
        const isAllowed = ALLOWED_LINK_DOMAINS.some((d) => {
          try {
            return new URL(url).hostname.endsWith(d);
          } catch {
            return false;
          }
        });

        if (isAllowed) {
          parts.push(
            <a
              key={`l-${lineIdx}-${partKey++}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-white transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          // 非白名单域名：只显示文字，不渲染链接
          parts.push(linkMatch[1]);
        }
        remaining = remaining.slice(idx + linkMatch[0].length);
      }
    }

    return (
      <span key={`line-${lineIdx}`}>
        {lineIdx > 0 && <br />}
        {parts}
      </span>
    );
  });
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* AI 头像 */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold mt-1">
          S
        </div>
      )}

      {/* 消息气泡 */}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-white/10 text-white/90 rounded-bl-md"
        }`}
      >
        {renderContent(message.content)}
      </div>
    </div>
  );
}
