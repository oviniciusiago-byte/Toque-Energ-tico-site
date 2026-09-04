# Briefing fotográfico — Toque Energético

Especificação para gerar/produzir as imagens do site. Os nomes de arquivo são
os que o código já procura: salvar com o nome exato e a imagem entra sozinha,
sem tocar em código.

---

## Direção de arte (vale para todas)

Da própria marca: *luxo silencioso botânico*.

- **Luz lateral suave**, com sombra presente. Nunca luz frontal achatada.
- **Fundos**: cimento queimado grafite, tecido cru, madeira escura, pedra — ou
  a textura fluida verde. Um fundo por cena, nunca dois competindo.
- **Poucos elementos botânicos.** O produto é o protagonista.
- **Cores naturais**, baixa saturação, acabamento fosco. Sem HDR, sem brilho
  plástico, sem vinheta pesada.
- **Textura real** de vidro, metal, ervas e pele.
- A embalagem é **sachê dourado metalizado** com rótulo colorido — o dourado
  reflete, então cuidado com estouro de luz nele.
- **Evitar cara de IA**: mãos com dedos corretos, texto de rótulo legível e
  coerente, simetria imperfeita, grão fotográfico leve, profundidade de campo
  realista (não desfoque uniforme de recorte).

> Se o rótulo aparecer legível na imagem, o texto precisa ser o texto real do
> produto. Rótulo com texto inventado é o que mais denuncia imagem sintética.

---

## Formatos

| Uso | Proporção | Tamanho mínimo |
| --- | --- | --- |
| Produto (card e galeria) | **4:5** vertical | 1600 × 2000 |
| Capa de categoria | **3:4** vertical | 1500 × 2000 |
| Editorial largo (split, faixa) | **3:2** horizontal | 2400 × 1600 |
| Abertura (vídeo/poster) | **16:9** | 2400 × 1350 |
| Ritual (moldura circular) | **1:1** | 1400 × 1400 |

Salvar em JPEG qualidade ~85. O Next converte para WebP/AVIF sozinho.

---

## Lista de arquivos

### Produtos — `public/images/products/`

Três imagens por carro-chefe, duas para os demais:
`{slug}-1.jpg` (produto fiel à embalagem), `{slug}-2.jpg` (editorial),
`{slug}-3.jpg` (detalhe / modo de uso).

**Banhos & Escalda-Pés** — sachê dourado de pé, rótulo nítido e centrado:

| slug | rótulo | cena sugerida |
| --- | --- | --- |
| `aurora-dourada` | creme, "Banho de Prosperidade" | luz de amanhecer, laranja e canela ao lado |
| `alegria` | âmbar | luz alta e clara, calêndula seca |
| `calmaria` | azul-violeta | fim de tarde, lavanda, água morna |
| `limpeza-densa` | grafite | fundo de cimento, eucalipto, luz dura lateral |
| `encantamento-e-poder-pessoal` | vinho | luz baixa, rosa vermelha, sombra profunda |
| `paz-na-alma` | marfim | luz difusa, tecido cru |
| `primavere-se` | coral | luz de meio-dia, flores frescas |
| `eixo-rosa` | rosa | luz suave, pétalas de rosa |

**Demais linhas:** `spray-de-protecao`, `bruma-de-frescor`, `brumas-de-harmonia`,
`aura-botanica`, `oleo-de-ritual-rosas-com-geranio`, `oleo-de-ritual-lavanda`,
`oleo-de-ritual-jasmim`, `roll-on-personalizado`, `incensos-naturais`,
`sache-lavanda-da-alma`, `buque-botanico`, `amuleto-de-harmonia`.

### Capas de categoria — `public/images/categories/`

`banhos-escalda-pes` · `brumas-aromas-ambientes` · `oleos-de-ritual` ·
`roll-ons-oleos-essenciais` · `incensos-naturais` · `presentes-complementos`
(+ `velas` quando a linha existir)

### Editoriais — `public/images/editorial/`

| arquivo | cena |
| --- | --- |
| `maos-preparo.jpg` | **as mãos dela** no preparo, luz lateral — a marca pediu foto real |
| `maos-buque.jpg` | mãos segurando um buquê botânico |
| `preparo-mesa.jpg` | bancada com ervas e flores secas, vista de cima |
| `fundadora.jpg` | retrato discreto, não precisa o rosto inteiro |
| `ritual-brumas.jpg` | bruma borrifada, névoa atravessada por luz |
| `ritual-banhos.jpg` | flores em infusão, água morna |
| `ritual-oleos.jpg` | óleo aquecido entre as mãos |
| `ritual-rollons.jpg` | roll-on no pulso |
| `ritual-incensos.jpg` | incenso aceso, fumaça subindo |
| um por categoria, com o slug da categoria | faixa editorial daquela linha |

### Abertura — `public/images/`

- `hero-poster.jpg` — quadro do vídeo, escuro, para ser o primeiro frame.
- `public/video/hero.mp4` + `hero.webm` — escalda-pés, borrifo, luz lateral.
  Depois de colocar, virar `videoAtivo` para `true` em `lib/media.ts`.

Enquanto não houver vídeo, a abertura usa a textura fluida verde
(`public/images/texture/fluid-green-dark.jpg`), gerada por
`npm run textura`.

---

## Checagem antes de subir

- [ ] proporção correta (a imagem é cortada por `object-cover`, o assunto tem
      que sobreviver ao corte nas duas orientações)
- [ ] assunto no terço central — o corte no mobile é mais estreito
- [ ] peso do arquivo abaixo de ~600 KB
- [ ] rótulo legível e com o texto real, se aparecer
- [ ] nada de dedo torto, texto borrado ou reflexo impossível no dourado
