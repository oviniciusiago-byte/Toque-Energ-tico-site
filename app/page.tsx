import Link from 'next/link';

import CategoryCard from '@/components/CategoryCard';
import CollectionCard from '@/components/CollectionCard';
import CircleFrame from '@/components/CircleFrame';
import DragRow from '@/components/DragRow';
import EditorialSplit from '@/components/EditorialSplit';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Star from '@/components/Star';
import WhatsAppCTA from '@/components/WhatsAppCTA';

import { categoriasVisiveis, getCategoria } from '@/content/categorias';
import { contagemPorCategoria, produtosDestaque } from '@/content/produtos';
import { home, paginas, valores } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

/**
 * HOME — oito seções, na ordem que a marca pediu:
 * abertura · manifesto · destaques · catálogo · história · rituais ·
 * depoimentos · fechamento.
 *
 * A jornada de cor segue "sombra e recolhimento → presença e descoberta →
 * luz e expressão": abre no oliva profundo, passa pelo cimento (cenário dos
 * produtos) e pelo musgo, e termina na luz do creme com a estrela.
 */
export default function HomePage() {
  const destaques = produtosDestaque();
  const banhos = getCategoria('banhos-escalda-pes')!;
  const rituais = paginas.rituais.blocos.slice(0, 3);

  return (
    <>
      {/* ── 1 · Abertura ─────────────────── oliva + textura fluida verde ── */}
      <Hero />

      {/* ── 2 · Manifesto curto ────────────────────────────────── creme ── */}
      <Section surface="bone" padding="loose">
        <div className="shell">
          <div className="grid-12 items-start gap-y-10">
            <div className="col-span-4 md:col-span-3">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="label-quiet tnum">01</span>
                  <span aria-hidden="true" className="h-px w-6 bg-[color:var(--s-line)]" />
                  <span className="label">{home.manifestoCurto.label}</span>
                </div>
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-9">
              <Reveal delay={0.08}>
                <p className="display text-d3 text-balance">{home.manifestoCurto.frase}</p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="lede mt-8 max-w-prose text-pretty">
                  {home.manifestoCurto.texto}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3 · Produtos em destaque ────────────────────────────── Tan ──── */}
      <Section surface="tan" padding="loose">
        <div className="shell">
          <SectionHead
            indice="02"
            label={home.destaques.kicker}
            titulo={home.destaques.titulo}
            acao={
              <Link href={home.destaques.cta.href} className="btn btn-outline">
                {home.destaques.cta.label}
              </Link>
            }
          />

          <div className="mt-14 sm:mt-20">
            <DragRow label="Produtos em destaque">
              {[
                ...destaques.map((p, i) => (
                  <ProductCard
                    key={p.slug}
                    produto={p}
                    prioridade={i === 0}
                    linhaApoio={home.destaques.linhas[p.slug]}
                  />
                )),
                /* O quarto carro-chefe é uma coleção inteira, não um item. */
                <CollectionCard
                  key={banhos.slug}
                  categoria={banhos}
                  quantidade={contagemPorCategoria(banhos.slug)}
                  descricao={home.destaques.linhas['banhos-escalda-pes']}
                />,
              ]}
            </DragRow>
          </div>
        </div>
      </Section>

      {/* ── 4 · Catálogo ────────── cimento queimado (cenário de produto) ── */}
      <Section surface="concrete" padding="loose" texture id="catalogo">
        <div className="shell relative">
          <SectionHead
            indice="03"
            label={home.categorias.kicker}
            titulo={home.categorias.titulo}
            acao={
              <Link href="/catalogo" className="btn btn-outline">
                Ver o catálogo completo
              </Link>
            }
          />

          <RevealGroup
            className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {categoriasVisiveis.map((c) => (
              <RevealItem key={c.slug}>
                <CategoryCard categoria={c} quantidade={contagemPorCategoria(c.slug)} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 5 · História e processo ──────────────── sálvia pálido (luz) ─── */}
      <EditorialSplit
        surface="sage"
        imagem="/images/editorial/maos-preparo.jpg"
        alt="Mãos preparando um lote de ervas e flores sob luz lateral"
        label={home.historia.label}
        titulo={home.historia.titulo}
        texto={home.historia.texto}
        assinatura={home.historia.assinatura}
        ladoImagem="left"
        acao={
          <Link href={home.historia.cta.href} className="btn btn-outline">
            {home.historia.cta.label}
          </Link>
        }
      />

      {/* Como é feito — os quatro princípios, discretos, sem faixa própria */}
      <Section surface="sage" padding="tight">
        <div className="shell">
          <div className="rule mb-10" />
          <RevealGroup
            className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4"
            stagger={0.07}
          >
            {valores.map((v, i) => (
              <RevealItem key={v.titulo} className="flex items-start gap-3">
                <span className="label-quiet tnum mt-1 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-sans text-[0.88rem] leading-snug">
                    {v.titulo}
                  </span>
                  <span className="mt-1.5 block font-sans text-[0.8rem] leading-snug text-[color:var(--s-muted)]">
                    {v.texto}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 6 · Rituais de uso ─────────────────────────────────── creme ── */}
      <Section surface="bone" padding="loose">
        <div className="shell">
          <SectionHead
            indice="04"
            label={home.comoUsar.kicker}
            titulo={home.comoUsar.titulo}
            intro={home.comoUsar.texto}
            alinhamento="center"
            acao={
              <Link href={home.comoUsar.cta.href} className="btn btn-outline">
                {home.comoUsar.cta.label}
              </Link>
            }
          />

          <RevealGroup
            className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:mt-20 sm:grid-cols-3"
            stagger={0.1}
          >
            {rituais.map((r, i) => (
              <RevealItem key={r.titulo} className="text-center">
                <CircleFrame
                  src={r.imagem}
                  alt={r.alt}
                  className="mx-auto w-[62%] text-[color:var(--s-accent)] sm:w-[88%]"
                  sizes="(max-width: 640px) 60vw, 280px"
                />
                <p className="label-quiet tnum mt-8">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="display mt-3 text-d4">{r.titulo}</h3>
                <p className="body mx-auto mt-3 max-w-[24rem] text-[0.9rem]">{r.texto}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 7 · Depoimentos ──────────────────── musgo (sombra acolhedora) ─ */}
      <Section surface="moss" padding="loose" texture>
        <div className="shell relative">
          <SectionHead
            indice="05"
            label={home.depoimentos.kicker}
            titulo={home.depoimentos.titulo}
            alinhamento="center"
          />

          {/*
            TODO [confirmar]: inserir 2–3 mensagens reais de clientes já
            recebidas. Placeholder visível de propósito — nada inventado.
          */}
          <RevealGroup
            className="mx-auto mt-14 grid max-w-[62rem] grid-cols-1 gap-6 sm:grid-cols-3"
            stagger={0.08}
          >
            {[0, 1, 2].map((i) => (
              <RevealItem key={i}>
                <div
                  className="flex min-h-[13rem] flex-col justify-between border border-dashed p-7"
                  style={{ borderColor: 'var(--s-line)' }}
                >
                  <Star size={18} className="text-[color:var(--s-accent)] opacity-60" />
                  <p className="label-quiet mt-6 leading-relaxed">
                    {home.depoimentos.placeholder}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 8 · Fechamento ───────────────────── creme (luz e expressão) ── */}
      <WhatsAppCTA
        surface="bone"
        label={home.fechamento.kicker}
        titulo={home.fechamento.titulo}
        texto={home.fechamento.texto}
        cta={home.fechamento.cta.label}
        mensagem={wppMsg.geral}
      />
    </>
  );
}
