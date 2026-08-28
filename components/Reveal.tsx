'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal on scroll — fade + translateY lento, uma única vez.
 * Movimento sereno: 0.8–1.4s, sem bounce.
 */
export function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 32,
  duration = 1.1,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const reduzido = useReducedMotion();
  const Comp = motion[as as 'div'] ?? motion.div;

  return (
    <Comp
      className={className}
      initial={reduzido ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduzido ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: reduzido ? 0.35 : duration, delay: reduzido ? 0 : delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const grupo: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Grupo com stagger: use <RevealGroup> em volta e <RevealItem> em cada filho. */
export function RevealGroup({
  children,
  className,
  as = 'div',
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
}) {
  const Comp = motion[as as 'div'] ?? motion.div;
  return (
    <Comp
      className={className}
      variants={{
        ...grupo,
        visivel: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
  y = 28,
  duration = 1,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  duration?: number;
}) {
  const reduzido = useReducedMotion();
  const Comp = motion[as as 'div'] ?? motion.div;
  return (
    <Comp
      className={className}
      variants={{
        oculto: reduzido ? { opacity: 0 } : { opacity: 0, y },
        visivel: {
          opacity: 1,
          y: 0,
          transition: { duration: reduzido ? 0.35 : duration, ease: EASE },
        },
      }}
    >
      {children}
    </Comp>
  );
}
