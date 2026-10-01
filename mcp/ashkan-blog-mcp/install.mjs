/* Ashkan Studios blog MCP - config installer.
 *
 * Finds Claude Desktop's config and adds the "ashkan-blog" entry to it.
 * Nothing else in the file is touched.
 *
 *   node install.mjs                 -> leaves a placeholder password
 *   node install.mjs "<password>"    -> writes the password straight in
 *
 * This exists as a file rather than a long `node -e "..."` one-liner
 * because cmd ate the `||` out of that line and it died with a syntax
 * error. A file has no shell quoting to get wrong.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* server.mjs sits next to this file, wherever the folder ends up. A
   hard-coded path breaks the moment someone puts the folder elsewhere. */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(HERE, "server.mjs").replace(/\\/g, "/");

/* Two places to look. A normal install keeps the config under %APPDATA%.
   The Microsoft Store build is packaged (MSIX), which redirects %APPDATA%
   into its own container, so from outside the app the file lives under
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
    } catch { /* no Packages folder - normal on a non-Store install */ }
  }
  return list;
}

const stop = (msg) => { console.log("\nSTOPPED: " + msg + "\n"); process.exit(1); };

console.log("\nAshkan Studios blog MCP - config installer\n");

const cands = candidates();
const file = cands.find((c) => fs.existsSync(c));
if (!file) {
  console.log("Looked in:");
  cands.forEach((c) => console.log("   " + c));
  stop("no config file found.\n         Open Claude Desktop, go to Settings > Developer > Edit config,\n         then run this again.");
}
console.log("Config found:\n   " + file + "\n");

const raw = fs.readFileSync(file, "utf8");
let cfg;
try {
  cfg = raw.trim() ? JSON.parse(raw) : {};
} catch (e) {
  stop("that config is not valid JSON, so nothing was changed.\n         " + e.message + "\n         Fix the file first, then run this again.");
}

if (!cfg.mcpServers) cfg.mcpServers = {};

if (cfg.mcpServers["ashkan-blog"]) {
  console.log("ashkan-blog is already there - nothing changed.");
  console.log("To add it again, remove that entry from the config first.\n");
  process.exit(0);
}

if (!fs.existsSync(SERVER)) {
  stop("server.mjs is not next to this script:\n         " + SERVER + "\n         Run install.mjs from inside the package folder.");
}

const password = process.argv[2] ? process.argv[2] : "PASTE_THE_PASSWORD_HERE";

const backup = file.replace(/\.json$/, ".before-ashkan.json");
fs.copyFileSync(file, backup);
console.log("Backup written:\n   " + backup + "\n");

const before = Object.keys(cfg.mcpServers);
cfg.mcpServers = {
  "ashkan-blog": {
    command: process.execPath.replace(/\\/g, "/"),   // the node running this, so it is always right
    args: [SERVER],
    env: { ASHKAN_BLOG_PASSWORD: password },
  },
  ...cfg.mcpServers,
};
fs.writeFileSync(file, JSON.stringify(cfg, null, 2));

console.log("ashkan-blog added.");
console.log("   node            : " + process.execPath);
console.log("   existing servers: " + (before.length ? before.join(", ") : "(none)"));
console.log("   total now       : " + Object.keys(cfg.mcpServers).length);
console.log(
  password === "PASTE_THE_PASSWORD_HERE"
    ? "\nNEXT: open the config and replace PASTE_THE_PASSWORD_HERE with the real\n      password, then run:  node check.mjs\n"
    : "\nNEXT: node check.mjs\n"
);
