'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import type { ScrollTrigger as TipoScrollTrigger } from 'gsap/ScrollTrigger';
import { carregarMotor, cascata, dur, movimentoReduzido, respiro } from '@/lib/motion';

/**
 * Revelação de texto por SplitText.
 *
 * O que muda em relação ao <Reveal>: o <Reveal> move o BLOCO inteiro — um
 * parágrafo de cinco linhas sobe como um tijolo só. Aqui o texto é fatiado e
 * cada linha (ou cada palavra, no título) sobe de dentro da própria caixa,
 * atrás de uma máscara. É a diferença entre "o elemento apareceu" e "o texto
 * foi escrito na tela".
 *
 * TRÊS VARIANTES, e o motivo de cada uma
 *
 *  · `titulo` — palavras subindo dentro da máscara da linha. Numa serifada
 *    grande, a palavra é a unidade que o olho lê; revelar palavra a palavra dá
 *    o ritmo de leitura sem virar efeito.
 *
 *  · `texto`  — linha a linha. Em corpo de leitura, palavra a palavra viraria
 *    confete; a linha é a unidade certa.
 *
 *  · `rotulo` — letra a letra, curto e discreto. Só vale porque os rótulos são
 *    caixa-alta de 3 ou 4 palavras com entreletra larga: a letra ali já é um
 *    elemento gráfico.
 *
 * Nenhuma delas gira, escala ou pisca. A cliente pediu "sofisticado sem ser
 * ostensivo" e vetou brilho e efeito mágico — a referência (era-residence) usa
 * `rotateX: 90` e `rotateY: 90` em caracteres, e isso aqui seria contra a
 * marca. O que se copia dela é a ESTRUTURA de três verbos, não o gesto.
 *
 * TRÊS VERBOS: `inicial` (esconde sem animar), `revelar`, `ocultar`. O terceiro
 * existe para a transição de página: quem sai, sai pelo lado oposto de onde
 * entrou.
 *
 * SEM JS o texto fica visível e legível — quem esconde é a classe `motor`, que
 * só entra no <html> se houver JS e o movimento não estiver reduzido.
 */

export type VarianteTexto = 'titulo' | 'texto' | 'rotulo';

type Receita = {
  divisao: { type: string; mask?: 'lines'; linesClass?: string; wordsClass?: string; charsClass?: string };
  alvo: 'lines' | 'words' | 'chars';
  inicial: gsap.TweenVars;
  revelar: gsap.TweenVars;
  ocultar: gsap.TweenVars;
};

const receitas: Record<VarianteTexto, Receita> = {
  titulo: {
    divisao: { type: 'lines,words', mask: 'lines', linesClass: 'linha', wordsClass: 'palavra' },
    alvo: 'words',
    inicial: { yPercent: 115 },
    revelar: { yPercent: 0, duration: dur.longa, ease: 'saida', stagger: 0.05 },
    ocultar: { yPercent: -115, duration: dur.curta, ease: 'entrada', stagger: 0.025 },
  },
  texto: {
    divisao: { type: 'lines', mask: 'lines', linesClass: 'linha' },
    alvo: 'lines',
    inicial: { yPercent: 110 },
    revelar: { yPercent: 0, duration: dur.media, ease: 'saida', stagger: cascata },
    ocultar: { yPercent: -110, duration: dur.curta, ease: 'entrada', stagger: cascata / 2 },
  },
  rotulo: {
    divisao: { type: 'chars', charsClass: 'letra' },
    alvo: 'chars',
    inicial: { opacity: 0, yPercent: 45 },
    revelar: { opacity: 1, yPercent: 0, duration: dur.curta, ease: 'saida', stagger: 0.016 },
    ocultar: { opacity: 0, yPercent: -45, duration: 0.28, ease: 'entrada', stagger: 0.008 },
  },
};

/* Registro dos textos já fatiados, para que a transição de página consiga
   mandar "ocultar" sem que cada componente precise expor um handle. */
type Inscrito = {
  peças: () => Element[];
  receita: Receita;
  gsap: typeof import('gsap').gsap;
};
const inscritos = new Map<HTMLElement, Inscrito>();

/** Toca a saída de todo texto já revelado que está na tela. */
export function ocultarTextosVisiveis(raiz: ParentNode = document): Promise<void> {
  const alturaTela = window.innerHeight;
  let maisLongo = 0;

  inscritos.forEach((inscrito, el) => {
    if (!raiz.contains(el)) return;
    const caixa = el.getBoundingClientRect();
    if (caixa.bottom < 0 || caixa.top > alturaTela) return;
    const peças = inscrito.peças();
    if (!peças.length) return;
    inscrito.gsap.to(peças, { ...inscrito.receita.ocultar, overwrite: true });
    const total =
      Number(inscrito.receita.ocultar.duration ?? 0) +
      Number(inscrito.receita.ocultar.stagger ?? 0) * peças.length;
    maisLongo = Math.max(maisLongo, total);
  });

  return new Promise((resolve) => setTimeout(resolve, Math.min(maisLongo, 0.7) * 1000));
}

export default function Texto({
  children,
  variante = 'texto',
  as: Tag = 'p',
  className = '',
  atraso = 0,
  ...resto
}: {
  children: ReactNode;
  variante?: VarianteTexto;
  as?: ElementType;
  className?: string;
  /** Segundos a mais antes de começar — para escalonar irmãos. */
  atraso?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || movimentoReduzido()) return;

    let limpar = () => {};
    let cancelado = false;

    (async () => {
      const { gsap, ScrollTrigger, SplitText } = await carregarMotor();
      if (cancelado || !el.textContent?.trim()) return;

      const receita = receitas[variante];
      let gatilho: TipoScrollTrigger | undefined;

      /* `autoSplit` refaz a divisão quando a fonte termina de carregar e
         quando a largura muda — que é exatamente onde a quebra de linha muda.
         Sem isso, as linhas são calculadas em cima da fonte de fallback e
         ficam erradas assim que a Fraunces entra. */
      const divisao = SplitText.create(el, {
        ...receita.divisao,
        autoSplit: true,
        aria: 'auto',
        onSplit: (self) => {
          const peças = self[receita.alvo] as Element[];
          if (!peças.length) return;

          gsap.set(peças, receita.inicial);
          el.setAttribute('data-pronto', '');

          gatilho?.kill();
          /* Uma vez só, na entrada. Um título que se re-esconde ao voltar o
             scroll cansa numa página longa. */
          gatilho = ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () =>
              gsap.to(peças, { ...receita.revelar, delay: respiro + atraso, overwrite: true }),
          });

          inscritos.set(el as HTMLElement, {
            peças: () => self[receita.alvo] as Element[],
            receita,
            gsap,
          });
        },
      });

      limpar = () => {
        gatilho?.kill();
        inscritos.delete(el as HTMLElement);
        divisao.revert();
        el.removeAttribute('data-pronto');
      };
    })();

    return () => {
      cancelado = true;
      limpar();
    };
  }, [variante, atraso]);

  const Comp = Tag as ElementType;
  return (
    <Comp ref={ref} data-texto={variante} className={className} {...resto}>
      {children}
    </Comp>
  );
}
