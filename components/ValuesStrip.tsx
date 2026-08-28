import Section from '@/components/Section';
import { RevealGroup, RevealItem } from '@/components/Reveal';
import { valores } from '@/content/site';

/** Faixa dourada de valores — bloco de cor curto entre o hero e o conteúdo. */
export default function ValuesStrip() {
  return (
    <Section surface="gold" padding="none">
      <div className="shell py-8 sm:py-10">
        <RevealGroup
          className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4"
          stagger={0.08}
        >
          {valores.map((v, i) => (
            <RevealItem key={v.titulo} className="flex items-start gap-3">
              <span className="label-quiet tnum mt-1 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block font-sans text-[0.82rem] font-medium leading-snug">
                  {v.titulo}
                </span>
                <span className="mt-1 block font-sans text-[0.76rem] leading-snug text-[color:var(--s-muted)]">
                  {v.texto}
                </span>
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
