'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Fileira horizontal arrastável (referência: a seção "The Range" da Soho Skin).
 * Rolagem nativa com snap no mobile; no desktop também dá para arrastar com o
 * mouse. Acessível: continua navegável por teclado e por scroll normal.
 */
export default function DragRow({
  children,
  label,
  className = '',
  itemClassName = 'w-[74vw] sm:w-[42vw] lg:w-[26vw]',
}: {
  children: ReactNode[];
  label: string;
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const estado = useRef({ x: 0, esquerda: 0, ativo: false });
  const [temOverflow, setTemOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setTemOverflow(el.scrollWidth > el.clientWidth + 4);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const aoDescer = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    estado.current = { x: e.clientX, esquerda: el.scrollLeft, ativo: true };
    setArrastando(true);
  }, []);

  const aoMover = useCallback((e: React.PointerEvent) => {
    if (!estado.current.ativo) return;
    const el = ref.current;
    if (!el) return;
    el.scrollLeft = estado.current.esquerda - (e.clientX - estado.current.x);
  }, []);

  const aoSoltar = useCallback(() => {
    estado.current.ativo = false;
    setArrastando(false);
  }, []);

  return (
    <div className={className}>
      <div
        ref={ref}
        role="group"
        aria-label={label}
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerLeave={aoSoltar}
        className={`no-scrollbar -mx-5 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:gap-8 sm:px-8 lg:-mx-12 lg:px-12 ${
          arrastando ? 'cursor-grabbing select-none' : temOverflow ? 'md:cursor-grab' : ''
        }`}
      >
        {children.map((filho, i) => (
          <div key={i} className={`h-full shrink-0 snap-start ${itemClassName}`}>
            {filho}
          </div>
        ))}
      </div>

      {temOverflow ? (
        <p
          className="label-quiet mt-7 flex items-center justify-end gap-2"
          aria-hidden="true"
        >
          <svg width="22" height="6" viewBox="0 0 22 6" fill="none">
            <path
              d="M0 3h20m0 0-3.2-2.6M20 3l-3.2 2.6"
              stroke="currentColor"
              strokeWidth="0.9"
            />
          </svg>
          Arraste
        </p>
      ) : null}
    </div>
  );
}
