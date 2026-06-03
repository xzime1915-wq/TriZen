/** Short two-tone ping for new chat messages */
export function playChatSound() {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    if (ctx.state === "suspended") void ctx.resume();

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    };

    const t = ctx.currentTime;
    playTone(880, t, 0.12);
    playTone(1174, t + 0.14, 0.14);

    window.setTimeout(() => void ctx.close(), 500);
  } catch {
    /* ignore autoplay / audio errors */
  }
}

export async function requestChatNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showChatNotification(
  title: string,
  body: string,
  onClick?: () => void,
  tag = "trizen-chat"
) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (document.visibilityState === "visible") return;

  try {
    const n = new Notification(title, {
      body,
      icon: "/icon.png",
      tag,
    });
    n.onclick = () => {
      window.focus();
      onClick?.();
      n.close();
    };
  } catch {
    /* ignore */
  }
}
