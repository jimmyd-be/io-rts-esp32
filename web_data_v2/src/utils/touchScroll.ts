let scrolled = false;

if (typeof window !== "undefined") {
  window.addEventListener("touchstart", () => { scrolled = false; }, { passive: true });
  window.addEventListener("touchmove", () => { scrolled = true; }, { passive: true });
}

export function wasScrolling(): boolean {
  return scrolled;
}
