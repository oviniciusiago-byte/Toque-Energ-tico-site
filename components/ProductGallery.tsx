'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

/**
 * Galeria de produto: foto grande + miniaturas.
 * Troca por fade lento; retângulos limpos, sem sombra.
 */
export default function ProductGallery({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [atual, setAtual] = useState(0);
  const reduzido = useReducedMotion();

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start sm:gap-6">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden"
        style={{ backgroundColor: 'var(--s-fill)' }}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={atual}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduzido ? 0.15 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={imagens[atual]}
              alt={`${nome} — foto ${atual + 1} de ${imagens.length}`}
              fill
              priority={atual === 0}
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {imagens.length > 1 ? (
        <div
          className="flex gap-3 sm:flex-col"
          role="group"
          aria-label={`Fotos de ${nome}`}
        >
          {imagens.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setAtual(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === atual}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden transition-opacity duration-500 ease-calm sm:w-[4.5rem] ${
                i === atual ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ backgroundColor: 'var(--s-fill)' }}
            >
              <Image src={src} alt="" fill sizes="72px" className="object-cover" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border transition-colors duration-500"
                style={{ borderColor: i === atual ? 'var(--s-accent)' : 'transparent' }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
