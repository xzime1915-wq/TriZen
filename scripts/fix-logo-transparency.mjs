/**
 * Makes logo backgrounds transparent and resizes for web.
 * - logo.png: remove near-black pixels (white logo on dark sites)
 * - logo_b.png: remove near-white pixels (black logo on light sites)
 */
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_SIZE = 512;

async function processLogo(file, mode) {
  const input = path.join(root, "public", file);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .resize(OUT_SIZE, OUT_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (mode === "on-dark") {
      if (r < 28 && g < 28 && b < 28) pixels[i + 3] = 0;
    } else {
      if (r > 228 && g > 228 && b > 228) pixels[i + 3] = 0;
    }
  }

  const out = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(input, out);
  console.log(`${file}: ${info.width}x${info.height} → transparent PNG (${out.length} bytes)`);
}

await processLogo("logo.png", "on-dark");
await processLogo("logo_b.png", "on-light");
