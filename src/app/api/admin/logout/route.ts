import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/hmac';

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // maxAge=0 立即清除 cookie
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return res;
}
