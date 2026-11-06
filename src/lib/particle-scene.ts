import * as THREE from "three";
import { browserShape, phoneShape, pixelsShape, rng, shapeProgress, sphereShape } from "./hero-timeline";

/**
 * Milhares de partículas de luz que mudam de forma com a rolagem:
 * logo AE → ideia (esfera) → site (janela de navegador) → celular.
 * Um único draw call com shader próprio; leve até em celular.
 */
export type ParticleScene = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: (w: number, h: number) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

const vertex = /* glsl */ `
  uniform float uShape;
  uniform float uIntro;
  uniform float uTime;
  uniform float uPixel;
  uniform float uSize;
  uniform vec3 uMouse;
  attribute vec3 aA;
  attribute vec3 aB;
  attribute vec3 aC;
  attribute vec3 aD;
  attribute vec4 aRand;
  varying float vAlpha;
  varying float vTint;

  vec3 pick(float i) {
    if (i < 0.5) return aA;
    if (i < 1.5) return aB;
    if (i < 2.5) return aC;
    return aD;
  }

  void main() {
    float seg = min(floor(uShape), 2.0);
    float f = uShape - seg;
    // Cada partícula sai num tempo um pouco diferente: a forma "se desfaz e se refaz".
    float d = aRand.x * 0.45;
    float t = smoothstep(d, d + 0.55, f);
    vec3 from = pick(seg);
    vec3 to = pick(seg + 1.0);
    vec3 p = mix(from, to, t);
    // No meio da transição, as partículas fazem uma curva em espiral.
    float swirl = sin(t * 3.14159);
    float ang = aRand.z * 6.2831;
    p += vec3(cos(ang), sin(ang * 1.3), sin(ang)) * swirl * (0.6 + aRand.w * 0.9);
    // Abertura: as partículas chegam de longe e montam o logo.
    vec3 scatter = vec3(cos(ang) * sin(aRand.w * 3.14), sin(ang) * sin(aRand.w * 3.14), cos(aRand.w * 3.14)) * (5.0 + aRand.y * 7.0);
    p = mix(scatter, p, smoothstep(aRand.x * 0.5, aRand.x * 0.5 + 0.5, uIntro));
    // Respiração suave.
    p += vec3(sin(uTime * 0.8 + aRand.z * 20.0), cos(uTime * 0.7 + aRand.w * 20.0), sin(uTime * 0.6 + aRand.x * 20.0)) * 0.012;

    vec4 world = modelMatrix * vec4(p, 1.0);
    // O mouse empurra as partículas como um campo de força.
    vec3 away = world.xyz - uMouse;
    float dist = length(away.xy);
    world.xyz += normalize(away + 0.0001) * smoothstep(0.9, 0.0, dist) * 0.45;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRand.y * 0.9) * uPixel / -mv.z;
    vAlpha = 0.55 + aRand.y * 0.45 + swirl * 0.25;
    vTint = aRand.w;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vTint;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    float a = smoothstep(0.5, 0.0, r);
    a *= a;
    vec3 col = mix(uColorA, uColorB, smoothstep(0.75, 1.0, vTint));
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

/** Lê os pixels do logo AE (anel + letras) desenhado num canvas. */
function logoPixels(font: string) {
  const S = 360;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  const pts: [number, number][] = [];
  if (!ctx) return pts;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `700 150px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AE", S / 2, S / 2 + 6);
  const data = ctx.getImageData(0, 0, S, S).data;
  for (let y = 0; y < S; y += 2) {
    for (let x = 0; x < S; x += 2) {
      if ((data[(y * S + x) * 4 + 3] ?? 0) > 128) pts.push([x - S / 2, S / 2 - y]);
    }
  }
  return pts;
}

