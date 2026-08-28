'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lenis — rolagem lenta e orgânica, sincronizada com o ScrollTrigger do GSAP.
 * GSAP entra por dynamic import (fica fora do bundle inicial).
 * Sob prefers-reduced-motion, o Lenis não é inicializado.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let destruir = () => {};
    let cancelado = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelado) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.4,
        // easing sereno — o scroll assenta em vez de parar
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.1,
      });

      // deixa o Lenis acessível para âncoras internas
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      destruir = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    })();

    return () => {
      cancelado = true;
      destruir();
    };
  }, []);

  // Troca de rota: volta ao topo sem "pulo" perceptível.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number, o?: object) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
