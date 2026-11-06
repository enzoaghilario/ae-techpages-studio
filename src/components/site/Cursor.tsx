import { useEffect, useRef } from "react";

/** Cursor neon: ponto preciso + anel que segue com atraso e cresce sobre links e botões. Só com mouse. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;
    d.hidden = false;
    r.hidden = false;
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      d.style.transform = `translate(${x}px, ${y}px)`;
      r.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const hot = (e.target as Element | null)?.closest?.("a, button, [data-cursor]");
      r.classList.toggle("is-hot", !!hot);
    };
    const leave = () => {
      x = y = -100;
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={dot} hidden aria-hidden className="cursor-dot" />
      <div ref={ring} hidden aria-hidden className="cursor-ring" />
    </>
  );
}
