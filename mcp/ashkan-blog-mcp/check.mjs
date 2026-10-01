/* Ashkan Studios blog MCP - setup checker.
 *
 * Run this AFTER editing claude_desktop_config.json and BEFORE restarting
 * Claude. It starts the server exactly the way Claude Desktop does and
 * talks to it, so a problem shows up here with a readable message instead
 * of as a silent "no tools" inside the app.
 *
 *   node check.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
let failed = 0;
const ok = (m) => console.log("  OK    " + m);
const bad = (m) => { console.log("  FAIL  " + m); failed++; };

console.log("\nAshkan Studios blog MCP - setup check\n");

// ── 1. Node ──────────────────────────────────────────────────────
console.log("1. Node.js");
const major = Number(process.versions.node.split(".")[0]);
if (major >= 18) ok(`v${process.versions.node}`);
else bad(`v${process.versions.node} - version 18 or newer is required`);

// ── 2. Files ─────────────────────────────────────────────────────
console.log("\n2. Files in this folder");
for (const f of ["server.mjs", "docx.mjs", "package.json"]) {
  if (fs.existsSync(path.join(HERE, f))) ok(f);
  else bad(f + " is missing");
}
if (fs.existsSync(path.join(HERE, "node_modules", "@modelcontextprotocol"))) {
  ok("node_modules (dependencies are bundled - no npm install needed)");
} else {
  bad("node_modules is missing or incomplete - copy the whole folder again");
}

// ── 3. Claude config ─────────────────────────────────────────────
/* Two places to look. A normal install keeps the config under %APPDATA%.
   The Microsoft Store build is packaged (MSIX), which redirects %APPDATA%
   into its own container, so from outside the app the file is under
   %LOCALAPPDATA%\Packages\Claude_*\LocalCache\Roaming\Claude\. */
function findConfig() {
  const names = [path.join(process.env.APPDATA || "", "Claude", "claude_desktop_config.json")];
  try {
    const pkgs = path.join(process.env.LOCALAPPDATA || "", "Packages");
    for (const d of fs.readdirSync(pkgs)) {
      if (/^Claude_/i.test(d)) names.push(path.join(pkgs, d, "LocalCache", "Roaming", "Claude", "claude_desktop_config.json"));
    }
  } catch { /* no Packages folder - fine */ }
  return { found: names.find((n) => fs.existsSync(n)) || null, looked: names };
}

console.log("\n3. Claude Desktop config");
const { found: cfgPath, looked } = findConfig();
let entry = null;
if (!cfgPath) {
  bad("claude_desktop_config.json not found. Open Claude Desktop, go to Settings > Developer > Edit config, then run this again.");
  looked.forEach((l) => console.log("        looked: " + l));
} else {
  ok("config: " + cfgPath);
  let cfg = null;
  try {
    cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  } catch (e) {
    bad("the config is not valid JSON - " + e.message + " (a stray or missing comma is the usual cause)");
  }
  entry = (cfg && cfg.mcpServers && cfg.mcpServers["ashkan-blog"]) || null;
  if (!entry) {
    bad('no "ashkan-blog" entry under mcpServers');
  } else {
    ok("ashkan-blog entry found");
    const target = (entry.args && entry.args[0]) || "";
    if (fs.existsSync(target)) ok("server path points at a real file");
    else bad("server path does not exist: " + target);

    const pw = (entry.env && entry.env.ASHKAN_BLOG_PASSWORD) || "";
    if (!pw || pw.startsWith("PASTE_")) bad("ASHKAN_BLOG_PASSWORD is still the placeholder - paste the real password");
    else ok(`ASHKAN_BLOG_PASSWORD is set (${pw.length} characters)`);

    const key = (entry.env && entry.env.OPENAI_API_KEY) || "";
    if (!key || key.startsWith("PASTE_")) console.log("  NOTE  OPENAI_API_KEY is not set - everything works except generate_blog_image");
    else ok(`OPENAI_API_KEY is set (${key.length} characters)`);
  }
}

if (!entry || failed) {
  console.log("\nFix the points marked FAIL above, then run this again.\n");
  process.exit(1);
}

// ── 4. Live run ──────────────────────────────────────────────────
console.log("\n4. Starting the server the way Claude does");
const child = spawn(entry.command, entry.args, { env: { ...process.env, ...entry.env }, stdio: ["pipe", "pipe", "pipe"] });
let buf = "", stderr = "";
const pending = new Map();
child.stdout.on("data", (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let m;
    try { m = JSON.parse(line); } catch { continue; }
    const r = pending.get(m.id);
    if (r) { pending.delete(m.id); r(m); }
  }
});
child.stderr.on("data", (d) => { stderr += d.toString(); });

let id = 0;
const send = (method, params) => new Promise((res, rej) => {
  const my = ++id;
  pending.set(my, res);
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: my, method, params }) + "\n");
  setTimeout(() => {
    if (pending.has(my)) { pending.delete(my); rej(new Error("no reply for " + method + " within 40 seconds")); }
  }, 40000);
});

try {
  const init = await send("initialize", {
    protocolVersion: "2024-11-05", capabilities: {},
    clientInfo: { name: "setup-check", version: "1" },
  });
  ok(`server started: ${init.result.serverInfo.name} v${init.result.serverInfo.version}`);
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const list = await send("tools/list", {});
  const names = list.result.tools.map((t) => t.name);
  if (names.length === 7) ok(`${names.length} tools: ${names.join(", ")}`);
  else bad(`expected 7 tools, got ${names.length}: ${names.join(", ")}`);

  /* include_drafts: true is deliberate. Without it the server reads the
     public post list and never logs in, so a wrong password would sail
     through this check and only blow up on the first publish. */
  console.log("\n5. Logging into the live blog");
  const call = await send("tools/call", { name: "list_recent_posts", arguments: { limit: 3, include_drafts: true } });
  const txt = (call.result && call.result.content && call.result.content[0].text) || "";
  if ((call.result && call.result.isError) || /^\s*error/i.test(txt) || /login failed|password/i.test(txt)) {
    bad("could not log in: " + txt.replace(/\s+/g, " ").slice(0, 160));
    console.log("        ASHKAN_BLOG_PASSWORD is probably wrong - ask Sourav for it again.");
  } else {
    const titles = [...txt.matchAll(/"title"\s*:\s*"([^"]{0,55})/g)].map((m) => m[1]);
    ok(`logged in and read ${titles.length} posts`);
    titles.forEach((t) => console.log("        - " + t));
  }
} catch (e) {
  bad(e.message);
} finally {
  if (stderr.trim()) console.log("\n[server messages]\n" + stderr.trim().slice(0, 600));
  child.kill();
}

console.log(failed
  ? "\nSomething is not right - see the FAIL lines above.\n"
  : "\nAll good. Restart Claude Desktop and the blog tools will be there.\n");
process.exit(failed ? 1 : 0);
