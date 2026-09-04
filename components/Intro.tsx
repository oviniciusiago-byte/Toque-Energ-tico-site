'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LogoStacked } from '@/components/Logo';
import { site } from '@/content/site';

const CHAVE = 'te:abertura-vista';
const TEMPO_NA_TELA = 1900;
const TEMPO_DE_SAIDA = 1100;

/**
 * ABERTURA — a estrela e a assinatura aparecem, a cortina sobe.
 *
 * Feita com estado + transição CSS, DE PROPÓSITO: um elemento que cobre a tela
 * inteira não pode depender de uma animação de biblioteca para sair. Na
 * primeira versão, com AnimatePresence, a cortina ficava montada para sempre e
 * travava o site — aqui a saída é uma classe CSS e a desmontagem é um
 * `setTimeout` que sempre roda.
 *
 * Regras que a mantêm educada:
 *  · aparece UMA vez por sessão (sessionStorage), não a cada navegação;
 *  · sob prefers-reduced-motion não aparece;
 *  · fecha no clique, no scroll ou em qualquer tecla;
 *  · o conteúdo do site já está montado atrás — ela não bloqueia carregamento.
 */
export default function Intro() {
  const [fase, setFase] = useState<'fora' | 'entrando' | 'saindo'>('fora');
  const saindoRef = useRef(false);

  const sair = useCallback(() => {
    if (saindoRef.current) return;
    saindoRef.current = true;
    setFase('saindo');
    window.setTimeout(() => setFase('fora'), TEMPO_DE_SAIDA);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (window.sessionStorage.getItem(CHAVE)) return;
      window.sessionStorage.setItem(CHAVE, '1');
    } catch {
      /* modo privado — mostra uma vez e segue */
    }
    setFase('entrando');
  }, []);

  useEffect(() => {
    if (fase !== 'entrando') return;

    const t = window.setTimeout(sair, TEMPO_NA_TELA);
    window.addEventListener('pointerdown', sair, { passive: true });
    window.addEventListener('keydown', sair);
    window.addEventListener('wheel', sair, { passive: true });
    window.addEventListener('touchstart', sair, { passive: true });

    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('pointerdown', sair);
      window.removeEventListener('keydown', sair);
      window.removeEventListener('wheel', sair);
      window.removeEventListener('touchstart', sair);
      document.body.style.overflow = '';
    };
  }, [fase, sair]);

  if (fase === 'fora') return null;

  return (
    <div
      aria-hidden="true"
      className={`surface surface-olive texture fixed inset-0 z-[90] flex flex-col items-center justify-center transition-transform duration-[1100ms] ease-calm ${
        fase === 'saindo' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="te-abertura-marca">
        <LogoStacked size="lg" />
      </div>

      <p className="label-quiet te-abertura-assinatura absolute bottom-12 left-0 right-0 text-center">
        {site.assinatura}
      </p>

      <style jsx>{`
        .te-abertura-marca {
          animation: te-marca 1100ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .te-abertura-assinatura {
          animation: te-assinatura 900ms cubic-bezier(0.22, 1, 0.36, 1) 550ms both;
        }
        @keyframes te-marca {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes te-assinatura {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
