import { useEffect, useRef, useState } from "react";
import { Holo } from "@/components/site/Holo";

const STEPS = [
  { t: "Conversa", d: "Entendemos seu negócio, objetivos e público.", who: "Felipe", did: "ouvindo a ideia" },
  { t: "Proposta", d: "Orçamento claro, escopo definido e prazo combinado.", who: "André", did: "fechando a proposta" },
  { t: "Desenvolvimento", d: "Design e código sob medida, com você acompanhando.", who: "Enzo", did: "codando" },
  { t: "Entrega e suporte", d: "Site no ar, otimizado, e a gente segue junto.", who: "André", did: "publicando" },
];

/** Linha do tempo que se acende com a rolagem; cada etapa liga quando a luz passa por ela. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(-1);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
      let last = -1;
      items.forEach((it, i) => {
        if (it.getBoundingClientRect().top + 20 < mid) last = i;
      });
      setOn(last);
    };
    const q = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", q, { passive: true });
    window.addEventListener("resize", q);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", q);
      window.removeEventListener("resize", q);
    };
  }, []);

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <span aria-hidden className="absolute left-6 top-0 h-full w-px bg-border md:left-1/2" />
      <span ref={fill} aria-hidden className="absolute left-6 top-0 h-full w-px origin-top scale-y-0 bg-primary shadow-glow md:left-1/2" />
      {STEPS.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li key={s.t} className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-5 pb-12 last:pb-0 md:grid-cols-2 md:gap-16">
            <span data-node className={`tl-node relative z-10 col-start-1 row-start-1 grid size-12 place-items-center rounded-full border border-border bg-background font-display font-bold md:absolute md:left-1/2 md:top-4 md:-translate-x-1/2 ${on >= i ? "is-on" : "text-muted-foreground"}`}>
              0{i + 1}
            </span>
            <Holo data-team={s.who} data-team-label={s.did} className={`rv col-start-2 row-start-1 rounded-2xl p-6 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
              <h3 className="text-xl font-bold md:text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </Holo>
          </li>
        );
      })}
    </ol>
  );
}
