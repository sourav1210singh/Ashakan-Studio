// ────────────────────────────────────────────────────────────────
// .docx padhne ka chhota reader - text aur andar ki images dono.
//
// Koi npm package nahi: .docx sirf ek ZIP hai, aur Node ke zlib se
// uske entries khol lete hain. Package add karne ka matlab hota user
// ko npm install bolna, jo ek MCP server ke liye bekaar jhanjhat hai.
//
// Google Doc bhi yahin se nikal jaata hai - uska /export?format=docx
// ek asli .docx deta hai, to raasta ek hi rehta hai.
// ────────────────────────────────────────────────────────────────
import { inflateRawSync } from "node:zlib";

/* ── ZIP ──────────────────────────────────────────────────────────
   Sirf central directory padhte hain (wahi sach hai - local header
   me size 0 ho sakta hai jab data descriptor use hua ho). */
export function unzip(buf) {
  // End of Central Directory peeche se dhundo (comment 64 KB tak ho sakta)
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

    // local header se asli data ka offset
    if (localAt + 30 > buf.length || buf.readUInt32LE(localAt) !== 0x04034b50) continue;
    const lNameLen = buf.readUInt16LE(localAt + 26);
    const lExtraLen = buf.readUInt16LE(localAt + 28);
    const start = localAt + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + compSize);

    try {
      files.set(name, method === 0 ? Buffer.from(raw) : inflateRawSync(raw));
    } catch {
      // ek entry kharab ho to poora doc mat girao
    }
  }
  return files;
}

/* ── XML ─────────────────────────────────────────────────────────── */
const unescapeXml = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/&amp;/g, "&");   // amp sabse aakhir me, warna double-decode

/* rId -> media file ka naam. Isi se pata chalta hai ki kaunsi image
   text me kahan thi; warna sirf "3 images mili" hota. */
function relsMap(files) {
  const rels = files.get("word/_rels/document.xml.rels");
  const map = new Map();
  if (!rels) return map;
  for (const m of rels.toString("utf8").matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
    map.set(m[1], m[2].replace(/^\.?\/?/, "").replace(/^word\//, ""));
  }
  return map;
}

/* Ek <w:p> ko padhne layak line me badlo. Heading ko markdown ke #
   se mark karte hain taaki structure na khoye. */
function paragraphToText(xml, rels) {
  let prefix = "";
  const style = xml.match(/w:pStyle[^>]*w:val="([^"]+)"/);
  if (style) {
    const h = style[1].match(/^Heading(\d)$/i);
    if (h) prefix = "#".repeat(Math.min(6, +h[1])) + " ";
    else if (/^Title$/i.test(style[1])) prefix = "# ";
  }

  // image placeholder - jahan thi wahin
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
  /* Har <w:p>...</w:p> ka andar ka hissa lo. split() se kaam nahi chala
     tha - wo opening tag ka `<w:p` kha jaata hai, to bache hue
     attributes (w:rsidR="...") tag-strip se nahi hatt te the aur seedhe
     text me chale aate the. */
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
  // image1, image2, image10 - number ke hisaab se, naam ke hisaab se nahi
  const num = (s) => { const m = s.match(/(\d+)/); return m ? +m[1] : 0; };
  out.sort((a, b) => num(a.name) - num(b.name) || a.name.localeCompare(b.name));
  return out;
}

/* Google Doc ka link -> asli .docx ka download URL. Baaki koi bhi URL
   jyon ka tyon. */
export function docxUrlFor(url) {
  const m = String(url).match(/docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]+)/);
  if (m) return `https://docs.google.com/document/d/${m[1]}/export?format=docx`;
  const open = String(url).match(/(?:drive|docs)\.google\.com\/open\?id=([A-Za-z0-9_-]+)/);
  if (open) return `https://docs.google.com/document/d/${open[1]}/export?format=docx`;
  return String(url);
}
