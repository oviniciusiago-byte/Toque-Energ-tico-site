'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Parallax discreto — deslocamento máximo de 15–20% da altura do elemento.
 * É assinatura, não espetáculo. Desligado sob prefers-reduced-motion.
 */
export default function Parallax({
  children,
  className,
  /** 0.15 = 15% de deslocamento. Máximo recomendado: 0.2 */
  intensidade = 0.15,
  direcao = 'up',
}: {
  children: ReactNode;
  className?: string;
  intensidade?: number;
  direcao?: 'up' | 'down';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const limite = Math.min(intensidade, 0.2);
  const alcance = limite * 100;
  const sinal = direcao === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [`${-sinal * alcance}%`, `${sinal * alcance}%`]);
  // o zoom compensa o deslocamento: a imagem nunca deixa aparecer a borda
  const escala = 1 + limite * 2.2;

  if (reduzido) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ y, scale: escala }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
