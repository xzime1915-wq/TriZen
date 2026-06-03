/**
 * Google Search favicons — black logo on white background (stable; do not flip often).
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "logo_b.png");
const bg = { r: 255, g: 255, b: 255, alpha: 1 };

async function renderIcon(size) {
  const logo = await sharp(src)
    .flatten({ background: "#ffffff" })
    .resize(Math.round(size * 0.82), Math.round(size * 0.82), {
      fit: "contain",
      background: "#ffffff",
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
await make(192, "icon-192.png");
await make(180, "apple-touch-icon.png");
await make(512, "icon.png");
await makeIco();
