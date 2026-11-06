import { useEffect, type RefObject } from "react";
import { isMember, sleep, TEAM, TeamBot } from "@/lib/team";

/**
 * No resto da página: quando um elemento com `data-team="Felipe|Enzo|André"` aparece,
 * o cursor daquela pessoa entra, clica nele e deixa uma marcação com o nome e o que fez.
 */
export function useTeamPicks(layerRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-team]"));

    const act = async (el: HTMLElement, delay: number) => {
      const name = el.dataset["team"];
      if (!isMember(name)) return;
      await sleep(delay, signal);
      const L = layer.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const x = r.left - L.left;
      const y = r.top - L.top;
      const fromLeft = r.left + r.width / 2 > window.innerWidth / 2;
      const startX = fromLeft ? x + r.width + 140 : x - 140;
      const bot = new TeamBot(name, layer, startX, y + r.height + 80);
      const tx = x + Math.min(r.width * 0.35, 120);
      const ty = y + Math.min(r.height * 0.45, 60);
      try {
        await bot.move(tx, ty, 1000, signal);
        await bot.click(signal);
        const frame = document.createElement("span");
        frame.className = "tc-pick";
        frame.style.setProperty("--tc", TEAM[name]);
        Object.assign(frame.style, { left: `${x - 6}px`, top: `${y - 6}px`, width: `${r.width + 12}px`, height: `${r.height + 12}px` });
        const label = el.dataset["teamLabel"];
        frame.innerHTML = `<span class="tc-pick-tag">${name}${label ? ` · ${label}` : ""}</span>`;
        layer.appendChild(frame);
        await sleep(450, signal);
        await bot.move(tx + (fromLeft ? 160 : -160), ty + 120, 900, signal);
        bot.el.style.transition = "opacity .4s";
        bot.el.style.opacity = "0";
        await sleep(1400, signal);
        frame.style.opacity = "0";
        await sleep(500, signal);
        frame.remove();
      } catch {
        /* saiu da página no meio da animação */
      } finally {
        bot.remove();
      }
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, k) => {
            io.unobserve(e.target);
            // Quem aparece junto entra um de cada vez.
            void act(e.target as HTMLElement, 350 + k * 450);
          }),
      { threshold: 0.6 },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      ctrl.abort();
      io.disconnect();
      layer.querySelectorAll(".tc, .tc-pick").forEach((n) => n.remove());
    };
  }, [layerRef]);
}