import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';

/**
 * Cabeçalho de seção: índice + rótulo + título + intro, com uma ação opcional
 * alinhada à direita. Mantém o mesmo ritmo em todas as seções do site.
 */
export default function SectionHead({
  indice,
  label,
  titulo,
  intro,
  acao,
  alinhamento = 'left',
  tamanho = 'd2',
  as: Tag = 'h2',
  className = '',
}: {
  /** "01", "02"… — numeração editorial das seções */
  indice?: string;
  label?: string;
  titulo: ReactNode;
  intro?: string;
  acao?: ReactNode;
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
      <div className={centro ? 'max-w-[46rem]' : 'max-w-[46rem]'}>
        {(indice || label) && (
          <Reveal>
            <div
              className={`flex items-center gap-3 ${centro ? 'justify-center' : ''}`}
            >
              {indice ? <span className="label-quiet tnum">{indice}</span> : null}
              {indice && label ? (
                <span
                  aria-hidden="true"
                  className="h-px w-6 bg-[color:var(--s-line)]"
                />
              ) : null}
              {label ? <span className="label">{label}</span> : null}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.07}>
          <Tag className={`display ${escala} mt-6 text-balance`}>{titulo}</Tag>
        </Reveal>

        {intro ? (
          <Reveal delay={0.14}>
            <p className={`lede mt-6 max-w-prose text-pretty ${centro ? 'mx-auto' : ''}`}>
              {intro}
            </p>
          </Reveal>
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
