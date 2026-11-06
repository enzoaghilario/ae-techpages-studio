import { useEffect, useRef } from "react";

const WORDS = ["Landing Pages", "Sites", "SaaS", "Automações", "SEO", "Design sob medida", "Alta performance"];

/** Faixa infinita que acelera e inverte conforme a rolagem. */
export function Marquee() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    const box = wrap.current;
    if (!el || !box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let lastT = 0;
    let raf = 0;
    let visible = false;
    const tick = (t: number) => {
      raf = visible ? requestAnimationFrame(tick) : 0;
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 1 / 60;
      lastT = t;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      boost += (Math.min(6, Math.abs(dy) / 12) - boost) * 0.12;
      x += dir * 1.6 * dt * (1 + boost);
      x = ((x % 50) - 50) % 50;
      el.style.transform = `translate3d(${x}%,0,0)`;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }, { rootMargin: "200px 0px" });
    io.observe(box);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className="relative -rotate-1 overflow-hidden border-y border-primary/30 bg-primary/[0.06] py-5 backdrop-blur-sm">
      <div ref={track} className="flex w-max whitespace-nowrap font-display text-2xl font-bold uppercase tracking-wide md:text-4xl">
        {Array.from({ length: 4 }).flatMap((_, k) =>
          WORDS.map((w) => (
            <span key={`${k}-${w}`} className="flex items-center gap-6 px-3 md:gap-8 md:px-4">
              <span className={k % 2 ? "text-outline" : "text-foreground"}>{w}</span>
              <span className="text-primary">✦</span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
