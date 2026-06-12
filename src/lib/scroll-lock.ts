let lockCount = 0;

export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  document.documentElement.classList.add("trizen-scroll-locked");
  document.body.style.overflow = "hidden";
  window.dispatchEvent(new CustomEvent("trizen:scroll-lock", { detail: true }));
}

export function unlockPageScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.documentElement.classList.remove("trizen-scroll-locked");
  document.body.style.overflow = "";
  window.dispatchEvent(new CustomEvent("trizen:scroll-lock", { detail: false }));
}
