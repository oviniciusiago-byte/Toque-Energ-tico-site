import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Accordion from '@/components/Accordion';
import Badge from '@/components/Badge';
import DragRow from '@/components/DragRow';
import { Estrela } from '@/components/Logo';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import StickyBuyBar from '@/components/StickyBuyBar';

import { getCategoria } from '@/content/categorias';
import { getProduto, getRelacionados, produtos } from '@/content/produtos';
import { disponibilidades } from '@/content/site';
import { wppLink, wppMsg } from '@/lib/whatsapp';

export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) return {};
  return { title: p.nome, description: p.descricaoCurta };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produto = getProduto(slug);
  if (!produto) notFound();

  const categoria = getCategoria(produto.categoria);
  const relacionados = getRelacionados(produto);
  const info = disponibilidades[produto.disponibilidade];

  // Banhos e óleos herdam modo de uso e cuidados do bloco da categoria.
  const modoDeUso = produto.modoDeUso ?? categoria?.modoDeUsoLinha;
  const cuidados = produto.cuidados ?? categoria?.cuidadosLinha;

  const mensagem =
    produto.disponibilidade === 'sob-consulta'
      ? wppMsg.sobConsulta(produto.nome)
      : produto.disponibilidade === 'sazonal'
        ? wppMsg.sazonal(produto.nome)
        : wppMsg.produto(produto.nome, produto.volume, produto.preco);

  const ctaLabel =
    produto.disponibilidade === 'pronta-entrega' ? 'Pedir no WhatsApp' : 'Conversar no WhatsApp';

  /** Ficha técnica em linhas rótulo/valor. */
  const ficha = [
    produto.volume ? { rotulo: 'Volume', valor: produto.volume } : null,
    produto.aroma ? { rotulo: 'Notas de aroma', valor: produto.aroma } : null,
    categoria ? { rotulo: 'Linha', valor: categoria.nome } : null,
    { rotulo: 'Disponibilidade', valor: info.label },
  ].filter(Boolean) as { rotulo: string; valor: string }[];

  /** Detalhes em acordeão (referência: página de produto da Soho Skin). */
  const detalhes = [
    produto.composicao
      ? { pergunta: 'Composição', resposta: <p>{produto.composicao}</p> }
      : null,
    modoDeUso ? { pergunta: 'Modo de uso', resposta: <p>{modoDeUso}</p> } : null,
    cuidados
      ? {
          pergunta: 'Cuidados e avisos',
          resposta: (
            <>
              <p>{cuidados}</p>
              <p className="mt-4 text-[0.85rem] opacity-70">
                Produto artesanal de autocuidado. Não substitui acompanhamento profissional.
              </p>
            </>
          ),
        }
      : null,
    {
      pergunta: 'Pedido, envio e pagamento',
      resposta: (
        <p>
          O pedido é fechado pelo WhatsApp. O frete é calculado à parte, conforme o seu
          endereço, e combinado junto com a forma de pagamento.
        </p>
      ),
    },
  ].filter(Boolean) as { pergunta: string; resposta: React.ReactNode }[];

  return (
    <>
      <article>
        {/* ── Galeria + compra ─────────────────────────────────── areia ── */}
        <Section surface="sand" padding="none">
          <div className="shell pb-block pt-32 sm:pt-40">
            <Reveal>
              <nav aria-label="Você está em" className="mb-10">
                <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.66rem] uppercase tracking-[0.16em] text-[color:var(--s-faint)]">
                  <li>
                    <Link href="/catalogo" className="link-quiet">
                      Catálogo
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  {categoria ? (
                    <li>
                      <Link href={`/catalogo/${categoria.slug}`} className="link-quiet">
                        {categoria.nomeCurto ?? categoria.nome}
                      </Link>
                    </li>
                  ) : null}
                </ol>
              </nav>
            </Reveal>

            <div className="grid-12 gap-y-14">
              <div className="col-span-4 md:col-span-7">
                <Reveal>
                  <ProductGallery imagens={produto.imagens} nome={produto.nome} />
                </Reveal>
              </div>

              <div className="col-span-4 md:col-span-4 md:col-start-9">
                <div className="md:sticky md:top-28">
                  <Reveal>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge disponibilidade={produto.disponibilidade} comNota />
                      {produto.terapeutico ? (
                        <span className="label-quiet">Terapêutico</span>
                      ) : null}
                    </div>
                  </Reveal>

                  <Reveal delay={0.06}>
                    <h1 className="display mt-6 text-d2 text-balance">{produto.nome}</h1>
                  </Reveal>

                  <Reveal delay={0.12}>
                    <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                      {produto.conceito.map((palavra, i) => (
                        <li key={palavra} className="flex items-center gap-3">
                          {i > 0 ? (
                            <span aria-hidden="true" className="opacity-40">
                              ·
                            </span>
                          ) : null}
                          <span className="label">{palavra}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <p className="lede mt-8 text-pretty">{produto.descricaoCurta}</p>
                  </Reveal>

                  <Reveal delay={0.24}>
                    <div
                      className="mt-9 flex items-baseline gap-4 border-t pt-7"
                      style={{ borderColor: 'var(--s-line)' }}
                    >
                      {produto.preco ? (
                        <p className="display tnum text-d3">{produto.preco}</p>
                      ) : null}
                      {produto.volume ? <p className="label-quiet">{produto.volume}</p> : null}
                    </div>
                  </Reveal>

                  <Reveal delay={0.3}>
                    <a
                      href={wppLink(mensagem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-solid mt-8 w-full"
                    >
                      {ctaLabel}
                    </a>
                    <p className="body mt-4 text-[0.82rem]">
                      {info.label} — {info.descricao} O frete é combinado pelo WhatsApp, conforme
                      o seu endereço.
                    </p>
                  </Reveal>

                  {produto.comoAdquirir ? (
                    <Reveal delay={0.36}>
                      <p
                        className="mt-6 border-t pt-6 font-sans text-[0.85rem] leading-relaxed text-[color:var(--s-muted)]"
                        style={{ borderColor: 'var(--s-line)' }}
                      >
                        {produto.comoAdquirir}
                      </p>
                    </Reveal>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Para que serve ──────────────────────────────────── creme ── */}
        <Section surface="cream" padding="loose">
          <div className="shell">
            <div className="grid-12 gap-y-10">
              <div className="col-span-4 md:col-span-3">
                <Reveal>
                  <p className="label">Para que serve</p>
                </Reveal>
              </div>
              <div className="col-span-4 md:col-span-8 md:col-start-5">
                <Reveal delay={0.08}>
                  <p className="display max-w-[44rem] text-d4 text-pretty">
                    {produto.intencao}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Ficha + detalhes ────────────────────────────────── areia ── */}
        <Section surface="sand" padding="loose">
          <div className="shell">
            <div className="grid-12 gap-y-14">
              <div className="col-span-4 md:col-span-4">
                <Reveal>
                  <p className="label">Ficha</p>
                </Reveal>
                <RevealGroup className="mt-8" stagger={0.06}>
                  {ficha.map((linha) => (
                    <RevealItem
                      key={linha.rotulo}
                      className="flex items-baseline justify-between gap-6 border-b border-[color:var(--s-line)] py-4"
                    >
                      <span className="label-quiet">{linha.rotulo}</span>
                      <span className="font-sans text-[0.9rem] text-right text-[color:var(--s-fg)]">
                        {linha.valor}
                      </span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>

              <div className="col-span-4 md:col-span-7 md:col-start-6">
                <Reveal>
                  <p className="label">Detalhes</p>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="mt-8">
                    <Accordion itens={detalhes} abertoInicial={0} tamanho="medio" />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Frase de fechamento ──────────────────────────── madeira ── */}
        {produto.fechamento ? (
          <Section surface="wood" padding="loose" texture>
            <div className="shell relative">
              <Reveal>
                <div className="mx-auto flex max-w-[36rem] flex-col items-center text-center">
                  <Estrela size={24} className="text-[color:var(--s-accent)]" />
                  <p className="display mt-8 text-d2 italic text-balance">
                    {produto.fechamento}
                  </p>
                </div>
              </Reveal>
            </div>
          </Section>
        ) : null}
      </article>

      {/* ── Relacionados ────────────────────────────────────── creme ── */}
      {relacionados.length ? (
        <Section surface="cream" padding="loose">
          <div className="shell">
            <SectionHead
              titulo="Talvez combine"
              tamanho="d3"
              acao={
                categoria ? (
                  <Link href={`/catalogo/${categoria.slug}`} className="btn btn-outline">
                    Ver {categoria.nomeCurto ?? categoria.nome}
                  </Link>
                ) : undefined
              }
            />
            <div className="mt-14">
              <DragRow label="Produtos relacionados">
                {relacionados.map((p) => (
                  <ProductCard key={p.slug} produto={p} />
                ))}
              </DragRow>
            </div>
          </div>
        </Section>
      ) : null}

      <StickyBuyBar
        nome={produto.nomeCurto ?? produto.nome}
        preco={produto.preco}
        volume={produto.volume}
        mensagem={mensagem}
        cta="WhatsApp"
      />
    </>
  );
}
