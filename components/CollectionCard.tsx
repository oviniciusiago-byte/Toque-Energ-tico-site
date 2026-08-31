import Image from 'next/image';
import Link from 'next/link';
import type { Categoria } from '@/lib/types';

/**
 * Cartão de coleção — mesma anatomia do ProductCard, para que os dois possam
 * aparecer na mesma fileira sem desalinhar: no lugar do preço vai a contagem,
 * e no lugar do badge de disponibilidade vai a etiqueta "Coleção".
 *
 * Diferente do CategoryCard (que escreve o nome sobre a foto), aqui o texto
 * fica embaixo — é o que garante o alinhamento linha por linha.
 */
export default function CollectionCard({
  categoria,
  quantidade,
  descricao,
  prioridade = false,
}: {
  categoria: Categoria;
  quantidade: number;
  descricao: string;
  prioridade?: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/catalogo/${categoria.slug}`} className="flex h-full flex-col">
        <div className="card-media aspect-[4/5]">
          <Image
            src={categoria.capa}
            alt={`${categoria.nome} — Toque Energético`}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 26vw"
            priority={prioridade}
            className="object-cover transition-transform duration-[1400ms] ease-calm group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="card-title-row">
            <span className="card-name display text-d4 italic leading-tight">
              {categoria.nomeCurto ?? categoria.nome}
            </span>
            <span
              aria-hidden="true"
              className="mb-[0.35em] h-px flex-1 bg-[color:var(--s-line)]"
            />
            <span className="tnum shrink-0 font-sans text-[0.82rem] tracking-wide">
              {quantidade} itens
            </span>
          </h3>

          <p className="card-desc mt-3">{descricao}</p>

          <div className="card-meta">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.16em]"
              style={{ borderColor: 'var(--s-line)', color: 'var(--s-accent)' }}
            >
              <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-current" />
              Coleção
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
