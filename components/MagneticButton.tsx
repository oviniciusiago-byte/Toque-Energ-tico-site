'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useCallback, useRef, type ReactNode } from 'react';

/**
 * Magnetismo sutil: o botão inclina alguns pixels na direção do cursor.
 * Só em ponteiro fino, nunca em toque, nunca sob prefers-reduced-motion.
 */
export default function MagneticButton({
  children,
  className,
  forca = 8,
}: {
  children: ReactNode;
  className?: string;
  forca?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduzido = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 140, damping: 18, mass: 0.4 });

  const mover = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * forca);
      my.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * forca);
    },
    [mx, my, forca],
  );

  const sair = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  if (reduzido) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={`inline-block [@media(pointer:coarse)]:!transform-none ${className ?? ''}`}
      style={{ x, y }}
      onPointerMove={mover}
      onPointerLeave={sair}
    >
      {children}
    </motion.span>
  );
}
