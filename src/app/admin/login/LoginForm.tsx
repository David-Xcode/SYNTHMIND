'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

// 登录表单——纯 Client Component，服务端已处理"已登录重定向"
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (res.status === 429) {
          setError(
            'Too many attempts. Please wait a moment before trying again.',
          );
        } else {
          setError(data?.error ?? 'Invalid email or password.');
        }
        return;
      }

      // replace 而非 push，防止后退闪回登录页
      router.replace('/admin');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 标题 */}
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#3498db]">Synthmind</h1>
          <p className="mt-2 text-sm text-gray-400">Admin Dashboard</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-gray-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-[#3498db]/50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs text-gray-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-[#3498db]/50"
            />
          </div>

          {error && (
            <p role="alert" className="text-center text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#3498db] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2980b9] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
