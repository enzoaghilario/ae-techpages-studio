# Site da AE Tech Pages

Site de página única (landing page) em português para a AE Tech Pages, com base no Instagram @ae.techpages.

## O que veio do perfil
- Slogan: "Sua ideia. Nós criamos."
- Serviços: Landing Pages, Sites, SaaS, Automações
- Chamada: "Bora tirar sua ideia do papel?" e "Manda um direct com a palavra SITE"
- Visual: fundo quase preto azulado (#070C10), destaque ciano/turquesa neon (~#22D3DC), texto branco, grade sutil ao fundo e brilho neon nos botões

## Seções da página
1. **Topo**: logo "AE TECH PAGES" + menu (Serviços, Processo, Sobre, Perguntas) + botão "Pedir orçamento"
2. **Abertura**: "Sua ideia. Nós criamos." com subtítulo e botões "Chama no direct" (Instagram) e "Ver serviços"; "AE" gigante em contorno ao fundo, como nos posts
3. **Serviços**: 4 cartões — Landing Pages, Sites Institucionais, SaaS, Automações
4. **Como funciona**: 4 passos (Conversa, Proposta, Desenvolvimento, Entrega e suporte)
5. **Sobre a startup**: texto sobre a AE Tech Pages (startup nova, foco em sites rápidos, modernos e que vendem) + diferenciais (entrega ágil, design sob medida, otimizado para Google e celular, suporte próximo)
6. **Perguntas frequentes** (sanfona), cerca de 10 perguntas: quanto custa um site, prazo, landing page x site, se o site ajuda a vender, se funciona no celular, aparecer no Google, domínio e hospedagem, manutenção, automações/SaaS, formas de pagamento
7. **Chamada final**: "Bora tirar sua ideia do papel?" + botão para o direct
8. **Rodapé**: @ae.techpages, link do Instagram, direitos reservados

## Observações
- Textos de descrição e respostas das perguntas serão criados por mim; preços não serão citados (respostas do tipo "depende do projeto, orçamento sem compromisso").
- Sem WhatsApp/e-mail por enquanto — todos os botões levam ao Instagram. Pode me passar esses contatos depois.

## Detalhes técnicos
- Reescrever `src/routes/index.tsx` com as seções; componentes em `src/components/site/`.
- Cores em `src/styles.css` (oklch), tema escuro como padrão; fontes Space Grotesk (títulos) + DM Sans.
- Logo recriado em texto/SVG; perguntas usando o Accordion do shadcn.
- head() com título/descrição em PT-BR; `lang="pt-BR"`.
