'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { misturar, parLegivel, rampaLegivel, tintaPara } from '@/lib/contraste';
import { carregarMotor, lenis, movimentoReduzido } from '@/lib/motion';
import type { Produto } from '@/lib/types';

/**
 * OS OITO BANHOS — lâminas.
 *
 * A seção gruda na tela e a rolagem deixa de rolar a página: ela troca a
 * lâmina. Cada banho é uma lâmina inteira — cor do rótulo no fundo, nome em
 * tipografia grande, os três verbos, a descrição, o aroma e a foto. Uma
 * lâmina sai desfocando para cima enquanto a seguinte entra de baixo, e a cor
 * de fundo atravessa de uma para a outra.
 *
 * O QUE MUDOU, E POR QUÊ
 *
 * 1. ENCAIXE. Antes era um degradê contínuo por oito telas de rolagem: a
 *    pessoa passava a maior parte do tempo ENTRE dois banhos. Agora o scroll
 *    encaixa: parou de rolar, assenta na lâmina mais próxima. Nunca se
 *    descansa no meio de uma troca.
 *
 * 2. RITMO. Eram `innerHeight` por banho — oito telas cheias, mais de 5000px
 *    para atravessar oito preparos. Agora são 0.62 de tela por lâmina.
 *
 * 3. O TRANCO. A versão anterior lia `dentroRef.current` DURANTE o render
 *    para posicionar o nome e escalar a foto. Um ref não dispara render, então
 *    esse valor vinha de um quadro qualquer do passado — o nome saltava em vez
 *    de acompanhar. Aqui NENHUM valor de quadro passa pelo React: tudo é
 *    escrito direto no DOM dentro do `onUpdate`. O componente não re-renderiza
 *    uma única vez enquanto se rola.
 *
 * 4. O FANTASMA. O crossfade da foto era `transition` CSS de 520ms. Rolando
 *    rápido, as transições se enfileiravam e duas fotos apareciam ao mesmo
 *    tempo. Não há transição CSS aqui: a opacidade é função direta do scroll.
 *
 * 5. SEM `pin`. Quem prende é `position: sticky` — o mesmo motor da cena
 *    horizontal. Sem pin-spacer, sem remedir o documento.
 *
 * Acessibilidade: sob prefers-reduced-motion nada é fixado. A cena vira uma
 * lista vertical comum, com as mesmas informações e as mesmas cores.
 */

/** 0→1 com as pontas suavizadas. */
const suavizar = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** Quanto de tela cada lâmina consome. Abaixo disso a troca atropela. */
const RITMO = 0.62;
/* A lâmina SEGURA a maior parte do passo e troca depressa no fim.
   Com a troca espalhada pelo passo inteiro (era 0.14→0.86), a maior parte do
   tempo se passava ENTRE dois banhos — meio desfocado, meio cor de um, meio
   cor do outro. É disso que vinha a sensação de "demorada e meio bugada".
   Assim, 58% do passo é uma lâmina inteira e nítida, e a troca acontece em
   42% — rápida o suficiente para ler como virar a página. */
const INICIO_TROCA = 0.58;
const FIM_TROCA = 1.0;

