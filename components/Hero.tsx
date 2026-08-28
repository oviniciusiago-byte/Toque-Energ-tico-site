'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { home, site } from '@/content/site';
import { HERO } from '@/lib/media';
import { wppLink, wppMsg } from '@/lib/whatsapp';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * HERO — vídeo full-screen com o texto sobreposto na base (referência:
 * duyvenvoorde.nl). O poster é o LCP e aparece primeiro, sempre; o vídeo entra
 * por cima com fade quando estiver pronto.
 *
 * Sob prefers-reduced-motion, conexão fraca ou economia de dados: só o poster.
 */
export default function Hero() {
  const secaoRef = useRef<HTMLElement>(null);
  const fundoRef = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [videoPronto, setVideoPronto] = useState(false);

  useEffect(() => {
    if (!HERO.videoAtivo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const conn = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g|slow-2g|3g/.test(conn.effectiveType)) return;

    const t = window.setTimeout(() => setMostrarVideo(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  // Parallax lento do fundo (GSAP entra por dynamic import).
  useEffect(() => {
    if (reduzido) return;
    let limpar = () => {};
    let cancelado = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelado || !fundoRef.current || !secaoRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.to(fundoRef.current, {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: secaoRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      limpar = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => {
      cancelado = true;
      limpar();
    };
  }, [reduzido]);

  return (
    <section
      ref={secaoRef}
      aria-label={`${site.nome} — ${site.assinatura}`}
      className="surface-image relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-charcoal text-[color:var(--s-fg)]"
    >
      {/* fundo: poster + vídeo */}
      <div ref={fundoRef} className="absolute inset-0 -z-10 will-change-transform">
        <Image src={HERO.poster} alt="" fill priority sizes="100vw" className="object-cover" />

        {mostrarVideo && (
          <video
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-calm ${
              videoPronto ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            autoPlay
            loop
            playsInline
            preload="none"
            poster={HERO.poster}
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setVideoPronto(true)}
            onError={() => {
              setMostrarVideo(false);
              setVideoPronto(false);
            }}
          >
            <source src={HERO.video.webm} type="video/webm" />
            <source src={HERO.video.mp4} type="video/mp4" />
          </video>
        )}
      </div>

      {/* overlay tonal — legibilidade sem perder o clima intimista */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(to top, rgb(var(--charcoal-rgb) / 0.88) 0%, rgb(var(--charcoal-rgb) / 0.55) 38%, rgb(var(--charcoal-rgb) / 0.24) 70%, rgb(var(--charcoal-rgb) / 0.52) 100%)`,
        }}
      />

      {/* conteúdo */}
      <div className="shell relative w-full pb-14 pt-40 sm:pb-20">
        <motion.div
          initial="oculto"
          animate="visivel"
          variants={{ visivel: { transition: { staggerChildren: 0.13, delayChildren: 0.3 } } }}
          className="grid-12 items-end gap-y-10"
        >
          <div className="col-span-4 md:col-span-8">
            <Linha reduzido={reduzido}>
              <span className="label">{home.hero.kicker}</span>
            </Linha>

            <h1 className="display mt-7 text-d1">
              {home.hero.titulo.split(', ').map((parte, i, arr) => (
                <Linha key={parte} reduzido={reduzido}>
                  <span className={i === arr.length - 1 ? 'italic' : ''}>
                    {parte}
                    {i < arr.length - 1 ? ',' : ''}
                  </span>
                </Linha>
              ))}
            </h1>
          </div>

          <div className="col-span-4 md:col-span-4">
            <Linha reduzido={reduzido}>
              <p className="body max-w-prose-sm text-[color:var(--s-muted)]">
                {home.hero.subtitulo}
              </p>
            </Linha>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              variants={{
                oculto: { opacity: 0, y: 16 },
                visivel: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
            >
              <Link href={home.hero.ctaPrimario.href} className="btn btn-solid">
                {home.hero.ctaPrimario.label}
              </Link>
              <a
                href={wppLink(wppMsg.geral)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                {home.hero.ctaSecundario.label}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* rodapé do hero: três palavras + convite para rolar */}
      <div className="shell relative w-full pb-8">
        <div className="rule" />
        <div className="flex items-center justify-between gap-6 pt-5">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {site.tresPalavras.map((palavra) => (
              <li key={palavra} className="label-quiet">
                {palavra}
              </li>
            ))}
          </ul>
          <span className="label-quiet hidden sm:block" aria-hidden="true">
            Role
          </span>
        </div>
      </div>
    </section>
  );
}

/** Linha que sobe de dentro de um recorte. */
function Linha({
  children,
  reduzido,
}: {
  children: React.ReactNode;
  reduzido: boolean | null;
}) {
  return (
    <span className="mask-line block overflow-hidden">
      <motion.span
        className="block"
        variants={{
          oculto: reduzido ? { opacity: 0 } : { y: '108%', opacity: 0 },
          visivel: {
            y: '0%',
            opacity: 1,
            transition: { duration: reduzido ? 0.4 : 1.25, ease: EASE },
          },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
