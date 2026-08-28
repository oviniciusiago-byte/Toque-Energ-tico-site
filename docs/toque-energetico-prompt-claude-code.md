# PROMPT — Claude Code · Site Toque Energético (versão base)

Você é um engenheiro front-end sênior com sensibilidade de direção de arte. Construa a **versão base** de um site-catálogo **sensorial, editorial e sofisticado** para a **Toque Energético**, marca artesanal de autocuidado. Não é e-commerce: a venda fecha no **WhatsApp**. O objetivo é entregar uma base sólida, bonita e fluida para iteração posterior no Figma/código.

**Leia antes de codar, nesta ordem:**
1. `toque-energetico-briefing-site-v1.md` — marca, público, tom, restrições, dados de produto.
2. `toque-energetico-copy-site-v1.md` — **fonte de verdade de todo o texto**. Nada de lorem ipsum: use essa copy.
3. Este prompt — como construir.

> Onde o texto tiver `[confirmar: …]`, mantenha como placeholder visível em comentário/const `TODO`, não invente conteúdo de produto real (fórmula, aroma, avisos de segurança). Número de WhatsApp, vídeo, áudio e fotos entram como placeholders com marcação clara.

---

## 0. Conceito central (não decore, traduza em decisões)

**Presença · Proteção · Harmonia.** Luxo silencioso, herbalista contemporâneo, muito respiro visual.

**O fio condutor é o movimento orgânico entre luz e sombra** — inspirado no yin-yang como equilíbrio, **nunca o símbolo literal**. Na prática isso vira a *jornada tonal do scroll*: o site respira entre seções claras (off-white/dourado, arejadas) e momentos editoriais escuros e intimistas (cinza-chumbo texturizado, madeira escura, luz lateral). As **embalagens coloridas dos produtos são as protagonistas cromáticas** — o cenário é enxuto.

Segundo motivo sutil: **a estrela / irradiação** ("um centro que irradia para todos os lados; o que é cuidado por dentro aparece por fora"). Traduza como *fonte de luz*: glows radiais suaves, iluminação lateral nas imagens, um brilho que emana de trás dos elementos-chave. Nunca um ícone esotérico óbvio.

---

## 1. Referências visuais (o que puxar de cada uma)

- **Terraluna** (off-white/terracota, serifada elegante): base de refinamento, respiro, grid de coleções, seção da fundadora, badges de confiança. **É a espinha estrutural.** — trocamos terracota por **dourado + cinza-chumbo + madeira**.
- **Maison Rouge** (vinho, editorial escuro): os **momentos full-bleed intimistas** (mão segurando o buquê), grid de produtos com hover e ícone de salvar, tipografia serifada em itálico nos nomes. — recolorir para carvão/madeira/dourado, sem vinho.
- **Moss** (verde botânico escuro): as **seções imersivas escuras**, produto "flutuando" sobre elemento natural, **tipografia-manifesto gigante** ("frase sensorial" em serifada grande), cards de best-sellers.
- **Chá/editorial** (quente, molduras circulares): **molduras circulares** para rituais/ingredientes e callouts editoriais quentes.

Síntese: o site **mora** no off-white/dourado (Terraluna) e **respira** para momentos carvão/madeira intimistas (Maison Rouge + Moss), com molduras circulares editoriais (chá) e as embalagens como cor.

---

## 2. Stack

- **Next.js 14+ (App Router) + TypeScript**
- **Tailwind CSS** (design tokens via CSS variables no `globals.css` + `tailwind.config`)
- **Framer Motion** (reveals, page transitions, micro-interações)
- **Lenis** (smooth scroll)
- **GSAP + ScrollTrigger** (hero e parallax orquestrado; carregar via dynamic import)
- `next/font` (Google Fonts), `next/image`
- Sem backend, sem cart, sem gateway. Deep links de WhatsApp.

Estruture como projeto limpo e comentado, pronto pra `npm install && npm run dev`.

---

## 3. Design system (ponto de partida — Vinicius fecha os valores finais)

### Cores (CSS variables)
```
--offwhite:   #F4EEE2   /* base clara, fundo padrão */
--cream:      #EAE1D0   /* superfícies claras alternativas */
--gold:       #B99247   /* dourado — acentos, detalhes, hairlines */
--gold-soft:  #DCC38A   /* dourado claro para glows/realces */
--graphite:   #2C2A28   /* cinza-chumbo texturizado — momentos escuros */
--charcoal:   #1E1C1A   /* quase-preto quente — seções intimistas */
--wood:       #3A2A1F   /* madeira escura */
--ink:        #24211D   /* texto sobre claro */
--muted:      #7C7264   /* texto secundário */
--line:       rgba(185,146,71,0.28) /* hairline dourada */
```
Regras: dourado é **acento**, nunca preenchimento chapado. Texturas (papel/linho/pedra sutil) apenas nos fundos escuros. Cor forte vem só das fotos de produto.

