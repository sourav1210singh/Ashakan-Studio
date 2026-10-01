// ────────────────────────────────────────────────────────────────
// A small .docx reader - both the text and the images inside it.
//
// No npm package: a .docx is just a ZIP, and Node's zlib opens its
// entries. Adding a dependency would mean telling the user to run
// npm install, which is a pointless chore for an MCP server.
//
// Google Docs come through here too - /export?format=docx hands back a
// real .docx, so there is only ever one code path.
// ────────────────────────────────────────────────────────────────
import { inflateRawSync } from "node:zlib";

/* ── ZIP ──────────────────────────────────────────────────────────
   Read the central directory only - that is the authoritative copy. A
   local header can carry 0 for the size when a data descriptor was
   used. */
export function unzip(buf) {
  // Find the End of Central Directory from the back (its comment can run to 64 KB)
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 66000); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("This is not a .docx file (no ZIP central directory in it).");

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = new Map();

  for (let n = 0; n < count; n++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const cmtLen = buf.readUInt16LE(p + 32);
    const localAt = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + cmtLen;

    // the real data offset comes from the local header
    if (localAt + 30 > buf.length || buf.readUInt32LE(localAt) !== 0x04034b50) continue;
    const lNameLen = buf.readUInt16LE(localAt + 26);
    const lExtraLen = buf.readUInt16LE(localAt + 28);
    const start = localAt + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + compSize);

    try {
      files.set(name, method === 0 ? Buffer.from(raw) : inflateRawSync(raw));
    } catch {
      // one bad entry must not bring the whole document down
    }
  }
  return files;
}

/* ── XML ─────────────────────────────────────────────────────────── */
const unescapeXml = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/&amp;/g, "&");   // amp last, otherwise everything double-decodes

/* rId -> media filename. This is what makes an image's position in the
   text knowable; without it all you get is "3 images found". */
function relsMap(files) {
  const rels = files.get("word/_rels/document.xml.rels");
  const map = new Map();
  if (!rels) return map;
  for (const m of rels.toString("utf8").matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
    map.set(m[1], m[2].replace(/^\.?\/?/, "").replace(/^word\//, ""));
  }
  return map;
}

/* Turn one <w:p> into a readable line. Headings are marked with
   markdown # so the document's structure survives. */
function paragraphToText(xml, rels) {
  let prefix = "";
  const style = xml.match(/w:pStyle[^>]*w:val="([^"]+)"/);
  if (style) {
    const h = style[1].match(/^Heading(\d)$/i);
    if (h) prefix = "#".repeat(Math.min(6, +h[1])) + " ";
    else if (/^Title$/i.test(style[1])) prefix = "# ";
  }

  // image placeholder, left exactly where the picture sat
  let out = "";
  for (const blip of xml.matchAll(/<a:blip[^>]*r:embed="([^"]+)"/g)) {
    const target = rels.get(blip[1]);
    if (target) out += `\n[[IMAGE: ${target.replace(/^media\//, "")}]]\n`;
  }

  const text = xml
    .replace(/<w:tab\b[^>]*\/?>/g, "\t")
    .replace(/<w:br\b[^>]*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "");
  return (out + prefix + unescapeXml(text)).trim();
}

export function docxText(files) {
  const doc = files.get("word/document.xml");
  if (!doc) throw new Error("No word/document.xml inside - this zip is not a Word document.");
  const rels = relsMap(files);
  const xml = doc.toString("utf8");
  /* Take the inside of each <w:p>...</w:p>. split() did not work here -
     it eats the opening `<w:p`, so the leftover attributes
     (w:rsidR="...") survived the tag strip and landed in the text. */
  const paras = [...xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)]
    .map((m) => paragraphToText(m[1], rels));
  return paras.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function docxImages(files) {
  const out = [];
  for (const [name, bytes] of files) {
    if (!/^word\/media\//i.test(name)) continue;
    out.push({ name: name.replace(/^word\/media\//i, ""), bytes });
  }
  // image1, image2, image10 - order by the number, not by the name
  const num = (s) => { const m = s.match(/(\d+)/); return m ? +m[1] : 0; };
  out.sort((a, b) => num(a.name) - num(b.name) || a.name.localeCompare(b.name));
  return out;
}

/* A Google Doc link becomes the real .docx download URL. Any other URL
   passes through untouched. */
export function docxUrlFor(url) {
  const m = String(url).match(/docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]+)/);
  if (m) return `https://docs.google.com/document/d/${m[1]}/export?format=docx`;
  const open = String(url).match(/(?:drive|docs)\.google\.com\/open\?id=([A-Za-z0-9_-]+)/);
  if (open) return `https://docs.google.com/document/d/${open[1]}/export?format=docx`;
  return String(url);
}
