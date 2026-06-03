/**
 * Favicons for Google Search: black square + white logo (fills frame).
 * White-background icons look like a blank white circle in SERP at 16px.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "logo.png");
const bg = { r: 0, g: 0, b: 0, alpha: 1 };

async function renderIcon(size) {
  const logoSize = Math.round(size * 0.9);
  const logo = await sharp(src)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
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
  console.log("Wrote favicon.ico (32px PNG)");
}

await make(48, "favicon-48.png");
await make(96, "favicon-96.png");
await make(192, "icon-192.png");
await make(180, "apple-touch-icon.png");
await make(512, "icon.png");
await makeIco();