### Tipografia
- **Display (serifada editorial):** **Fraunces** (variável — usar optical size e um itálico nos nomes de produto, ao estilo Maison Rouge). Alternativa: Cormorant Garamond.
- **Texto (sans humanista):** **Hanken Grotesk**. Alternativa: Inter.
- Escala fluida com `clamp()`. Títulos-manifesto bem grandes e com **muito espaço em volta**. Tracking levemente aberto em kickers/labels (uppercase, pequenas, com letter-spacing).

### Espaço, ritmo, forma
- Grid de 12 col, gutters generosos, **mobile-first** (a cliente decide no celular).
- Muito whitespace ("respiro"). Cantos: retângulos limpos; molduras **circulares** reservadas a rituais/ingredientes/editorial.
- Hairlines douradas finas como divisores. Zero bordas grossas, zero sombras pesadas.

---

## 4. Elementos globais

### 4.1 Header
Transparente sobre o hero; ao rolar, ganha fundo sólido (off-white translúcido com blur leve) e reduz de altura — transição suave. Logo (placeholder SVG "Toque Energético" + estrela). Nav: Catálogo · Rituais · Sobre · Contato. Ações à direita: **toggle de som** + botão WhatsApp. Mobile: menu em drawer com transição suave.

### 4.2 Toggle de som (requisito-chave)
- Um `<audio loop>` **único e persistente** no root layout, controlado por um `AudioProvider` (Context) — o som **não corta ao trocar de página** (App Router).
- **Começa desligado** (browsers bloqueiam autoplay com som). Só toca após gesto do usuário.
- Ícone discreto (som on/off) com **micro-animação de "equalizer"** de 3 barrinhas quando ativo (respeitar `prefers-reduced-motion`: sem barras animadas, só estado).
- Ao ativar: **fade-in** de volume ~1.2s até ~0.25. Ao desativar: fade-out suave. Nunca começa alto.
- Persistir preferência em `localStorage`. No reload, **não force play** (política de autoplay): se a preferência era "on", deixe o toggle pronto e só religue no primeiro gesto; trate a Promise de `play()` rejeitada sem erro no console.
- Placeholder: `/public/audio/ambient.mp3` (som ambiente suave — Vinicius substitui). Deixe volume-alvo e caminho em constantes.

### 4.3 Smooth scroll + page transitions
- Lenis com easing lento e orgânico. Sincronizar ScrollTrigger com Lenis.
- Transição entre rotas: fade/opacidade suave (Framer Motion `AnimatePresence`), sem "pulos".

### 4.4 WhatsApp flutuante
- Botão fixo (bottom-right), aparece após sair do hero. Abre `wa.me` com mensagem pré-preenchida. Helper central:
```ts
const WPP = "55XXXXXXXXXXX"; // TODO: número real
export const wppLink = (msg: string) =>
  `https://wa.me/${WPP}?text=${encodeURIComponent(msg)}`;
