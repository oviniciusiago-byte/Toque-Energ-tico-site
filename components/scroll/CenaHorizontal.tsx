'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { carregarMotor, larguraCena, lenis, movimentoReduzido } from '@/lib/motion';

/**
 * Cena horizontal fixada: a seção gruda na tela e a rolagem vertical vira
 * deslocamento horizontal da fileira.
 *
 * COMO ISTO FUNCIONA — e por que a tentativa anterior não funcionava
 *
 * A versão antiga usava `pin` do ScrollTrigger. O pin engatava, mas o trigger
 * nunca reportava progresso e a trilha ficava parada em x=0. O suspeito é o
 * pin-spacer: o ScrollTrigger injeta um elemento e remede o documento a cada
 * refresh, e qualquer coisa que mude de altura nesse meio deixa as faixas dos
 * triggers fora de alcance.
 *
 * Aqui não existe pin. O que prende a cena é `position: sticky` — CSS puro. O
 * ScrollTrigger só lê o progresso e escreve `x` na trilha: não mexe no layout,
 * não cria spacer, não precisa remedir o documento. (As duas referências,
 * era-residence e collabcapitolium, fazem exatamente assim — nenhuma das duas
 * usa pin para isto.)
 *
 * A matemática é uma linha só:
 *
 *     altura do envoltório = distância a percorrer + uma tela
 *
 * Com `start: 'top top'` e uma faixa de exatamente `distância`, a cena fica
 * grudada durante todo o percurso e cada pixel de rolagem vertical vale um
 * pixel de deslocamento horizontal. 1:1, sem fator de calibração.
 *
 * A altura é escrita em `refreshInit` — o gancho que o ScrollTrigger dispara
 * ANTES de medir. É por isso que não há ResizeObserver aqui: era o observer
 * que, no código antigo, entrava em laço com o refresh e quebrava a altura do
 * documento.
 *
 * FORA DA CENA (mobile, sem JS, ou movimento reduzido) o componente é a
 * fileira de rolagem nativa que já estava no ar: teclado, trackpad e toque de
 * graça. A cena é um acréscimo por cima, nunca um pré-requisito.
 */
