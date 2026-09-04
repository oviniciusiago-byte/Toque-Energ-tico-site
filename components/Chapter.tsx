import type { ReactNode } from 'react';
import Star from '@/components/Star';

/**
 * Marcador de capítulo. A narrativa que a marca pediu — "sombra e
 * recolhimento → presença e descoberta → luz e expressão" — deixa de ser
 * só uma intenção de cor e passa a estar escrita na página.
 */
export default function Chapter({
  numero,
  nome,
  frase,
  children,
}: {
  /** "I", "II", "III" */
  numero: string;
  nome: string;
  frase?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Star size={17} orbita={false} className="text-[color:var(--s-accent)]" />
      <p className="label mt-6">
        Capítulo {numero} · {nome}
      </p>
      {frase ? (
        <p className="display mt-6 max-w-[34rem] text-d4 italic text-balance">{frase}</p>
      ) : null}
      {children}
    </div>
  );
}
