const QR_VERSION = 5;
const QR_SIZE = QR_VERSION * 4 + 17;
const DATA_CODEWORDS = 108;
const ECC_CODEWORDS = 26;
const ALIGNMENT_CENTER = QR_SIZE - 7;
const FORMAT_POLY = 0x537;
const FORMAT_MASK = 0x5412;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function appendBits(bits: number[], value: number, length: number) {
  for (let i = length - 1; i >= 0; i -= 1) {
    bits.push((value >>> i) & 1);
  }
}

function bitsToCodewords(bits: number[]) {
  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) {
      value = (value << 1) | (bits[i + j] ?? 0);
    }
    codewords.push(value);
  }
  return codewords;
}

function encodeData(value: string) {
  const bytes = new TextEncoder().encode(value);
  const maxBytes = Math.floor((DATA_CODEWORDS * 8 - 16) / 8);
  if (bytes.length > maxBytes) {
    throw new Error("QR payload is too long for the built-in product QR generator.");
  }

  const bits: number[] = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  for (const byte of bytes) appendBits(bits, byte, 8);

  const maxBits = DATA_CODEWORDS * 8;
  appendBits(bits, 0, Math.min(4, maxBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords = bitsToCodewords(bits);
  for (let pad = 0; codewords.length < DATA_CODEWORDS; pad += 1) {
    codewords.push(pad % 2 === 0 ? 0xec : 0x11);
  }

  return codewords;
}

function gfMultiply(a: number, b: number) {
  let result = 0;
  for (let i = 0; i < 8; i += 1) {
    if ((b & 1) !== 0) result ^= a;
    const carry = (a & 0x80) !== 0;
    a = (a << 1) & 0xff;
    if (carry) a ^= 0x1d;
    b >>>= 1;
  }
  return result;
}

function reedSolomonDivisor(degree: number) {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;

  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < result.length; j += 1) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }

  return result;
}

function reedSolomonRemainder(data: number[], divisor: number[]) {
  const result = new Array<number>(divisor.length).fill(0);

  for (const byte of data) {
    const factor = byte ^ result.shift()!;
    result.push(0);
    for (let i = 0; i < divisor.length; i += 1) {
      result[i] ^= gfMultiply(divisor[i], factor);
    }
  }

  return result;
}

function getFormatBits(mask: number) {
  let data = (0b01 << 3) | mask; // Error correction level L.
  let remainder = data;
  for (let i = 0; i < 10; i += 1) {
    remainder = (remainder << 1) ^ (((remainder >>> 9) & 1) * FORMAT_POLY);
  }
  return ((data << 10) | remainder) ^ FORMAT_MASK;
}

function getBit(value: number, index: number) {
  return ((value >>> index) & 1) !== 0;
}

function maskBit(x: number, y: number) {
  return (x + y) % 2 === 0;
}

function createMatrix(codewords: number[]) {
  const modules = Array.from({ length: QR_SIZE }, () =>
    new Array<boolean>(QR_SIZE).fill(false)
  );
  const reserved = Array.from({ length: QR_SIZE }, () =>
    new Array<boolean>(QR_SIZE).fill(false)
  );

  function set(x: number, y: number, dark: boolean, isFunction = true) {
    if (x < 0 || y < 0 || x >= QR_SIZE || y >= QR_SIZE) return;
    modules[y][x] = dark;
    if (isFunction) reserved[y][x] = true;
  }

  function drawFinder(x: number, y: number) {
    for (let dy = -1; dy <= 7; dy += 1) {
      for (let dx = -1; dx <= 7; dx += 1) {
        const xx = x + dx;
        const yy = y + dy;
        const inFinder = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
        const dark =
          inFinder &&
          (dx === 0 ||
            dx === 6 ||
            dy === 0 ||
            dy === 6 ||
            (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        set(xx, yy, dark);
      }
    }
  }

  function drawAlignment(cx: number, cy: number) {
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        const dark = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
        set(cx + dx, cy + dy, dark);
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(QR_SIZE - 7, 0);
  drawFinder(0, QR_SIZE - 7);
  drawAlignment(ALIGNMENT_CENTER, ALIGNMENT_CENTER);

  for (let i = 8; i < QR_SIZE - 8; i += 1) {
    const dark = i % 2 === 0;
    set(6, i, dark);
    set(i, 6, dark);
  }

  set(8, QR_VERSION * 4 + 9, true);

  const formatBits = getFormatBits(0);
  for (let i = 0; i <= 5; i += 1) set(8, i, getBit(formatBits, i));
  set(8, 7, getBit(formatBits, 6));
  set(8, 8, getBit(formatBits, 7));
  set(7, 8, getBit(formatBits, 8));
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, getBit(formatBits, i));
  for (let i = 0; i < 8; i += 1) set(QR_SIZE - 1 - i, 8, getBit(formatBits, i));
  for (let i = 8; i < 15; i += 1) {
    set(8, QR_SIZE - 15 + i, getBit(formatBits, i));
  }

  const dataBits: number[] = [];
  for (const codeword of codewords) appendBits(dataBits, codeword, 8);

  let bitIndex = 0;
  let upward = true;
  for (let right = QR_SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;

    for (let vertical = 0; vertical < QR_SIZE; vertical += 1) {
      const y = upward ? QR_SIZE - 1 - vertical : vertical;
      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset;
        if (reserved[y][x]) continue;

        let dark = dataBits[bitIndex] === 1;
        bitIndex += 1;
        if (maskBit(x, y)) dark = !dark;
        set(x, y, dark, false);
      }
    }

    upward = !upward;
  }

  return modules;
}

export function renderQrSvg(value: string, options?: { title?: string }) {
  const data = encodeData(value);
  const ecc = reedSolomonRemainder(data, reedSolomonDivisor(ECC_CODEWORDS));
  const modules = createMatrix([...data, ...ecc]);
  const quiet = 4;
  const moduleSize = 8;
  const imageSize = (QR_SIZE + quiet * 2) * moduleSize;
  const titleHeight = options?.title ? 24 : 0;
  const height = imageSize + titleHeight;
  const paths: string[] = [];

  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      if (!modules[y][x]) continue;
      paths.push(`M${(x + quiet) * moduleSize},${titleHeight + (y + quiet) * moduleSize}h${moduleSize}v${moduleSize}h-${moduleSize}z`);
    }
  }

  const title = options?.title
    ? `<text x="${imageSize / 2}" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700">${escapeXml(
        options.title
      )}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${imageSize}" height="${height}" viewBox="0 0 ${imageSize} ${height}" role="img" aria-label="QR code for ${escapeXml(
    value
  )}">
  <rect width="100%" height="100%" fill="#ffffff" />
  ${title}
  <path fill="#000000" d="${paths.join(" ")}" />
</svg>`;
}
