'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Imagem que entra por CORTINA (clip-path), não por fade: a foto é revelada
 * de baixo para cima enquanto faz um zoom-out lento. É o gesto que dá
 * sensação de peso e intenção — e é o que diferencia de um fade genérico.
 *
 * Sob prefers-reduced-motion a imagem simplesmente aparece.
 */
export default function RevealImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  duracao = 1.5,
  atraso = 0,
  direcao = 'up',
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  duracao?: number;
  atraso?: number;
  direcao?: 'up' | 'down' | 'left';
}) {
  const reduzido = useReducedMotion();

  const fechado =
    direcao === 'up'
      ? 'inset(100% 0% 0% 0%)'
      : direcao === 'down'
        ? 'inset(0% 0% 100% 0%)'
        : 'inset(0% 100% 0% 0%)';

  if (reduzido) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: fechado }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
        transition={{ duration: duracao, delay: atraso, ease: EASE }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.14 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
          transition={{ duration: duracao + 0.5, delay: atraso, ease: EASE }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
