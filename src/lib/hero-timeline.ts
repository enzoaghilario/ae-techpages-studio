/**
 * História do topo: as partículas formam a marca, viram uma ideia solta,
 * se organizam num site e terminam num celular. O progresso (0 → 1) vem da rolagem.
 * Arquivo puro (sem three.js) para ser testável.
 */
export const HERO_PHASES = [
  { key: "marca", label: "AE Tech Pages" },
  { key: "ideia", label: "01 — A ideia" },
  { key: "site", label: "02 — O site" },
  { key: "telas", label: "03 — Em toda tela" },
] as const;

/** Converte o progresso da rolagem (0 → 1) em "forma" contínua (0 → 3). Segura cada forma um pouco antes de mudar. */
export function shapeProgress(p: number) {
  const x = Math.min(1, Math.max(0, p)) * 3;
  const i = Math.min(2, Math.floor(x));
  const f = x - i;
  // 35% do trecho parado na forma atual, 65% transformando.
  const t = f < 0.35 ? 0 : (f - 0.35) / 0.65;
  return i + t;
}

/** Fase visível (0 a 3) para os textos sobrepostos. */
export function phaseAt(p: number) {
  return Math.min(3, Math.max(0, Math.round(shapeProgress(p))));
}

type Rng = () => number;

/** Gerador pseudo-aleatório com semente: as formas saem iguais em todo carregamento. */
export function rng(seed = 7): Rng {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Esfera difusa: a ideia ainda solta, sem forma. */
export function sphereShape(n: number, r = 1.7, rand: Rng = rng(11)) {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const k = r * (0.82 + rand() * 0.3) * (rand() < 0.12 ? 1.35 : 1);
    out[i * 3] = Math.cos(th) * rad * k;
    out[i * 3 + 1] = y * k;
    out[i * 3 + 2] = Math.sin(th) * rad * k;
  }
  return out;
}

type Rect = { x: number; y: number; w: number; h: number; fill?: boolean; weight?: number };

/** Distribui n pontos em retângulos (contorno ou preenchidos), proporcional ao peso de cada um. */
export function rectsShape(n: number, rects: Rect[], depth = 0.12, rand: Rng = rng(5)) {
  const out = new Float32Array(n * 3);
  const weights = rects.map((r) => (r.weight ?? 1) * (r.fill ? r.w * r.h * 3 : (r.w + r.h) * 2));
  const total = weights.reduce((a, b) => a + b, 0);
  let i = 0;
  rects.forEach((r, k) => {
    const count = k === rects.length - 1 ? n - i : Math.round(((weights[k] ?? 0) / total) * n);
    for (let c = 0; c < count && i < n; c++, i++) {
      let x: number;
      let y: number;
      if (r.fill) {
        x = r.x + rand() * r.w;
        y = r.y + rand() * r.h;
      } else {
        const per = (r.w + r.h) * 2;
        let d = rand() * per;
        if (d < r.w) { x = r.x + d; y = r.y; }
        else if ((d -= r.w) < r.h) { x = r.x + r.w; y = r.y + d; }
        else if ((d -= r.h) < r.w) { x = r.x + r.w - d; y = r.y + r.h; }
        else { d -= r.w; x = r.x; y = r.y + r.h - d; }
        x += (rand() - 0.5) * 0.015;
        y += (rand() - 0.5) * 0.015;
      }
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = (rand() - 0.5) * depth;
    }
  });
  return out;
}

/** Uma janela de navegador com um site dentro: barra, destaque, textos e cartões. */
export function browserShape(n: number) {
  const W = 4.6;
  const H = 3;
  const x0 = -W / 2;
  const y0 = -H / 2;
  return rectsShape(n, [
    { x: x0, y: y0, w: W, h: H, weight: 2.2 },
    { x: x0, y: y0 + H - 0.32, w: W, h: 0.004, fill: true, weight: 0.35 },
    { x: x0 + 0.14, y: y0 + H - 0.2, w: 0.08, h: 0.08, fill: true, weight: 0.6 },
    { x: x0 + 0.3, y: y0 + H - 0.2, w: 0.08, h: 0.08, fill: true, weight: 0.6 },
    { x: x0 + 0.46, y: y0 + H - 0.2, w: 0.08, h: 0.08, fill: true, weight: 0.6 },
    { x: x0 + 1.2, y: y0 + H - 0.22, w: 2.2, h: 0.12, weight: 0.6 },
    { x: x0 + 0.35, y: y0 + 1.75, w: 2.1, h: 0.2, fill: true, weight: 1.4 },
    { x: x0 + 0.35, y: y0 + 1.5, w: 1.5, h: 0.08, fill: true, weight: 0.8 },
    { x: x0 + 0.35, y: y0 + 1.36, w: 1.2, h: 0.08, fill: true, weight: 0.8 },
    { x: x0 + 0.35, y: y0 + 1.05, w: 0.75, h: 0.18, fill: true, weight: 1.6 },
    { x: x0 + 2.75, y: y0 + 1.05, w: 1.5, h: 1.15, weight: 1.2 },
    { x: x0 + 2.95, y: y0 + 1.25, w: 1.1, h: 0.75, fill: true, weight: 0.5 },
    { x: x0 + 0.35, y: y0 + 0.2, w: 1.15, h: 0.6, weight: 0.9 },
    { x: x0 + 1.72, y: y0 + 0.2, w: 1.15, h: 0.6, weight: 0.9 },
    { x: x0 + 3.09, y: y0 + 0.2, w: 1.15, h: 0.6, weight: 0.9 },
  ]);
}

/** Um celular com o mesmo site, em versão vertical. */
export function phoneShape(n: number) {
  const W = 1.55;
  const H = 3.1;
  const x0 = -W / 2;
  const y0 = -H / 2;
  return rectsShape(n, [
    { x: x0, y: y0, w: W, h: H, weight: 2.4 },
    { x: x0 + 0.06, y: y0 + 0.06, w: W - 0.12, h: H - 0.12, weight: 0.8 },
    { x: -0.25, y: y0 + H - 0.2, w: 0.5, h: 0.07, fill: true, weight: 0.8 },
    { x: x0 + 0.18, y: y0 + 2.2, w: 1.1, h: 0.16, fill: true, weight: 1.3 },
    { x: x0 + 0.18, y: y0 + 2.0, w: 0.9, h: 0.06, fill: true, weight: 0.6 },
    { x: x0 + 0.18, y: y0 + 1.88, w: 0.7, h: 0.06, fill: true, weight: 0.6 },
    { x: x0 + 0.18, y: y0 + 1.58, w: 0.6, h: 0.16, fill: true, weight: 1.4 },
    { x: x0 + 0.18, y: y0 + 0.82, w: W - 0.36, h: 0.6, weight: 1 },
    { x: x0 + 0.18, y: y0 + 0.16, w: W - 0.36, h: 0.5, weight: 1 },
    { x: -0.2, y: y0 + 0.1, w: 0.4, h: 0.025, fill: true, weight: 0.3 },
  ]);
}

/** Pontos a partir de pixels acesos de uma imagem (usado para o "AE" e o anel do logo). */
export function pixelsShape(n: number, pixels: [number, number][], scale: number, depth = 0.25, rand: Rng = rng(3)) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const [px, py] = pixels[Math.floor(rand() * pixels.length)] ?? [0, 0];
    out[i * 3] = (px + (rand() - 0.5) * 1.2) * scale;
    out[i * 3 + 1] = (py + (rand() - 0.5) * 1.2) * scale;
    out[i * 3 + 2] = (rand() - 0.5) * depth;
  }
  return out;
}