export default function CenaHorizontal({
  children,
  label,
  indice,
  className = '',
}: {
  children: ReactNode[];
  label: string;
  /** "04" — o mesmo índice do cabeçalho da seção, repetido dentro da cena. */
  indice?: string;
  className?: string;
}) {
  const envoltorioRef = useRef<HTMLDivElement>(null);
  const telaRef = useRef<HTMLDivElement>(null);
  const trilhaRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLSpanElement>(null);

  const [fixada, setFixada] = useState(false);
  const [temCurso, setTemCurso] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const arrasto = useRef({ ativo: false, x: 0, esquerda: 0 });

  /* Progresso escrito direto no DOM, quadro a quadro. Nunca em estado: seriam
     60 renders por segundo. Nunca com `transition`: valor atrelado ao scroll
     com transição congela no meio do caminho. */
  const pintarProgresso = (p: number) => {
    const barra = barraRef.current;
    if (barra) barra.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
  };

  /* ── A cena fixada (desktop, movimento normal) ──────────────────────── */
  useEffect(() => {
    if (movimentoReduzido()) return;

    let desmontar = () => {};
    let cancelado = false;

    (async () => {
      const { gsap, ScrollTrigger } = await carregarMotor();
      if (cancelado) return;

      const mm = gsap.matchMedia();

      mm.add(`(min-width: ${larguraCena}px)`, () => {
        const envoltorio = envoltorioRef.current;
        const tela = telaRef.current;
        const trilha = trilhaRef.current;
        if (!envoltorio || !tela || !trilha) return;

        setFixada(true);
        /* Ao entrar na cena a rolagem nativa some; zera para o transform
           partir do mesmo lugar em que o olho está. */
        tela.scrollLeft = 0;

        const distancia = () => Math.max(0, trilha.offsetWidth - tela.offsetWidth);

        /* Se a fileira já cabe na tela não há travessia — e uma cena que gruda
           a tela sem ter para onde andar é só uma pausa sem motivo. */
        if (distancia() <= 8) return;

        /* Quanto de rolagem a cena consome, por pixel percorrido.
           Em 1:1 uma fileira curta prende a tela por meia tela de rolagem e
           solta: lê como solavanco, não como cena. Em 1.5 a fileira anda mais
           devagar do que o dedo, a cena dura o suficiente para ser lida e o
           ritmo bate com o "lento e contemplativo" do briefing.
           (É a mesma proporção a que o era-residence chega por outro caminho:
           lá a altura do envoltório é a largura da trilha, o que dá ~1.45.) */
        const ritmo = 1.5;
        const percurso = () => distancia() * ritmo;

        const ajustarAltura = () => {
          envoltorio.style.height = `${percurso() + window.innerHeight}px`;
          /* A cena acrescenta milhares de pixels à página. O Lenis guarda o
             limite de rolagem em cache e não observa isso sozinho: sem este
             `resize()` a rolagem trava antes do fim do site — verificado, a
             página parava em 9365px de 22584px. */
          lenis()?.resize();
        };

        ajustarAltura();
        ScrollTrigger.addEventListener('refreshInit', ajustarAltura);

        const travessia = gsap.to(trilha, {
          x: () => -distancia(),
          /* `none` de propósito: a fileira é um catálogo, não uma cena
             narrativa. Quem rola espera que ela ande junto — uma curva de
             aceleração faria a trilha "não sair do lugar" no começo. O `scrub`
             já dá a inércia que tira a dureza do 1:1. */
          ease: 'none',
          scrollTrigger: {
            trigger: envoltorio,
            start: 'top top',
            end: () => `+=${percurso()}`,
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => pintarProgresso(self.progress),
          },
        });

        const st = travessia.scrollTrigger;

        /* Publicado para que um filho possa atrelar a própria revelação à
           travessia horizontal (`containerAnimation` do ScrollTrigger). */
        (envoltorio as unknown as { _travessia?: unknown })._travessia = travessia;

        /* Teclado: dentro da cena a tela não rola, então o foco pararia num
           cartão fora do campo de visão. Traduz a posição horizontal do cartão
           de volta para posição de rolagem vertical da página. */
        const aoFocar = (e: FocusEvent) => {
          const alvo = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-item-cena]');
          if (!alvo || !st) return;
          const curso = distancia();
          if (!curso) return;
          const margem = tela.offsetWidth * 0.12;
          const p = Math.min(1, Math.max(0, (alvo.offsetLeft - margem) / curso));
          const destino = st.start + p * (st.end - st.start);
          const suave = lenis();
          if (suave) suave.scrollTo(destino, { duration: 0.6 });
          else window.scrollTo({ top: destino, behavior: 'smooth' });
        };
        trilha.addEventListener('focusin', aoFocar);

        setTemCurso(distancia() > 8);

        /* As cenas acima desta (abertura, banhos) foram medidas quando a
           página ainda era mais curta. Um refresh no fim da montagem realinha
           todo mundo — e como `ajustarAltura` roda em `refreshInit`, a altura
           entra antes da medição, sem laço. */
        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          trilha.removeEventListener('focusin', aoFocar);
          ScrollTrigger.removeEventListener('refreshInit', ajustarAltura);
          st?.kill();
          travessia.kill();
          gsap.set(trilha, { clearProps: 'transform' });
          envoltorio.style.height = '';
          delete (envoltorio as unknown as { _travessia?: unknown })._travessia;
          setFixada(false);
          pintarProgresso(0);
        };
      });

      desmontar = () => mm.revert();
    })();

    return () => {
      cancelado = true;
      desmontar();
    };
  }, []);

  /* ── A fileira nativa (mobile, sem JS, movimento reduzido) ──────────── */
  useEffect(() => {
    if (fixada) return;
    const tela = telaRef.current;
    if (!tela) return;

    const medir = () => {
      const curso = tela.scrollWidth - tela.clientWidth;
      setTemCurso(curso > 8);
      pintarProgresso(curso > 0 ? tela.scrollLeft / curso : 0);
    };

    medir();
    tela.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      tela.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, [fixada]);

  const aoDescer = (e: React.PointerEvent) => {
    if (fixada || e.pointerType !== 'mouse' || !telaRef.current) return;
    arrasto.current = { ativo: true, x: e.clientX, esquerda: telaRef.current.scrollLeft };
    setArrastando(true);
  };
  const aoMover = (e: React.PointerEvent) => {
    if (!arrasto.current.ativo || !telaRef.current) return;
    telaRef.current.scrollLeft = arrasto.current.esquerda - (e.clientX - arrasto.current.x);
  };
  const aoSoltar = () => {
    arrasto.current.ativo = false;
    setArrastando(false);
  };

  return (
    <div
      ref={envoltorioRef}
      data-cena-horizontal={fixada ? 'fixada' : 'nativa'}
      className={`cena-h ${fixada ? 'is-fixada' : ''} ${className}`}
    >
      {/* O palco é o que gruda. O medidor mora dentro dele: fora, ficaria
          ancorado no fluxo logo depois da tela e só apareceria quando a cena
          já tivesse acabado. */}
      <div className="cena-h__palco">
        {/* Faixa 1 de 3: a referência de onde a pessoa está. Quando a fileira
            toma a tela inteira, o cabeçalho da seção já saiu de cena. */}
        <div className="cena-h__rotulo shell" aria-hidden="true">
          {indice ? <span className="label-quiet tnum">{indice}</span> : null}
          {indice ? <span className="h-px w-6 shrink-0 bg-[color:var(--s-line)]" /> : null}
          <span className="label">{label}</span>
        </div>

        <div
          ref={telaRef}
          role="group"
          aria-label={label}
          tabIndex={fixada ? -1 : 0}
          onPointerDown={aoDescer}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerLeave={aoSoltar}
          className={`cena-h__tela no-scrollbar ${
            arrastando
              ? 'cursor-grabbing select-none'
              : !fixada && temCurso
                ? 'md:cursor-grab'
                : ''
          }`}
        >
          <div ref={trilhaRef} className="cena-h__trilha gap-6 px-5 pb-2 sm:gap-10 sm:px-8 lg:px-12">
            {children.map((filho, i) => (
              <div
                key={i}
                data-item-cena
                className="h-full w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[34vw]"
              >
                {filho}
              </div>
            ))}
          </div>
        </div>

        {temCurso ? (
          <div className="cena-h__medidor shell">
            <div className="relative h-px w-full bg-[color:var(--s-line)]">
              <span
                ref={barraRef}
                className="absolute inset-y-0 left-0 w-full origin-left bg-[color:var(--s-accent)]"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <p className="label-quiet mt-4 flex items-center gap-2" aria-hidden="true">
              <svg width="22" height="6" viewBox="0 0 22 6" fill="none">
                <path
                  d="M0 3h20m0 0-3.2-2.6M20 3l-3.2 2.6"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
              </svg>
              {fixada ? 'Continue rolando' : 'Arraste para percorrer'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