export default function BathsScene({ banhos }: { banhos: Produto[] }) {
  /* A cor do rótulo entra como fundo de tela cheia, então o par fundo/texto é
     CALCULADO para passar AA — ver lib/contraste.ts. Sete das oito cores
     passam como estão; a Limpeza Densa é escurecida um fio. */
  const cenas = banhos.map((b) => ({
    ...b,
    ...parLegivel(b.cor ?? '#0F0E0C'),
    /* Três tons de leitura calculados a partir da cor do rótulo — ver a nota
       em lib/contraste.ts sobre por que opacidade não servia. */
    ...rampaLegivel(b.cor ?? '#0F0E0C'),
  }));

  const envoltorioRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const fundoRef = useRef<HTMLDivElement>(null);
  const laminasRef = useRef<(HTMLDivElement | null)[]>([]);
  const fotosRef = useRef<(HTMLDivElement | null)[]>([]);
  const trilhoRef = useRef<HTMLSpanElement>(null);
  const contadorRef = useRef<HTMLSpanElement>(null);
  const rodapeRef = useRef<HTMLSpanElement>(null);
  const avisoRef = useRef<HTMLSpanElement>(null);
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    setReduzido(movimentoReduzido());
  }, []);

  useEffect(() => {
    if (reduzido) return;

    let desmontar = () => {};
    let cancelado = false;

    (async () => {
      const { gsap, ScrollTrigger } = await carregarMotor();
      if (cancelado) return;

      const envoltorio = envoltorioRef.current;
      const palco = palcoRef.current;
      if (!envoltorio || !palco) return;

      const n = cenas.length;
      const paradas = n - 1;
      const passo = () => window.innerHeight * RITMO;
      const percurso = () => paradas * passo();

      const ajustarAltura = () => {
        envoltorio.style.height = `${percurso() + window.innerHeight}px`;
        /* A cena muda a altura do documento; o Lenis guarda o limite de
           rolagem em cache e não observa isso sozinho. */
        lenis()?.resize();
      };
      ajustarAltura();
      ScrollTrigger.addEventListener('refreshInit', ajustarAltura);

      /* Qual par de lâminas está pintado agora. Sem isto, apagar as outras
         seis a cada quadro custaria seis escritas de estilo à toa. */
      let parAtual: [number, number] = [-1, -1];
      let indiceMostrado = -1;
      /* Definido logo abaixo do trigger; o `onUpdate` só o chama. */
      let agendarEncaixe = () => {};

      /* `inert` numa lâmina invisível resolve três coisas de uma vez: o Tab
         não pousa no link dela, o leitor de tela não a lê, e o ponteiro não a
         alcança. Sem isto as oito lâminas ficam empilhadas e o teclado passeia
         por links que ninguém está vendo. */
      const apagar = (i: number) => {
        const el = laminasRef.current[i];
        if (!el) return;
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.inert = true;
      };

      const pintar = (i: number, visivel: number, vindoDeBaixo: boolean) => {
        const el = laminasRef.current[i];
        if (!el) return;
        const oculto = 1 - visivel;
        el.style.visibility = visivel <= 0.001 ? 'hidden' : 'visible';
        el.style.opacity = `${visivel}`;
        el.style.filter = oculto < 0.002 ? 'none' : `blur(${oculto * 16}px)`;
        el.style.transform = `translate3d(0, ${(vindoDeBaixo ? oculto : -oculto) * 46}px, 0)`;
        el.inert = visivel < 0.5;

        const foto = fotosRef.current[i];
        if (foto) foto.style.transform = `scale(${1 + oculto * 0.05})`;
      };

      const st = ScrollTrigger.create({
        trigger: envoltorio,
        start: 'top top',
        end: () => `+=${percurso()}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const bruto = self.progress * paradas;
          const i = Math.min(paradas, Math.floor(bruto));
          const f = bruto - i;
          const j = Math.min(n - 1, i + 1);

          const t = suavizar((f - INICIO_TROCA) / (FIM_TROCA - INICIO_TROCA));

          /* A cor é escrita direto no DOM, sem `transition`: um valor atrelado
             ao scroll com transição CSS congela no meio do caminho. */
          const fundo = misturar(cenas[i].fundo, cenas[j].fundo, t);
          const tinta = tintaPara(fundo);
          if (fundoRef.current) fundoRef.current.style.backgroundColor = fundo;
          palco.style.color = tinta;

          if (parAtual[0] !== i || parAtual[1] !== j) {
            for (let k = 0; k < n; k++) if (k !== i && k !== j) apagar(k);
            parAtual = [i, j];
          }
          pintar(i, 1 - t, false);
          if (j !== i) pintar(j, t, true);

          if (trilhoRef.current) {
            trilhoRef.current.style.transform = `scaleX(${self.progress})`;
            trilhoRef.current.style.backgroundColor = tinta;
          }
          /* Contador e aviso são informação, não decoração: cor cheia, sem
             opacidade a comer o contraste. */
          if (rodapeRef.current) rodapeRef.current.style.color = tinta;
          if (avisoRef.current) avisoRef.current.style.color = tinta;

          /* O número troca junto com o cruzamento da cor, não na borda da
             faixa — senão o contador discorda do que está na tela. */
          const mostrado = t > 0.5 ? j : i;
          if (mostrado !== indiceMostrado && contadorRef.current) {
            indiceMostrado = mostrado;
            contadorRef.current.textContent = String(mostrado + 1).padStart(2, '0');
          }

          agendarEncaixe();
        },
      });

      /* ── Encaixe ────────────────────────────────────────────────────────
         Parou de rolar → assenta na lâmina mais próxima.

         Três decisões, todas medidas:

         · Quem MOVE é o Lenis, não o `snap` do ScrollTrigger. O Lenis é dono
           da rolagem; um snap que escreve em `window.scrollTo` por fora briga
           com o laço dele e vira elástico.

         · Quem AVISA que rolou é o `onUpdate` do trigger, não o evento do
           Lenis. A primeira versão fazia `lenis().on('scroll', …)` aqui e não
           funcionava nunca: o SmoothScroll publica o Lenis em `window` depois
           de um import dinâmico, então quando esta cena montava `lenis()`
           ainda era `undefined` e o ouvinte não chegava a ser registrado.
           Verificado: a rolagem parava em 2.485 e 3.698 lâminas.

         · Quem decide QUANDO é o gesto, não um cronômetro. Só com debounce o
           encaixe saía no meio da rolagem seguinte e puxava a página para
           trás — verificado: seis cliques de roda para a frente terminaram
           180px atrás. Agora só encaixa quando o dedo parou (`ultimoGesto`) e
           o deslize do Lenis já morreu (`velocity`). Enquanto qualquer um dos
           dois estiver vivo, reagenda. */
      let relogio: number | undefined;
      let travando = false;
      let ultimoGesto = 0;

      const marcarGesto = () => {
        ultimoGesto = performance.now();
        /* Se a pessoa voltou a rolar durante um encaixe, o encaixe perde a
           vez na hora — quem manda é o gesto. */
        travando = false;
      };
      window.addEventListener('wheel', marcarGesto, { passive: true });
      window.addEventListener('touchmove', marcarGesto, { passive: true });
      window.addEventListener('keydown', marcarGesto);

      const encaixar = () => {
        if (travando || !st.isActive) return;
        const faixa = st.end - st.start;
        if (faixa <= 0) return;
        const alvo = st.start + (Math.round(st.progress * paradas) / paradas) * faixa;
        if (Math.abs(window.scrollY - alvo) < 4) return;
        travando = true;
        const L = lenis();
        if (L) L.scrollTo(alvo, { duration: 0.5, easing: (x: number) => 1 - Math.pow(1 - x, 3) });
        else window.scrollTo({ top: alvo, behavior: 'smooth' });
        /* Longo o bastante para cobrir o voo inteiro do `scrollTo` (0.5s) mais
           a folga do Lenis assentar. Se ficar curto, o próximo `verificar`
           entra no meio do voo e reaponta para outra lâmina. */
        window.setTimeout(() => {
          travando = false;
        }, 780);
      };

      const verificar = () => {
        if (!st.isActive) return;
        const paradoHa = performance.now() - ultimoGesto;
        const deslize = Math.abs(lenis()?.velocity ?? 0);
        /* Ainda com o dedo na roda, ou o Lenis ainda deslizando: espera mais um
           pouco em vez de encaixar por cima do gesto. */
        if (paradoHa < 220 || deslize > 0.35) {
          agendarEncaixe();
          return;
        }
        encaixar();
      };

      agendarEncaixe = () => {
        window.clearTimeout(relogio);
        relogio = window.setTimeout(verificar, 140);
      };

      requestAnimationFrame(() => ScrollTrigger.refresh());

      desmontar = () => {
        window.clearTimeout(relogio);
        window.removeEventListener('wheel', marcarGesto);
        window.removeEventListener('touchmove', marcarGesto);
        window.removeEventListener('keydown', marcarGesto);
        ScrollTrigger.removeEventListener('refreshInit', ajustarAltura);
        st.kill();
        envoltorio.style.height = '';
      };
    })();

    return () => {
      cancelado = true;
      desmontar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduzido, banhos.length]);

  /* ---------------- versão sem movimento: lista vertical ---------------- */
  if (reduzido) {
    return (
      <div>
        {cenas.map((b) => (
          <section
            key={b.slug}
            className="flex min-h-[70svh] items-center py-block"
            style={{ backgroundColor: b.campo, color: b.forte }}
          >
            <div className="shell grid-12 items-center gap-y-10">
              <div className="col-span-4 md:col-span-6">
                <p
                  className="font-sans text-[0.7rem] uppercase tracking-[0.24em]"
                  style={{ color: b.suave }}
                >
                  {b.subtitulo ?? 'Banho & escalda-pés'}
                </p>
                <h3 className="display mt-4 text-d1" style={{ color: b.forte }}>
                  {b.nome}
                </h3>
                <p
                  className="mt-6 font-sans text-[0.78rem] uppercase tracking-[0.2em]"
                  style={{ color: b.suave }}
                >
                  {b.conceito.join(' · ')}
                </p>
                <p
                  className="mt-6 max-w-prose-sm font-sans text-[0.95rem]"
                  style={{ color: b.medio }}
                >
                  {b.descricaoCurta}
                </p>
                <Link
                  href={`/produto/${b.slug}`}
                  className="mt-9 inline-flex border-b border-current pb-1 font-sans text-[0.72rem] uppercase tracking-[0.18em]"
                >
                  Ver o banho
                </Link>
              </div>
              <div className="col-span-4 md:col-span-5 md:col-start-8">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={b.imagens[0]}
                    alt={`${b.nome} — ${b.subtitulo ?? 'banho e escalda-pés'}`}
                    fill
                    sizes="(max-width: 768px) 88vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  /* ------------------------------ lâminas ------------------------------ */
  return (
    <div ref={envoltorioRef} className="relative" data-cena-banhos>
      <div
        ref={palcoRef}
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ color: cenas[0].texto }}
      >
        <div
          ref={fundoRef}
          className="absolute inset-0"
          style={{ backgroundColor: cenas[0].fundo }}
        />

        {cenas.map((b, i) => (
          <div
            key={b.slug}
            ref={(el) => {
              laminasRef.current[i] = el;
            }}
            className="absolute inset-0 will-change-[opacity,filter,transform]"
            inert={i !== 0}
            style={{
              opacity: i === 0 ? 1 : 0,
              visibility: i === 0 ? 'visible' : 'hidden',
            }}
          >
            {/* A FOTO É A LÂMINA. Antes havia uma cor de fundo MAIS uma foto
                emoldurada na coluna direita — duas coisas disputando. Aqui a
                foto sangra de borda a borda e o texto deita por cima.
                Só funciona porque a foto foi composta para isso: o fundo dela
                é o hex exato do rótulo (o mesmo que a cena usa), e o terço
                esquerdo é campo de cor vazio, reservado para a tipografia. */}
            <div
              ref={(el) => {
                fotosRef.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              {/* DOIS RECORTES, um por orientação.
                  A 16:9 foi composta com o terço esquerdo vazio para a
                  tipografia — e num viewport retrato o `object-cover` corta
                  justamente esse pedaço: o produto sumia por completo e a
                  lâmina virava um retângulo de cor lisa no celular.
                  Em retrato entra a 4:5 do catálogo, que já existe, ancorada
                  embaixo para o produto ficar abaixo do texto. */}
              <div className="cena-paisagem absolute inset-0">
                <Image
                  src={`/images/banhos/${b.slug}.jpg`}
                  alt={`${b.nome} — ${b.subtitulo ?? 'banho e escalda-pés'}`}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
              {/* Em retrato a foto ocupa a faixa de baixo, abaixo do texto —
                  empilhado é o que funciona numa tela alta, e evita a escolha
                  impossível entre véu que esconde a foto e texto ilegível. */}
              <div className="cena-retrato absolute inset-x-0 bottom-0 top-[44%]">
                <Image
                  src={b.imagens[0]}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Véu na cor do próprio banho, só do lado do texto. Faz duas
                coisas: garante a legibilidade quando o corte do `object-cover`
                puxa a composição para a esquerda em telas estreitas, e
                aprofunda o campo o mínimo necessário para os três tons de
                leitura caberem (4% a 25%, conforme o banho). Como é gradiente,
                lê como queda de luz. */}
            <span
              aria-hidden="true"
              className="cena-paisagem absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${b.campo} 0%, ${b.campo} 24%, ${b.campo}00 66%)`,
              }}
            />
            <span
              aria-hidden="true"
              className="cena-retrato absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${b.campo} 0%, ${b.campo} 30%, ${b.campo}00 46%)`,
              }}
            />

            <div className="relative flex h-full items-start pt-[8.5rem] landscape:items-center landscape:pt-0">
              <div className="shell w-full">
                <div className="max-w-[34rem] xl:max-w-[42rem]">
                  <p
                    className="font-sans text-[0.7rem] uppercase tracking-[0.24em]"
                    style={{ color: b.suave }}
                  >
                    {b.subtitulo ?? 'Banho & escalda-pés'}
                  </p>
                  {/* Hífen que não quebra (U+2011): "Primavere-se" partia em
                      "Primavere-" / "se", e nenhuma propriedade de CSS impede
                      quebra num hífen existente — só o caractere resolve.
                      Nomes com espaço continuam quebrando normalmente. */}
                  <h3
                    className="display mt-4 text-balance text-d1 leading-[0.95]"
                    style={{ color: b.forte }}
                  >
                    {b.nome.replace(/-/g, '\u2011')}
                  </h3>
                  <p
                    className="mt-6 font-sans text-[0.76rem] uppercase tracking-[0.2em]"
                    style={{ color: b.suave }}
                  >
                    {b.conceito.join(' · ')}
                  </p>
                  <p
                    className="mt-7 font-sans text-[0.95rem] leading-relaxed"
                    style={{ color: b.medio }}
                  >
                    {b.descricaoCurta}
                  </p>
                  {b.aroma ? (
                    <p
                      className="mt-4 font-sans text-[0.74rem] uppercase tracking-[0.16em]"
                      style={{ color: b.suave }}
                    >
                      {b.aroma}
                    </p>
                  ) : null}
                  <Link
                    href={`/produto/${b.slug}`}
                    className="mt-9 inline-flex border-b border-current pb-1 font-sans text-[0.72rem] uppercase tracking-[0.18em] transition-opacity duration-500 hover:opacity-70"
                    style={{ color: b.forte }}
                  >
                    Ver o banho
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Trilho contínuo: acompanha o scroll quadro a quadro, não a lâmina.
            É o que deixa claro que a cena responde ao gesto mesmo entre um
            encaixe e outro. */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="shell">
            <div className="relative h-px w-full bg-current opacity-20">
              <span
                ref={trilhoRef}
                className="absolute inset-y-0 left-0 w-full origin-left bg-current"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            {/* O trilho é decorativo e pode viver em opacidade. O contador e o
                aviso são informação: recebem cor de verdade, escrita quadro a
                quadro pelo onUpdate junto com a tinta da cena. */}
            <div className="mt-4 flex items-center justify-between">
              <span
                ref={rodapeRef}
                className="font-sans text-[0.62rem] tabular-nums tracking-[0.2em]"
              >
                <span ref={contadorRef}>01</span> / {String(cenas.length).padStart(2, '0')}
              </span>
              <span
                ref={avisoRef}
                className="font-sans text-[0.6rem] uppercase tracking-[0.24em]"
              >
                Role para trocar a lâmina
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
