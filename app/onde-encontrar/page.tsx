import type { Metadata } from 'next';

import { Reveal } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { paginas, site } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Onde encontrar',
  description: paginas.ondeEncontrar.corpo,
};

export default function OndeEncontrarPage() {
  return (
    <>
      <Section surface="olive" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label={paginas.ondeEncontrar.kicker}
            titulo={paginas.ondeEncontrar.h1}
            intro={paginas.ondeEncontrar.corpo}
          />
        </div>
      </Section>

      <Section surface="bone" padding="loose">
        <div className="shell">
          {/* TODO [confirmar]: lista de pontos de venda fixos e feiras agendadas. */}
          <Reveal>
            <div
              className="max-w-[48rem] border border-dashed p-8 sm:p-10"
              style={{ borderColor: 'var(--s-line)' }}
            >
              <p className="label">Agenda</p>
              <p className="body mt-5">{paginas.ondeEncontrar.placeholder}</p>
              <p className="body mt-6">
                Enquanto isso, o calendário atualizado fica no Instagram{' '}
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet text-[color:var(--s-accent)]"
                >
                  {site.instagram.handle}
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <WhatsAppCTA
        surface="tan"
        titulo="Onde estaremos?"
        texto="Pergunte pelo WhatsApp — contamos das próximas feiras e pontos parceiros."
        cta="Falar no WhatsApp"
        mensagem={wppMsg.ondeEncontrar}
      />
    </>
  );
}
