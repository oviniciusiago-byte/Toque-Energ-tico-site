'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import SoundToggle from '@/components/SoundToggle';
import { anuncio, nav, navSecundaria, site } from '@/content/site';
import { categoriasVisiveis } from '@/content/categorias';
import { wppLink, wppMsg } from '@/lib/whatsapp';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Header() {
  const pathname = usePathname();
  const reduzido = useReducedMotion();
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  /**
   * O header precisa saber se o PRIMEIRO bloco da página é claro ou escuro:
   * antes de rolar ele é transparente, e tinta escura sobre bloco escuro fica
   * invisível. Em vez de fixar por rota, lê a superfície do primeiro bloco.
   */
  const [topoEscuro, setTopoEscuro] = useState(true);
  const sobreEscuro = topoEscuro && !rolou;

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => setMenuAberto(false), [pathname]);

  useEffect(() => {
    const primeiro = document.querySelector<HTMLElement>('main [data-surface]');
    const superficie = primeiro?.dataset.surface;
    setTopoEscuro(
      !superficie || ['ink', 'smoke', 'olive', 'moss', 'noir', 'concrete', 'image'].includes(superficie),
    );
  }, [pathname]);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    if (menuAberto) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAberto]);

  useEffect(() => {
    if (!menuAberto) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [menuAberto]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.16em] focus:text-paper"
      >
        Ir para o conteúdo
      </a>

      {/* Faixa de anúncio + header no MESMO container fixo: assim o header
          nunca depende de um valor mágico de `top` e a faixa pode encolher. */}
      <div className="fixed inset-x-0 top-0 z-50">
        <motion.div
          aria-hidden={rolou}
          initial={false}
          animate={{ height: rolou ? 0 : 'auto', opacity: rolou ? 0 : 1 }}
          transition={{ duration: reduzido ? 0.2 : 0.6, ease: EASE }}
          className="surface surface-ink overflow-hidden"
        >
          <div className="shell py-2.5">
            <p className="text-center font-sans text-[0.68rem] leading-relaxed tracking-[0.06em] text-[color:var(--s-muted)]">
              {anuncio.texto}
            </p>
          </div>
        </motion.div>

        <motion.header
          initial={false}
          animate={{
            backgroundColor: rolou ? 'rgb(var(--ink-rgb) / 0.94)' : 'rgb(var(--ink-rgb) / 0)',
          }}
          transition={{ duration: reduzido ? 0.2 : 0.6, ease: EASE }}
          /*
            Ao rolar, o header fica sólido escuro. Translúcido sobre seções que
            trocam de cor é frágil: o texto some quando passa por um bloco
            claro. Sólido é previsível e sempre legível.
          */
          className={`${rolou ? 'backdrop-blur-[10px]' : ''} ${
            rolou || sobreEscuro ? 'surface-ink' : 'surface-paper'
          }`}
          style={{ color: 'var(--s-fg)' }}
        >
        <div className="shell">
          <motion.div
            initial={false}
            animate={{ paddingTop: rolou ? 14 : 20, paddingBottom: rolou ? 14 : 20 }}
            transition={{ duration: reduzido ? 0.2 : 0.6, ease: EASE }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
          >
            <Link
              href="/"
              aria-label={`${site.nome} — início`}
              className="shrink-0 transition-opacity duration-500 hover:opacity-70"
            >
              <Logo compacto={rolou} />
            </Link>

            <nav aria-label="Navegação principal" className="hidden justify-center md:flex">
              <ul className="flex items-center gap-9">
                {nav.map((item) => {
                  const ativo =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={ativo ? 'page' : undefined}
                        className={`link-quiet font-sans text-[0.7rem] uppercase tracking-[0.2em] transition-opacity duration-500 ${
                          ativo ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center justify-end gap-2.5">
              <SoundToggle />

              <a
                href={wppLink(wppMsg.geral)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm hidden sm:inline-flex"
              >
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setMenuAberto(true)}
                aria-label="Abrir menu"
                aria-expanded={menuAberto}
                className="control gap-2 px-4 md:hidden"
              >
                <span className="flex flex-col gap-[4px]" aria-hidden="true">
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                </span>
                <span className="font-sans text-[0.62rem] uppercase tracking-[0.18em]">
                  Menu
                </span>
              </button>
            </div>
          </motion.div>
        </div>
        </motion.header>
      </div>

      {/* Drawer mobile — tela cheia, links serifados numerados */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="surface surface-ink texture fixed inset-0 z-[70] overflow-y-auto md:hidden"
            initial={reduzido ? { opacity: 0 } : { opacity: 0, y: '-3%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduzido ? { opacity: 0 } : { opacity: 0, y: '-3%' }}
            transition={{ duration: reduzido ? 0.2 : 0.55, ease: EASE }}
          >
            <div className="shell relative flex min-h-full flex-col py-6">
              <div className="flex items-center justify-between">
                <Logo compacto />
                <button
                  type="button"
                  onClick={() => setMenuAberto(false)}
                  aria-label="Fechar menu"
                  className="control gap-2 px-4"
                >
                  <span aria-hidden="true" className="relative block h-3.5 w-3.5">
                    <span className="absolute left-0 top-1/2 block h-px w-3.5 rotate-45 bg-current" />
                    <span className="absolute left-0 top-1/2 block h-px w-3.5 -rotate-45 bg-current" />
                  </span>
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.18em]">
                    Fechar
                  </span>
                </button>
              </div>

              <nav aria-label="Navegação" className="mt-14 flex-1">
                <ul>
                  {nav.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={reduzido ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: EASE }}
                      className="border-b border-[color:var(--s-line)]"
                    >
                      <Link href={item.href} className="flex items-baseline gap-4 py-5">
                        <span className="label-quiet tnum">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="display text-d3">{item.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <p className="label mt-12">Categorias</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {categoriasVisiveis.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/catalogo/${c.slug}`}
                        className="inline-flex rounded-full border border-[color:var(--s-line)] px-3.5 py-2 font-sans text-[0.68rem] text-[color:var(--s-muted)]"
                      >
                        {c.nomeCurto ?? c.nome}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="mt-12 flex flex-col gap-3">
                  {navSecundaria.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--s-faint)]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <a
                href={wppLink(wppMsg.geral)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid mt-12 w-full"
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
