# Prompt para colar como PRIMEIRO comando do chat novo

Copie tudo abaixo da linha.

---

Você vai continuar o site da **Toque Energético**. Antes de escrever qualquer
código, leia estes arquivos nesta ordem — eles contêm todo o histórico,
decisões, erros já cometidos e armadilhas do ambiente:

1. `handoff-2026-09-04.md` (raiz do projeto) — **leia inteiro, é a fonte de verdade**
2. `README.md` — sistema de superfícies, contraste, anatomia dos cartões
3. `docs/toque-energetico-briefing-site-v1.md` e `docs/toque-energetico-copy-site-v1.md` — briefing e copy originais da cliente
4. `docs/briefing-fotografico.md` — especificação das imagens
5. `git log` — cada commit explica o **porquê** da decisão, não só o quê

## Onde estão as coisas

- **Projeto:** `/Users/viniciuspereira/Library/CloudStorage/GoogleDrive-oviniciusiago@gmail.com/Meu Drive/TOQUE ENERGÉTICO BASE SITE`
- **Fotos reais dos produtos (HEIC):** `…/Meu Drive/TOQUE ENERGÉTICO/IMAGENS/BANHO/` — converta com `sips -s format jpeg -Z 1400` para ler
- **Site no ar:** https://toque-energetico.vercel.app
- **Repo:** https://github.com/oviniciusiago-byte/Toque-Energ-tico-site
- **Vercel:** projeto `toque-energetico`, CLI já autenticada como `oviniciusiago-byte` e instalada como devDependency
- **Publicar:** `npm run deploy` (publica **e** verifica 10 rotas no ar). `git push` **não** publica — Vercel e GitHub não estão conectados

## Regras do ambiente que já me custaram tempo

- **Nunca** rodar `next build` com `next dev` no ar — corrompe o `.next`. Sempre `pkill -f "next dev"` → `rm -rf .next` → build
- **Nunca** filtrar a saída de um comando de deploy com `grep` — três falsos "deploy falhou" vieram daí
- Rodar `python3 scripts/check-contrast.py` depois de qualquer mexida em cor: ele falha com exit 1 se algum token cair abaixo de 4.5:1
- Classe Tailwind **nunca** por template string (`` `surface-${x}` ``) — o tree-shaking purga e a cor não existe no CSS. Sempre mapa de literais
- Nos testes de scroll, use `window.__lenis.scrollTo(y, { immediate: true })` — o Lenis controla a rolagem e `window.scrollTo` não atualiza o ScrollTrigger
- Screenshots do painel do browser vêm em branco quando o painel está oculto; verificar por DOM é mais confiável
- Ao medir posição de scroll, meça **com a página no topo** ou use `start`/`end` do próprio trigger — errei isso três vezes e conclui bug onde não havia

## Contexto rápido

Site-catálogo, **não é loja** — a venda fecha no WhatsApp. Cliente:
Maria Fernanda Pavan (BH). Marca artesanal de autocuidado; conceito de luz e
sombra; a estrela como centro que irradia. Base de cor atual é neutra
(`paper` / `ink` / `smoke`) porque eu pedi para tirar o cimento e o verde da
cliente por ora — as superfícies dela (`bone`, `tan`, `sage`, `olive`, `moss`,
`noir`, `concrete`) seguem definidas em `app/globals.css` para reencaixar
depois. **A cor vem dos produtos:** os 8 banhos carregam a cor real do seu
rótulo, transcrita das fotos.

Stack: Next 15 App Router · TS · Tailwind 3 · **GSAP 3.15 + ScrollTrigger** ·
Lenis · Framer Motion.

## O que JÁ funciona (não refazer, não quebrar)

- `components/scroll/HeroScrub.tsx` — abertura fixada com `pin` + `scrub`
- `components/scroll/BathsScene.tsx` — **a peça central**: seção fixada onde o
  scroll atravessa os 8 banhos e a cor real de cada rótulo toma a tela inteira.
  A cor é escrita direto no DOM quadro a quadro, **sem `transition`**
- `lib/contraste.ts` — calcula o par fundo/texto de cada cena (a tinta vira
  clara sozinha nos fundos escuros)
