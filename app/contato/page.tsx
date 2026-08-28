import type { Metadata } from 'next';

import { Reveal } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import { paginas, site } from '@/content/site';
import { WPP_CONFIGURADO, wppLink, wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Fale com a gente',
  description: paginas.contato.corpo,
};

export default function ContatoPage() {
  return (
    <>
      <Section surface="charcoal" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label={paginas.contato.kicker}
            titulo={paginas.contato.h1}
            intro={paginas.contato.corpo}
          />
        </div>
      </Section>

      <Section surface="sand" padding="loose">
        <div className="shell">
          <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
            <Reveal className="border-t border-[color:var(--s-line)] pt-7">
              <dt className="label">WhatsApp</dt>
              <dd className="mt-4 font-sans text-[1.05rem]">
                {WPP_CONFIGURADO ? (
                  <a
                    href={wppLink(wppMsg.geral)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-quiet"
                  >
                    Chamar no WhatsApp
                  </a>
                ) : (
                  // TODO [confirmar]: número — preencher WPP em lib/whatsapp.ts
                  <span className="text-[color:var(--s-muted)]">
                    {paginas.contato.whatsappPlaceholder}
                  </span>
                )}
              </dd>
            </Reveal>

            <Reveal delay={0.08} className="border-t border-[color:var(--s-line)] pt-7">
              <dt className="label">Instagram</dt>
              <dd className="mt-4 font-sans text-[1.05rem]">
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet"
                >
                  {site.instagram.handle}
                </a>
              </dd>
            </Reveal>

            <Reveal delay={0.16} className="border-t border-[color:var(--s-line)] pt-7">
              <dt className="label">Cidade</dt>
              <dd className="mt-4 font-sans text-[1.05rem] text-[color:var(--s-muted)]">
                {site.cidade}
              </dd>
            </Reveal>
          </dl>

          <Reveal delay={0.24}>
            <a
              href={wppLink(wppMsg.geral)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid mt-14"
            >
              {paginas.contato.cta.label}
            </a>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
