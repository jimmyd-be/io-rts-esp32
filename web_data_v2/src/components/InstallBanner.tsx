import { useEffect, useState } from "preact/hooks";

const DISMISSED_KEY = "pwa-install-dismissed";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
}

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    if (isIos()) {
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void });
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  }

  function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      dismiss();
    }
  }

  if (!show) return null;

  return (
    <div class="install-banner">
      {deferredPrompt ? (
        <>
          <span>Install io-control as an app</span>
          <button type="button" class="install-btn" onClick={install}>Install</button>
        </>
      ) : (
        <span>
          Install: tap <strong>⎙</strong> then <strong>Add to Home Screen</strong>
        </span>
      )}
      <button type="button" class="install-dismiss" aria-label="Dismiss" onClick={dismiss}>✕</button>
    </div>
  );
}
