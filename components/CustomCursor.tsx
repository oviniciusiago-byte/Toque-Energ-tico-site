'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cursor customizado: um ponto com glow dourado que cresce sobre elementos
 * interativos. Apenas em `pointer: fine`; nunca em toque nem sob
 * prefers-reduced-motion. É acento, não espetáculo.
 */
export default function CustomCursor() {
  const pontoRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);
  const [sobreLink, setSobreLink] = useState(false);

  useEffect(() => {
    const fino = window.matchMedia('(pointer: fine)').matches;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fino || reduzido) return;

    setAtivo(true);
    let raf = 0;
    let alvoX = window.innerWidth / 2;
    let alvoY = window.innerHeight / 2;
    let x = alvoX;
    let y = alvoY;

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      alvoX = e.clientX;
      alvoY = e.clientY;
      const el = e.target as HTMLElement | null;
      setSobreLink(Boolean(el?.closest('a, button, [role="button"], input, summary')));
    };

    const loop = () => {
      // lerp: o ponto segue o cursor com um leve atraso orgânico
      x += (alvoX - x) * 0.18;
      y += (alvoY - y) * 0.18;
      const el = pontoRef.current;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', mover, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', mover);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!ativo) return null;

  return (
    <div
      ref={pontoRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <div
        className="rounded-full transition-[width,height,opacity] duration-500 ease-calm"
        style={{
          width: sobreLink ? 44 : 10,
          height: sobreLink ? 44 : 10,
          opacity: sobreLink ? 0.55 : 0.85,
          background:
            'radial-gradient(circle, var(--gold-soft) 0%, rgb(var(--gold-rgb) / 0.35) 45%, transparent 70%)',
          boxShadow: '0 0 18px rgb(var(--gold-rgb) / 0.35)',
        }}
      />
    </div>
  );
}
