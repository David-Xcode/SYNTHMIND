'use client';

import { useRouter } from 'next/navigation';
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ChatSessionRow, FormSubmissionRow } from '@/lib/types';

// ── source 标签颜色映射 ──
const SOURCE_STYLES: Record<string, string> = {
  contact: 'bg-blue-500/20 text-blue-300',
  chat: 'bg-teal-500/20 text-teal-300',
};

// 格式化时间：相对时间（如 "3h ago"）或日期
function formatTime(iso: string): string {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';

  const diff = Date.now() - ms;
  if (diff < 0) return 'just now';
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-CA');
}

// ── 内联 SVG 图标组件（替代 lucide-react）──
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function SortIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

interface Props {
  activeView: 'sessions' | 'submissions';
  sessions: ChatSessionRow[];
  submissions: FormSubmissionRow[];
  initialSearch: string;
  sortAsc: boolean;
  dbError?: string | null;
}

export default function AdminDashboardClient({
  activeView,
  sessions,
  submissions,
  initialSearch,
  sortAsc,
  dbError,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  // ── 多选删除 state ──
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 全选 checkbox ref（用于 indeterminate 状态）
  const selectAllRef = useRef<HTMLInputElement>(null);

  // 当 URL searchParams 变化时同步搜索输入框
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  // 视图/数据变化时清空选中
  // biome-ignore lint/correctness/useExhaustiveDependencies: 视图或数据变化时需要清空选中状态
  useEffect(() => {
    setSelectedIds(new Set());
  }, [activeView, sessions, submissions]);

  // 同步全选 checkbox 的 indeterminate 状态
  const currentIds: (string | number)[] =
    activeView === 'sessions'
      ? sessions.map((s) => s.id)
      : submissions.map((s) => s.id);
  const allSelected =
    currentIds.length > 0 && selectedIds.size === currentIds.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  // ── 选中操作 ──

  const toggleOne = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentIds));
    }
  }, [allSelected, currentIds]);

  // ── URL 参数协调 ──

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('view', activeView);
    if (search.trim()) params.set('q', search.trim());
    if (sortAsc) params.set('sort', 'asc');
    router.push(`/admin?${params.toString()}`);
  };

  const handleTabSwitch = (view: 'sessions' | 'submissions') => {
    router.push(`/admin?view=${view}`);
  };

  const handleSortToggle = () => {
    const params = new URLSearchParams();
    params.set('view', activeView);
    if (search.trim()) params.set('q', search.trim());
    if (!sortAsc) params.set('sort', 'asc');
    router.push(`/admin?${params.toString()}`);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  // ── 删除逻辑 ──

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const table = activeView === 'sessions' ? 'sessions' : 'submissions';
      const ids = Array.from(selectedIds);

      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ table, ids }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || `Delete failed (${res.status})`,
        );
      }

      setShowConfirm(false);
      setSelectedIds(new Set());
      router.refresh();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Delete failed. Please try again.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Escape 键关闭确认弹窗
  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showConfirm]);

  // 行导航
  const navigateToSession = (id: string) => {
    router.push(`/admin/session/${id}`);
  };

  const handleRowKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateToSession(id);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* 顶部区域 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#3498db]">Synthmind</h1>
            <span className="rounded bg-[#3498db]/20 px-2 py-0.5 text-[11px] font-medium text-[#3498db]">
              Admin
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-[#3498db] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2980b9]"
          >
            <LogOutIcon className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>

        <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>

        {/* Tab 切换 */}
        <div className="mb-6 flex gap-1 border-b border-white/10">
          <button
            type="button"
            onClick={() => handleTabSwitch('sessions')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === 'sessions'
                ? 'border-b-2 border-[#3498db] text-[#3498db]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Chat Sessions
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('submissions')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === 'submissions'
                ? 'border-b-2 border-[#3498db] text-[#3498db]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Form Submissions
          </button>
        </div>

        {/* 搜索栏 */}
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeView === 'sessions'
                  ? 'Search by email or phone...'
                  : 'Search by name or email...'
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#3498db]/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#3498db] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2980b9]"
          >
            Search
          </button>
        </form>

        {/* 工具栏 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <>
                <span className="text-xs text-gray-400">
                  {selectedIds.size} selected
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setShowConfirm(true);
                  }}
                  className="flex items-center gap-1.5 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleSortToggle}
            className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-200"
          >
            <SortIcon className="h-3.5 w-3.5" />
            {sortAsc ? 'Oldest first' : 'Newest first'}
          </button>
        </div>

        {/* DB 错误提示 */}
        {dbError && (
          <p role="alert" className="mb-4 text-center text-sm text-red-400">
            {dbError}
          </p>
        )}

        {/* ── Sessions 视图 ── */}
        {activeView === 'sessions' &&
          (sessions.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              No sessions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400">
                    <th className="px-3 py-2 font-medium">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all sessions"
                        className="accent-[#3498db]"
                      />
                    </th>
                    <th className="px-3 py-2 font-medium">Session</th>
                    <th className="px-3 py-2 font-medium">Lead Email</th>
                    <th className="px-3 py-2 font-medium">Lead Phone</th>
                    <th className="px-3 py-2 font-medium text-center">
                      Messages
                    </th>
                    <th className="px-3 py-2 font-medium text-right">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    // biome-ignore lint/a11y/useSemanticElements: <tr> 无法替换为 <button>，表格行用 role="button" 提供可交互语义
                    <tr
                      key={s.id}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open session for ${s.lead_email || s.lead_name || s.id.slice(0, 8)}`}
                      onClick={() => navigateToSession(s.id)}
                      onKeyDown={(e) => handleRowKeyDown(e, s.id)}
                      className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                        selectedIds.has(s.id) ? 'bg-white/5' : ''
                      }`}
                    >
                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(s.id)}
                          onChange={() => toggleOne(s.id)}
                          aria-label={`Select session ${s.id.slice(0, 8)}`}
                          className="accent-[#3498db]"
                        />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-gray-400">
                        {s.id.slice(0, 8)}
                      </td>
                      <td className="px-3 py-3">
                        {s.lead_email ? (
                          <span className="text-[#3498db]">{s.lead_email}</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {s.lead_phone || (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {s.message_count}
                      </td>
                      <td className="px-3 py-3 text-right text-xs text-gray-400">
                        {formatTime(s.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {/* ── Submissions 视图 ── */}
        {activeView === 'submissions' &&
          (submissions.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              No submissions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400">
                    <th className="px-3 py-2 font-medium">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all submissions"
                        className="accent-[#3498db]"
                      />
                    </th>
                    <th className="px-3 py-2 font-medium">Source</th>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Subject</th>
                    <th className="px-3 py-2 font-medium">Session</th>
                    <th className="px-3 py-2 font-medium text-right">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className={`border-b border-white/5 ${
                        selectedIds.has(sub.id) ? 'bg-white/5' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(sub.id)}
                          onChange={() => toggleOne(sub.id)}
                          aria-label={`Select submission from ${sub.name}`}
                          className="accent-[#3498db]"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
                            SOURCE_STYLES[sub.source] ??
                            'bg-white/10 text-gray-400'
                          }`}
                        >
                          {sub.source}
                        </span>
                      </td>
                      <td className="px-3 py-3">{sub.name}</td>
                      <td className="px-3 py-3 text-[#3498db]">{sub.email}</td>
                      <td className="max-w-[200px] truncate px-3 py-3">
                        {sub.subject || (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {sub.session_id ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigateToSession(sub.session_id as string)
                            }
                            className="font-mono text-xs text-[#3498db] hover:underline"
                          >
                            {sub.session_id.slice(0, 8)}
                          </button>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-xs text-gray-400">
                        {formatTime(sub.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </main>

      {/* ── 确认删除弹窗 ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          {/* 背景遮罩层：点击关闭弹窗 */}
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close dialog"
            onClick={() => !isDeleting && setShowConfirm(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && !isDeleting) setShowConfirm(false);
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="mx-4 w-full max-w-sm rounded-lg border border-white/10 bg-[#0f1419] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <h2
              id="confirm-title"
              className="mb-2 text-lg font-semibold text-gray-100"
            >
              Confirm Deletion
            </h2>
            <p className="mb-1 text-sm text-gray-300">
              Delete{' '}
              <span className="font-semibold text-gray-100">
                {selectedIds.size}
              </span>{' '}
              {activeView === 'sessions' ? 'session' : 'submission'}
              {selectedIds.size > 1 ? 's' : ''}?
            </p>
            {activeView === 'sessions' && (
              <p className="mb-4 text-xs text-red-400">
                All associated chat messages will also be permanently deleted.
              </p>
            )}
            {activeView === 'submissions' && <div className="mb-4" />}

            {deleteError && (
              <p
                role="alert"
                className="mb-3 rounded bg-red-900/30 px-3 py-2 text-xs text-red-300"
              >
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-gray-400 transition-colors hover:text-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded bg-red-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {isDeleting && (
                  <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
