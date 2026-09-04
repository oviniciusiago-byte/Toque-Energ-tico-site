'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { misturar, parLegivel, tintaPara } from '@/lib/contraste';
import type { Produto } from '@/lib/types';

/**
 * OS OITO BANHOS — cena FIXADA e atrelada ao scroll.
 *
 * A seção gruda na tela e o scroll deixa de rolar a página: ele passa a
 * atravessar os oito preparos. O fundo assume a COR REAL do rótulo de cada
 * banho, o nome troca em tipografia grande, os três verbos entram, e a foto
 * faz crossfade. É a única parte do site em que a cor vem toda dos produtos.
 *
 * Como é feito: um ScrollTrigger com `pin` + `scrub`, onde o progresso (0→1)
 * é fatiado em N passos. Nada de animação "uma vez ao entrar" — a posição da
 * cena é função direta da posição do scroll, então dá para ir e voltar.
 *
 * Acessibilidade: sob prefers-reduced-motion nada é fixado. A cena vira uma
 * lista vertical comum, com as mesmas informações e as mesmas cores.
 */
export default function BathsScene({ banhos }: { banhos: Produto[] }) {
  /* A cor do rótulo entra como fundo de tela cheia, então o par fundo/texto é
     CALCULADO para passar AA — ver lib/contraste.ts. Sete das oito cores
     passam como estão; a Limpeza Densa é escurecida um fio. */
  const cenas = banhos.map((b) => ({ ...b, ...parLegivel(b.cor ?? '#0F0E0C') }));

  const raizRef = useRef<HTMLDivElement>(null);
  const fundoRef = useRef<HTMLDivElement>(null);
  const textoRef = useRef<HTMLDivElement>(null);
  const trilhoRef = useRef<HTMLSpanElement>(null);
  const dentroRef = useRef(0);
  /* Só o passo é estado: nome, foto e contador são discretos. Cor e trilho são
     escritos direto no DOM a cada quadro — ver a nota no onUpdate. */
  const [passo, setPasso] = useState(0);
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    setReduzido(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduzido || !raizRef.current) return;

    let limpar = () => {};
    let cancelado = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelado || !raizRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: raizRef.current,
        start: 'top top',
        // uma "tela" de scroll por banho: o tempo de leitura acompanha o gesto
        end: () => `+=${window.innerHeight * banhos.length}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const total = cenas.length;
          const bruto = self.progress * total;
          const i = Math.min(total - 1, Math.floor(bruto));
          const f = bruto - i;

          /*
            A COR é escrita direto no DOM, sem `transition` e sem estado.
            Com transição CSS ela congelava no meio: o passo mudava antes de a
            transição terminar e o valor computado ficava preso numa cor
            anterior, mesmo com o React já tendo escrito a certa. Aqui a cor é
            função direta do scroll — não há o que ficar pendurado.

            A troca acontece no último terço do passo, então cada banho
            "segura" a sua cor a maior parte do tempo em vez de virar um
            degradê contínuo.
          */
          const t = f < 0.66 ? 0 : (f - 0.66) / 0.34;
          const proximo = cenas[Math.min(total - 1, i + 1)];
          const fundo = misturar(cenas[i].fundo, proximo.fundo, t * t * (3 - 2 * t));

          if (fundoRef.current) fundoRef.current.style.backgroundColor = fundo;
          if (textoRef.current) textoRef.current.style.color = tintaPara(fundo);
          if (trilhoRef.current) {
            trilhoRef.current.style.width = `${self.progress * 100}%`;
            trilhoRef.current.style.backgroundColor = tintaPara(fundo);
          }

          dentroRef.current = f;

          /*
            O nome troca no MEIO da mistura de cor (f ≈ 0.83), não na borda do
            passo. Antes, no último terço, o fundo já era o do próximo banho
            enquanto o nome ainda era o anterior — os dois discordavam. Assim
            nome, foto e cor cruzam juntos.
          */
          setPasso(f > 0.83 ? Math.min(total - 1, i + 1) : i);
        },
      });

      ScrollTrigger.refresh();
      limpar = () => st.kill();
    })();

    return () => {
      cancelado = true;
      limpar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduzido, banhos.length]);

  /* ---------------- versão sem movimento: lista vertical ---------------- */
  if (reduzido) {
    return (
      <div>
        {cenas.map((b) => (
          <section
            key={b.slug}
            className="flex min-h-[70svh] items-center py-block"
            style={{ backgroundColor: b.fundo, color: b.texto }}
          >
            <div className="shell grid-12 items-center gap-y-10">
              <div className="col-span-4 md:col-span-6">
                <p className="font-sans text-[0.7rem] uppercase tracking-[0.24em] opacity-70">
                  {b.subtitulo ?? 'Banho & escalda-pés'}
                </p>
                <h3 className="display mt-4 text-d1">{b.nome}</h3>
                <p className="mt-6 font-sans text-[0.78rem] uppercase tracking-[0.2em] opacity-75">
                  {b.conceito.join(' · ')}
                </p>
                <Link
                  href={`/produto/${b.slug}`}
                  className="mt-9 inline-flex border-b border-current pb-1 font-sans text-[0.72rem] uppercase tracking-[0.18em]"
                >
                  Ver o banho
                </Link>
              </div>
              <div className="col-span-4 md:col-span-5 md:col-start-8">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={b.imagens[0]}
                    alt={`${b.nome} — ${b.subtitulo ?? 'banho e escalda-pés'}`}
                    fill
                    sizes="(max-width: 768px) 88vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  /* ---------------------------- cena fixada ---------------------------- */
  const atual = cenas[passo];
  const dentro = dentroRef.current;

  return (
    <div ref={raizRef} className="relative h-[100svh] overflow-hidden">
      {/* fundo: a cor do rótulo, em transição */}
      <div ref={fundoRef} className="absolute inset-0" style={{ backgroundColor: atual.fundo }} />

      <div ref={textoRef} className="relative flex h-full items-center" style={{ color: atual.texto }}>
        <div className="shell grid-12 w-full items-center gap-y-10">
          {/* texto */}
          <div className="col-span-4 md:col-span-6">
            {cenas.map((b, i) => (
              <div
                key={b.slug}
                aria-hidden={i !== passo}
                className="col-start-1 row-start-1"
                style={{
                  display: i === passo ? 'block' : 'none',
                }}
              >
                <p className="mt-5 font-sans text-[0.7rem] uppercase tracking-[0.24em] opacity-70">
                  {b.subtitulo ?? 'Banho & escalda-pés'}
                </p>
                <h3
                  className="display mt-4 text-d1 leading-[0.95]"
                  style={{
                    /* o nome sobe devagar dentro do próprio passo */
                    transform: `translateY(${(0.5 - dentro) * 14}px)`,
                  }}
                >
                  {b.nome}
                </h3>
                <p className="mt-7 font-sans text-[0.76rem] uppercase tracking-[0.2em] opacity-75">
                  {b.conceito.join(' · ')}
                </p>
                <Link
                  href={`/produto/${b.slug}`}
                  className="mt-10 inline-flex border-b border-current pb-1 font-sans text-[0.72rem] uppercase tracking-[0.18em] transition-opacity duration-500 hover:opacity-60"
                >
                  Ver o banho
                </Link>
              </div>
            ))}
          </div>

          {/* foto: crossfade entre os banhos */}
          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <div className="relative aspect-[4/5] w-full">
              {cenas.map((b, i) => (
                <div
                  key={b.slug}
                  className="absolute inset-0 transition-opacity duration-[520ms]"
                  style={{
                    opacity: i === passo ? 1 : 0,
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <Image
                    src={b.imagens[0]}
                    alt={i === passo ? `${b.nome} — ${b.subtitulo ?? ''}` : ''}
                    fill
                    sizes="(max-width: 768px) 88vw, 40vw"
                    className="object-cover"
                    style={{
                      transform: `scale(${1.06 - dentro * 0.06})`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trilho de progresso CONTÍNUO: acompanha o scroll quadro a quadro, não
          o passo. É o elemento que deixa claro que a cena responde ao gesto. */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="shell">
          <div
            className="relative h-px w-full"
            style={{ backgroundColor: atual.texto, opacity: 0.18 }}
          >
            <span
              ref={trilhoRef}
              className="absolute inset-y-0 left-0"
              style={{ width: '0%', backgroundColor: atual.texto, opacity: 0.55 }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span
              className="font-sans text-[0.62rem] tabular-nums tracking-[0.2em]"
              style={{ color: atual.texto, opacity: 0.6 }}
            >
              {String(passo + 1).padStart(2, '0')} / {String(cenas.length).padStart(2, '0')}
            </span>
            <span
              className="font-sans text-[0.6rem] uppercase tracking-[0.24em]"
              style={{ color: atual.texto, opacity: 0.45 }}
            >
              Role para atravessar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
