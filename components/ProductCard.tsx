'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import Badge from '@/components/Badge';
import SaveButton from '@/components/SaveButton';
import type { Produto } from '@/lib/types';

/**
 * Card de produto. Imagem em retângulo limpo, nome em serifada itálica,
 * preço alinhado à direita numa linha com hairline — o desenho de catálogo.
 * Herda as cores da superfície da seção onde está.
 */
export default function ProductCard({
  produto,
  prioridade = false,
  className = '',
  linhaApoio,
  indice,
}: {
  produto: Produto;
  prioridade?: boolean;
  className?: string;
  /** Substitui a descrição curta (a home tem copy própria nos destaques). */
  linhaApoio?: string;
  /** Numeração editorial opcional ("01"). */
  indice?: string;
}) {
  const reduzido = useReducedMotion();
  const nome = produto.nomeCurto ?? produto.nome;

  return (
    <article className={`group relative ${className}`}>
      <SaveButton slug={produto.slug} nome={nome} />

      <Link href={`/produto/${produto.slug}`} className="block">
        <div
          className="relative aspect-[4/5] overflow-hidden"
          style={{ backgroundColor: 'var(--s-fill)' }}
        >
          <Image
            src={produto.imagens[0]}
            alt={`${produto.nome} — Toque Energético`}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 44vw, 26vw"
            priority={prioridade}
            className={`object-cover transition-transform duration-[1400ms] ease-calm ${
              reduzido ? '' : 'group-hover:scale-[1.045]'
            }`}
          />

          {indice ? (
            <span className="label-quiet tnum absolute left-4 top-4 text-sand/80 mix-blend-difference">
              {indice}
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="flex items-baseline gap-3">
            <h3 className="display text-d4 italic leading-tight">{nome}</h3>
            <span aria-hidden="true" className="mb-1 h-px flex-1 bg-[color:var(--s-line)]" />
            {produto.preco ? (
              <span className="tnum shrink-0 font-sans text-[0.8rem] tracking-wide">
                {produto.preco}
              </span>
            ) : null}
          </div>

          <p className="body mt-3 text-[0.92rem] leading-relaxed">
            {linhaApoio ?? produto.descricaoCurta}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge disponibilidade={produto.disponibilidade} />
            {produto.volume ? (
              <span className="label-quiet">{produto.volume}</span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
