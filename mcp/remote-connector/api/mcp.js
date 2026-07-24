// OAuth-protected MCP endpoint (streamable HTTP, stateless JSON-RPC).
// Requires a valid Bearer access token; without one it returns a 401
// that tells the client where to authenticate (RFC 9728).
import { verify, baseUrl } from "./_lib/oauth.js";
import { TOOLS, INSTRUCTIONS } from "./_lib/blog.js";

async function handleMessage(msg) {
  const { id, method, params = {} } = msg || {};
  const reply = (result) => ({ jsonrpc: "2.0", id, result });
  const fail = (code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });
  if (id === undefined || id === null) return null; // notification

  switch (method) {
    case "initialize":
      return reply({
        protocolVersion: params.protocolVersion || "2025-06-18",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "ashkan-blog", version: "2.0.0" },
        instructions: INSTRUCTIONS,
      });
    case "ping":
      return reply({});
    case "tools/list":
      return reply({ tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case "tools/call": {
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return fail(-32602, `Unknown tool: ${params.name}`);
      try {
        const out = await tool.handler(params.arguments || {});
        return reply({ content: [{ type: "text", text: JSON.stringify(out, null, 2) }], isError: false });
      } catch (e) {
        return reply({ content: [{ type: "text", text: `Error: ${e.message}` }], isError: true });
      }
    }
    default:
      return fail(-32601, `Method not found: ${method}`);
  }
}

export default async function handler(req, res) {
  const base = baseUrl(req);
  res.setHeader("Cache-Control", "no-store");

  // ── require a valid Bearer access token ──
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!verify("at", token)) {
    res.setHeader(
      "WWW-Authenticate",
      `Bearer resource_metadata="${base}/.well-known/oauth-protected-resource"`
    );
    res.status(401).json({ error: "invalid_token", error_description: "Sign in to the Ashkan blog connector." });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  const body = req.body;
  try {
    if (Array.isArray(body)) {
      const replies = (await Promise.all(body.map(handleMessage))).filter(Boolean);
      if (replies.length === 0) { res.status(202).end(); return; }
      res.status(200).json(replies);
      return;
    }
    const out = await handleMessage(body);
    if (!out) { res.status(202).end(); return; }
    res.status(200).json(out);
  } catch (e) {
    res.status(200).json({ jsonrpc: "2.0", id: body?.id ?? null, error: { code: -32603, message: e.message } });
  }
}

export const config = { maxDuration: 60 };