```
Em produto: `Olá! Tenho interesse no {nome} ({volume} · {preço}). Ele está disponível?`

### 4.5 Footer
Off-white/escuro alternável. Assinatura "Presença, Proteção, Harmonia", nav, Instagram (@fernandapavan803), cidade (BH/MG), WhatsApp. Placeholder de newsletter opcional (sem backend — só UI).

---

## 5. A HERO (capriche — é o cartão de visitas)

- **Vídeo full-viewport** (`min-h-[100svh]`, `object-cover`), `muted autoPlay loop playsInline`, com **poster** de fallback (`/images/hero-poster.jpg`) que também é o LCP enquanto o vídeo carrega. Formatos: `/video/hero.webm` + `/video/hero.mp4` (placeholders — cenas de escalda-pés, borrifo de spray, luz lateral; Vinicius gera na IA).
- **Overlay tonal** sutil (gradiente de `--charcoal` transparente→~55% na base e laterais) só o suficiente pra legibilidade — mantendo o clima intimista, sem escurecer demais.
- **Conteúdo:** kicker "Toque Energético" → título serifado grande "Presença, Proteção, Harmonia." → linha de apoio (da copy) → CTA "Conhecer os produtos". Entrada com **reveal escalonado** (mask/clip + translateY, easing lento) no load.
- **Scroll cue** discreto animado na base.
- **Radiância:** um glow radial dourado muito sutil emanando por trás do bloco de texto (o motivo da estrela) — quase imperceptível.
- **Do hero para a próxima seção:** transição tonal de escuro → off-white (a primeira respiração luz/sombra).
- Mobile: sempre poster primeiro; carregue o vídeo com cuidado (lazy, sem travar). Se `prefers-reduced-motion` ou conexão fraca, mostre poster estático elegante em vez do vídeo.

---

## 6. Animações e interatividade (fluidez máxima, tom sereno)

**Filosofia:** movimento **lento, orgânico e silencioso** — nada de bounce, nada estridente. É luxo silencioso. Durações 0.8–1.4s nos reveals, easing tipo `cubic-bezier(0.22, 1, 0.36, 1)`. Generoso, respirado.

Implemente:
- **Reveal on scroll** (Framer `whileInView`, `once`): fade + translateY(24–40px), **stagger** em grupos (títulos, parágrafos, cards). Componente `<Reveal>` reutilizável.
- **Parallax sutil** nas imagens editoriais e no produto "flutuante": deslocamento **máximo 15–20%** (assinatura discreta, sem exagero).
- **Jornada tonal:** o `background` do site transita suavemente entre off-white e carvão conforme entra em seções claras/escuras (ScrollTrigger controlando a var de fundo). É o coração do conceito luz/sombra — faça funcionar bem.
- **Tipografia-manifesto:** frases sensoriais grandes (estilo Moss) revelam palavra a palavra ou por máscara de linha ao entrar na viewport.
- **Product cards:** hover com **lift** suave, leve **zoom na imagem** (scale ~1.04), ícone de salvar (coração) com transição. Toque no mobile: estados equivalentes.
- **Botões magnéticos** (sutis) e **cursor customizado** (um dot com glow suave que cresce sobre elementos interativos) — **apenas** em `pointer:fine`, desativados em touch e em `prefers-reduced-motion`. Manter contido: é acento, não espetáculo.
- **Molduras circulares** de ritual/ingrediente com hairline dourada que "desenha" (stroke-dashoffset) ao aparecer.
- **`prefers-reduced-motion`:** desligar parallax, magnetismo, cursor e reveals complexos — manter fades curtos. Tudo deve permanecer legível e navegável.

---

## 7. Páginas e rotas (App Router)

Crie **todas** as rotas com a copy no lugar. **Construa por completo** (design + animação de referência) as três marcadas ⭐; as demais ficam com layout limpo + copy, prontas para replicar o padrão.

- `/` ⭐ **Home** — hero vídeo → "a ideia" → destaques (carros-chefe) → categorias → seção manifesto → editorial full-bleed → feito à mão → rituais (teaser) → depoimentos (placeholder) → fechamento/WhatsApp.
- `/catalogo` — intro + legenda de disponibilidade + as 6 categorias.
- `/catalogo/[categoria]` ⭐ (construir **Brumas, Aromas & Ambientes** como referência) — intro da categoria + grid de produtos + faixa editorial.
- `/produto/[slug]` ⭐ (construir **Spray de Proteção** como referência) — galeria + nome + conceito (3 palavras) + preço + badge de disponibilidade + descrição + intenção + notas de aroma + composição + modo de uso + cuidados + CTA WhatsApp + relacionados.
- `/sobre` — história (estrela/irradiação, artesanal, sem promessa).
- `/rituais` — como usar por linha (molduras circulares).
- `/faq` — acordeão animado.
- `/contato` — WhatsApp + Instagram + cidade.
- `/onde-encontrar` — feiras/pontos (placeholder).
- `/atacado` — revenda (placeholder).

**Categorias:** Banhos & Escalda-Pés · Brumas, Aromas & Ambientes · Óleos de Ritual · Roll-ons de Óleos Essenciais · Incensos Naturais · Presentes & Complementos. **Estrutura preparada para futura categoria "Velas"** (não exibir agora).

---

## 8. Camada de conteúdo (tipada)

Gere a partir da copy `.md` um content layer tipado — nada hardcoded nos componentes.

```ts
type Disponibilidade = "pronta-entrega" | "sob-consulta" | "sazonal";

