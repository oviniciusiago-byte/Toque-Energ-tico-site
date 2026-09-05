"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Star from "@/components/Star";
import Texto from "@/components/Texto";
import { home, site } from "@/content/site";
import { HERO } from "@/lib/media";
import { lenis } from "@/lib/motion";
import { wppLink, wppMsg } from "@/lib/whatsapp";

/**
 * ABERTURA atrelada ao scroll.
 *
 * A seção fica FIXADA enquanto o scroll a atravessa: o fundo faz um zoom-out
 * lento, o título sobe e se dissolve em ritmos diferentes por linha, e a
 * assinatura desaparece por último. Nada disso é "animação ao entrar" — cada
 * valor é função do progresso do scroll, então o gesto de voltar desfaz o
 * movimento na mesma medida.
 *
 * Sob prefers-reduced-motion nada é fixado: vira uma abertura estática.
 */
export default function HeroScrub() {
  const envoltorioRef = useRef<HTMLDivElement>(null);
  const raizRef = useRef<HTMLDivElement>(null);
  const fundoRef = useRef<HTMLDivElement>(null);
  const linhasRef = useRef<(HTMLSpanElement | null)[]>([]);
  const apoioRef = useRef<HTMLDivElement>(null);
  const rodapeRef = useRef<HTMLDivElement>(null);
  const [reduzido, setReduzido] = useState(false);
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [videoPronto, setVideoPronto] = useState(false);

  useEffect(() => {
    setReduzido(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!HERO.videoAtivo || reduzido) return;
    const conn = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g|slow-2g|3g/.test(conn.effectiveType)) return;
    const t = window.setTimeout(() => setMostrarVideo(true), 400);
    return () => window.clearTimeout(t);
  }, [reduzido]);

  useEffect(() => {
    if (reduzido || !raizRef.current) return;

    let limpar = () => {};
    let cancelado = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelado || !raizRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const envoltorio = envoltorioRef.current;
      if (!envoltorio) return;

      /*
        SEM `pin`. O pin do ScrollTrigger envolve o elemento fixado num
        `pin-spacer` — ou seja, INSERE um nó de DOM em volta de algo que o
        React renderizou. Na troca de rota o React tenta remover o filho do pai
        que ele anotou, o pai real virou o pin-spacer, e estoura
        `NotFoundError: Failed to execute 'removeChild' on 'Node'`.

        Não era hipótese: reproduzido em build de produção local, saindo da
        home para qualquer página. Com `pin: false` a navegação volta a
        funcionar. `kill(true)` na limpeza não resolve — o React não garante
        que a limpeza do efeito rode antes de deletar o nó.

        Quem prende agora é `position: sticky`, o mesmo motor da cena dos
        banhos e da fileira horizontal. O envoltório recebe altura = percurso
        + uma tela; o ScrollTrigger só lê progresso e escreve transform.
      */
      const percurso = () => window.innerHeight * 1.2;

      const ajustarAltura = () => {
        envoltorio.style.height = `${percurso() + window.innerHeight}px`;
        lenis()?.resize();
      };
      ajustarAltura();
      ScrollTrigger.addEventListener("refreshInit", ajustarAltura);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: envoltorio,
          start: "top top",
          end: () => `+=${percurso()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // o fundo recua devagar — a sensação de afastamento
      tl.to(fundoRef.current, { scale: 1.16, yPercent: 6, ease: "none" }, 0);

      /*
        Cada linha do título sai num ritmo próprio — a de baixo primeiro.
        A saída era `yPercent: -110` atrás de uma máscara. A máscara caiu
        junto com a entrada por máscara: `overflow: hidden` corta o halo do
        desfoque e o blur vira um borrão em forma de retângulo. Sair
        desfocando para cima é o mesmo gesto que o resto do site usa quando o
        texto some — hero e corpo passam a falar a mesma língua.
      */
      const linhas = linhasRef.current.filter(Boolean) as HTMLSpanElement[];
      linhas.forEach((linha, i) => {
        tl.to(
          linha,
          { y: -80, opacity: 0, filter: "blur(14px)", ease: "none" },
          0.06 * (linhas.length - 1 - i),
        );
      });

      tl.to(
        apoioRef.current,
        { y: -60, opacity: 0, filter: "blur(10px)", ease: "none" },
        0.1,
      );
      tl.to(rodapeRef.current, { opacity: 0, ease: "none" }, 0.5);

      ScrollTrigger.refresh();
      limpar = () => {
        ScrollTrigger.removeEventListener("refreshInit", ajustarAltura);
        tl.scrollTrigger?.kill();
        tl.kill();
        envoltorio.style.height = "";
      };
    })();

    return () => {
      cancelado = true;
      limpar();
    };
  }, [reduzido]);

  const linhasDoTitulo = home.hero.titulo.replace(/\.$/, "").split(", ");

  return (
    <div ref={envoltorioRef} className="relative">
      <div
        ref={raizRef}
        data-surface="image"
        className="surface-image sticky top-0 isolate h-[100svh] overflow-hidden bg-ink text-[color:var(--s-fg)]"
        aria-label={`${site.nome} — ${site.assinatura}`}
      >
        {/* fundo */}
        <div
          ref={fundoRef}
          className="absolute inset-0 -z-10 will-change-transform"
        >
          <Image
            src={HERO.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {mostrarVideo && (
            <video
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-calm ${
                videoPronto ? "opacity-100" : "opacity-0"
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

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to top, rgb(var(--ink-rgb) / 0.78) 0%, rgb(var(--ink-rgb) / 0.34) 46%, rgb(var(--ink-rgb) / 0.12) 100%)",
          }}
        />

        {/* conteúdo */}
        <div className="relative flex h-full flex-col justify-end">
          <div className="shell pb-14 pt-40 sm:pb-20">
            <div className="grid-12 items-end gap-y-10">
              <h1 className="col-span-4 md:col-span-8">
                <Texto variante="rotulo" as="span" className="label mb-7 block">
                  {home.hero.kicker}
                </Texto>
                {linhasDoTitulo.map((parte, i) => (
                  /* Sem `overflow: hidden` aqui: ele cortaria o halo do
                   desfoque, das letras entrando e da linha inteira saindo. */
                  <span key={parte} className="block">
                    <span
                      ref={(el) => {
                        linhasRef.current[i] = el;
                      }}
                      className="block will-change-transform"
                    >
                      <Texto
                        variante="titulo"
                        as="span"
                        atraso={0.12 * i}
                        className={`display block text-d1 leading-[0.94] ${
                          i === linhasDoTitulo.length - 1 ? "italic" : ""
                        }`}
                      >
                        {parte}
                        {i < linhasDoTitulo.length - 1 ? "," : "."}
                      </Texto>
                    </span>
                  </span>
                ))}
              </h1>

              <div ref={apoioRef} className="col-span-4 md:col-span-4">
                <Texto
                  variante="texto"
                  as="p"
                  atraso={0.3}
                  className="body max-w-prose-sm"
                >
                  {home.hero.subtitulo}
                </Texto>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link
                    href={home.hero.ctaPrimario.href}
                    className="btn btn-solid"
                  >
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
                </div>
              </div>
            </div>
          </div>

          <div ref={rodapeRef} className="shell pb-8">
            <div className="rule" />
            <div className="flex items-center justify-between gap-6 pt-5">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {site.tresPalavras.map((palavra) => (
                  <li key={palavra} className="label-quiet">
                    {palavra}
                  </li>
                ))}
              </ul>
              <Star
                size={14}
                orbita={false}
                className="shrink-0 text-[color:var(--s-accent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
