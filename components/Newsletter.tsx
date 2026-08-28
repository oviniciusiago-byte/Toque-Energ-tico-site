'use client';

import { useState } from 'react';
import { newsletter } from '@/content/site';

/**
 * Newsletter — apenas UI. Não há backend nesta versão base.
 * TODO: conectar a um serviço de e-mail (Mailchimp, Beehiiv, etc.).
 */
export default function Newsletter() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div>
      <h2 className="label">{newsletter.titulo}</h2>
      <p className="body mt-6 text-[0.9rem]">{newsletter.texto}</p>

      <form
        className="mt-6 flex items-center gap-3 border-b pb-2"
        style={{ borderColor: 'var(--s-line)' }}
        onSubmit={(e) => {
          e.preventDefault();
          setEnviado(true);
        }}
      >
        <label htmlFor="footer-email" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="footer-email"
          type="email"
          name="email"
          required
          placeholder={newsletter.placeholder}
          autoComplete="email"
          className="w-full bg-transparent font-sans text-[0.9rem] text-[color:var(--s-fg)] placeholder:text-[color:var(--s-faint)] focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--s-accent)]"
        >
          {newsletter.cta}
        </button>
      </form>

      <p
        aria-live="polite"
        className="mt-4 font-sans text-[0.72rem] leading-relaxed"
        style={{ color: enviado ? 'var(--s-accent)' : 'var(--s-faint)' }}
      >
        {newsletter.aviso}
      </p>
    </div>
  );
}
