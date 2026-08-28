'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tipografia-manifesto: frase serifada grande que se revela palavra a palavra,
 * cada palavra subindo de dentro de uma máscara de linha.
 */
export default function Manifesto({
  frase,
  className = '',
  italico,
}: {
  frase: string;
  className?: string;
  /** índice(s) de palavra em itálico — acento editorial */
  italico?: number[];
}) {
  const reduzido = useReducedMotion();
  const palavras = frase.split(' ');

  if (reduzido) {
    return (
      <motion.p
        className={`display text-fluid-2xl text-balance ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {frase}
      </motion.p>
    );
  }

  return (
    <motion.p
      className={`display text-fluid-2xl text-balance ${className}`}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-18% 0px -18% 0px' }}
      variants={{ visivel: { transition: { staggerChildren: 0.075 } } }}
      aria-label={frase}
    >
      {palavras.map((palavra, i) => (
        <span
          key={`${palavra}-${i}`}
          className="mask-line mr-[0.26em] inline-block overflow-hidden align-bottom"
          aria-hidden="true"
        >
          <motion.span
            className={`inline-block ${italico?.includes(i) ? 'italic' : ''}`}
            variants={{
              oculto: { y: '110%', opacity: 0 },
              visivel: { y: '0%', opacity: 1, transition: { duration: 1.15, ease: EASE } },
            }}
          >
            {palavra}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}
