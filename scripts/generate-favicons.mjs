/**
 * One master file → two outputs only:
 *   public/trizen-icon.png  (edit this)
 *   public/favicon.ico      (browser tab)
 *   public/icon.png         (512px — PWA, Apple, Google)
 * Run: npm run icons:generate
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "trizen-icon.png");

async function renderIcon(size) {
  return sharp(src).resize(size, size, { fit: "cover" }).png();
}

const ico = await (await renderIcon(32)).toBuffer();
await writeFile(path.join(root, "public", "favicon.ico"), ico);
await (await renderIcon(512)).toFile(path.join(root, "public", "icon.png"));

console.log("OK: trizen-icon.png → favicon.ico + icon.png");
