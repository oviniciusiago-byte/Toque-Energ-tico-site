import MagneticButton from '@/components/MagneticButton';
import Section, { type Surface } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import Star from '@/components/Star';
import { wppLink } from '@/lib/whatsapp';

/** Fechamento: a jornada do site termina no WhatsApp. Nunca há carrinho. */
export default function WhatsAppCTA({
  label,
  titulo,
  texto,
  cta,
  mensagem,
  surface = 'bone',
  nota,
}: {
  label?: string;
  titulo: string;
  texto: string;
  cta: string;
  mensagem: string;
  surface?: Surface;
  nota?: string;
}) {
  return (
    <Section surface={surface} padding="loose">
      <div className="shell">
        <div className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
          <Reveal>
            <Star size={26} className="text-[color:var(--s-accent)]" />
          </Reveal>

          {label ? (
            <Reveal delay={0.06}>
              <p className="label mt-8">{label}</p>
            </Reveal>
          ) : null}

          <Reveal delay={0.12}>
            <h2 className="display mt-6 text-d2">{titulo}</h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="lede mt-6 text-pretty">{texto}</p>
          </Reveal>

          <Reveal delay={0.26}>
            <MagneticButton className="mt-11">
              <a
                href={wppLink(mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid"
              >
                {cta}
              </a>
            </MagneticButton>
          </Reveal>

          {nota ? (
            <Reveal delay={0.32}>
              <p className="label-quiet mt-7 normal-case tracking-[0.1em]">{nota}</p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
