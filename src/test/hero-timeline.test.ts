import { describe, expect, it } from "vitest";
import { browserShape, HERO_PHASES, phaseAt, phoneShape, rng, shapeProgress, sphereShape } from "@/lib/hero-timeline";

describe("História das partículas", () => {
  it("tem as quatro formas na ordem: marca, ideia, site, telas", () => {
    expect(HERO_PHASES.map((p) => p.key)).toEqual(["marca", "ideia", "site", "telas"]);
  });

  it("segura cada forma antes de transformar", () => {
    expect(shapeProgress(0)).toBe(0);
    expect(shapeProgress(0.1)).toBe(0);
    expect(shapeProgress(1)).toBe(3);
    expect(shapeProgress(0.5)).toBeGreaterThan(1);
  });

  it("mostra o texto certo em cada trecho da rolagem", () => {
    expect(phaseAt(0)).toBe(0);
    expect(phaseAt(0.45)).toBe(1);
    expect(phaseAt(0.75)).toBe(2);
    expect(phaseAt(1)).toBe(3);
  });

  it("gera todas as formas com o mesmo número de partículas", () => {
    for (const shape of [sphereShape(500), browserShape(500), phoneShape(500)]) {
      expect(shape.length).toBe(1500);
      expect(Array.from(shape).every(Number.isFinite)).toBe(true);
    }
  });

  it("gera sempre as mesmas formas (semente fixa)", () => {
    const a = rng(1);
    const b = rng(1);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
