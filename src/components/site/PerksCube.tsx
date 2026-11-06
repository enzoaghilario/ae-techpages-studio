import { useEffect, useRef } from "react";
import { HeartHandshake, Palette, Search, Zap } from "lucide-react";

const PERKS = [
  { icon: Zap, t: "Entrega ágil" },
  { icon: Palette, t: "Design sob medida" },
  { icon: Search, t: "Pronto para Google e celular" },
  { icon: HeartHandshake, t: "Suporte próximo" },
];

/** Cubo 3D que gira com a rolagem, mostrando um diferencial em cada face. */
export function PerksCube() {
  const stage = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const paint = () => {
      raf = 0;
      const s = stage.current;
      const c = cube.current;
      if (!s || !c) return;
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2)));
      c.style.transform = `rotateX(${-14 + my * 10}deg) rotateY(${-25 - p * 300 + mx * 20}deg)`;
    };
    const q = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduced) return;
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      q();
    };
    paint();
    window.addEventListener("scroll", q, { passive: true });
    window.addEventListener("resize", q);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", q);
      window.removeEventListener("resize", q);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div ref={stage} className="cube-stage grid place-items-center py-6 [--s:190px] md:[--s:240px]" aria-hidden>
        <div ref={cube} className="cube">
          {PERKS.map(({ icon: I, t }) => (
            <div key={t} className="cube-face">
              <I className="mx-auto size-10 text-primary drop-shadow-[0_0_10px_var(--primary)]" />
              <p className="font-display text-lg font-bold leading-tight">{t}</p>
            </div>
          ))}
          <div className="cube-face"><span className="font-display text-5xl font-bold text-primary">AE</span></div>
          <div className="cube-face" />
        </div>
        <div className="cube-shadow" />
      </div>
      {/* Lista acessível dos diferenciais */}
      <ul className="mt-6 grid w-full max-w-md grid-cols-2 gap-3">
        {PERKS.map(({ icon: I, t }) => (
          <li key={t} className="rv flex items-center gap-2.5 rounded-xl border border-border bg-card/60 px-3 py-2.5 text-sm font-semibold">
            <I className="size-4 shrink-0 text-primary" /> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
