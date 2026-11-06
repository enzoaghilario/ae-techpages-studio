import { useEffect, useRef } from "react";
import { pick, rand, selectionBox, sleep, TeamBot, type Member } from "@/lib/team";

const LAYOUT = ["ajustando o layout", "alinhando os blocos", "escolhendo as cores", "arrumando o espaçamento"];
const CODE = ["<Hero animated />", "git commit -m \"menu\"", "npm run build", "fix: celular", "deploy --prod"];
const CHECKS = ["✓ pronto pro Google", "✓ rápido no celular", "✓ publicado", "✓ formulário ok"];

/**
 * No topo, Felipe, Enzo e André trabalham na peça de partículas:
 * Felipe arrasta seleções e ajusta o layout, Enzo digita código, André revisa e publica.
 */
export function TeamCursors() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = layer.current;
    if (!host) return;
    const ctrl = new AbortController();
    const { signal } = ctrl;
    let visible = true;
    let wake: (() => void) | null = null;
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) wake?.();
    });
    io.observe(host);
    const awake = () => (visible ? Promise.resolve() : new Promise<void>((r) => (wake = r)));

    // Área de trabalho: ao redor das partículas (à direita no computador, em cima no celular).
    const area = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      return w < 900
        ? { x0: w * 0.1, x1: w * 0.62, y0: h * 0.1, y1: h * 0.38 }
        : { x0: w * 0.52, x1: w * 0.86, y0: h * 0.18, y1: h * 0.72 };
    };
    const spot = () => {
      const a = area();
      return { x: rand(a.x0, a.x1), y: rand(a.y0, a.y1) };
    };

    const bots = (["Felipe", "Enzo", "André"] as Member[]).map((n, i) => {
      const s = spot();
      const b = new TeamBot(n, host, s.x + i * 10, s.y);
      return b;
    });
    const [felipe, enzo, andre] = bots as [TeamBot, TeamBot, TeamBot];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        io.disconnect();
        bots.forEach((b) => b.remove());
      };
    }

    const felipeLoop = async () => {
      await sleep(600, signal);
      for (;;) {
        await awake();
        const a = spot();
        await felipe.move(a.x, a.y, rand(900, 1300), signal);
        felipe.press(true);
        const box = selectionBox(host, "Felipe", a.x, a.y);
        const narrow = host.clientWidth < 900;
        const w = rand(narrow ? 70 : 90, narrow ? 110 : 170);
        const h = rand(narrow ? 50 : 60, narrow ? 80 : 110);
        box.animate([{ width: "0px", height: "0px" }, { width: `${w}px`, height: `${h}px` }], { duration: 900, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" });
        await felipe.move(a.x + w, a.y + h, 900, signal);
        felipe.press(false);
        await felipe.say(pick(LAYOUT), signal);
        await sleep(1500, signal);
        felipe.hush();
        box.style.opacity = "0";
        window.setTimeout(() => box.remove(), 450);
        await sleep(rand(400, 900), signal);
      }
    };

    const enzoLoop = async () => {
      await sleep(1400, signal);
      for (;;) {
        await awake();
        const a = spot();
        await enzo.move(a.x, a.y, rand(1000, 1400), signal);
        await enzo.click(signal);
        await enzo.say(pick(CODE), signal, true);
        await sleep(1300, signal);
        enzo.hush();
        await sleep(rand(500, 1000), signal);
      }
    };

    const andreLoop = async () => {
      await sleep(2200, signal);
      for (;;) {
        await awake();
        const a = spot();
        await andre.move(a.x, a.y, rand(1100, 1500), signal);
        await andre.click(signal);
        await sleep(160, signal);
        await andre.click(signal);
        await andre.say(pick(CHECKS), signal);
        await sleep(1600, signal);
        andre.hush();
        await sleep(rand(600, 1200), signal);
      }
    };

    const run = (f: () => Promise<void>) => f().catch(() => {});
    run(felipeLoop);
    run(enzoLoop);
    run(andreLoop);

    return () => {
      ctrl.abort();
      io.disconnect();
      bots.forEach((b) => b.remove());
      host.querySelectorAll(".tc-select").forEach((n) => n.remove());
    };
  }, []);

  return <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 z-[6]" />;
}