import Image from 'next/image';
import Parallax from '@/components/Parallax';
import { Reveal } from '@/components/Reveal';
import Section, { type Surface } from '@/components/Section';

/**
 * Split editorial: metade imagem, metade bloco de cor sólido.
 * É o desenho do anexo de estrutura — imagem colada na borda, texto no bloco.
 */
export default function EditorialSplit({
  imagem,
  alt,
  label,
  titulo,
  texto,
  assinatura,
  acao,
  surface = 'forest',
  ladoImagem = 'left',
}: {
  imagem: string;
  alt: string;
  label?: string;
  titulo: string;
  texto?: string;
  assinatura?: string;
  acao?: React.ReactNode;
  surface?: Surface;
  ladoImagem?: 'left' | 'right';
}) {
  const imagemPrimeiro = ladoImagem === 'left';

  return (
    <Section surface={surface} padding="none" texture>
      <div className="grid lg:grid-cols-2">
        <div
          className={`relative min-h-[62svh] overflow-hidden lg:min-h-[86svh] ${
            imagemPrimeiro ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <Parallax intensidade={0.1} className="absolute inset-0">
            <Image src={imagem} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </Parallax>
        </div>

        <div
          className={`flex items-center px-5 py-block sm:px-8 lg:px-14 xl:px-20 ${
            imagemPrimeiro ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="max-w-[34rem]">
            {label ? (
              <Reveal>
                <p className="label">{label}</p>
              </Reveal>
            ) : null}

            <Reveal delay={0.07}>
              <h2 className="display mt-6 text-d2 text-balance">{titulo}</h2>
            </Reveal>

            {texto ? (
              <Reveal delay={0.14}>
                <p className="lede mt-7 text-pretty">{texto}</p>
              </Reveal>
            ) : null}

            {assinatura ? (
              <Reveal delay={0.2}>
                <p className="label-quiet mt-9">{assinatura}</p>
              </Reveal>
            ) : null}

            {acao ? (
              <Reveal delay={0.26}>
                <div className="mt-10">{acao}</div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
