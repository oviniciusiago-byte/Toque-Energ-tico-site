import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';
import Texto from '@/components/Texto';

/**
 * Cabeçalho de seção: índice + rótulo + título + intro, com uma ação opcional
 * alinhada à direita. Mantém o mesmo ritmo em todas as seções do site.
 */
export default function SectionHead({
  capitulo,
  indice,
  label,
  titulo,
  intro,
  acao,
  meta,
  alinhamento = 'left',
  tamanho = 'd2',
  as: Tag = 'h2',
  className = '',
}: {
  /** "Capítulo I · Sombra" — a narrativa da marca, escrita na página. */
  capitulo?: string;
  /** "01", "02"… — numeração editorial das seções */
  indice?: string;
  label?: string;
  titulo: ReactNode;
  intro?: string;
  acao?: ReactNode;
  /** Linha de especificação (preço da linha, disponibilidade) — vai abaixo da intro. */
  meta?: string;
  alinhamento?: 'left' | 'center';
  tamanho?: 'd1' | 'd2' | 'd3';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const centro = alinhamento === 'center';
  // classes literais: o scanner do Tailwind não enxerga template strings
  const escala = { d1: 'text-d1', d2: 'text-d2', d3: 'text-d3' }[tamanho];

  return (
    <div
      className={`${centro ? 'flex flex-col items-center text-center' : 'flex flex-col gap-8 md:flex-row md:items-end md:justify-between'} ${className}`}
    >
      <div className="max-w-[46rem]">
        {capitulo ? (
          <Texto
            variante="rotulo"
            as="p"
            className={`label-quiet mb-5 ${centro ? 'text-center' : ''}`}
            style={{ letterSpacing: '0.3em' }}
          >
            {capitulo}
          </Texto>
        ) : null}

        {/* Índice + fio + rótulo continuam no <Reveal>: a linha entre eles é
            decorativa e não é texto, então fatiar aqui só criaria um caso
            especial. O bloco sobe inteiro, que é o certo para uma marca de
            três elementos. */}
        {(indice || label) && (
          <Reveal>
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${
                centro ? 'justify-center' : ''
              }`}
            >
              {indice ? <span className="label-quiet tnum">{indice}</span> : null}
              {indice && label ? (
                <span
                  aria-hidden="true"
                  className="h-px w-6 shrink-0 bg-[color:var(--s-line)]"
                />
              ) : null}
              {label ? <span className="label">{label}</span> : null}
            </div>
          </Reveal>
        )}

        <Texto variante="titulo" as={Tag} className={`display ${escala} mt-6 text-balance`}>
          {titulo}
        </Texto>

        {intro ? (
          <Texto
            variante="texto"
            as="p"
            atraso={0.08}
            className={`lede mt-6 max-w-prose text-pretty ${centro ? 'mx-auto' : ''}`}
          >
            {intro}
          </Texto>
        ) : null}

        {meta ? (
          <Texto
            variante="texto"
            as="p"
            atraso={0.14}
            className={`label-quiet mt-7 border-t pt-5 ${centro ? 'mx-auto inline-block' : ''}`}
            style={{ borderColor: 'var(--s-line)' }}
          >
            {meta}
          </Texto>
        ) : null}
      </div>

      {acao ? (
        <Reveal delay={0.2} className={centro ? 'mt-10' : 'shrink-0'}>
          {acao}
        </Reveal>
      ) : null}
    </div>
  );
}
