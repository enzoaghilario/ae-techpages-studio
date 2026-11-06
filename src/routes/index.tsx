import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Globe,
  LayoutTemplate,
  Layers,
  Instagram,
  Zap,
  Palette,
  Search,
  HeartHandshake,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const IG = "https://www.instagram.com/ae.techpages/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AE Tech Pages — Sua ideia. Nós criamos." },
      {
        name: "description",
        content:
          "Startup que cria landing pages, sites, SaaS e automações modernas, rápidas e feitas para vender.",
      },
      { property: "og:title", content: "AE Tech Pages — Sua ideia. Nós criamos." },
      {
        property: "og:description",
        content: "Landing pages, sites, SaaS e automações para tirar sua ideia do papel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  { icon: LayoutTemplate, t: "Landing Pages", d: "Páginas focadas em conversão para lançar produtos, captar contatos e vender mais." },
  { icon: Globe, t: "Sites", d: "Sites institucionais modernos que passam credibilidade e colocam sua marca no Google." },
  { icon: Layers, t: "SaaS", d: "Plataformas e sistemas web sob medida para transformar sua ideia em produto digital." },
  { icon: Bot, t: "Automações", d: "Integrações e fluxos automáticos que economizam tempo e eliminam tarefas repetitivas." },
];

const steps = [
  { t: "Conversa", d: "Entendemos seu negócio, objetivos e público." },
  { t: "Proposta", d: "Orçamento claro, escopo definido e prazo combinado." },
  { t: "Desenvolvimento", d: "Design e código sob medida, com você acompanhando." },
  { t: "Entrega e suporte", d: "Site no ar, otimizado, e a gente segue junto." },
];

const perks = [
  { icon: Zap, t: "Entrega ágil" },
  { icon: Palette, t: "Design sob medida" },
  { icon: Search, t: "Pronto para Google e celular" },
  { icon: HeartHandshake, t: "Suporte próximo" },
];

const founders = [
  "Felipe Quast de Andrade",
  "Enzo Alessandro Gonçalves Hilário",
  "André Luiz Carmanhan Furlan",
];

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

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 font-display font-bold tracking-wider">
      <span className="grid size-9 place-items-center rounded-full border-2 border-primary text-sm shadow-glow">AE</span>
      <span>TECH <span className="text-primary">PAGES</span></span>
    </a>
  );
}

function Cta({ children, ghost }: { children: React.ReactNode; ghost?: boolean }) {
  return (
    <a
      href={ghost ? "#servicos" : IG}
      target={ghost ? undefined : "_blank"}
      rel="noreferrer"
      className={
        ghost
          ? "inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-semibold press-fx hover:border-primary hover:text-primary"
          : "inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-glow animate-glow press-fx"
      }
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="reveal mb-3 flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary"><span className="led" aria-hidden />{children}</p>;
}

function Index() {
  useReveal();
  return (
    <div className="min-h-screen overflow-x-hidden bg-background bg-grid">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#servicos" className="press-fx inline-block hover:text-primary">Serviços</a>
            <a href="#processo" className="press-fx inline-block hover:text-primary">Processo</a>
            <a href="#sobre" className="press-fx inline-block hover:text-primary">Sobre</a>
            <a href="#faq" className="press-fx inline-block hover:text-primary">Perguntas</a>
          </nav>
          <a href={IG} target="_blank" rel="noreferrer" className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary press-fx hover:bg-primary hover:text-primary-foreground">
            Pedir orçamento
          </a>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 md:pt-32">
        <span aria-hidden className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[16rem] font-bold leading-none text-outline animate-float md:text-[26rem]">AE</span>
        <div className="relative max-w-3xl animate-fade-up">
          <Eyebrow>Landing pages · Sites · SaaS</Eyebrow>
          <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl">
            Sua ideia. <span className="text-primary">Nós criamos.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A AE Tech Pages cria experiências digitais modernas, rápidas e pensadas para vender. Do primeiro rascunho ao site no ar.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Cta>Chama no direct <ArrowRight className="size-4" /></Cta>
            <Cta ghost>Ver serviços</Cta>
          </div>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>O que fazemos</Eyebrow>
        <h2 className="reveal mb-12 text-4xl font-bold">Soluções digitais sob medida</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: I, t, d }) => (
            <div key={t} className="reveal card-fx rounded-2xl border border-border bg-card p-6">
              <span className="led" aria-hidden />
              <I className="mb-5 size-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="processo" className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Como funciona</Eyebrow>
        <h2 className="reveal mb-12 text-4xl font-bold">Do papel para a tela em 4 passos</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="reveal card-fx border-t-2 border-primary pt-5">
              <span className="led" aria-hidden />
              <p className="font-display text-4xl font-bold text-primary">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <Eyebrow>Sobre a startup</Eyebrow>
          <h2 className="reveal mb-6 text-4xl font-bold">Tecnologia com cara de gente</h2>
          <p className="mb-4 text-muted-foreground">
            A AE Tech Pages nasceu da vontade de ajudar empreendedores e empresas a ocuparem o lugar que merecem na internet. Somos uma startup jovem, movida por design, código e resultado.
          </p>
          <p className="text-muted-foreground">
            Acreditamos que um bom site não é só bonito: ele carrega rápido, aparece no Google, funciona perfeitamente no celular e transforma visitantes em clientes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 self-center">
          {perks.map(({ icon: I, t }) => (
            <div key={t} className="reveal card-fx rounded-2xl border border-border bg-card p-5">
              <span className="led" aria-hidden />
              <I className="mb-3 size-6 text-primary" />
              <p className="font-semibold">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fundadores" className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Quem faz acontecer</Eyebrow>
        <h2 className="reveal mb-12 text-4xl font-bold">Fundadores</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {founders.map((n) => {
            const parts = n.split(" ");
            const ini = (parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "");
            return (
              <div key={n} className="reveal card-fx flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="led" aria-hidden />
                <span className="grid size-14 shrink-0 place-items-center fx-icon rounded-full border-2 border-primary font-display text-lg font-bold text-primary shadow-glow">{ini}</span>
                <div>
                  <p className="font-display font-bold leading-tight">{n}</p>
                  <p className="text-sm text-muted-foreground">Cofundador</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <Eyebrow>Perguntas frequentes</Eyebrow>
        <h2 className="reveal mb-10 text-4xl font-bold">Tudo sobre sites e vendas</h2>
        <Accordion type="single" collapsible>
          {faq.map(([q, a]) => (
            <AccordionItem key={q} value={q} className="reveal">
              <AccordionTrigger className="text-left text-base font-semibold hover:text-primary">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <Eyebrow>Dê o próximo passo</Eyebrow>
        <h2 className="reveal text-4xl font-bold md:text-6xl">
          Bora tirar sua ideia do <span className="text-primary">papel?</span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-lg text-muted-foreground">
          Manda um direct com a palavra <strong className="text-foreground">SITE</strong> e receba um orçamento sem compromisso.
        </p>
        <div className="mt-10"><Cta>Chama no direct <ArrowRight className="size-4" /></Cta></div>
      </section>

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

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    els.forEach((el) => {
      const sibs = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 6) * 90}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}
