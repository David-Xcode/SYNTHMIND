'use client';

// ─── 通用 Error Boundary ───
// React 18 class component（hooks 不支持 componentDidCatch）
// 用于包裹可能抛错的区域，防止整页白屏

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 自定义错误 UI，不传则使用默认样式 */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-txt-secondary text-sm mb-4">Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-secondary text-sm px-4 py-2"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
