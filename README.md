# Toque Energético — site catálogo (versão base)

Catálogo sensorial e editorial. **Não é loja**: a venda fecha no WhatsApp.
Next.js (App Router) + TypeScript + Tailwind + Framer Motion + Lenis + GSAP.

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos: `npm run build`, `npm start`, `npm run typecheck`,
`npm run placeholders` (regera imagens de placeholder que estejam faltando).

---

---

## Publicação

- **Site:** https://toque-energetico.vercel.app
- **Repositório:** https://github.com/oviniciusiago-byte/Toque-Energ-tico-site
- **Projeto na Vercel:** `oviniciusiago-bytes-projects/toque-energetico`

O framework está declarado em `vercel.json` (`"framework": "nextjs"`), então o
deploy não depende do preset configurado no painel — sem isso a Vercel serve
`/public` como site estático e a home dá 404.

Publicar uma nova versão:

```bash
npx vercel@latest deploy --prod
```

> **Deployment Protection** precisa ficar **desativada** em
> Settings → Deployment Protection, senão o link pede login da Vercel e a
> cliente não consegue abrir.

---

## O sistema visual: blocos de cor

Cada seção do site é um **bloco de cor definido**. Uma seção declara a sua
superfície e, com isso, define de uma vez fundo, cor de texto, texto
secundário, hairline e acento — os botões inclusive, que **invertem sozinhos**
para nunca perder contraste:

```tsx
<Section surface="forest">…</Section>   // trocar a cor = trocar a palavra
```

Superfícies disponíveis (`components/Section.tsx`, cores em `app/globals.css`),
derivadas da identidade — verde-sálvia dos rótulos + dourado envelhecido da
estrela:

| Superfície | Cor | Uso |
| --- | --- | --- |
| `bone` | #E5D7C4 | creme/Bone — **fundo claro principal e área de respiro** |
| `tan` | #CFBB99 | neutro de transição |
| `sage` | #D2D7BC | sálvia pálido — a identidade presente na luz |
| `olive` | #354024 | Kombu — **a sombra principal** |
| `moss` | #4A5136 | musgo profundo — identidade na sombra |
| `noir` | #4C3D19 | Café Noir — sombra quente |
| `concrete` | #4A4B47 | cimento queimado — **cenário de produto, não identidade** |
| `image` | — | sobre foto ou textura fluida |

Acentos, nunca preenchimento: `--gold` #A2854B (linhas, estrela, ícones),
`--gold-deep` #5E4614 (rótulos pequenos sobre claro), `--sage` #889063
(linhas de identidade), `--tiffany` #8FC6C0 (**só** na linha de Brumas).

