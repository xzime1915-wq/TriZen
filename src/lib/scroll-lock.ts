let lockCount = 0;

export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const scrollY = window.scrollY;
  document.documentElement.classList.add("trizen-scroll-locked");
  document.body.dataset.scrollLockY = String(scrollY);
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  window.dispatchEvent(new CustomEvent("trizen:scroll-lock", { detail: true }));
}

export function unlockPageScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  const scrollY = Number(document.body.dataset.scrollLockY || "0");
  document.documentElement.classList.remove("trizen-scroll-locked");
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  delete document.body.dataset.scrollLockY;
  window.scrollTo(0, scrollY);
  window.dispatchEvent(new CustomEvent("trizen:scroll-lock", { detail: false }));
}
