'use client';

import { useEffect, useState } from 'react';

/**
 * Navegação por categoria do catálogo: uma faixa que gruda no topo ao rolar e
 * marca a linha que está em tela. Rolagem suave via Lenis quando disponível.
 */
export default function CategoryNav({
  itens,
}: {
  itens: { slug: string; nome: string }[];
}) {
  const [ativo, setAtivo] = useState<string | null>(null);

  useEffect(() => {
    const alvos = itens
      .map((i) => document.getElementById(i.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!alvos.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visivel) setAtivo(visivel.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    alvos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [itens]);

  const irPara = (slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (!el) return;
    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }
    ).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Categorias do catálogo"
      className="surface surface-charcoal sticky top-0 z-30 border-b backdrop-blur-[6px]"
      style={{ borderColor: 'var(--s-line)', backgroundColor: 'rgb(var(--charcoal-rgb) / 0.9)' }}
    >
      <div className="shell">
        <ul className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 py-3 sm:mx-0 sm:justify-center sm:px-0">
          {itens.map((item) => {
            const atual = ativo === item.slug;
            return (
              <li key={item.slug} className="shrink-0">
                <a
                  href={`#${item.slug}`}
                  onClick={irPara(item.slug)}
                  aria-current={atual ? 'true' : undefined}
                  className="inline-flex rounded-full px-3.5 py-2 font-sans text-[0.68rem] uppercase tracking-[0.16em] transition-colors duration-500 ease-calm"
                  style={{
                    color: atual ? 'var(--s-bg)' : 'var(--s-muted)',
                    backgroundColor: atual ? 'var(--s-fg)' : 'transparent',
                  }}
                >
                  {item.nome}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
