'use client';

import { useEffect, useState } from 'react';

const KEY = 'te:salvos';

const ler = (): string[] => {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
};

/**
 * Ícone de salvar (coração) — lembrete local, no navegador de quem visita.
 * Não é carrinho: nada é enviado a lugar nenhum.
 */
export default function SaveButton({ slug, nome }: { slug: string; nome: string }) {
  const [salvo, setSalvo] = useState(false);

  useEffect(() => setSalvo(ler().includes(slug)), [slug]);

  const alternar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const atual = ler();
    const proximo = atual.includes(slug) ? atual.filter((s) => s !== slug) : [...atual, slug];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(proximo));
    } catch {
      /* modo privado — segue só no estado local */
    }
    setSalvo(proximo.includes(slug));
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={salvo}
      aria-label={salvo ? `Remover ${nome} dos salvos` : `Salvar ${nome}`}
      className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-sand/25 bg-charcoal/25 text-sand opacity-0 backdrop-blur-[3px] transition-all duration-500 ease-calm hover:border-gold-soft focus-visible:opacity-100 group-hover:opacity-100 [@media(pointer:coarse)]:opacity-100"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path
          d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.2Z"
          fill={salvo ? 'var(--gold-soft)' : 'none'}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
