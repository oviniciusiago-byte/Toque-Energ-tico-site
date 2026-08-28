'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Som ambiente — um único <audio> persistente no root layout.
 *
 * Regras da marca:
 *  · começa SEMPRE desligado (nunca autoplay com som);
 *  · só toca depois de um gesto do usuário;
 *  · fade-in lento até um volume baixo, fade-out suave ao desligar;
 *  · a preferência é lembrada, mas no reload nada toca sozinho: o toggle fica
 *    "armado" e o som volta no primeiro gesto real da pessoa.
 *
 * TODO: substituir /public/audio/ambient.m4a pelo som ambiente definitivo
 * (qualquer formato que o browser toque — .m4a, .mp3, .ogg). Basta trocar
 * AUDIO_SRC abaixo.
 */
export const AUDIO_SRC = '/audio/ambient.m4a';
export const AUDIO_VOLUME_ALVO = 0.25;
const FADE_IN_MS = 1200;
const FADE_OUT_MS = 700;
const STORAGE_KEY = 'te:sound';

interface AudioCtx {
  ligado: boolean;
  /** true quando a preferência era "ligado" mas o browser ainda não liberou o play. */
  armado: boolean;
  alternar: () => void | Promise<void>;
}

const Ctx = createContext<AudioCtx>({ ligado: false, armado: false, alternar: () => {} });

export const useAudio = () => useContext(Ctx);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [ligado, setLigado] = useState(false);
  const [armado, setArmado] = useState(false);

  const pararFade = () => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  };

  /** Rampa de volume por rAF — nada de som entrando alto. */
  const fade = useCallback((de: number, para: number, ms: number, aoFim?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    pararFade();
    const inicio = performance.now();
    el.volume = de;
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / ms);
      // easeOutCubic: entra rápido e assenta devagar
      const e = 1 - Math.pow(1 - t, 3);
      el.volume = Math.max(0, Math.min(1, de + (para - de) * e));
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(passo);
      } else {
        fadeRef.current = null;
        aoFim?.();
      }
    };
    fadeRef.current = requestAnimationFrame(passo);
  }, []);

  const tocar = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return false;
    el.volume = 0;
    try {
      await el.play();
    } catch {
      // Autoplay bloqueado — silencioso de propósito, sem erro no console.
      return false;
    }
    fade(0, AUDIO_VOLUME_ALVO, FADE_IN_MS);
    return true;
  }, [fade]);

  const parar = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    fade(el.volume, 0, FADE_OUT_MS, () => el.pause());
  }, [fade]);

  const guardar = (valor: 'on' | 'off') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, valor);
    } catch {
      /* localStorage indisponível (modo privado) — segue sem persistir. */
    }
  };

  const alternar = useCallback(async () => {
    if (ligado) {
      parar();
      setLigado(false);
      setArmado(false);
      guardar('off');
      return;
    }
    // Se o browser bloquear o play, o toggle continua desligado (e "armado"),
    // em vez de mentir que o som está tocando.
    const ok = await tocar();
    setLigado(ok);
    setArmado(!ok);
    guardar(ok ? 'on' : 'off');
  }, [ligado, tocar, parar]);

  // Preferência salva: arma o toggle, mas não força play.
  useEffect(() => {
    let pref: string | null = null;
    try {
      pref = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    if (pref !== 'on') return;

    setArmado(true);
    const religar = async () => {
      const ok = await tocar();
      if (ok) {
        setLigado(true);
        setArmado(false);
        limpar();
      }
    };
    const limpar = () => {
      window.removeEventListener('pointerdown', religar);
      window.removeEventListener('keydown', religar);
      window.removeEventListener('touchstart', religar);
    };
    window.addEventListener('pointerdown', religar, { passive: true });
    window.addEventListener('keydown', religar);
    window.addEventListener('touchstart', religar, { passive: true });
    return limpar;
  }, [tocar]);

  useEffect(() => pararFade, []);

  return (
    <Ctx.Provider value={{ ligado, armado, alternar }}>
      {/*
        Fica fora de qualquer transição de rota: o som não corta ao navegar.
        aria-hidden + sem controles: é decorativo, comandado pelo toggle do header.
      */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      {children}
    </Ctx.Provider>
  );
}
