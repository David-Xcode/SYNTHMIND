'use client';

import { useCallback, useEffect, useState } from 'react';

const CHAT_OPEN_EVENT = 'synthmind:chat-open';

/**
 * Chat 开关状态 hook
 * 基于 CustomEvent 实现跨组件触发
 */
export function useChatOpen(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  // 监听外部触发
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(CHAT_OPEN_EVENT, handler);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, handler);
  }, []);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback(() => setOpen(false), []);
  const openChat = useCallback(() => setOpen(true), []);

  return { open, toggle, close, openChat };
}
