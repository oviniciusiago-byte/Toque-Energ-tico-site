'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

/**
 * Moldura circular editorial (rituais / ingredientes) com hairline que se
 * "desenha" ao entrar na viewport.
 */
export default function CircleFrame({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 60vw, 300px',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const reduzido = useReducedMotion();

  return (
    <div className={`relative aspect-square ${className}`}>
      <div className="absolute inset-[5%] overflow-hidden rounded-full">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>

      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="49.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeOpacity="0.5"
          pathLength={1}
          initial={reduzido ? { opacity: 0 } : { pathLength: 0 }}
          whileInView={reduzido ? { opacity: 1 } : { pathLength: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: reduzido ? 0.3 : 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
