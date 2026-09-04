import Link from 'next/link';

import CategoryCard from '@/components/CategoryCard';
import CircleFrame from '@/components/CircleFrame';
import ProductCard from '@/components/ProductCard';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import Star from '@/components/Star';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import BathsScene from '@/components/scroll/BathsScene';
import HeroScrub from '@/components/scroll/HeroScrub';
import CenaHorizontal from '@/components/scroll/CenaHorizontal';

import { categoriasVisiveis, getCategoria } from '@/content/categorias';
import { contagemPorCategoria, produtosPorCategoria, produtosDestaque } from '@/content/produtos';
import { capitulos, home, paginas, valores } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

/**
 * HOME.
 *
 * A espinha é a mesma que a marca pediu — abertura, manifesto, destaques,
 * catálogo, história, rituais, depoimentos, fechamento — mas três momentos
 * deixaram de ser "seções que aparecem com fade" e passaram a ser cenas
 * atreladas ao scroll:
 *
 *  · a ABERTURA fica fixada e se desfaz conforme o scroll a atravessa;
 *  · OS OITO BANHOS viram uma cena fixada em que a cor real de cada rótulo
 *    toma a tela — é o coração do site e a única parte onde a cor vem toda
 *    dos produtos;
 *  · o CATÁLOGO atravessa a tela na horizontal enquanto a página rola.
 *
 * A casa é quase monocromática (papel e tinta) de propósito: sem competir com
 * as cores dos produtos nem com as fotos.
 */
export default function HomePage() {
  const destaques = produtosDestaque();
  const banhos = produtosPorCategoria('banhos-escalda-pes');
  const banhosCat = getCategoria('banhos-escalda-pes')!;
  const rituais = paginas.rituais.blocos.slice(0, 3);

  return (
    <>
      {/* ── 1 · Abertura ────────────────────── fixada, atrelada ao scroll ── */}
      <HeroScrub />

      {/* ── 2 · Manifesto ─────────────────────────────────────── papel ──── */}
      <Section surface="paper" padding="loose" secao="Manifesto">
        <div className="shell">
          <div className="grid-12 items-start gap-y-10">
            <div className="col-span-4 md:col-span-3">
              <Reveal>
                <p className="label-quiet mb-5" style={{ letterSpacing: '0.3em' }}>
                  {capitulos.sombra}
                </p>
                <div className="flex items-center gap-3">
                  <span className="label-quiet tnum">01</span>
                  <span aria-hidden="true" className="h-px w-6 bg-[color:var(--s-line)]" />
                  <span className="label">{home.manifestoCurto.label}</span>
                </div>
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-9">
              <Reveal delay={0.08}>
                <p className="display text-d2 text-balance">{home.manifestoCurto.frase}</p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="lede mt-9 max-w-prose text-pretty">{home.manifestoCurto.texto}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3 · Os oito banhos ─────────── cena fixada, cor dos rótulos ──── */}
      <Section surface="ink" padding="tight" secao="Os banhos">
        <div className="shell">
          <SectionHead
            capitulo={capitulos.presenca}
            indice="02"
            label="Banhos & Escalda-Pés"
            titulo="Oito banhos, oito intenções"
            intro="Cada preparo tem a sua cor, as suas ervas e o seu gesto. Role para atravessá-los."
            alinhamento="center"
          />
        </div>
      </Section>
      <BathsScene banhos={banhos} />

      {/* ── 4 · Destaques ──────────────────────────────────────── papel ─── */}
      <Section surface="paper" padding="loose" secao="Destaques">
        <div className="shell">
          <SectionHead
            indice="03"
            label={home.destaques.kicker}
            titulo={home.destaques.titulo}
            acao={
              <Link href={home.destaques.cta.href} className="btn btn-outline">
                {home.destaques.cta.label}
              </Link>
            }
          />
        </div>

        <div className="mt-16 sm:mt-20">
          <CenaHorizontal label="Produtos em destaque" indice="03">
            {[
              ...destaques.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  produto={p}
                  prioridade={i === 0}
                  linhaApoio={home.destaques.linhas[p.slug]}
                />
              )),
              <div key={banhosCat.slug} className="flex h-full flex-col">
                <CategoryCard
                  categoria={banhosCat}
                  quantidade={contagemPorCategoria(banhosCat.slug)}
                />
              </div>,
            ]}
          </CenaHorizontal>
        </div>
      </Section>

      {/* ── 5 · Catálogo ──────────────────── fileira horizontal, escuro ─── */}
      <Section surface="ink" padding="tight" id="catalogo" secao="Catálogo">
        <div className="shell">
          <SectionHead
            indice="04"
            label={home.categorias.kicker}
            titulo={home.categorias.titulo}
            acao={
              <Link href="/catalogo" className="btn btn-outline">
                Ver o catálogo completo
              </Link>
            }
          />
        </div>

        <div className="mt-16">
          <CenaHorizontal label="Categorias do catálogo" indice="04">
            {categoriasVisiveis.map((c) => (
              <CategoryCard
                key={c.slug}
                categoria={c}
                quantidade={contagemPorCategoria(c.slug)}
              />
            ))}
          </CenaHorizontal>
        </div>
      </Section>

      {/* ── 6 · História e processo ────────────────────────────── papel ─── */}
      <Section surface="paper" padding="loose" secao="Processo">
        <div className="shell">
          <SectionHead
            indice="05"
            label={home.historia.label}
            titulo={home.historia.titulo}
            intro={home.historia.texto}
            acao={
              <Link href={home.historia.cta.href} className="btn btn-outline">
                {home.historia.cta.label}
              </Link>
            }
          />

          <div className="rule mt-16" />
          <RevealGroup
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4"
            stagger={0.07}
          >
            {valores.map((v, i) => (
              <RevealItem key={v.titulo} className="flex items-start gap-3">
                <span className="label-quiet tnum mt-1 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-sans text-[0.88rem] leading-snug">{v.titulo}</span>
                  <span className="mt-1.5 block font-sans text-[0.8rem] leading-snug text-[color:var(--s-muted)]">
                    {v.texto}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 7 · Rituais ────────────────────────────────────────── fumaça ── */}
      <Section surface="smoke" padding="loose" secao="Rituais" texture>
        <div className="shell relative">
          <SectionHead
            capitulo={capitulos.luz}
            indice="06"
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

      {/* ── 8 · Depoimentos ───────────────────────────────────── papel ──── */}
      <Section surface="paper" padding="loose" secao="Depoimentos">
        <div className="shell">
          <SectionHead
            indice="07"
            label={home.depoimentos.kicker}
            titulo={home.depoimentos.titulo}
            alinhamento="center"
          />

          {/* TODO [confirmar]: 2–3 mensagens reais de clientes já recebidas. */}
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

      {/* ── 9 · Fechamento ─────────────────────────────────────── tinta ─── */}
      <WhatsAppCTA
        surface="ink"
        label={home.fechamento.kicker}
        titulo={home.fechamento.titulo}
        texto={home.fechamento.texto}
        cta={home.fechamento.cta.label}
        mensagem={wppMsg.geral}
      />
    </>
  );
}
