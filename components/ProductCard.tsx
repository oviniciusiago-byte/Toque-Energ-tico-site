'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import Badge from '@/components/Badge';
import SaveButton from '@/components/SaveButton';
import type { Produto } from '@/lib/types';

/**
 * Cartão de produto.
 *
 * A anatomia é FIXA e compartilhada com o CollectionCard:
 *   mídia 4:5 → nome + régua + preço → descrição de 2 linhas (altura
 *   reservada) → metadados.
 *
 * A altura reservada da descrição (`.card-desc`) é o que mantém a régua de
 * metadados na mesma linha em todos os cartões de uma fileira, mesmo quando um
 * texto ocupa uma linha e o outro ocupa duas.
 */
export default function ProductCard({
  produto,
  prioridade = false,
  className = '',
  linhaApoio,
}: {
  produto: Produto;
  prioridade?: boolean;
  className?: string;
  /** Substitui a descrição curta (a home tem copy própria nos destaques). */
  linhaApoio?: string;
}) {
  const reduzido = useReducedMotion();
  const nome = produto.nomeCurto ?? produto.nome;

  return (
    <article className={`group relative flex h-full flex-col ${className}`}>
      <SaveButton slug={produto.slug} nome={nome} />

      <Link href={`/produto/${produto.slug}`} className="flex h-full flex-col">
        <div className="card-media aspect-[4/5]">
          <Image
            src={produto.imagens[0]}
            alt={`${produto.nome} — Toque Energético`}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 26vw"
            priority={prioridade}
            className={`object-cover transition-transform duration-[1400ms] ease-calm ${
              reduzido ? '' : 'group-hover:scale-[1.04]'
            }`}
          />
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="card-title-row">
            <span className="card-name display text-d4 italic leading-tight">{nome}</span>
            <span
              aria-hidden="true"
              className="mb-[0.35em] h-px flex-1 bg-[color:var(--s-line)]"
            />
            {produto.preco ? (
              <span className="tnum shrink-0 font-sans text-[0.82rem] tracking-wide">
                {produto.preco}
              </span>
            ) : null}
          </h3>

          <p className="card-desc mt-3">{linhaApoio ?? produto.descricaoCurta}</p>

          <div className="card-meta">
            <Badge disponibilidade={produto.disponibilidade} />
            {produto.volume ? <span className="label-quiet">{produto.volume}</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
