'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { wppLink } from '@/lib/whatsapp';

/** Botão flutuante de WhatsApp — aparece depois que o hero sai da tela. */
export default function WhatsAppFab({ mensagem }: { mensagem: string }) {
  const [visivel, setVisivel] = useState(false);
  const reduzido = useReducedMotion();

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.8);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.a
          href={wppLink(mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          initial={reduzido ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduzido ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.95 }}
          transition={{ duration: reduzido ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full border border-gold/40 bg-charcoal text-sand shadow-[0_14px_44px_-18px_rgb(26_24_22/0.7)] transition-colors duration-500 ease-calm hover:bg-wood sm:bottom-8 sm:right-8"
          style={{ height: 54, width: 54 }}
        >
          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="currentColor">
            <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.9 9.9 0 0 0 4.88 1.27c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.1c-1.6 0-3.17-.43-4.54-1.24l-.33-.19-3.06.8.82-2.99-.21-.34a8.13 8.13 0 0 1-1.25-4.34c0-4.5 3.66-8.16 8.16-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.3-7.75 8.3Zm4.48-6.1c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.25-.02-.38.1-.5.11-.11.24-.28.36-.42.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.75-1.81-.2-.48-.4-.4-.55-.41h-.47c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.17 1.68 2.66 4.08 3.63 2.4.97 2.4.65 2.83.61.43-.04 1.39-.57 1.59-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
