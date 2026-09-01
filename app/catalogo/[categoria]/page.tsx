import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import EditorialSplit from '@/components/EditorialSplit';
import ProductCard from '@/components/ProductCard';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { categoriasVisiveis, getCategoria } from '@/content/categorias';
import { produtosPorCategoria } from '@/content/produtos';
import { wppMsg } from '@/lib/whatsapp';

/** Rotas geradas só para as categorias visíveis (Velas fica de fora). */
export function generateStaticParams() {
  return categoriasVisiveis.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const c = getCategoria(categoria);
  if (!c) return {};
  return { title: c.nome, description: c.intro };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria: slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria || categoria.oculta) notFound();

  const itens = produtosPorCategoria(categoria.slug);
  const outras = categoriasVisiveis.filter((c) => c.slug !== categoria.slug);
  const indice = categoriasVisiveis.findIndex((c) => c.slug === categoria.slug) + 1;

  return (
    <>
      {/* Cabeçalho — bloco escuro, nome grande.
          Linhas com acento próprio (Brumas → verde Tiffany) sobrescrevem só o
          token de acento; o resto da superfície continua igual. */}
      <Section surface="olive" padding="none" texture>
        <div
          className="shell relative pb-block-sm pt-40 sm:pt-48"
          style={
            categoria.acento === 'tiffany'
              ? ({ '--s-accent': 'var(--tiffany)' } as React.CSSProperties)
              : undefined
          }
        >
          <Reveal>
            <nav aria-label="Você está em" className="mb-10">
              <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.66rem] uppercase tracking-[0.16em] text-[color:var(--s-faint)]">
                <li>
                  <Link href="/catalogo" className="link-quiet">
                    Catálogo
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[color:var(--s-muted)]">{categoria.nomeCurto ?? categoria.nome}</li>
              </ol>
            </nav>
          </Reveal>

          <SectionHead
            as="h1"
            tamanho="d1"
            indice={String(indice).padStart(2, '0')}
            label="Linha"
            titulo={categoria.nome}
            intro={categoria.intro}
            meta={categoria.notaLinha}
          />
        </div>
      </Section>

      {/* Grid da linha */}
      <Section surface="bone" padding="loose">
        <div className="shell">
          {itens.length ? (
            <RevealGroup
              className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.08}
            >
              {itens.map((p, i) => (
                <RevealItem key={p.slug}>
                  <ProductCard produto={p} prioridade={i < 3} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <p className="lede">
              Em breve. Fale com a gente pelo WhatsApp para saber o que há disponível agora.
            </p>
          )}
        </div>
      </Section>

      {/* Modo de uso da linha — split editorial */}
      {categoria.modoDeUsoLinha ? (
        <EditorialSplit
          surface="moss"
          imagem={`/images/editorial/${categoria.slug}.jpg`}
          alt={categoria.nome}
          label="Toda a linha"
          titulo={`Como usar ${categoria.nomeCurto ?? categoria.nome}`}
          texto={categoria.modoDeUsoLinha}
          ladoImagem="right"
        />
      ) : null}

      {/* Cuidados da linha */}
      {categoria.cuidadosLinha ? (
        <Section surface="tan" padding="normal">
          <div className="shell">
            <div className="grid-12 gap-y-8">
              <div className="col-span-4 md:col-span-3">
                <Reveal>
                  <p className="label">Cuidados</p>
                </Reveal>
              </div>
              <div className="col-span-4 md:col-span-8 md:col-start-5">
                <Reveal delay={0.08}>
                  <p className="body max-w-prose">{categoria.cuidadosLinha}</p>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Outras linhas */}
      <Section surface="bone" padding="loose">
        <div className="shell">
          <SectionHead titulo="Outras linhas" tamanho="d3" />
          <RevealGroup
            className="mt-12 flex flex-wrap gap-3"
            stagger={0.05}
          >
            {outras.map((c) => (
              <RevealItem key={c.slug}>
                <Link
                  href={`/catalogo/${c.slug}`}
                  className="inline-flex rounded-full border px-5 py-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-500 ease-calm hover:border-[color:var(--s-fg)]"
                  style={{ borderColor: 'var(--s-line)' }}
                >
                  {c.nomeCurto ?? c.nome}
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <WhatsAppCTA
        surface="noir"
        label="Pedidos e dúvidas"
        titulo="Fale com a gente"
        texto={`Combinamos disponibilidade, envio e pagamento da linha ${categoria.nomeCurto ?? categoria.nome} pelo WhatsApp.`}
        cta="Falar no WhatsApp"
        mensagem={wppMsg.categoria(categoria.nome)}
      />
    </>
  );
}
