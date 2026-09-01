import type { Metadata } from 'next';

import { Reveal } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { paginas } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Atacado e revenda',
  description: paginas.atacado.corpo[0],
};

export default function AtacadoPage() {
  return (
    <>
      <Section surface="olive" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label={paginas.atacado.kicker}
            titulo={paginas.atacado.h1}
          />
        </div>
      </Section>

      <Section surface="bone" padding="loose">
        <div className="shell">
          <div className="grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-3">
              <Reveal>
                <p className="label">Condições</p>
              </Reveal>
            </div>
            <div className="col-span-4 md:col-span-8 md:col-start-5">
              <div className="prose-brand max-w-prose">
                {paginas.atacado.corpo.map((paragrafo, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <p className={i === 0 ? 'lede' : undefined}>{paragrafo}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <WhatsAppCTA
        surface="noir"
        titulo="Vamos conversar"
        texto="Conte sobre o seu negócio e montamos as condições de acordo com o volume e o mix de produtos."
        cta={paginas.atacado.cta.label}
        mensagem={wppMsg.atacado}
      />
    </>
  );
}
