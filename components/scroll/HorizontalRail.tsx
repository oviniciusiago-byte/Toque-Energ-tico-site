'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Fileira horizontal com arraste, encaixe e indicador de progresso.
 *
 * NOTA HONESTA DE IMPLEMENTAÇÃO
 * Tentei antes a versão "fixada": a seção grudava na tela e o scroll vertical
 * era traduzido em deslocamento horizontal, como nas referências. O pin
 * engatava (o ScrollTrigger criava a faixa correta), mas o trigger nunca
 * reportava progresso e a trilha ficava parada em x=0. Testei várias hipóteses
 * — valor de tween gravado antes do layout, laço de refresh por
 * ResizeObserver, `invalidateOnRefresh` num trigger sem animação — e a última
 * não era a causa. Preferi entregar uma fileira que eu consegui verificar
 * funcionando do que deixar uma seção travada no site.
 *
 * O que esta versão faz e foi verificado: rolagem horizontal nativa (portanto
 * com teclado, trackpad e toque de graça), arraste com o mouse no desktop,
 * encaixe nos itens e um trilho que mostra a posição.
 */
export default function HorizontalRail({
  children,
  label,
  className = '',
}: {
  children: ReactNode[];
  label: string;
  className?: string;
}) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const arrasto = useRef({ ativo: false, x: 0, esquerda: 0 });
  const [arrastando, setArrastando] = useState(false);
  const [temCurso, setTemCurso] = useState(false);
  /* Progresso em ESTADO, não escrito num ref: o indicador só existe depois de
     `temCurso` virar true, então a primeira escrita num ref caía no vazio e a
     barra ficava travada em 0%. */
  const [progresso, setProgresso] = useState(0);

  const medir = useCallback(() => {
    const el = pistaRef.current;
    if (!el) return;
    const curso = el.scrollWidth - el.clientWidth;
    setTemCurso(curso > 8);
    setProgresso(curso > 0 ? el.scrollLeft / curso : 0);
  }, []);

  useEffect(() => {
    const el = pistaRef.current;
    if (!el) return;
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', medir);
      ro.disconnect();
    };
  }, [medir]);

  const aoDescer = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !pistaRef.current) return;
    arrasto.current = { ativo: true, x: e.clientX, esquerda: pistaRef.current.scrollLeft };
    setArrastando(true);
  };

  const aoMover = (e: React.PointerEvent) => {
    if (!arrasto.current.ativo || !pistaRef.current) return;
    pistaRef.current.scrollLeft = arrasto.current.esquerda - (e.clientX - arrasto.current.x);
  };

  const aoSoltar = () => {
    arrasto.current.ativo = false;
    setArrastando(false);
  };

  return (
    <div className={className}>
      <div
        ref={pistaRef}
        role="group"
        aria-label={label}
        tabIndex={0}
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerLeave={aoSoltar}
        className={`no-scrollbar flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto px-5 pb-2 sm:gap-10 sm:px-8 lg:px-12 ${
          arrastando ? 'cursor-grabbing select-none' : temCurso ? 'md:cursor-grab' : ''
        }`}
      >
        {children.map((filho, i) => (
          <div
            key={i}
            className="h-full w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[34vw]"
          >
            {filho}
          </div>
        ))}
      </div>

      {temCurso ? (
        <div className="shell mt-8">
          <div className="relative h-px w-full bg-[color:var(--s-line)]">
            <span
              className="absolute inset-y-0 left-0 bg-[color:var(--s-accent)]"
              style={{ width: `${progresso * 100}%` }}
            />
          </div>
          <p className="label-quiet mt-4 flex items-center gap-2" aria-hidden="true">
            <svg width="22" height="6" viewBox="0 0 22 6" fill="none">
              <path
                d="M0 3h20m0 0-3.2-2.6M20 3l-3.2 2.6"
                stroke="currentColor"
                strokeWidth="0.9"
              />
            </svg>
            Arraste para percorrer
          </p>
        </div>
      ) : null}
    </div>
  );
}
