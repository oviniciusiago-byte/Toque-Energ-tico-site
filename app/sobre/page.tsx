import type { Metadata } from 'next';

import EditorialBand from '@/components/EditorialBand';
import EditorialSplit from '@/components/EditorialSplit';
import { Estrela } from '@/components/Logo';
import Manifesto from '@/components/Manifesto';
import Numbers from '@/components/Numbers';
import { Reveal } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { categoriasVisiveis } from '@/content/categorias';
import { produtos } from '@/content/produtos';
import { numeros, paginas, site } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'A Toque Energético',
  description: paginas.sobre.corpo[0],
};

export default function SobrePage() {
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
      {/* Cabeçalho escuro */}
      <Section surface="charcoal" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label={paginas.sobre.kicker}
            titulo={paginas.sobre.h1}
          />
        </div>
      </Section>

      {/* Corpo */}
      <Section surface="sand" padding="loose">
        <div className="shell">
          <div className="grid-12 gap-y-12">
            <div className="col-span-4 md:col-span-3">
              <Reveal>
                <p className="label">Nossa história</p>
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-8 md:col-start-5">
              <div className="prose-brand">
                {paginas.sobre.corpo.map((paragrafo, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <p className={i === 0 ? 'lede' : undefined}>{paragrafo}</p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <div className="mt-12 flex items-center gap-4">
                  <Estrela size={20} className="text-[color:var(--s-accent)]" />
                  <p className="display text-d4 italic">{site.assinatura}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* Split da fundadora */}
      <EditorialSplit
        surface="forest"
        imagem="/images/editorial/fundadora.jpg"
        alt="Preparo artesanal — Toque Energético"
        label="Quem faz"
        titulo="Cada fórmula nasce, é testada e ajustada pelas mesmas mãos."
        texto="Produção artesanal em pequenos lotes. Só depois de passar pela própria vida de quem criou é que o produto chega até você."
        assinatura={`Maria Fernanda Pavan · ${site.cidade}`}
        ladoImagem="right"
      />

      {/* Números */}
      <Section surface="sand" padding="loose">
        <div className="shell">
          <Numbers itens={numerosResolvidos} />
        </div>
      </Section>

      {/* Manifesto da estrela */}
      <Section surface="wood" padding="loose" texture>
        <div className="shell relative">
          <div className="mx-auto max-w-[42rem] text-center">
            <Reveal>
              <Estrela size={26} className="mx-auto text-[color:var(--s-accent)]" />
            </Reveal>
            <Manifesto frase={paginas.sobre.manifesto} className="mt-9" italico={[1]} />
          </div>
        </div>
      </Section>

      <EditorialBand
        imagem="/images/editorial/preparo-mesa.jpg"
        alt="Ervas e flores secas sobre a bancada de preparo"
        label="Pequenos lotes"
        frase="Sete anos de preparo à mão, uma fórmula por vez."
        altura="min-h-[56svh]"
      />

      <WhatsAppCTA
        surface="cream"
        titulo="Converse com a gente"
        texto="Dúvidas sobre um produto, uma intenção ou um presente: o WhatsApp é o caminho mais direto."
        cta="Falar no WhatsApp"
        mensagem={wppMsg.geral}
      />
    </>
  );
}
