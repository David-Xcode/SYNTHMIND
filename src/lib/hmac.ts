// ── HMAC-SHA256 签名 / 验证（Edge + Node 通用）──
// middleware（Edge Runtime）和 Server Component（Node）都能安全导入

export const COOKIE_NAME = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天（秒）

const encoder = new TextEncoder();

// ── 辅助：hex ↔ Uint8Array ──

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

// ── 获取 HMAC 密钥（CryptoKey 缓存，避免重复导入）──

let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');

  cachedKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  return cachedKey;
}

// ── 签名：生成 token（expiryTimestamp.hexSignature）──

export async function signToken(): Promise<string> {
  const key = await getKey();
  const expiry = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const data = encoder.encode(String(expiry));
  const sig = await crypto.subtle.sign('HMAC', key, data);
  return `${expiry}.${bytesToHex(new Uint8Array(sig))}`;
}

// ── 验证：检查签名有效性 + 过期时间 ──

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const dot = token.indexOf('.');
    if (dot === -1) return false;

    const expiryStr = token.slice(0, dot);
    const sigHex = token.slice(dot + 1);

    // 检查过期
    const expiry = Number(expiryStr);
    if (Number.isNaN(expiry) || expiry < Date.now() / 1000) return false;

    // crypto.subtle.verify 内部使用时序安全比较
    const key = await getKey();
    const data = encoder.encode(expiryStr);
    // 类型断言：TS 5.3 严格模式下 Uint8Array 与 BufferSource 不完全兼容
    const sig = hexToBytes(sigHex) as unknown as ArrayBuffer;
    return await crypto.subtle.verify('HMAC', key, sig, data);
  } catch {
    return false;
  }
}
