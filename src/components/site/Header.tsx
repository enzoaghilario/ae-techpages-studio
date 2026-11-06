import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { IG, Logo } from "@/components/site/Logo";
import { lockScroll } from "@/lib/smooth-scroll";

const LINKS = [
  ["Serviços", "#servicos"],
  ["Processo", "#processo"],
  ["Sobre", "#sobre"],
  ["Perguntas", "#faq"],
] as const;

/** Topo de vidro: some ao descer, volta ao subir; no celular abre um menu que se expande do botão. */
export function Header() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLAnchorElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; w: number } | null>(null);
  const [refract, setRefract] = useState(false);

  // A refração por SVG só funciona em navegadores baseados no Chromium; nos outros fica o vidro desfocado.
  useEffect(() => {
    const ua = navigator.userAgent;
    const chromium = /Chrome|Chromium|Edg\//.test(ua) && !/Firefox|FxiOS|CriOS|EdgiOS/.test(ua) && window.matchMedia("(pointer: fine)").matches;
    setRefract(chromium);
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      setSolid(y > 30);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t = window.setTimeout(() => first.current?.focus(), 250);
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", esc);
    return () => {
      lockScroll(false);
      window.clearTimeout(t);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-primary shadow-glow" />
      </div>
      {/* Filtro de refração do vidro líquido (usado só em navegadores que suportam) */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="lg-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <header className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 sm:px-5 sm:pt-4 ${hidden && !open ? "-translate-y-[130%]" : ""}`}>
        <div
          ref={glass}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
          }}
          className={`liquid-glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pl-3 pr-2 sm:pl-5 ${solid || open ? "is-solid" : ""} ${refract ? "can-refract" : ""}`}
        >
          <Logo onClick={() => setOpen(false)} />
          <nav
            className="lg-nav relative hidden items-center rounded-full p-1 text-sm text-muted-foreground md:flex"
            aria-label="Seções"
            onPointerLeave={() => setLens(null)}
          >
            <span aria-hidden className="lg-lens" style={lens ? { transform: `translateX(${lens.x}px)`, width: lens.w, opacity: 1 } : { opacity: 0 }} />
            {LINKS.map(([l, h]) => (
              <a
                key={h}
                href={h}
                onPointerEnter={(e) => setLens({ x: e.currentTarget.offsetLeft, w: e.currentTarget.offsetWidth })}
                onFocus={(e) => setLens({ x: e.currentTarget.offsetLeft, w: e.currentTarget.offsetWidth })}
                className="relative z-10 rounded-full px-4 py-2 transition-colors hover:text-foreground"
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={IG} target="_blank" rel="noreferrer" data-magnetic className="lg-cta whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold text-primary-foreground sm:text-sm">
              Pedir orçamento
            </a>
            <button ref={toggle} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-site" aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="lg-bubble relative grid size-11 place-items-center rounded-full md:hidden">
              <span className={`absolute h-px w-5 bg-foreground transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-5 bg-foreground transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </header>
      <div id="menu-site" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={!open}
        className={`menu-panel bg-grid fixed inset-0 z-40 flex flex-col bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 md:hidden ${open ? "is-open" : ""}`}>
        <nav className="flex flex-col gap-2" aria-label="Seções">
          {LINKS.map(([l, h], i) => (
            <a key={h} ref={i === 0 ? first : undefined} href={h} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${0.2 + i * 0.06}s` : "0s" }}
              className="menu-link flex items-baseline gap-4 border-b border-border py-4 font-display text-4xl font-bold">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              {l}
            </a>
          ))}
        </nav>
        <a href={IG} target="_blank" rel="noreferrer" className="menu-link mt-auto flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow-glow" style={{ transitionDelay: open ? "0.5s" : "0s" }}>
          <Instagram className="size-5" /> Chama no direct
        </a>
      </div>
    </>
  );
}
