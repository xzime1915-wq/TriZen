/**
 * Build sharp WebP previews from hero PNGs (no color/bg changes).
 * Source of truth: public/products/trizen-tripad-hero*.png
 * Run: node scripts/hero-flip-white-bg.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const products = path.join(root, "public/products");

const pairs = [
  ["trizen-tripad-hero.png", "trizen-tripad-hero-display.webp"],
  ["trizen-tripad-hero-flip-b.png", "trizen-tripad-hero-flip-b-display.webp"],
];

for (const [srcName, outName] of pairs) {
  await sharp(path.join(products, srcName))
    .resize(2400, null, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(products, outName));
  console.log(`${srcName} → ${outName}`);
}
