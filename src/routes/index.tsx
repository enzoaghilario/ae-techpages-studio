import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, Globe, Instagram, Layers, LayoutTemplate } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/site/Header";
import { Cursor } from "@/components/site/Cursor";
import { HeroParticles } from "@/components/site/HeroParticles";
import { Marquee } from "@/components/site/Marquee";
import { Holo } from "@/components/site/Holo";
import { Timeline } from "@/components/site/Timeline";
import { PerksCube } from "@/components/site/PerksCube";
import { Scramble } from "@/components/site/Scramble";
import { useTeamPicks } from "@/hooks/use-team-picks";
import { IG, Logo } from "@/components/site/Logo";
import { startSmoothScroll } from "@/lib/smooth-scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AE Tech Pages — Sua ideia. Nós criamos." },
      { name: "description", content: "Startup que cria landing pages, sites, SaaS e automações modernas, rápidas e feitas para vender." },
      { property: "og:title", content: "AE Tech Pages — Sua ideia. Nós criamos." },
      { property: "og:description", content: "Landing pages, sites, SaaS e automações para tirar sua ideia do papel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  { icon: LayoutTemplate, t: "Landing Pages", d: "Páginas focadas em conversão para lançar produtos, captar contatos e vender mais.", who: "Felipe", did: "desenhando" },
  { icon: Globe, t: "Sites", d: "Sites institucionais modernos que passam credibilidade e colocam sua marca no Google.", who: "Enzo", did: "codando" },
  { icon: Layers, t: "SaaS", d: "Plataformas e sistemas web sob medida para transformar sua ideia em produto digital.", who: "André", did: "testando" },
  { icon: Bot, t: "Automações", d: "Integrações e fluxos automáticos que economizam tempo e eliminam tarefas repetitivas.", who: "Enzo", did: "conectando" },
];

const founders = ["Felipe Quast de Andrade", "Enzo Alessandro Gonçalves Hilário", "André Luiz Carmanhan Furlan"];

const faq: [string, string][] = [
  ["Quanto custa um site?", "Depende do tipo de projeto, número de páginas e funcionalidades. Cada orçamento é personalizado e sem compromisso — é só mandar a palavra SITE no nosso direct."],
  ["Quanto tempo leva para ficar pronto?", "Landing pages costumam ficar prontas em poucos dias. Sites completos e sistemas variam conforme o escopo, e o prazo é sempre combinado antes de começar."],
  ["Qual a diferença entre landing page e site?", "A landing page é uma página única focada em uma ação (comprar, cadastrar, chamar no WhatsApp). O site tem várias páginas e apresenta a empresa de forma completa."],
  ["Um site realmente ajuda a vender mais?", "Sim. Um site profissional transmite confiança, aparece nas buscas e funciona 24 horas por dia como vitrine e canal de vendas, levando o cliente direto ao contato ou à compra."],
  ["O site funciona bem no celular?", "Sempre. Todos os nossos projetos são pensados primeiro para o celular, onde está a maior parte dos seus clientes."],
  ["Meu site vai aparecer no Google?", "Entregamos o site com boas práticas de SEO: velocidade, estrutura correta e textos otimizados, para facilitar que o Google encontre seu negócio."],
  ["Preciso ter domínio e hospedagem?", "Não se preocupe: ajudamos a registrar o domínio (ex.: suaempresa.com.br) e cuidamos da publicação do site."],
  ["Vocês fazem manutenção depois da entrega?", "Sim. Oferecemos suporte e ajustes após a entrega, além de planos de manutenção para quem quer o site sempre atualizado."],
  ["Vocês criam sistemas e automações?", "Sim! Desenvolvemos SaaS, painéis, integrações e automações para atendimento, vendas e processos internos."],
  ["Quais as formas de pagamento?", "Trabalhamos com Pix, cartão e parcelamento. As condições são definidas junto com a proposta."],
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="led" aria-hidden />
      <Scramble text={children} />
    </p>
  );
}

