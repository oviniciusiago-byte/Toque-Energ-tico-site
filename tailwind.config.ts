import type { Config } from 'tailwindcss';

/**
 * As cores vivem em `app/globals.css`.
 * Aqui elas são expostas ao Tailwind em canais RGB, para que os modificadores
 * de opacidade funcionem (`bg-charcoal/60`, `text-sand/70`).
 *
 * Cores de SUPERFÍCIE (`surface-*`) não são classes de cor: são as classes que
 * uma seção usa para definir fundo + texto + hairline + acento de uma vez.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: 'rgb(var(--sand-rgb) / <alpha-value>)',
        cream: 'rgb(var(--cream-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        'gold-soft': 'rgb(var(--gold-soft-rgb) / <alpha-value>)',
        'gold-deep': 'rgb(var(--gold-deep-rgb) / <alpha-value>)',
        'ink-gold': 'rgb(var(--ink-gold-rgb) / <alpha-value>)',
        charcoal: 'rgb(var(--charcoal-rgb) / <alpha-value>)',
        concrete: 'rgb(var(--concrete-rgb) / <alpha-value>)',
        wood: 'rgb(var(--wood-rgb) / <alpha-value>)',
        forest: 'rgb(var(--forest-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        // tokens da superfície ativa — para uso pontual em arbitrary values
        s: {
          bg: 'var(--s-bg)',
          fg: 'var(--s-fg)',
          muted: 'var(--s-muted)',
          faint: 'var(--s-faint)',
          line: 'var(--s-line)',
          'line-strong': 'var(--s-line-strong)',
          accent: 'var(--s-accent)',
          fill: 'var(--s-fill)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // escala editorial fluida
        d1: ['clamp(2.9rem, 1.5rem + 6vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.022em' }],
        d2: ['clamp(2.1rem, 1.4rem + 3.2vw, 4.4rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        d3: ['clamp(1.6rem, 1.25rem + 1.6vw, 2.6rem)', { lineHeight: '1.14', letterSpacing: '-0.014em' }],
        d4: ['clamp(1.2rem, 1.08rem + 0.6vw, 1.6rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        d5: ['clamp(1.02rem, 0.98rem + 0.3vw, 1.22rem)', { lineHeight: '1.4' }],
      },
      spacing: {
        // ritmo vertical dos blocos de cor
        block: 'clamp(4.5rem, 3.5rem + 6vw, 9.5rem)',
        'block-sm': 'clamp(3rem, 2.5rem + 3vw, 5.5rem)',
        'block-lg': 'clamp(6rem, 4.5rem + 8vw, 13rem)',
      },
      maxWidth: {
        prose: '38rem',
        'prose-sm': '30rem',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
