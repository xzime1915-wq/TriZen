import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { renderCode128Svg } from "../src/lib/barcode-svg";
import { renderQrSvg } from "../src/lib/qr-svg";

const root = process.cwd();
const out = path.join(root, "artwork", "packaging");
const W = 1090, H = 600, y = 75, panelH = 450;
const backX = 20, frontX = 555, panelW = 510, depth = 25;

const products = [
  {
    id: "v1",
    name: "TRIPAD V1",
    model: "TP - V1 (BLACK)",
    sku: "TS-GP-V1-BLK",
    barcode: "890000000002",
    slug: "trizen-tripad-v1-black",
    tagline: "ENGINEERED GLIDE",
    descriptor: "ORIGINAL BLACK EDITION",
  },
  {
    id: "v2",
    name: "TRIPAD V2",
    model: "TP - V2 (BLACK)",
    sku: "TS-GP-V2-BLK",
    barcode: "890000000004",
    slug: "trizen-tripad-v2-black",
    tagline: "NEXT GEN CONTROL",
    descriptor: "VERTICAL SIGNATURE EDITION",
  },
] as const;

function uri(mime: string, value: Buffer | string) {
  const data = typeof value === "string" ? Buffer.from(value) : value;
  return `data:${mime};base64,${data.toString("base64")}`;
}

function cutLayer() {
  return `<g id="DIELINE-NONPRINT" fill="none">
    <path d="M20 0H530V45H555V0H1065V45H1090V525H1065V600H555V555H530V600H20V525H0V75H20Z"
      stroke="#ff2ea6" stroke-width="1.2"/>
    <g stroke="#27c9ff" stroke-width=".8" stroke-dasharray="5 4">
      <path d="M20 75H1090M20 525H1090M20 75V525M530 45V555M555 45V555M1065 45V555"/>
    </g>
    <g class="guide">
      <text x="35" y="69">BACK 510 mm</text><text x="570" y="69">FRONT 510 mm</text>
      <text x="537" y="69">25</text><text x="1071" y="69">25</text>
      <text x="8" y="310" transform="rotate(-90 8 310)">GLUE 20 mm</text>
      <text x="518" y="310" transform="rotate(-90 518 310)">450 mm</text>
    </g>
  </g>`;
}

function front(p: (typeof products)[number]) {
  const isV2 = p.id === "v2";
  const grid = isV2
    ? `<g opacity=".38" stroke="#3b3e45" stroke-width=".7">
        ${Array.from({ length: 12 }, (_, i) => `<path d="M${575 + i * 42} 75V525"/>`).join("")}
        ${Array.from({ length: 10 }, (_, i) => `<path d="M555 ${96 + i * 42}H1065"/>`).join("")}
      </g>`
    : `<path d="M1045 75L790 525M1080 145L860 525" stroke="#282b31" stroke-width="36"/>
       <path d="M1035 75L780 525M1070 145L850 525" stroke="#656971" stroke-width="1.2"/>`;
  const v2Rail = isV2
    ? `<rect x="555" y="75" width="54" height="450" fill="#f3f3f3"/>
       <text x="589" y="493" class="brand rail" fill="#101216" transform="rotate(-90 589 493)">TRIZEN</text>`
    : "";
  const contentX = isV2 ? 630 : 585;
  return `<g id="FRONT-ARTWORK">
    <rect x="${frontX}" y="${y}" width="${panelW}" height="${panelH}" fill="url(#front)"/>
    ${grid}${v2Rail}
    <text x="${contentX}" y="130" class="brand micro">TRIZEN STORE / PERFORMANCE GEAR</text>
    <text x="${contentX}" y="245" class="brand hero">TRIPAD</text>
    <text x="${contentX}" y="305" class="brand version">${p.id.toUpperCase()}</text>
    <text x="${contentX}" y="346" class="brand edition">BLACK EDITION</text>
    <text x="${contentX}" y="390" class="body statement">ULTRA SMOOTH / LOW FRICTION / COMPETITION READY</text>
    <path d="M${contentX} 410H1030" stroke="#696c73"/>
    <text x="${contentX}" y="452" class="brand tagline">${p.tagline}</text>
    <text x="1030" y="130" class="body dims" text-anchor="end">490 &#215; 430 &#215; 3 MM</text>
    <text x="1032" y="505" class="brand ghost" text-anchor="end">${isV2 ? "02" : "01"}</text>
  </g>`;
}

