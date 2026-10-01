/* Ashkan Studios blog MCP - config installer.
 *
 * Claude Desktop ki config dhoondh ke usme "ashkan-blog" entry jod deta
 * hai. Baaki kuch nahi chhuta.
 *
 *   node install.mjs                 -> password ki jagah placeholder
 *   node install.mjs "<password>"    -> password seedha bhar deta hai
 *
 * Ye file isliye hai kyunki wahi cheez ek lambi `node -e "..."` line me
 * dene par cmd ne usme se || nikaal diya tha. File me koi escaping nahi,
 * koi gadbad nahi.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* server.mjs isi folder me hai, chahe folder kahin bhi ho. Path
   hardcode karne se folder kahin aur rakhne par tootta. */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(HERE, "server.mjs").replace(/\\/g, "/");

/* Do jagah dekhni padti hain. Normal install %APPDATA% me rakhta hai.
   Microsoft Store wala build MSIX hai - wo %APPDATA% ko apne container
   me redirect kar deta hai, to bahar se file yahan milti hai:
   %LOCALAPPDATA%\Packages\Claude_*\LocalCache\Roaming\Claude\ */
function candidates() {
  const list = [];
  const appdata = process.env.APPDATA ? process.env.APPDATA : "";
  if (appdata) list.push(path.join(appdata, "Claude", "claude_desktop_config.json"));
  const local = process.env.LOCALAPPDATA ? process.env.LOCALAPPDATA : "";
  if (local) {
    const pkgs = path.join(local, "Packages");
    try {
      for (const d of fs.readdirSync(pkgs)) {
        if (/^Claude_/i.test(d)) list.push(path.join(pkgs, d, "LocalCache", "Roaming", "Claude", "claude_desktop_config.json"));
      }
    } catch { /* no Packages folder - normal */ }
  }
  return list;
}

const stop = (msg) => { console.log("\nRUKO: " + msg + "\n"); process.exit(1); };

console.log("\nAshkan Studios blog MCP - config installer\n");

const cands = candidates();
const file = cands.find((c) => fs.existsSync(c));
if (!file) {
  console.log("Dekha gaya:");
  cands.forEach((c) => console.log("   " + c));
  stop("config file kahin nahi mili.\n       Claude Desktop kholo, Settings > Developer > Edit config dabao,\n       phir ye dobara chalao.");
}
console.log("config mili:\n   " + file + "\n");

const raw = fs.readFileSync(file, "utf8");
let cfg;
try {
  cfg = raw.trim() ? JSON.parse(raw) : {};
} catch (e) {
  stop("is config ki JSON tooti hui hai, isliye kuch nahi badla.\n       " + e.message + "\n       Pehle use theek karo, phir ye chalao.");
}

if (!cfg.mcpServers) cfg.mcpServers = {};

if (cfg.mcpServers["ashkan-blog"]) {
  console.log("ashkan-blog pehle se maujood hai - kuch nahi badla.");
  console.log("Dobara daalna ho to pehle config se wo entry hata do.\n");
  process.exit(0);
}

if (!fs.existsSync(SERVER)) {
  stop("server.mjs isi folder me nahi mila:\n       " + SERVER + "\n       install.mjs ko package wale folder ke andar se hi chalao.");
}

const password = process.argv[2] ? process.argv[2] : "YAHAN_PASSWORD";

const backup = file.replace(/\.json$/, ".before-ashkan.json");
fs.copyFileSync(file, backup);
console.log("backup bana:\n   " + backup + "\n");

const before = Object.keys(cfg.mcpServers);
cfg.mcpServers = {
  "ashkan-blog": {
    command: process.execPath.replace(/\\/g, "/"),   // jo node abhi chala raha hai, wahi
    args: [SERVER],
    env: { ASHKAN_BLOG_PASSWORD: password },
  },
  ...cfg.mcpServers,
};
fs.writeFileSync(file, JSON.stringify(cfg, null, 2));

console.log("ashkan-blog add ho gaya.");
console.log("   node       : " + process.execPath);
console.log("   purane servers: " + (before.length ? before.join(", ") : "(koi nahi)"));
console.log("   ab kul     : " + Object.keys(cfg.mcpServers).length);
console.log(
  password === "YAHAN_PASSWORD"
    ? "\nAGLA KADAM: config kholo aur YAHAN_PASSWORD ki jagah asli password daalo,\n           phir: node check.mjs\n"
    : "\nAGLA KADAM: node check.mjs\n"
);