> **O sálvia puro (#889063) não serve de fundo para texto.** Nenhum texto passa
> 4.5:1 nele (2,4:1 com creme, 3,1:1 com Café Noir). A identidade sálvia entra
> como `sage` pálido na luz e `moss` na sombra — e como cor de linha.
>
> **Dourado também não serve para texto pequeno sobre claro:** o melhor caso dá
> 2,5:1. Por isso ele fica em linhas, estrela e ícones, e os rótulos usam
> `--gold-deep`.

### A textura fluida verde

`scripts/make-fluid-texture.py` gera a "assinatura emocional" da marca —
mármore/pintura fluida em sálvia, musgo, oliva e petróleo acinzentado. É
procedural e autoral: nada de imagem licenciada de terceiros.

```bash
python3 scripts/make-fluid-texture.py
```

Saem três arquivos em `public/images/texture/`:

- `fluid-green-dark.jpg` — **fundo da abertura**. Paleta na faixa de sombra, de
  propósito: assim o texto creme já passa 4,5:1 com véu quase nulo e a textura
  aparece. Com a variante luminosa, o véu necessário apagava a textura.
- `fluid-green.jpg` / `fluid-green-alt.jpg` — variantes luminosas, para faixas
  onde há véu (a faixa da página "Sobre").

### A estrela

`components/Star.tsx` é o único lugar onde a estrela é desenhada — header,
divisores, fechamento e depoimentos usam esse componente. **É um placeholder:**
o briefing pede a estrela oficial da marca. Ao receber o vetor, troque o
`polygon` ali e o `public/logo.svg`.

### Contraste é token, não gosto

As opacidades de `--s-muted` e `--s-faint` de cada superfície foram calculadas
para passar **4.5:1 (WCAG AA)** contra o próprio fundo — não são escolhas
estéticas. Ao mexer em qualquer cor de superfície, rode:

```bash
python3 scripts/check-contrast.py
```

O script lê `app/globals.css`, recalcula todos os pares e falha (exit 1) se
algum ficar abaixo de 4.5:1. Foi assim que descobrimos que o `faint` original
estava em 2.5:1 em todas as superfícies.

### Anatomia dos cartões

`ProductCard` e `CollectionCard` compartilham a mesma anatomia, para que
produto e coleção possam aparecer na mesma fileira sem desalinhar:

```
mídia 4:5  →  nome (máx. 2 linhas) + régua + preço  →  descrição (2 linhas,
altura reservada)  →  metadados (ancorados na base do cartão)
```

Duas regras sustentam o alinhamento e não devem ser removidas:

- `.card-desc` reserva a altura de duas linhas, então uma descrição curta não
  sobe a régua de metadados;
- `.card-meta` usa `mt-auto`, ancorando os metadados na base — como todos os
  cartões de uma fileira têm a mesma altura, as réguas alinham mesmo com
  títulos de tamanhos diferentes.

O ritmo de cores da home, na ordem: vídeo → **dourado** → areia → creme →
**verde** → areia → **carvão** → creme → areia → **cimento** → creme → **carvão**.

> A **animação** de transição entre as cores fica para depois, como combinado.
> O ponto de entrada é o `<Section>`: qualquer efeito de troca de cor entra ali,
> num lugar só.

## Referências aplicadas

- **Soho Skin** — estrutura de catálogo: `/catalogo` reúne todas as linhas com
  navegação fixa por categoria; a página de produto tem ficha em linhas
  rótulo/valor + detalhes em acordeão + fileira arrastável de relacionados.
- **duyvenvoorde.nl** — hero em vídeo full-screen com título e CTAs sobrepostos
  na base, poster como LCP.
- **Sua Botica** — faixa de valores logo abaixo do hero e preço visível em todo
  card de produto.

## O que já está construído

| Rota | Estado |
| --- | --- |
| `/` | **completa e animada** — hero, jornada tonal, reveals, manifesto, editorial, rituais, fechamento |
| `/catalogo/brumas-aromas-ambientes` | **template de referência** de categoria (todas as 6 usam o mesmo componente) |
| `/produto/spray-de-protecao` | **template de referência** de produto (todos os 20 usam o mesmo componente) |
| `/catalogo`, `/sobre`, `/rituais`, `/faq`, `/contato`, `/onde-encontrar`, `/atacado` | layout limpo com a copy no lugar |

Toda a copy vem de `content/` — nenhum texto está escrito dentro de componente.

---

## Onde trocar as coisas

| O que | Arquivo |
| --- | --- |
| **Número de WhatsApp** | `lib/whatsapp.ts` → `WPP` (formato `5531999999999`) |
| **Vídeo do hero** | coloque `hero.mp4` + `hero.webm` em `public/video/` e mude `videoAtivo` para `true` em `lib/media.ts` |
| **Poster do hero** | `public/images/hero-poster.jpg` (é o LCP — troque por uma foto tratada) |
| **Som ambiente** | `public/audio/` + `AUDIO_SRC` em `components/providers/AudioProvider.tsx` (volume-alvo e fades também ficam lá) |
| **Logo** | `public/logo.svg` e o componente `components/Logo.tsx` (placeholder até o vetor final) |
| **Cores, fontes, ritmo** | `app/globals.css` (design tokens) e `tailwind.config.ts` |
| **Fotos de produto** | `public/images/products/{slug}-1.jpg`, `-2`, `-3` |
| **Fotos editoriais / capas** | `public/images/editorial/`, `public/images/categories/` |

> As imagens em `public/images/` são **placeholders gerados** (gradientes na paleta
> da marca, com o nome do arquivo escrito por cima). Basta salvar a foto real com o
> mesmo nome — `npm run placeholders` nunca sobrescreve arquivo existente.

---

## Como adicionar conteúdo

### Um produto

1. abra `content/produtos.ts` e acrescente um objeto `Produto` (o tipo está em `lib/types.ts`);
2. `slug` define a URL (`/produto/{slug}`) **e** o nome dos arquivos de foto;
3. rode `npm run placeholders` para gerar as imagens provisórias;
4. salve as fotos reais em `public/images/products/` com o mesmo nome.

Campos opcionais somem sozinhos da página quando não existem (aroma, composição,
volume, modo de uso, cuidados…). `destaque: true` coloca o produto na home.

### Uma categoria (inclusive as **Velas**)

As Velas já estão cadastradas em `content/categorias.ts` com `oculta: true`.
Para publicar: **remova o `oculta: true`**, cadastre os produtos com
`categoria: 'velas'`, escreva a `intro` e gere/coloque a capa. Nada mais muda —
nav, footer, home, catálogo e rotas estáticas leem a mesma lista.

### Disponibilidade

`pronta-entrega` · `sob-consulta` · `sazonal` (esta aparece com a nota
"conforme o lote"). O badge, a legenda do catálogo e a mensagem pré-preenchida do
WhatsApp mudam junto — ver `content/site.ts` e `lib/whatsapp.ts`.

---

## Decisões de conceito (para não desmontar sem querer)

- **A estrela** aparece como *irradiação* (glows radiais, classe `.radiance`),
  nunca como símbolo esotérico.
- **Dourado é acento.** A superfície `gold` existe só para faixas curtas.
  Texturas só em fundo escuro.
- **Movimento**: 0.8–1.4s, easing `cubic-bezier(0.22, 1, 0.36, 1)`, parallax no
  máximo ~15% (o `<Parallax>` calcula o zoom para nunca aparecer a borda da foto).
- **Som nunca toca sozinho.** Começa desligado, só entra depois de um gesto, com
  fade-in de ~1.2s até volume 0.25. A preferência é lembrada, mas no reload o
  toggle fica "armado" e o som só volta no primeiro gesto real.
- **`prefers-reduced-motion`** desliga Lenis, parallax, magnetismo, cursor
  customizado e reveals complexos — sobram fades curtos.
- **Classes de cor precisam ser literais.** O Tailwind faz tree-shaking do que
  está em `@layer components`: uma classe montada por template string
  (`` `surface-${x}` ``) sai purgada do CSS. Por isso `Section` usa um mapa de
  strings literais. Mesma regra vale para `text-d1/d2/d3`.

## Pendências de conteúdo

Os trechos marcados `[confirmar: …]` aparecem **visíveis na tela** de propósito:
são fórmula, notas de aroma, avisos de segurança, depoimentos, pontos de venda e o
número de WhatsApp. Precisam da Fernanda antes de publicar — nada foi inventado.
Busque por `[confirmar` e por `TODO` no projeto para ver a lista completa.

Briefing, copy e prompt originais estão em `docs/`.
