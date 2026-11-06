/**
 * Os três cursores da equipe (Felipe, Enzo e André) "trabalhando" no site:
 * andam, clicam, arrastam seleções, digitam código e marcam o que fizeram.
 */
export const TEAM = {
  Felipe: "var(--primary)",
  Enzo: "var(--team-enzo)",
  André: "var(--team-andre)",
} as const;
export type Member = keyof typeof TEAM;
export const MEMBERS = Object.keys(TEAM) as Member[];

export const isMember = (v: string | undefined): v is Member => !!v && v in TEAM;

const ARROW =
  '<svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor" aria-hidden="true"><path d="M1 1l17 8-7.5 2.2L7 19z" stroke="var(--background)" stroke-width="1.2" stroke-linejoin="round"/></svg>';

/** Espera que pode ser cancelada (quando o componente sai da tela/desmonta). */
export function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("aborted", "AbortError"));
    const t = window.setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      window.clearTimeout(t);
      reject(new DOMException("aborted", "AbortError"));
    }, { once: true });
  });
}

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)] as T;

/** Um cursor com nome que se move e clica dentro de uma camada (`parent`). */
export class TeamBot {
  readonly el: HTMLSpanElement;
  readonly bubble: HTMLSpanElement;
  x: number;
  y: number;

  constructor(readonly name: Member, parent: HTMLElement, x = -80, y = -80) {
    this.el = document.createElement("span");
    this.el.className = "tc";
    this.el.setAttribute("aria-hidden", "true");
    this.el.style.setProperty("--tc", TEAM[name]);
    this.el.innerHTML = `${ARROW}<span class="tc-tag">${name}</span><span class="tc-ring"></span>`;
    this.bubble = document.createElement("span");
    this.bubble.className = "tc-bubble";
    this.el.appendChild(this.bubble);
    parent.appendChild(this.el);
    this.x = x;
    this.y = y;
    this.place();
  }

  private place() {
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  /** Anda até (x, y) com aceleração natural de mão humana. */
  async move(x: number, y: number, ms: number, signal?: AbortSignal) {
    const anim = this.el.animate(
      [{ transform: `translate(${this.x}px, ${this.y}px)` }, { transform: `translate(${x}px, ${y}px)` }],
      { duration: ms, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" },
    );
    this.x = x;
    this.y = y;
    const stop = () => anim.cancel();
    signal?.addEventListener("abort", stop, { once: true });
    try {
      await anim.finished;
    } finally {
      signal?.removeEventListener("abort", stop);
      this.place();
      anim.cancel();
    }
    if (signal?.aborted) throw new DOMException("aborted", "AbortError");
  }

  press(down: boolean) {
    this.el.classList.toggle("is-down", down);
  }

  async click(signal?: AbortSignal) {
    this.press(true);
    this.el.classList.remove("is-click");
    void this.el.offsetWidth; // reinicia a onda do clique
    this.el.classList.add("is-click");
    await sleep(140, signal);
    this.press(false);
  }

  /** Balão ao lado do cursor; com `typing`, o texto aparece letra por letra como num editor. */
  async say(text: string, signal?: AbortSignal, typing = false) {
    // Perto da borda direita, o balão abre para a esquerda para não sair da tela.
    const room = (this.el.parentElement?.clientWidth ?? window.innerWidth) - this.x;
    this.bubble.classList.toggle("to-left", room < 220);
    this.bubble.classList.add("is-on");
    if (!typing) {
      this.bubble.textContent = text;
      return;
    }
    this.bubble.innerHTML = '<span></span><i class="caret"></i>';
    const out = this.bubble.firstChild as HTMLSpanElement;
    for (let i = 1; i <= text.length; i++) {
      out.textContent = text.slice(0, i);
      await sleep(rand(35, 75), signal);
    }
  }

  hush() {
    this.bubble.classList.remove("is-on");
  }

  remove() {
    this.el.remove();
  }
}

/** Retângulo de seleção tracejado, como quando se arrasta o mouse num editor. */
export function selectionBox(parent: HTMLElement, member: Member, x: number, y: number) {
  const box = document.createElement("span");
  box.className = "tc-select";
  box.style.setProperty("--tc", TEAM[member]);
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  box.style.width = "0px";
  box.style.height = "0px";
  parent.appendChild(box);
  return box;
}