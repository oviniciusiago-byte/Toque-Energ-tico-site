'use client';

import { useAudio } from '@/components/providers/AudioProvider';
import { useReducedMotion } from 'framer-motion';

/**
 * Toggle de som ambiente: três barrinhas de equalizer quando ativo.
 * Sob prefers-reduced-motion as barras não animam — só mudam de estado.
 */
export default function SoundToggle({ className = '' }: { className?: string }) {
  const { ligado, armado, alternar } = useAudio();
  const reduzido = useReducedMotion();

  const rotulo = ligado
    ? 'Desligar som ambiente'
    : armado
      ? 'Ligar som ambiente (toque para retomar)'
      : 'Ligar som ambiente';

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={ligado}
      aria-label={rotulo}
      title={rotulo}
      className={`control gap-0 px-3.5 sm:px-4 ${className}`}
    >
      <span className="flex items-center gap-2" aria-hidden="true">
        {/* Alto-falante: ícone reconhecível de áudio. As ondas aparecem quando
            ligado; quando desligado, o corte diagonal indica "sem som". */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
            fill="currentColor"
            fillOpacity={ligado ? 0.95 : 0.6}
          />
          {ligado ? (
            <>
              <path
                d="M15.6 9.1a4 4 0 0 1 0 5.8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                className={reduzido ? undefined : 'te-onda'}
              />
              <path
                d="M18.2 6.6a7.5 7.5 0 0 1 0 10.8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.65"
                className={reduzido ? undefined : 'te-onda te-onda-2'}
              />
            </>
          ) : (
            <path
              d="M16 9.5l5 5m0-5l-5 5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
        </svg>
        <span className="hidden font-sans text-[0.62rem] uppercase tracking-[0.16em] sm:inline">
          Som
        </span>
      </span>

      <style jsx>{`
        .te-onda {
          animation: te-pulso 2.6s ease-in-out infinite;
        }
        .te-onda-2 {
          animation-delay: 0.35s;
        }
        @keyframes te-pulso {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </button>
  );
}
