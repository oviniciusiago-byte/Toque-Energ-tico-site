import type { Metadata } from 'next';

import Accordion from '@/components/Accordion';
import { Reveal } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { paginas } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Perguntas frequentes',
  description: 'Compra, frete, produção artesanal, personalizados e cuidados de uso.',
};

export default function FaqPage() {
  return (
    <>
      <Section surface="charcoal" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label={paginas.faq.kicker}
            titulo={paginas.faq.h1}
          />
        </div>
      </Section>

      <Section surface="sand" padding="loose">
        <div className="shell">
          <div className="mx-auto max-w-[58rem]">
            <Reveal>
              <Accordion
                itens={paginas.faq.itens.map((i) => ({
                  pergunta: i.pergunta,
                  resposta: <p>{i.resposta}</p>,
                }))}
                abertoInicial={0}
                numerado
              />
            </Reveal>
          </div>
        </div>
      </Section>

      <WhatsAppCTA
        surface="cream"
        titulo="Ficou alguma dúvida?"
        texto="Pergunte no WhatsApp — respondemos com o mesmo cuidado que colocamos nos produtos."
        cta="Falar no WhatsApp"
        mensagem={wppMsg.geral}
      />
    </>
  );
}
