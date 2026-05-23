export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(input, init);
  const text = await res.text();
  try {
    const data = text ? (JSON.parse(text) as T) : ({} as T);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: res.status,
      data: {
        error: "Server returned an invalid response. Try refreshing the page.",
      } as T,
    };
  }
}
