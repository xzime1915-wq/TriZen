import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const AUDIO_TYPES = new Map([
  ["audio/webm", "webm"],
  ["audio/ogg", "ogg"],
  ["audio/mpeg", "mp3"],
  ["audio/mp4", "m4a"],
  ["audio/wav", "wav"],
]);

export type ChatUploadKind = "image" | "audio";

export function getUploadKind(mime: string): ChatUploadKind | null {
  if (IMAGE_TYPES.has(mime)) return "image";
  if (AUDIO_TYPES.has(mime)) return "audio";
  return null;
}

export async function saveChatUpload(
  conversationId: string,
  file: File,
  kind: ChatUploadKind
) {
  const mime = file.type || "";
  const extMap = kind === "image" ? IMAGE_TYPES : AUDIO_TYPES;
  const ext = extMap.get(mime);
  if (!ext) {
    throw new Error(
      kind === "image"
        ? "Only JPG, PNG, WebP, or GIF images are allowed"
        : "Unsupported audio format"
    );
  }

  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  if (file.size > maxBytes) {
    throw new Error(
      kind === "image"
        ? "Image must be 5MB or smaller"
        : "Voice message must be 10MB or smaller"
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeId = conversationId.replace(/[^a-zA-Z0-9_-]/g, "");
  const dir = path.join(process.cwd(), "public", "uploads", "chat", safeId);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const diskPath = path.join(dir, filename);
  await writeFile(diskPath, bytes);

  return {
    url: `/uploads/chat/${safeId}/${filename}`,
    attachmentType: kind,
  };
}
