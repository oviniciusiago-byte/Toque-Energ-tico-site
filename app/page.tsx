import Link from 'next/link';

import CategoryCard from '@/components/CategoryCard';
import CircleFrame from '@/components/CircleFrame';
import DragRow from '@/components/DragRow';
import EditorialBand from '@/components/EditorialBand';
import EditorialSplit from '@/components/EditorialSplit';
import Hero from '@/components/Hero';
import Numbers from '@/components/Numbers';
import ProductCard from '@/components/ProductCard';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import ValuesStrip from '@/components/ValuesStrip';
import WhatsAppCTA from '@/components/WhatsAppCTA';

import { categoriasVisiveis, getCategoria } from '@/content/categorias';
import { contagemPorCategoria, produtos, produtosDestaque } from '@/content/produtos';
import { home, numeros, paginas } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export default function HomePage() {
  const destaques = produtosDestaque();
  const banhos = getCategoria('banhos-escalda-pes')!;
  const rituais = paginas.rituais.blocos.slice(0, 3);

  /** Os números vêm do próprio catálogo — nunca ficam desatualizados. */
  const numerosResolvidos = numeros.map((n) => ({
    ...n,
    valor:
      n.valor === 'AUTO_CATEGORIAS'
        ? String(categoriasVisiveis.length)
        : n.valor === 'AUTO_PRODUTOS'
          ? String(produtos.length)
          : n.valor,
  }));

  return (
    <>
      {/* ── 01 · Hero em vídeo ─────────────────────────── escuro / imagem ── */}
      <Hero />

      {/* ── 02 · Valores ──────────────────────────────────────── dourado ── */}
      <ValuesStrip />

      {/* ── 03 · A ideia ───────────────────────────────────────── areia ─── */}
      <Section surface="sand" padding="loose">
        <div className="shell">
          <div className="grid-12 items-start gap-y-10">
            <div className="col-span-4 md:col-span-3">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="label-quiet tnum">01</span>
                  <span aria-hidden="true" className="h-px w-6 bg-[color:var(--s-line)]" />
                  <span className="label">{home.ideia.kicker}</span>
                </div>
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-9">
              <Reveal delay={0.08}>
                <p className="display text-d3 text-pretty">{home.ideia.texto}</p>
              </Reveal>

              <Reveal delay={0.18}>
                <Link href="/sobre" className="link-arrow mt-10">
                  A nossa história
                  <svg width="20" height="6" viewBox="0 0 20 6" fill="none" aria-hidden="true">
                    <path
                      d="M0 3h18m0 0-3-2.4M18 3l-3 2.4"
                      stroke="currentColor"
                      strokeWidth="0.9"
                    />
                  </svg>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 04 · Destaques ─────────────────────────────────────── creme ─── */}
      <Section surface="cream" padding="loose">
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
                    indice={String(i + 1).padStart(2, '0')}
                    linhaApoio={home.destaques.linhas[p.slug]}
                  />
                )),
                /* o quarto carro-chefe é uma coleção inteira, não um item */
                <div key="banhos">
                  <CategoryCard
                    categoria={banhos}
                    quantidade={contagemPorCategoria(banhos.slug)}
                    indice="04"
                    proporcao="aspect-[4/5]"
                  />
                  <p className="body mt-5 text-[0.92rem]">
                    {home.destaques.linhas['banhos-escalda-pes']}
                  </p>
                </div>,
              ]}
            </DragRow>
          </div>
        </div>
      </Section>

      {/* ── 05 · Split editorial ────────────────────────── verde botânico ── */}
      <EditorialSplit
        surface="forest"
        imagem="/images/editorial/maos-buque.jpg"
        alt="Mãos segurando um buquê botânico sob luz lateral"
        label={home.editorial.label}
        titulo={home.editorial.frase}
        texto={home.editorial.apoio}
        assinatura={home.editorial.assinatura}
        ladoImagem="left"
        acao={
          <Link href="/sobre" className="btn btn-outline">
            Como a marca nasceu
          </Link>
        }
      />

      {/* ── 06 · Números ───────────────────────────────────────── areia ─── */}
      <Section surface="sand" padding="normal">
        <div className="shell">
          <Numbers itens={numerosResolvidos} />
        </div>
      </Section>

      {/* ── 07 · O catálogo ─────────────────────────────────── carvão ───── */}
      <Section surface="charcoal" padding="loose" texture id="catalogo">
        <div className="shell relative">
          <SectionHead
            indice="03"
            label={home.categorias.kicker}
            titulo={home.categorias.titulo}
            intro={paginas.catalogo.intro}
            acao={
              <Link href="/catalogo" className="btn btn-outline">
                Ver o catálogo completo
              </Link>
            }
          />

          <RevealGroup
            className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 sm:mt-20"
            stagger={0.08}
          >
            {categoriasVisiveis.map((c, i) => (
              <RevealItem key={c.slug}>
                <CategoryCard
                  categoria={c}
                  quantidade={contagemPorCategoria(c.slug)}
                  indice={String(i + 1).padStart(2, '0')}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 08 · Rituais ───────────────────────────────────────── creme ─── */}
      <Section surface="cream" padding="loose">
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
            className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-3 sm:mt-20"
            stagger={0.1}
          >
            {rituais.map((r, i) => (
              <RevealItem key={r.titulo} className="text-center">
                <CircleFrame
                  src={r.imagem}
                  alt={r.titulo}
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

      {/* ── 09 · Depoimentos ───────────────────────────────────── areia ─── */}
      <Section surface="sand" padding="loose">
        <div className="shell">
          <SectionHead
            indice="05"
            label={home.depoimentos.kicker}
            titulo={home.depoimentos.titulo}
            alinhamento="center"
          />

          {/*
            TODO [confirmar]: inserir 2–3 mensagens reais de clientes já recebidas.
            Placeholder visível de propósito — nada de depoimento inventado.
          */}
          <RevealGroup
            className="mx-auto mt-14 grid max-w-[64rem] grid-cols-1 gap-6 sm:grid-cols-3"
            stagger={0.08}
          >
            {[0, 1, 2].map((i) => (
              <RevealItem key={i}>
                <div
                  className="flex min-h-[14rem] flex-col justify-between border border-dashed p-7"
                  style={{ borderColor: 'var(--s-line)' }}
                >
                  <p className="display text-d3 italic opacity-25">“</p>
                  <p className="label-quiet mt-6 leading-relaxed">
                    {home.depoimentos.placeholder}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── 10 · Manifesto sobre imagem ───────────────────────── imagem ─── */}
      <EditorialBand
        imagem="/images/editorial/preparo-mesa.jpg"
        alt="Ervas e flores secas sobre a bancada de preparo"
        label={home.faixaEditorial.label}
        frase={home.faixaEditorial.frase}
        alinhamento="center"
        altura="min-h-[64svh]"
      />

      {/* ── 11 · Fechamento ────────────────────────────────────── creme ─── */}
      <WhatsAppCTA
        surface="cream"
        label={home.fechamento.kicker}
        titulo={home.fechamento.titulo}
        texto={home.fechamento.texto}
        cta={home.fechamento.cta.label}
        mensagem={wppMsg.geral}
      />
    </>
  );
}
