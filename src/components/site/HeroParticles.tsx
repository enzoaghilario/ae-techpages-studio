import { useEffect, useRef, useState } from "react";
import { ArrowRight, Instagram } from "lucide-react";
import { HERO_PHASES, phaseAt } from "@/lib/hero-timeline";
import { IG } from "@/components/site/Logo";
import { Scramble } from "@/components/site/Scramble";
import { TeamCursors } from "@/components/site/TeamCursors";
import type { ParticleScene } from "@/lib/particle-scene";

const STORY = [
  { title: "Toda ideia começa", accent: "solta.", text: "Você conta o que imagina. A gente escuta, pergunta e transforma em um plano claro." },
  { title: "Design e código que", accent: "vendem.", text: "Cada bloco pensado para levar seu cliente até o direct, a compra ou o cadastro." },
  { title: "Rápido no celular,", accent: "pronto pro Google.", text: "Seu site no ar, leve e otimizado — e a gente segue junto no suporte." },
];

/**
 * Topo fixo: milhares de partículas formam o logo AE e, conforme a rolagem,
 * viram uma ideia, um site e um celular. Os textos acompanham cada forma.
 */
export function HeroParticles() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ParticleScene | null>(null);
  const progressRef = useRef(0);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (travel || 1)));
      progressRef.current = p;
      sceneRef.current?.setProgress(p);
      barsRef.current.forEach((b, i) => {
        if (b) b.style.transform = `scaleY(${Math.min(1, Math.max(0, p * 3 - (i - 1)))})`;
      });
      setPhase(phaseAt(p));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Cada montagem usa seu próprio canvas: evita dois renderizadores no mesmo contexto WebGL.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);
    let disposed = false;
    let scene: ParticleScene | null = null;
    let ro: ResizeObserver | undefined;
    let io: IntersectionObserver | undefined;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      scene?.setPointer((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    };
    (async () => {
      try {
        const probe = document.createElement("canvas");
        if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;
        const { createParticleScene } = await import("@/lib/particle-scene");
        if (disposed) return;
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        scene = await createParticleScene(canvas, { mobile, reducedMotion: reduced });
        if (disposed) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        scene.setProgress(progressRef.current);
        const fit = () => scene?.resize(host.clientWidth, host.clientHeight);
        ro = new ResizeObserver(fit);
        ro.observe(host);
        fit();
        io = new IntersectionObserver(([e]) => (e?.isIntersecting ? scene?.start() : scene?.stop()));
        io.observe(host);
        window.addEventListener("pointermove", onMove, { passive: true });
        setReady(true);
      } catch (error) {
        console.warn("[Partículas]", error);
      }
    })();
    return () => {
      disposed = true;
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene?.dispose();
      sceneRef.current = null;
      canvas.remove();
    };
  }, []);

  return (
    <section id="topo" ref={sectionRef} className="relative h-[380svh] md:h-[400vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className="hero-glow" />
        <div aria-hidden className="hero-floor" />
        <div ref={hostRef} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />

        {/* A equipe trabalhando na peça */}
        <TeamCursors />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent md:hidden" />

        <div className="relative mx-auto h-full max-w-6xl px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24">
          <div className="relative h-full max-w-xl">
            {/* Fase 0 — marca */}
            <div className={`phase ${phase === 0 ? "is-active" : ""}`} inert={phase !== 0}>
              <p className="mb-4 inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="led" aria-hidden />
                <Scramble text="Landing pages · Sites · Automações" />
              </p>
              <h1 className="text-[2.9rem] font-bold leading-[1.02] sm:text-6xl md:text-7xl">
                Sua ideia. <span className="text-neon">Nós criamos.</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-muted-foreground md:mt-6 md:text-lg">
                A AE Tech Pages cria experiências digitais modernas, rápidas e pensadas para vender. Do primeiro rascunho ao site no ar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
                <a href={IG} target="_blank" rel="noreferrer" data-magnetic className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-glow animate-glow">
                  <Instagram className="size-4" /> Chama no direct
                </a>
                <a href="#servicos" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3.5 font-semibold backdrop-blur hover:border-primary hover:text-primary">
                  Ver serviços <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            {STORY.map((s, i) => (
              <div key={s.title} className={`phase ${phase === i + 1 ? "is-active" : ""}`} inert={phase !== i + 1}>
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Scramble text={HERO_PHASES[i + 1]?.label ?? ""} play={phase === i + 1} />
                </p>
                <h2 className="text-4xl font-bold leading-[1.05] md:text-6xl">
                  {s.title} <span className="text-neon">{s.accent}</span>
                </h2>
                <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador das fases */}
        <div aria-hidden className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:right-8 md:flex">
          {HERO_PHASES.map((ph, i) => (
            <span key={ph.key} className="relative block h-10 w-[2px] overflow-hidden bg-border">
              <span ref={(el) => { barsRef.current[i] = el; }} className={`absolute inset-0 origin-top bg-primary ${i === 0 ? "" : "scale-y-0"}`} />
            </span>
          ))}
        </div>
        <p className={`pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-opacity duration-500 md:flex ${phase === 0 ? "opacity-100" : "opacity-0"}`}>
          Role para ver a ideia virar site
        </p>
      </div>
    </section>
  );
}
