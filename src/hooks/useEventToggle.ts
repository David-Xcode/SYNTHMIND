"use client";

import { useEffect, useCallback, useRef } from "react";

// 存储 callback 与实际 DOM handler 的映射
interface ListenerEntry {
  callback: (detail?: unknown) => void;
  handler: EventListener;
}

/**
 * 通用 CustomEvent 工厂 hook
 * 用于跨组件通信（不需要 Context 或状态提升）
 */
export function useEventToggle(eventName: string) {
  const listenersRef = useRef<ListenerEntry[]>([]);

  // 触发事件
  const emit = useCallback(
    (detail?: unknown) => {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    },
    [eventName]
  );

  // 订阅事件
  const subscribe = useCallback(
    (callback: (detail?: unknown) => void) => {
      const handler = (e: Event) =>
        callback((e as CustomEvent).detail);

      window.addEventListener(eventName, handler);
      listenersRef.current.push({ callback, handler });

      // 返回取消订阅函数
      return () => {
        window.removeEventListener(eventName, handler);
        listenersRef.current = listenersRef.current.filter(
          (entry) => entry.callback !== callback
        );
      };
    },
    [eventName]
  );

  // 组件卸载时清理（安全网）— 移除所有未手动取消的监听器
  useEffect(() => {
    return () => {
      listenersRef.current.forEach((entry) => {
        window.removeEventListener(eventName, entry.handler);
      });
      listenersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { emit, subscribe };
}
