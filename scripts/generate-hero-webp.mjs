/**
 * Hero responsive WebP variants from public/products/trizen-tripad-hero.png
 * Run: node scripts/generate-hero-webp.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "products", "trizen-tripad-hero.png");

const variants = [
  { out: "trizen-tripad-hero-1280.webp", w: 1280, q: 92 },
  { out: "trizen-tripad-hero-2560.webp", w: 2560, q: 93 },
  { out: "trizen-tripad-hero.webp", w: 3840, q: 94 },
];

for (const v of variants) {
  const out = path.join(root, "public", "products", v.out);
  await sharp(src)
    .ensureAlpha()
    .resize(v.w, null, {
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: v.q, effort: 6, alphaQuality: 100 })
    .toFile(out);
  const s = fs.statSync(out);
  const m = await sharp(out).metadata();
  console.log(`${v.out}: ${(s.size / 1024).toFixed(0)}KB ${m.width}×${m.height}`);
}

console.log("Hero WebP variants updated.");