/** Efeitos gerais: entrada dos elementos, botões magnéticos e rolagem suave. */
function useEffects() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    els.forEach((el) => {
      const sibs = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("rv"));
      el.style.setProperty("--rv-delay", `${Math.min(Math.max(sibs.indexOf(el), 0), 6) * 90}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));

    const fine = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offs = (fine ? Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]")) : []).map((m) => {
      m.style.transition = "transform .35s cubic-bezier(.2,.7,.2,1), background-color .2s, color .2s";
      const move = (e: PointerEvent) => {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      };
      const leave = () => {
        m.style.transform = "";
      };
      m.addEventListener("pointermove", move);
      m.addEventListener("pointerleave", leave);
      return () => {
        m.removeEventListener("pointermove", move);
        m.removeEventListener("pointerleave", leave);
      };
    });

    let stop: (() => void) | undefined;
    let cancelled = false;
    void startSmoothScroll().then((fn) => (cancelled ? fn() : (stop = fn)));
    return () => {
      cancelled = true;
      stop?.();
      io.disconnect();
      offs.forEach((f) => f());
    };
  }, []);
}

function Index() {
  useEffects();
  const team = useRef<HTMLDivElement>(null);
  useTeamPicks(team);
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background bg-grid">
      {/* Camada onde os cursores da equipe trabalham pela página */}
      <div ref={team} aria-hidden className="pointer-events-none absolute inset-0 z-30" />
      <Cursor />
      <Header />
      <main>
        <HeroParticles />

        <Marquee />

        <section id="servicos" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:py-32">
          <Eyebrow>O que fazemos</Eyebrow>
          <h2 className="rv mb-12 max-w-2xl text-4xl font-bold md:mb-16 md:text-5xl">
            Soluções digitais <span className="text-neon">sob medida</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: I, t, d, who, did }) => (
              <Holo key={t} data-team={who} data-team-label={did} className="rv group rounded-2xl p-6">
                <div className="lift">
                  <span className="mb-6 grid size-14 place-items-center rounded-xl border border-primary/40 bg-primary/10 shadow-glow transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <I className="size-7 text-primary" />
                  </span>
                  <h3 className="mb-2 text-xl font-bold">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </Holo>
            ))}
          </div>
        </section>

        <section id="processo" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:py-32">
          <div className="mb-14 text-center md:mb-20">
            <Eyebrow>Como funciona</Eyebrow>
            <h2 className="rv text-4xl font-bold md:text-5xl">
              Do papel para a tela em <span className="text-neon">4 passos</span>
            </h2>
          </div>
          <Timeline />
        </section>

        <section id="sobre" className="relative mx-auto grid max-w-6xl scroll-mt-20 items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <Eyebrow>Sobre a startup</Eyebrow>
            <h2 className="rv mb-6 text-4xl font-bold md:text-5xl">
              Tecnologia com <span className="text-neon">cara de gente</span>
            </h2>
            <p className="rv mb-4 text-muted-foreground md:text-lg">
              A AE Tech Pages nasceu da vontade de ajudar empreendedores e empresas a ocuparem o lugar que merecem na internet. Somos uma startup jovem, movida por design, código e resultado.
            </p>
            <p className="rv text-muted-foreground md:text-lg">
              Acreditamos que um bom site não é só bonito: ele carrega rápido, aparece no Google, funciona perfeitamente no celular e transforma visitantes em clientes.
            </p>
          </div>
          <PerksCube />
        </section>

        <section id="fundadores" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:py-32">
          <Eyebrow>Quem faz acontecer</Eyebrow>
          <h2 className="rv mb-12 text-4xl font-bold md:text-5xl">Fundadores</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {founders.map((n) => {
              const parts = n.split(" ");
              const ini = (parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "");
              return (
                <Holo key={n} data-team={parts[0]} data-team-label="esse sou eu" className="rv rounded-2xl p-6">
                  <div className="lift flex items-center gap-4">
                    <span className="ring-spin isolate grid size-16 shrink-0 place-items-center rounded-full">
                      <span className="grid size-full place-items-center rounded-full bg-background font-display text-xl font-bold text-primary">{ini}</span>
                    </span>
                    <div>
                      <p className="font-display font-bold leading-tight">{n}</p>
                      <p className="text-sm text-muted-foreground">Cofundador</p>
                    </div>
                  </div>
                </Holo>
              );
            })}
          </div>
        </section>

        <section id="faq" className="relative mx-auto max-w-3xl scroll-mt-20 px-6 py-24 md:py-32">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 className="rv mb-10 text-4xl font-bold md:text-5xl">
            Tudo sobre <span className="text-neon">sites e vendas</span>
          </h2>
          <Accordion type="single" collapsible>
            {faq.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="rv faq-item">
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="relative overflow-hidden px-6 py-32 text-center md:py-44">
          <div aria-hidden className="portal" />
          <div className="relative mx-auto max-w-4xl">
            <Eyebrow>Dê o próximo passo</Eyebrow>
            <h2 className="rv text-5xl font-bold leading-[1.02] md:text-7xl">
              Bora tirar sua ideia do <span className="text-neon">papel?</span>
            </h2>
            <p className="rv mx-auto mt-6 max-w-lg text-muted-foreground md:text-lg">
              Manda um direct com a palavra <strong className="text-foreground">SITE</strong> e receba um orçamento sem compromisso.
            </p>
            <div className="rv mt-10">
              <a href={IG} target="_blank" rel="noreferrer" data-magnetic data-team="Felipe" data-team-label="te esperando no direct" className="inline-flex items-center gap-2.5 rounded-full bg-primary px-9 py-4 text-lg font-bold text-primary-foreground shadow-glow animate-glow">
                <Instagram className="size-5" /> Chama no direct <ArrowRight className="size-5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <a href={IG} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
            <Instagram className="size-4" /> @ae.techpages
          </a>
          <p>© {new Date().getFullYear()} AE Tech Pages. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
