/**
 * Final TriZen icon — white mark on black (trizen-icon-source.png).
 * Run: npm run icons:generate
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { writeFile, copyFile } from "fs/promises";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "trizen-icon-source.png");

async function renderIcon(size) {
  return sharp(src)
    .resize(size, size, { fit: "cover", position: "center" })
    .png();
}

async function make(size, outName) {
  const out = path.join(root, "public", outName);
  await (await renderIcon(size)).toFile(out);
  console.log(`Wrote ${outName} (${size}x${size})`);
}

async function makeIco() {
  const out = path.join(root, "public", "favicon.ico");
  const buf32 = await (await renderIcon(32)).toBuffer();
  await writeFile(out, buf32);
  console.log("Wrote favicon.ico");
}

// Master file for header / JSON-LD (same artwork)
await copyFile(src, path.join(root, "public", "logo.png"));

await make(48, "favicon-48.png");
await make(192, "icon-192.png");
await make(180, "apple-touch-icon.png");
await make(512, "icon.png");
await makeIco();

console.log("Done — black icon only, no white favicon variants.");
