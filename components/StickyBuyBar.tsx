'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { wppLink } from '@/lib/whatsapp';

/**
 * Barra fixa de pedido (mobile) — aparece quando o CTA do topo sai da tela.
 * Não é carrinho: é o atalho para o WhatsApp com a mensagem já preenchida.
 */
export default function StickyBuyBar({
  nome,
  preco,
  volume,
  mensagem,
  cta,
}: {
  nome: string;
  preco?: string;
  volume?: string;
  mensagem: string;
  cta: string;
}) {
  const [visivel, setVisivel] = useState(false);
  const reduzido = useReducedMotion();

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.9);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={reduzido ? { opacity: 0 } : { y: '110%' }}
          animate={reduzido ? { opacity: 1 } : { y: 0 }}
          exit={reduzido ? { opacity: 0 } : { y: '110%' }}
          transition={{ duration: reduzido ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="surface surface-charcoal fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
          style={{ borderColor: 'var(--s-line)' }}
        >
          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="display truncate text-[0.98rem] italic">{nome}</p>
              <p className="label-quiet mt-1">
                {[volume, preco].filter(Boolean).join(' · ')}
              </p>
            </div>
            <a
              href={wppLink(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid btn-sm shrink-0"
            >
              {cta}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