function handlingIcons() {
  return `<g transform="translate(48 426)" fill="none" stroke="#e7e7e8" stroke-width="1.2">
    <g><circle cx="20" cy="20" r="19" stroke="#4d5057"/><path d="M11 27h18M14 23l6-11 6 11M20 12v16"/><text x="20" y="51" class="icon" text-anchor="middle">GLASS</text></g>
    <g transform="translate(68)"><circle cx="20" cy="20" r="19" stroke="#4d5057"/><path d="M11 11h18v18H11zM14 15l12 10M26 15L14 25"/><text x="20" y="51" class="icon" text-anchor="middle">FRAGILE</text></g>
    <g transform="translate(136)"><circle cx="20" cy="20" r="19" stroke="#4d5057"/><path d="M10 23c7-12 13-12 20 0M20 13v16"/><text x="20" y="51" class="icon" text-anchor="middle">KEEP DRY</text></g>
    <g transform="translate(204)"><circle cx="20" cy="20" r="19" stroke="#4d5057"/><path d="M11 26h18M14 20l6-7 6 7M20 13v16"/><text x="20" y="51" class="icon" text-anchor="middle">THIS SIDE UP</text></g>
  </g>`;
}

function back(p: (typeof products)[number], barcode: string, qr: string) {
  return `<g id="BACK-ARTWORK">
    <rect x="${backX}" y="${y}" width="${panelW}" height="${panelH}" fill="url(#back)"/>
    <text x="48" y="124" class="brand micro">TRIZEN / ${p.descriptor}</text>
    <text x="48" y="184" class="brand backTitle">${p.name} BLACK</text>
    <text x="48" y="213" class="body copy">A large tempered-glass mouse pad engineered for esports.</text>
    <text x="48" y="233" class="body copy">Fast glide. Stable base. Predictable tracking across every swipe.</text>
    <g transform="translate(48 267)">
      <text class="brand specHead">PRODUCT SPECIFICATION</text><path d="M0 15H430" stroke="#4b4e55"/>
      <text y="43" class="body key">PRODUCT</text><text x="145" y="43" class="body value">${p.model}</text>
      <text y="67" class="body key">SIZE</text><text x="145" y="67" class="body value">490 &#215; 430 &#215; 3 mm</text>
      <text y="91" class="body key">MATERIAL</text><text x="145" y="91" class="body value">Tempered glass / non-slip base</text>
      <text y="115" class="body key">SURFACE</text><text x="145" y="115" class="body value">Ultra smooth / low friction</text>
      <text y="139" class="body key">SKU</text><text x="145" y="139" class="body value">${p.sku}</text>
    </g>
    ${handlingIcons()}
    <g id="SCANNABLE-CODES">
      <rect x="326" y="273" width="176" height="112" rx="3" fill="#fff"/>
      <image href="${barcode}" x="336" y="284" width="156" height="84" preserveAspectRatio="none"/>
      <text x="414" y="379" class="code" text-anchor="middle">CODE 128 / ${p.barcode}</text>
      <rect x="414" y="400" width="88" height="88" rx="3" fill="#fff"/>
      <image href="${qr}" x="418" y="404" width="80" height="80"/>
      <text x="405" y="506" class="body qrLabel" text-anchor="end">SCAN FOR PRODUCT</text>
    </g>
    <text x="48" y="494" class="body footer">TRIZEN STORE (OFFICIAL) / TRIZENSTORE.COM.BD</text>
    <text x="48" y="508" class="body footer">SUPPORT@TRIZENSTORE.COM.BD / +880 1778-741431</text>
  </g>`;
}

