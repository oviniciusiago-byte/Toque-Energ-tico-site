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
}: {
  categoria: Categoria;
  quantidade?: number;
  prioridade?: boolean;
}) {
  return (
    <Link href={`/catalogo/${categoria.slug}`} className="group block">
      <div className="card-media aspect-[3/4]">
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
              'linear-gradient(to top, rgb(var(--olive-rgb) / 0.9) 0%, rgb(var(--olive-rgb) / 0.5) 38%, rgb(var(--olive-rgb) / 0.12) 100%)',
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5 text-bone sm:p-6">
          <span
            aria-hidden="true"
            className="block h-px w-8 bg-gold-soft/70 transition-[width] duration-[900ms] ease-calm group-hover:w-14"
          />
          <h3 className="display mt-4 text-d4 text-balance">{categoria.nome}</h3>
          {quantidade ? (
            <p className="mt-2 font-sans text-[0.66rem] uppercase tracking-[0.18em] text-bone/80">
              {quantidade} {quantidade === 1 ? 'produto' : 'produtos'}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
