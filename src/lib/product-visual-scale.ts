const LARGE_VIEW_SCALE_BY_IMAGE: Array<{ pattern: RegExp; scale: number }> = [];

export function getLargeProductImageScale(src: string) {
  const hit = LARGE_VIEW_SCALE_BY_IMAGE.find(({ pattern }) => pattern.test(src));
  return hit?.scale ?? 1;
}
