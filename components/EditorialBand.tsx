import Image from 'next/image';
import Parallax from '@/components/Parallax';
import { Reveal } from '@/components/Reveal';

/**
 * Faixa editorial full-bleed: imagem cobrindo a largura, frase por cima.
 * O momento mais intimista do scroll.
 */
export default function EditorialBand({
  imagem,
  alt,
  label,
  frase,
  assinatura,
  altura = 'min-h-[70svh]',
  alinhamento = 'left',
}: {
  imagem: string;
  alt: string;
  label?: string;
  frase: string;
  assinatura?: string;
  altura?: string;
  alinhamento?: 'left' | 'center';
}) {
  const centro = alinhamento === 'center';

  return (
    <section
      className={`surface-image relative isolate flex items-end overflow-hidden bg-charcoal text-[color:var(--s-fg)] ${altura}`}
    >
      <Parallax intensidade={0.12} className="absolute inset-0 -z-10">
        <Image src={imagem} alt={alt} fill sizes="100vw" className="object-cover" />
      </Parallax>

      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, rgb(var(--charcoal-rgb) / 0.86) 0%, rgb(var(--charcoal-rgb) / 0.4) 52%, rgb(var(--charcoal-rgb) / 0.14) 100%)',
        }}
      />

      <div className="shell relative w-full pb-block-sm pt-block">
        <div className={centro ? 'mx-auto max-w-[42rem] text-center' : 'max-w-[40rem]'}>
          {label ? (
            <Reveal>
              <p className="label">{label}</p>
            </Reveal>
          ) : null}
          <Reveal delay={0.08}>
            <p className="display mt-6 text-d2 text-balance">{frase}</p>
          </Reveal>
          {assinatura ? (
            <Reveal delay={0.16}>
              <p className="label-quiet mt-8">{assinatura}</p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
