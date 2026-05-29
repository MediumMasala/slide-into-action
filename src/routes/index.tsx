import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const PAGE: "candidate" | "boss" = "candidate";

const CONFIG = {
  candidate: {
    headline: "BOSSES OF BANGALORE",
    bubbles: [
      "i scan across multiple boards to find the right one for you.",
      "filtering through the noise — that's my job.",
      "so, ready to get a job you'll love?",
    ],
    sliderLabel: "SLIDE INTO TAL'S DM",
    redirectUrl: "https://chat.whatsapp.com/CurDSi18V6SG2QAzRblo45",
  },
  boss: {
    headline: "I FIND YOU THE RIGHT HIRE",
    bubbles: [
      "tell me who you need. i'll surface real, vetted candidates.",
      "no job posts, no inbox spam — i message them first.",
      "so, ready to meet your next hire?",
    ],
    sliderLabel: "SLIDE TO MEET CANDIDATES",
    redirectUrl: "https://chat.whatsapp.com/CurDSi18V6SG2QAzRblo45",
  },
} as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tal — Slide Into My DM" },
      { name: "description", content: "Tal does your job search for you. Slide to start." },
      { property: "og:title", content: "Tal — Slide Into My DM" },
      { property: "og:description", content: "Tal does your job search for you. Slide to start." },
    ],
  }),
  component: Index,
});

const HANDLE_SIZE = 58;
const TRACK_PADDING = 6;

function Index() {
  const cfg = CONFIG[PAGE];
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [x, setX] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const startRef = useRef({ pointerX: 0, startX: 0 });
  const completedRef = useRef(false);

  useEffect(() => {
    const compute = () => {
      if (!trackRef.current) return;
      const w = trackRef.current.clientWidth;
      setMaxX(w - HANDLE_SIZE - TRACK_PADDING * 2);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const getPointerX = (e: PointerEvent | React.PointerEvent) =>
    "clientX" in e ? e.clientX : 0;

  const onPointerDown = (e: React.PointerEvent) => {
    if (completedRef.current) return;
    setDragging(true);
    startRef.current = { pointerX: e.clientX, startX: x };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    if (!dragging) return;

    const move = (e: PointerEvent) => {
      const dx = getPointerX(e) - startRef.current.pointerX;
      const next = Math.max(0, Math.min(maxX, startRef.current.startX + dx));
      setX(next);
    };

    const up = () => {
      setDragging(false);
      if (maxX > 0 && x / maxX >= 0.9) {
        completedRef.current = true;
        setX(maxX);
        setTimeout(() => {
          window.location.href = cfg.redirectUrl;
        }, 150);
      } else {
        setX(0);
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, maxX, x, cfg.redirectUrl]);

  const progress = maxX > 0 ? x / maxX : 0;
  const labelOpacity = Math.max(0, 1 - progress * 1.4);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#FF6B1A" }}
    >
      <main className="flex flex-1 flex-col gap-4 px-4 pt-5 pb-28 overflow-hidden">
        {/* Tile 1 — Title front and center */}
        <section className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-8 flex items-center justify-center">
          <h1 className="text-white text-center font-black uppercase tracking-tight leading-[0.95] text-[2.5rem] sm:text-5xl">
            {cfg.headline}
          </h1>
        </section>

        {/* Tile 2 — Mascot + messages */}
        <section className="flex-1 min-h-0 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm p-5 flex flex-col items-center gap-4 overflow-hidden">
          <div className="w-[55%] max-w-[200px] aspect-square rounded-[1.75rem] bg-white/20 border border-white/25 flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-white/70 text-sm">mascot</span>
          </div>

          <div className="w-full flex flex-col gap-2 items-start overflow-y-auto">
            {cfg.bubbles.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-snug text-neutral-900 shadow-sm max-w-[88%]"
                style={{ backgroundColor: "#FDF6EC" }}
              >
                {b}
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-4 left-4 right-4 z-10">
        <div
          ref={trackRef}
          className="relative w-full rounded-full bg-black select-none"
          style={{ height: 70 }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold tracking-[0.18em] text-neutral-400 pointer-events-none"
            style={{ opacity: labelOpacity }}
          >
            {cfg.sliderLabel}
          </span>

          <div
            ref={handleRef}
            onPointerDown={onPointerDown}
            className="absolute rounded-full bg-white flex items-center justify-center shadow-md touch-none cursor-grab active:cursor-grabbing"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              top: (70 - HANDLE_SIZE) / 2,
              left: TRACK_PADDING,
              transform: `translateX(${x}px)`,
              transition: dragging ? "none" : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <span className="text-neutral-900 text-xl font-bold leading-none">»</span>
          </div>
        </div>
      </div>
    </div>
  );
}
