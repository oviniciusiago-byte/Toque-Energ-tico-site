import type { Metadata } from 'next';
import Link from 'next/link';

import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { categoriasVisiveis } from '@/content/categorias';
import { produtos, produtosPorCategoria } from '@/content/produtos';
import { disponibilidades, paginas } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Catálogo',
  description: paginas.catalogo.intro,
};

/**
 * Catálogo completo — todas as linhas numa página só, com navegação fixa por
 * categoria (referência: "The Full Range" da Soho Skin). Os blocos alternam
 * areia e creme para separar as linhas visualmente.
 */
export default function CatalogoPage() {
  return (
    <>
      {/* Cabeçalho — bloco escuro */}
      <Section surface="charcoal" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label="Catálogo"
            titulo={paginas.catalogo.h1}
            intro={paginas.catalogo.intro}
          />

          {/* Legenda de disponibilidade */}
          <Reveal delay={0.22}>
            <dl className="mt-14 grid gap-6 border-t pt-8 sm:grid-cols-3" style={{ borderColor: 'var(--s-line)' }}>
              {Object.entries(disponibilidades).map(([chave, info]) => (
                <div key={chave}>
                  <dt className="label">{info.label}</dt>
                  <dd className="body mt-3 text-[0.9rem]">{info.descricao}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="label-quiet tnum mt-10">
              {produtos.length} produtos · {categoriasVisiveis.length} linhas
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Navegação por categoria — fixa ao rolar */}
      <CategoryNav
        itens={categoriasVisiveis.map((c) => ({
          slug: c.slug,
          nome: c.nomeCurto ?? c.nome,
        }))}
      />

      {/* Uma faixa por linha, alternando areia/creme */}
      {categoriasVisiveis.map((categoria, i) => {
        const itens = produtosPorCategoria(categoria.slug);
        return (
          <Section
            key={categoria.slug}
            id={categoria.slug}
            surface={i % 2 === 0 ? 'sand' : 'cream'}
            padding="loose"
            className="scroll-mt-24"
          >
            <div className="shell">
              <SectionHead
                indice={String(i + 1).padStart(2, '0')}
                label="Linha"
                titulo={categoria.nome}
                intro={categoria.intro}
                meta={categoria.notaLinha}
                acao={
                  <Link href={`/catalogo/${categoria.slug}`} className="btn btn-outline">
                    Ver a linha
                  </Link>
                }
              />

              <RevealGroup
                className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 sm:mt-20"
                stagger={0.07}
              >
                {itens.map((p, j) => (
                  <RevealItem key={p.slug}>
                    <ProductCard produto={p} prioridade={i === 0 && j < 4} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Section>
        );
      })}

      <WhatsAppCTA
        surface="wood"
        label="Ajuda para escolher"
        titulo="Não sabe por onde começar?"
        texto="Conte o que você está procurando — um aroma, um momento do dia, um presente — e a gente sugere o caminho."
        cta="Falar no WhatsApp"
        mensagem={wppMsg.geral}
      />
    </>
  );
}
