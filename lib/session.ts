// Uses the Web Crypto API (globalThis.crypto) rather than Node's `crypto`
// module, so this works both in normal server code and in Next.js
// middleware, which runs on the Edge runtime and doesn't have Node's crypto.

const SESSION_COOKIE_NAME = "atlas_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error(
      "COOKIE_SECRET is not set. Add it to your environment before logging in."
    );
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return toHex(signature);
}

/** Constant-time-ish string comparison, without relying on Node's Buffer. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Creates a signed "expiry.signature" token to store in a cookie. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const signature = await hmac(getSecret(), String(expiresAt));
  return `${expiresAt}.${signature}`;
}

/** Verifies a session token from a cookie. Returns true only if valid and unexpired. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expected = await hmac(getSecret(), expiresAtRaw);
  if (!safeEqual(expected, signature)) return false;

  const expiresAt = Number(expiresAtRaw);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

/** Checks the submitted admin credentials against environment variables. */
export function checkAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  return safeEqual(email, expectedEmail) && safeEqual(password, expectedPassword);
}

export { SESSION_COOKIE_NAME };
