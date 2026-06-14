export function editionLabelFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("black")) return "Black";
  if (lower.includes("white")) return "White";
  if (lower.includes("silver")) return "Silver";
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

export function baseNameFromProductName(name: string): string {
  return name
    .replace(/\s+(black|white|silver)$/i, "")
    .trim();
}