export async function createParticleScene(canvas: HTMLCanvasElement, opts: { mobile: boolean; reducedMotion: boolean }): Promise<ParticleScene> {
  const { mobile, reducedMotion } = opts;
  const N = mobile ? 4500 : 16000;

  // Espera a fonte da marca para desenhar o "AE" certo.
  try {
    await Promise.race([document.fonts.load('700 150px "Space Grotesk"'), new Promise((r) => setTimeout(r, 1500))]);
  } catch {
    /* segue com a fonte reserva */
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 8);

  const rand = rng(21);
  const logo = pixelsShape(N, logoPixels('"Space Grotesk", system-ui, sans-serif'), 3.5 / 360, 0.35);
  const shapes = [logo, sphereShape(N), browserShape(N), phoneShape(N)];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  ["aA", "aB", "aC", "aD"].forEach((name, i) => geo.setAttribute(name, new THREE.BufferAttribute(shapes[i] ?? new Float32Array(N * 3), 3)));
  const r4 = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) r4[i] = rand();
  geo.setAttribute("aRand", new THREE.BufferAttribute(r4, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);

  const uniforms = {
    uShape: { value: 0 },
    uIntro: { value: reducedMotion ? 1 : 0 },
    uTime: { value: 0 },
    uPixel: { value: dpr },
    uSize: { value: mobile ? 26 : 22 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uColorA: { value: new THREE.Color(0x22d3dc) },
    uColorB: { value: new THREE.Color(0xe8fdff) },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let target = 0;
  let current = 0;
  let px = 0;
  let py = 0;
  let hasPointer = false;
  let cpx = 0;
  let cpy = 0;
  let raf = 0;
  let last = 0;
  let running = false;
  let offsetX = 0;
  let offsetY = 0;
  let fit = 1;
  const clock = new THREE.Clock();
  let introT0 = 0;
  const mouse3 = new THREE.Vector3();

  function apply() {
    const shape = shapeProgress(current);
    uniforms.uShape.value = shape;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = reducedMotion ? 0 : t;
    if (!reducedMotion) uniforms.uIntro.value = introT0 ? Math.min(1, (performance.now() - introT0) / 2400) : 0;
    // Gira devagar e inclina conforme a forma (o site "deita" em perspectiva).
    const tilt = Math.max(0, 1 - Math.abs(shape - 2));
    points.rotation.y = (reducedMotion ? 0 : Math.sin(t * 0.25) * 0.18) + cpx * 0.35 - tilt * 0.32 + (shape > 2 ? (shape - 2) * 0.22 : 0);
    points.rotation.x = cpy * 0.25 + tilt * 0.12;
    points.scale.setScalar(fit);
    points.position.set(offsetX, offsetY, 0);
    // Posição do mouse no plano das partículas (longe enquanto não houver mouse).
    if (!hasPointer) {
      uniforms.uMouse.value.set(99, 99, 0);
      return;
    }
    mouse3.set(cpx * 2, -cpy * 2, 0.5).unproject(camera).sub(camera.position).normalize();
    const k = -camera.position.z / mouse3.z;
    uniforms.uMouse.value.copy(camera.position).addScaledVector(mouse3, k);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    current += (target - current) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 3.5));
    const kp = 1 - Math.exp(-dt * 4);
    cpx += (px - cpx) * kp;
    cpy += (py - cpy) * kp;
    apply();
    renderer.render(scene, camera);
  }

  return {
    setProgress: (p) => void (target = p),
    setPointer: (x, y) => {
      px = x;
      py = y;
      hasPointer = true;
    },
    resize(w, h) {
      const width = Math.max(1, w);
      const height = Math.max(1, h);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Área visível no plano z=0 para encaixar as formas (~4,8 unidades de largura).
      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visW = visH * camera.aspect;
      if (mobile || width < 900) {
        fit = Math.min(1, (visW * 0.9) / 4.8, (visH * 0.42) / 3.2);
        offsetX = 0;
        offsetY = visH * 0.16;
      } else {
        fit = Math.min(1, (visW * 0.44) / 4.8, (visH * 0.68) / 3.2);
        offsetX = visW * 0.18;
        offsetY = 0;
      }
      if (!running) {
        apply();
        renderer.render(scene, camera);
      }
    },
    start() {
      if (running) return;
      running = true;
      last = 0;
      if (!introT0) introT0 = performance.now();
      clock.start();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
