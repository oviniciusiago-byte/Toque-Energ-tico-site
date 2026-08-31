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
      className={`control ${className}`}
    >
      <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-current transition-[height,opacity] duration-500 ease-calm"
            style={{
              height: ligado ? (i === 1 ? '100%' : '58%') : '22%',
              opacity: ligado ? 0.95 : 0.5,
              animation:
                ligado && !reduzido
                  ? `te-eq 1.${4 + i}s ${i * 0.18}s ease-in-out infinite`
                  : undefined,
            }}
          />
        ))}
      </span>

      <style jsx>{`
        @keyframes te-eq {
          0%,
          100% {
            height: 26%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </button>
  );
}