interface Produto {
  slug: string;
  nome: string;
  categoria: string;        // slug da categoria
  conceito: string[];       // 3 palavras
  descricaoCurta: string;
  intencao: string;
  aroma?: string;
  composicao?: string;
  volume?: string;          // ex.: "120 ml"
  preco?: string;           // ex.: "R$ 58" | "a partir de R$ 50"
  precoBase?: number;       // para ordenação
  disponibilidade: Disponibilidade;
  modoDeUso?: string;
  cuidados?: string;
  fechamento?: string;
  imagens: string[];        // /images/products/{slug}-*.jpg (placeholders)
  destaque?: boolean;       // carro-chefe
  relacionados?: string[];  // slugs
}
```
Também `categorias.ts` (nome, slug, intro, imagem de capa) e `site.ts` (nav, whatsapp, social, textos globais).

**Decisões de conteúdo já fechadas (aplicar):**
- Sprays padronizados: Spray de Proteção, Bruma de Frescor e Brumas de Harmonia → **120 ml · R$ 58**. Aura Botânica permanece à parte (**R$ 56**).
- Amuleto de Harmonia: **a partir de R$ 50** (mesmo valor em Presentes e onde mais aparecer).
- Carros-chefe (`destaque: true`): Spray de Proteção, Bruma de Frescor, Brumas de Harmonia, Coleção Banhos & Escalda-Pés.
- Badge por disponibilidade: pronta-entrega / sob-consulta / sazonal (esta com nota "conforme o lote").

---

## 9. Assets e `/public`

Crie a estrutura com **placeholders** que deixem o projeto rodando (imagens sólidas/gradientes com o nome do arquivo, vídeo curto vazio ou poster-only, áudio silencioso curto):
```
/public
  /video/hero.mp4            (TODO: vídeo IA — escalda-pés, spray, luz lateral)
  /video/hero.webm
  /images/hero-poster.jpg    (TODO)
  /audio/ambient.mp3         (TODO: som ambiente)
  /images/products/{slug}-1.jpg ... (TODO por produto)
  /images/editorial/*.jpg    (full-bleed intimistas — TODO)
  /images/categories/*.jpg   (TODO)
  logo.svg                   (placeholder editável)
```
Use `next/image` com `sizes` corretos; nomes de arquivo = **slug real do produto** (padrão do Vinicius: usar nomes reais, não descritores inventados).

---

## 10. Acessibilidade e performance

- Mobile-first e responsivo de verdade (testar 360–430px primeiro).
- `prefers-reduced-motion` honrado em tudo.
- Semântica: landmarks, headings em ordem, `alt` descritivo, foco visível, navegação por teclado, acordeão/menu/toggle acessíveis (`aria-pressed` no som).
- Vídeo do hero decorativo: poster como LCP, lazy do vídeo, `aria-hidden` no vídeo.
- `next/font` com `display: swap`; imagens lazy; libs pesadas (GSAP) em dynamic import; prefetch de rotas.
- Sem erros no console. Lighthouse decente já na base.

---

## 11. Definition of done

O projeto roda com `npm run dev` e entrega:
1. **Home completa e animada**, com hero em vídeo + poster, toggle de som funcional (fade, persistência, sem autoplay), smooth scroll, reveals e a **jornada tonal luz↔sombra**.
2. **Uma categoria (Brumas)** e **um produto (Spray de Proteção)** totalmente construídos como templates de referência.
3. Demais rotas criadas com copy e layout limpo, prontas para replicar o padrão.
4. Toda a copy vinda do content layer (zero lorem ipsum). WhatsApp deep links funcionando.
5. Mobile impecável, `prefers-reduced-motion` ok, sem erros de console.
6. README curto: como rodar, onde trocar vídeo/áudio/número/fotos, e como adicionar um produto/categoria (inclusive a futura "Velas").

---

## 12. NÃO fazer (restrições da marca)

- Sem yin-yang literal, mandala, chakra ou qualquer símbolo esotérico óbvio.
- Sem espiritualidade do medo, sem promessa de cura, sem clichê de autoajuda.
- Sem cenário carregado, sem excesso de flores/utensílios/decoração — produto protagonista.
- Sem animação estridente/bounce; nada rápido demais. Fluidez ≠ agito.
- Sem carrinho/checkout/pagamento — a jornada termina no WhatsApp.
- Sem áudio tocando sozinho.
- Sem inventar fórmula, aroma ou aviso de segurança de produto real (manter `[confirmar]`).
- Sem imagem artificial que não represente o produto verdadeiro.

Capriche na fluidez, no respiro e na transição luz/sombra. É uma marca que fala baixo — e é por isso que precisa ser impecável.
