import type { Metadata } from 'next';
import Link from 'next/link';

import CircleFrame from '@/components/CircleFrame';
import Star from '@/components/Star';
import { Reveal } from '@/components/Reveal';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { paginas } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Rituais',
  description: paginas.rituais.intro,
};

export default function RituaisPage() {
  return (
    <>
      <Section surface="ink" padding="none" texture>
        <div className="shell relative pb-block-sm pt-40 sm:pt-48">
          <SectionHead
            as="h1"
            tamanho="d1"
            label={paginas.rituais.kicker}
            titulo={paginas.rituais.h1}
            intro={paginas.rituais.intro}
          />
        </div>
      </Section>

      {/* Um bloco por linha, alternando areia e creme */}
      {paginas.rituais.blocos.map((bloco, i) => (
        <Section key={bloco.titulo} surface={i % 2 === 0 ? 'paper' : 'smoke'} padding="normal">
          <div className="shell">
            <div className="grid-12 items-center gap-y-10">
              <div
                className={`col-span-4 md:col-span-4 ${i % 2 ? 'md:order-2 md:col-start-9' : ''}`}
              >
                <CircleFrame
                  src={bloco.imagem}
                  alt={bloco.alt}
                  className="mx-auto w-[64%] text-[color:var(--s-accent)] md:w-full"
                  sizes="(max-width: 768px) 62vw, 320px"
                  priority={i === 0}
                />
              </div>

              <div
                className={`col-span-4 md:col-span-6 ${i % 2 ? 'md:order-1 md:col-start-2' : 'md:col-start-6'}`}
              >
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="label-quiet tnum">{String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="h-px w-6 bg-[color:var(--s-line)]" />
                    <span className="label">Ritual</span>
                  </div>
                  <h2 className="display mt-6 text-d3">{bloco.titulo}</h2>
                  <p className="lede mt-6 max-w-prose text-pretty">{bloco.texto}</p>
                  <Link href={`/catalogo/${bloco.categoria}`} className="link-arrow mt-9">
                    Ver os produtos
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
      ))}

      {/* Fechamento */}
      <Section surface="smoke" padding="loose" texture>
        <div className="shell relative">
          <div className="mx-auto flex max-w-[38rem] flex-col items-center text-center">
            <Reveal>
              <Star size={24} className="text-[color:var(--s-accent)]" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="display mt-8 text-d2 text-balance">{paginas.rituais.fechamento}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <WhatsAppCTA
        surface="paper"
        titulo="Qual ritual combina com você?"
        texto="Conte como é o seu dia e a gente sugere por onde começar."
        cta="Falar no WhatsApp"
        mensagem={wppMsg.geral}
      />
    </>
  );
}
