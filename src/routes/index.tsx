import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const PAGE: "candidate" | "boss" = "candidate";

const CONFIG = {
  candidate: {
    eyebrow: "You are about to join",
    brand: "bosses of bangalore",
    badge: "beta",
    buttonLabel: "Join the group",
    redirectUrl: "https://chat.whatsapp.com/CurDSi18V6SG2QAzRblo45",
  },
  boss: {
    eyebrow: "You are about to meet",
    brand: "your next hire",
    badge: "beta",
    buttonLabel: "Join the group",
    redirectUrl: "https://chat.whatsapp.com/CurDSi18V6SG2QAzRblo45",
  },
} as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bosses of Bangalore" },
      {
        name: "description",
        content: "You're about to join bosses of bangalore (beta). With love, by Tal.",
      },
      { property: "og:title", content: "Bosses of Bangalore" },
      {
        property: "og:description",
        content: "You're about to join bosses of bangalore (beta). With love, by Tal.",
      },
    ],
  }),
  component: Index,
});

const AUTO_PRESS_MS = 2000;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.2 4.79 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.2-8.24 8.2zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21s-6.72-4.35-9.34-8.08C.58 9.88 1.4 6.49 4.2 5.4c1.9-.74 3.86.05 5 1.66L12 9.9l2.8-2.84c1.14-1.61 3.1-2.4 5-1.66 2.8 1.09 3.62 4.48 1.54 7.52C18.72 16.65 12 21 12 21z" />
    </svg>
  );
}

function Index() {
  const cfg = CONFIG[PAGE];
  const [mounted, setMounted] = useState(false);
  const [fill, setFill] = useState(0);
  const [fillMs, setFillMs] = useState(AUTO_PRESS_MS);
  const [pressed, setPressed] = useState(false);
  const firedRef = useRef(false);

  const go = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setFillMs(180);
    setFill(100);
    setPressed(true);
    setTimeout(() => {
      window.location.href = cfg.redirectUrl;
    }, 200);
  };

  useEffect(() => {
    const ua = navigator.userAgent || "";
    // Mobile skips the interstitial and goes straight to the WhatsApp link
    if (/Android|iPhone|iPad|iPod/i.test(ua)) {
      window.location.href = cfg.redirectUrl;
      return;
    }
    // Desktop keeps this middle page with the auto-press CTA
    setMounted(true);
    const raf = requestAnimationFrame(() => setFill(100));
    const timer = setTimeout(go, AUTO_PRESS_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rise = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "linear-gradient(165deg, #FF8A3D 0%, #FF6B1A 52%, #EF5A0C 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 75% at 50% 12%, rgba(255,255,255,0.22), rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-white/85 text-base font-medium tracking-wide" style={rise(60)}>
            {cfg.eyebrow}
          </p>
          <h1
            className="text-white font-black lowercase tracking-tight leading-[0.92] text-[2.85rem] sm:text-6xl"
            style={rise(140)}
          >
            {cfg.brand}
          </h1>
          <span
            className="inline-flex items-center rounded-full bg-black px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-sm"
            style={rise(240)}
          >
            {cfg.badge}
          </span>
        </div>

        <div className="flex w-full flex-col items-center gap-3.5" style={rise(360)}>
          <button
            type="button"
            onClick={go}
            aria-label={cfg.buttonLabel}
            className="relative w-full overflow-hidden rounded-full bg-black flex items-center justify-center gap-2.5 select-none shadow-lg shadow-black/25"
            style={{
              height: 68,
              transform: pressed ? "scale(0.98)" : undefined,
              transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 bg-white/15 pointer-events-none"
              style={{ width: `${fill}%`, transition: `width ${fillMs}ms linear` }}
            />
            <WhatsAppIcon className="relative z-10 h-5 w-5 text-white" />
            <span className="relative z-10 text-white text-[17px] font-semibold tracking-wide">
              {cfg.buttonLabel}
            </span>
          </button>
          <p className="flex items-center gap-1.5 text-white/75 text-[13px] tracking-wide">
            <HeartIcon className="h-3.5 w-3.5 text-white/90" />
            with love, by Tal
          </p>
        </div>
      </div>
    </div>
  );
}