function build(p: (typeof products)[number], fonts: { orbitron: string; inter: string }) {
  const barcode = uri("image/svg+xml", renderCode128Svg(p.barcode));
  const qr = uri("image/svg+xml", renderQrSvg(`https://trizenstore.com.bd/product/${p.slug}`));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
<title>${p.name} Black packaging dieline</title>
<desc>Production draft for 510 x 450 x 25 mm internal-fit carton.</desc>
<defs>
<style>
@font-face{font-family:OrbitronPack;src:url("${fonts.orbitron}") format("truetype");font-weight:400 900}
@font-face{font-family:InterPack;src:url("${fonts.inter}") format("truetype");font-weight:300 700}
.brand{font-family:OrbitronPack,Orbitron,sans-serif;fill:#f5f5f5;letter-spacing:1.1px}.body{font-family:InterPack,Inter,sans-serif;fill:#d8d9dc}
.micro{font-size:8px;font-weight:650;letter-spacing:1.5px}.hero{font-size:55px;font-weight:850;letter-spacing:2.5px}
.version{font-size:48px;font-weight:800}.edition{font-size:14px;font-weight:650;letter-spacing:3.5px}
.statement{font-size:7.5px;letter-spacing:1px}.tagline{font-size:11px;font-weight:750;letter-spacing:2.3px}
.dims{font-size:7px;letter-spacing:1px}.ghost{font-size:78px;font-weight:850;fill:#202329}.rail{font-size:27px;font-weight:850;letter-spacing:5px;fill:#101216}
.backTitle{font-size:26px;font-weight:750}.copy{font-size:7.5px;fill:#adb0b7}.specHead{font-size:8px;font-weight:700}
.key{font-size:6.5px;fill:#90939a;letter-spacing:.8px}.value{font-size:7px;fill:#f2f2f3}
.icon{font:4.6px InterPack;fill:#b7bac1;stroke:none;letter-spacing:.4px}.code{font:5.2px InterPack;fill:#111;letter-spacing:.45px}
.qrLabel,.footer{font-size:5.4px;fill:#adb0b7;letter-spacing:.55px}.side{font-size:6.4px;font-weight:650}.flap{font-size:8px;font-weight:650;letter-spacing:1.6px}
.guide{font:5px Arial;fill:#27c9ff}
</style>
<linearGradient id="front"><stop stop-color="#15171c"/><stop offset=".55" stop-color="#08090c"/><stop offset="1" stop-color="#17191f"/></linearGradient>
<linearGradient id="back"><stop stop-color="#111318"/><stop offset="1" stop-color="#07080a"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="#08090b"/>
<g id="ARTWORK-CMYK-CONVERSION-REQUIRED">
  <rect x="20" width="510" height="75" fill="#090a0d"/><rect x="555" width="510" height="75" fill="#0a0b0e"/>
  <rect x="20" y="525" width="510" height="75" fill="#090a0d"/><rect x="555" y="525" width="510" height="75" fill="#0a0b0e"/>
  <rect y="75" width="20" height="450" fill="#08090b"/>
  <text x="275" y="43" class="brand flap" text-anchor="middle">OPEN THE GLIDE / ${p.name}</text>
  <text x="810" y="43" class="brand flap" text-anchor="middle">HANDLE WITH CARE / TEMPERED GLASS</text>
  <text x="275" y="568" class="brand flap" text-anchor="middle">TRIZEN PERFORMANCE GEAR / BANGLADESH</text>
  <text x="810" y="568" class="brand flap" text-anchor="middle">PRECISION / SPEED / CONSISTENCY</text>
  ${back(p, barcode, qr)}
  <rect x="530" y="75" width="${depth}" height="450" fill="#0b0c0f"/><rect x="1065" y="75" width="${depth}" height="450" fill="#0b0c0f"/>
  <text x="546" y="490" class="brand side" transform="rotate(-90 546 490)">${p.name} / BLACK / ENGINEERED FOR ESPORTS</text>
  <text x="1081" y="490" class="brand side" transform="rotate(-90 1081 490)">TRIZENSTORE.COM.BD / ${p.sku}</text>
  ${front(p)}
</g>
${cutLayer()}
</svg>`;
}

async function main() {
  await mkdir(out, { recursive: true });
  const fonts = {
    orbitron: uri("font/ttf", await readFile(path.join(root, "src/app/fonts/Orbitron-Variable.ttf"))),
    inter: uri("font/ttf", await readFile(path.join(root, "src/app/fonts/Inter-Variable.ttf"))),
  };
  for (const p of products) {
    const svg = build(p, fonts);
    const base = path.join(out, `tripad-${p.id}-black-packaging`);
    await writeFile(`${base}-dieline.svg`, svg, "utf8");
    const scale = 3;
    const png = await sharp(Buffer.from(svg), { density: 96, limitInputPixels: false }).resize({ width: W * scale }).png().toBuffer();
    await writeFile(`${base}-dieline.png`, png);
    await sharp(png).extract({ left: frontX * scale, top: y * scale, width: panelW * scale, height: panelH * scale }).png().toFile(`${base}-front-preview.png`);
    await sharp(png).extract({ left: backX * scale, top: y * scale, width: panelW * scale, height: panelH * scale }).png().toFile(`${base}-back-preview.png`);
  }
  await writeFile(path.join(out, "PACKAGING-SPECS.md"), `# TRIPAD Black Packaging Production Draft

## Correct size
The supplied 101.6 x 92 x 21 mm reference carton cannot fit a 490 x 430 x 3 mm glass TRIPAD.
This artwork uses a 510 x 450 x 25 mm internal-fit concept, allowing 10 mm edge clearance and protective depth.

## Exact inventory codes
- V1 Black: SKU TS-GP-V1-BLK / Code 128 890000000002
- V2 Black: SKU TS-GP-V2-BLK / Code 128 890000000004
- QR codes resolve to the matching trizenstore.com.bd product pages.

## Print and structure handoff
- Recommended: E-flute or micro-flute corrugated board rated by the vendor for the final packed weight.
- Use 5-10 mm EPE/EVA foam perimeter or molded corner protection.
- Finish: matte black lamination, opaque white/silver ink, optional spot UV on TRIPAD and V1/V2.
- Magenta solid line = CUT. Cyan dashed line = FOLD. Hide DIELINE-NONPRINT before production.
- Ask the selected manufacturer to rebuild final cut tabs for their board thickness and machine tolerances.
- Add 3 mm bleed on the manufacturer's final dieline, convert to their CMYK/spot profile, and run a white sample plus drop/edge test.

These are production-minded vector artwork drafts, not a certified structural die.
`, "utf8");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });





