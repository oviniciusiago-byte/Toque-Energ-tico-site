import Image from 'next/image';
import Link from 'next/link';
import type { Categoria } from '@/lib/types';

/**
 * Card de categoria. Imagem + nome sobre a base escurecida, com contador de
 * produtos e uma hairline que cresce no hover.
 */
export default function CategoryCard({
  categoria,
  quantidade,
  prioridade = false,
  indice,
  proporcao = 'aspect-[3/4]',
}: {
  categoria: Categoria;
  quantidade?: number;
  prioridade?: boolean;
  indice?: string;
  proporcao?: string;
}) {
  return (
    <Link href={`/catalogo/${categoria.slug}`} className="group block">
      <div
        className={`relative overflow-hidden ${proporcao}`}
        style={{ backgroundColor: 'var(--s-fill)' }}
      >
        <Image
          src={categoria.capa}
          alt={categoria.nome}
          fill
          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 45vw, 32vw"
          priority={prioridade}
          className="object-cover transition-transform duration-[1600ms] ease-calm group-hover:scale-[1.05]"
        />

        {/* legibilidade garantida mesmo sobre foto clara */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgb(var(--charcoal-rgb) / 0.88) 0%, rgb(var(--charcoal-rgb) / 0.34) 45%, rgb(var(--charcoal-rgb) / 0.06) 100%)',
          }}
        />

        {indice ? (
          <span className="absolute left-5 top-5 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-sand/70">
            {indice}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5 text-sand sm:p-6">
          <span
            aria-hidden="true"
            className="block h-px w-8 bg-gold-soft/70 transition-[width] duration-[900ms] ease-calm group-hover:w-14"
          />
          <h3 className="display mt-4 text-d4 text-balance">{categoria.nome}</h3>
          {quantidade ? (
            <p className="mt-2 font-sans text-[0.64rem] uppercase tracking-[0.18em] text-sand/60">
              {quantidade} {quantidade === 1 ? 'produto' : 'produtos'}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
