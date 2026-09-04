'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import type { ScrollTrigger as TipoScrollTrigger } from 'gsap/ScrollTrigger';
import { carregarMotor, cascata, dur, movimentoReduzido, respiro } from '@/lib/motion';

/**
 * Revelação de texto por SplitText — o texto entra desfocado e vem para o
 * foco, subindo um fio (blur in up).
 *
 * O que muda em relação ao <Reveal>: o <Reveal> move o BLOCO inteiro — um
 * parágrafo de cinco linhas sobe como um tijolo só. Aqui o texto é fatiado e
 * cada pedaço entra no seu tempo.
 *
 * POR QUE DESFOQUE E NÃO MÁSCARA
 * A versão anterior revelava por máscara: o pedaço subia de dentro de uma
 * caixa com `overflow: clip`. Máscara e desfoque não convivem — o `clip`
 * corta justamente o halo do blur e o efeito vira um borrão cortado em
 * retângulo. Ao trocar o gesto, a máscara saiu.
 *
 * TRÊS VARIANTES, e a unidade de cada uma
 *
 *  · `titulo` — letra a letra. Numa serifada grande cada letra tem desenho
 *    próprio, e o foco chegando letra a letra é o que dá a leitura de algo
 *    sendo escrito.
 *
 *  · `texto`  — palavra a palavra. Em corpo de leitura a letra é pequena
 *    demais para o desfoque se distinguir, e há um custo real: `filter:
 *    blur()` promove CADA pedaço a uma camada de composição própria. Um
 *    parágrafo de 250 caracteres viraria 250 camadas animando ao mesmo tempo.
 *    Por palavra são ~40, com o mesmo resultado visível.
 *
 *  · `rotulo` — letra a letra, curto e discreto.
 *
 * A unidade pode ser forçada por `unidade` em qualquer lugar.
 *
 * IDA E VOLTA: revela ao entrar, e ao rolar PARA CIMA de volta o texto
 * desfoca e sai pelo lado oposto de onde entrou. O estado é guardado (
 * `visivel`), então passar pelo mesmo texto de novo não reinicia a animação
 * do nada.
 *
 * SEM JS o texto nasce visível e continua legível: quem autoriza esconder é a
 * classe `motor`, que só entra no <html> se houver JS e o movimento não
 * estiver reduzido.
 */

export type VarianteTexto = 'titulo' | 'texto' | 'rotulo';
export type UnidadeTexto = 'char' | 'palavra' | 'linha';

/** Quanto de desfoque no estado escondido, por unidade. */
const desfoque: Record<UnidadeTexto, number> = { char: 10, palavra: 9, linha: 8 };

type Receita = {
  unidade: UnidadeTexto;
  distancia: number;
  duracao: number;
  passo: number;
};

const receitas: Record<VarianteTexto, Receita> = {
  titulo: { unidade: 'char', distancia: 22, duracao: dur.longa, passo: 0.022 },
  texto: { unidade: 'palavra', distancia: 16, duracao: dur.media, passo: 0.018 },
  rotulo: { unidade: 'char', distancia: 12, duracao: dur.curta, passo: 0.014 },
};

const divisoes: Record<UnidadeTexto, { type: string; alvo: 'chars' | 'words' | 'lines' }> = {
  char: { type: 'chars', alvo: 'chars' },
  palavra: { type: 'words', alvo: 'words' },
  linha: { type: 'lines', alvo: 'lines' },
};

/* Registro dos textos fatiados, para a transição de página conseguir mandar
   "ocultar" sem que cada componente precise expor um handle. */
type Inscrito = { ocultar: () => number };
const inscritos = new Map<HTMLElement, Inscrito>();

/** Toca a saída de todo texto revelado que está na tela. Devolve a duração. */
export function ocultarTextosVisiveis(raiz: ParentNode = document): Promise<void> {
  const alturaTela = window.innerHeight;
  let maisLongo = 0;
  inscritos.forEach((inscrito, el) => {
    if (!raiz.contains(el)) return;
    const caixa = el.getBoundingClientRect();
    if (caixa.bottom < 0 || caixa.top > alturaTela) return;
    maisLongo = Math.max(maisLongo, inscrito.ocultar());
  });
  return new Promise((r) => setTimeout(r, Math.min(maisLongo, 0.7) * 1000));
}

export default function Texto({
  children,
  variante = 'texto',
  unidade,
  as: Tag = 'p',
  className = '',
  atraso = 0,
  ...resto
}: {
  children: ReactNode;
  variante?: VarianteTexto;
  /** Força a unidade de fatiamento, ignorando o padrão da variante. */
  unidade?: UnidadeTexto;
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
      const uni = unidade ?? receita.unidade;
      const { type, alvo } = divisoes[uni];
      const blur = desfoque[uni];

      let gatilho: TipoScrollTrigger | undefined;
      let visivel = false;

      const divisao = SplitText.create(el, {
        type,
        tag: 'span',
        charsClass: 'fatia',
        wordsClass: 'fatia',
        linesClass: 'fatia',
        autoSplit: true,
        aria: 'auto',
        onSplit: (self) => {
          const peças = self[alvo] as Element[];
          if (!peças.length) return;

          const escondido = { opacity: 0, filter: `blur(${blur}px)`, y: receita.distancia };

          gsap.set(peças, escondido);
          el.setAttribute('data-pronto', '');
          visivel = false;

          const revelar = () => {
            if (visivel) return;
            visivel = true;
            gsap.to(peças, {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: receita.duracao,
              delay: respiro + atraso,
              stagger: receita.passo,
              ease: 'saida',
              overwrite: true,
              /* Tira o filtro no fim. Um `filter` ativo mantém cada pedaço
                 numa camada de composição própria para sempre; num texto
                 fatiado isso são dezenas de camadas paradas consumindo
                 memória de GPU pelo resto da sessão. */
              onComplete: () => gsap.set(peças, { filter: 'none', willChange: 'auto' }),
            });
          };

          const ocultar = () => {
            if (!visivel) return 0;
            visivel = false;
            gsap.to(peças, {
              opacity: 0,
              filter: `blur(${blur}px)`,
              y: -receita.distancia,
              duration: dur.curta,
              stagger: receita.passo / 2,
              ease: 'entrada',
              overwrite: true,
            });
            return dur.curta + (receita.passo / 2) * peças.length;
          };

          gatilho?.kill();
          gatilho = ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: revelar,
            /* Voltando de baixo para cima, o texto reaparece — mas só se
               estiver escondido, senão a animação reiniciaria à toa. */
            onEnterBack: revelar,
            /* Rolando PARA CIMA além do começo: o texto desfoca e sai por
               cima, o oposto de por onde entrou. */
            onLeaveBack: ocultar,
          });

          inscritos.set(el as HTMLElement, { ocultar });
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
  }, [variante, unidade, atraso]);

  const Comp = Tag as ElementType;
  return (
    <Comp ref={ref} data-texto={variante} className={className} {...resto}>
      {children}
    </Comp>
  );
}
