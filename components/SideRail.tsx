'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Trilha lateral fixa (só desktop): índice da seção em que a pessoa está e o
 * capítulo correspondente, na margem — o recurso de "marginália editorial"
 * que as referências usam.
 *
 * Lê as seções pelo atributo `data-secao` que a home declara, então não
 * duplica conhecimento sobre a estrutura da página.
 */
export default function SideRail() {
  const pathname = usePathname();
  const [secoes, setSecoes] = useState<{ indice: string; nome: string }[]>([]);
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>('[data-secao]'));
    setSecoes(
      alvos.map((el, i) => ({
        indice: String(i + 1).padStart(2, '0'),
        nome: el.dataset.secao ?? '',
      })),
    );
    setAtual(0);
    if (!alvos.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        const visiveis = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visiveis[0]) setAtual(alvos.indexOf(visiveis[0].target as HTMLElement));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    alvos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  if (secoes.length < 2) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-12 flex-col items-center justify-center gap-6 xl:flex"
    >
      <span className="font-sans text-[0.6rem] tabular-nums tracking-[0.2em] text-[color:var(--s-faint)]">
        {secoes[atual]?.indice}
      </span>

      <span className="relative h-24 w-px bg-[color:var(--s-line)]">
        <span
          className="absolute inset-x-0 top-0 bg-[color:var(--s-accent)] transition-[height] duration-700 ease-calm"
          style={{ height: `${((atual + 1) / secoes.length) * 100}%` }}
        />
      </span>

      <span
        className="font-sans text-[0.58rem] uppercase tracking-[0.28em] text-[color:var(--s-faint)] transition-opacity duration-500"
        style={{ writingMode: 'vertical-rl' }}
      >
        {secoes[atual]?.nome}
      </span>
    </div>
  );
}
