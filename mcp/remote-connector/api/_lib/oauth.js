// Stateless OAuth 2.1 helpers — HMAC-signed tokens so the whole flow
// works on serverless with no database. Rotating MCP_OAUTH_SECRET
// invalidates every issued token/code at once (the "revoke all" switch).
import crypto from "crypto";

const SECRET = process.env.MCP_OAUTH_SECRET || "";

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlJson(obj) {
  return b64url(JSON.stringify(obj));
}
function fromB64urlJson(s) {
  return JSON.parse(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
}

// token = "<type>.<payloadB64>.<sigB64>", HMAC over "<type>.<payloadB64>"
export function sign(type, payload, ttlSeconds) {
  if (!SECRET) throw new Error("MCP_OAUTH_SECRET is not set on the server.");
  const body = { ...payload, iat: nowSec(), exp: nowSec() + ttlSeconds };
  const head = `${type}.${b64urlJson(body)}`;
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(head).digest());
  return `${head}.${sig}`;
}

export function verify(type, token) {
  if (!SECRET || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== type) return null;
  const head = `${parts[0]}.${parts[1]}`;
  const expected = b64url(crypto.createHmac("sha256", SECRET).update(head).digest());
  const a = Buffer.from(parts[2]);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try { payload = fromB64urlJson(parts[1]); } catch { return null; }
  if (!payload.exp || payload.exp < nowSec()) return null;
  return payload;
}

export function pkceMatches(codeVerifier, codeChallenge) {
  if (!codeVerifier || !codeChallenge) return false;
  const hash = b64url(crypto.createHash("sha256").update(codeVerifier).digest());
  const a = Buffer.from(hash);
  const b = Buffer.from(codeChallenge);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function nowSec() {
  return Math.floor(Date.now() / 1000);
}

// Absolute base URL of THIS deployment, from the incoming request, so
// the metadata is correct whatever the final *.vercel.app name is.
export function baseUrl(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

export { b64url };