- `components/Intro.tsx` — cortina de abertura, uma vez por sessão
- `components/SideRail.tsx` — trilha lateral com índice e nome da seção
- Camada de conteúdo com os dados **reais** dos rótulos (nome, subtítulo, três
  verbos, ervas e a intenção de cada uma). As 39 marcações `[confirmar]` são
  intencionais — **não invente** nada no lugar delas

## A TAREFA

O Vinicius disse, com razão, que o site ainda não chega perto das referências
de animação. Ele quer explorar **estas duas** a fundo:

- **https://www.era-residence.com/** ← prioridade
- **https://www.collabcapitolium.fr/**

Do era-residence eu já confirmei o stack inspecionando a página:
**GSAP + ScrollTrigger + SplitText + CustomEase + Lenis + Barba**. Os três
recursos que ele usa e que o nosso site **ainda não tem** são justamente o que
falta:

1. **`SplitText` + `CustomEase`** — revelação de títulos **linha por linha
   atrelada ao scroll**, com curva de easing própria. Hoje nossos títulos
   fazem fade de bloco inteiro. Aplicar nos títulos de seção da home e das
   páginas internas.
2. **Transição de página com cortina** (o papel do Barba). Hoje
   `components/PageTransition.tsx` é um fade simples.
3. **Alternância de estado tipo "by day / by night"** do era-residence. Na
   Toque Energético isso é literalmente **luz ↔ sombra**, que é o conceito
   central da marca — pode ser um controle que troca a superfície da página
   inteira. Essa é a ideia com maior potencial de virar assinatura do site.

Do collabcapitolium: a estrutura em **capítulos com cenas fixadas** (já temos
os capítulos escritos, mas não as cenas por capítulo).

**Antes de implementar, visite as duas referências e estude o movimento** —
não confie na minha descrição. Use o browser, inspecione os scripts, role as
páginas devagar. Depois proponha ao Vinicius o que vai fazer, em ordem de
impacto, e confirme antes de sair codando: ele tem repertório e opinião forte,
e prefere decidir a prioridade.

## A dívida que eu deixei

**`components/scroll/HorizontalRail.tsx`** — tentei a versão **fixada** (scroll
vertical virando deslocamento horizontal, como nas referências) e **não
consegui fazer funcionar**. O `pin` engatava e a faixa do trigger era
calculada certa, mas o trigger **nunca reportava progresso**: `onUpdate`
disparava ~6 vezes na montagem e nunca mais, e a trilha ficava em `x = 0`.

Hipóteses que testei e **não** eram a causa: valor de tween função gravado
antes do layout; `invalidateOnRefresh` em trigger sem animação; medição errada
minha. Havia um laço de `ResizeObserver` que era um bug real (quebrava a
altura do documento e deixava as faixas inalcançáveis) — corrigido, mas não
era a causa do `x = 0`.

O que está no ar é rolagem horizontal **nativa** com arraste e encaixe,
verificada funcionando. A nota honesta está no topo do componente.

**Sugestão de caminho novo:** em vez do `pin` do ScrollTrigger, testar
`position: sticky` no container e traduzir por progresso calculado do
`getBoundingClientRect()` do wrapper — tira o pin-spacer da equação, que é
onde as coisas quebraram.

## Como o Vinicius mede o resultado

Ele compara **lado a lado** com as referências e a meta declarada é
"digno de awwwards". Ele reclamou de eu estar "travado" e pediu para eu criar
algo de que eu me orgulhe. Então: proponha ideias suas, não só execute; e
quando algo não funcionar, diga que não funcionou em vez de entregar quebrado.

Uma coisa que vale dizer a ele com franqueza: **o site hoje vive de gradientes
de placeholder.** A cena dos banhos com 8 fotos reais em fundo de cimento, luz
lateral, vidro e ervas com textura é o que a transforma de vez. Ele já disse
que vai gerar as imagens por IA — `docs/briefing-fotografico.md` tem proporção,
nome de arquivo e direção de arte por cena, e `npm run placeholders` nunca
sobrescreve arquivo existente, então basta salvar com o nome certo.

## Duas coisas que dependem de decisão dele (não decida sozinho)

1. **O repositório é público** e `docs/` tem o briefing da cliente com nome
   completo, cidade, Instagram, preços e condição comercial. Ou torna o repo
   privado, ou remove `docs/` do versionamento.
2. **O projeto está dentro do Google Drive.** O Drive sincronizando `.git`
   tende a corromper o repositório. Recomendo mover para `~/dev/`.
