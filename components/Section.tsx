import type { ReactNode } from 'react';

export type Surface =
  | 'sand'
  | 'cream'
  | 'gold'
  | 'charcoal'
  | 'graphite'
  | 'wood'
  | 'forest'
  | 'image';

/**
 * Bloco de cor. Cada seção do site declara a sua superfície e, com isso,
 * define fundo, cor de texto, texto secundário, hairline e acento para tudo
 * que está dentro dela — botões inclusive, que invertem automaticamente.
 *
 * Trocar a cor de uma seção = trocar uma palavra (`surface="forest"`).
 */
export default function Section({
  children,
  surface = 'sand',
  id,
  className = '',
  padding = 'normal',
  texture = false,
  as: Tag = 'section',
  ariaLabel,
}: {
  children: ReactNode;
  surface?: Surface;
  id?: string;
  className?: string;
  padding?: 'none' | 'tight' | 'normal' | 'loose';
  /** textura de papel/pedra — só faz sentido em superfície escura */
  texture?: boolean;
  as?: 'section' | 'div' | 'footer' | 'header';
  ariaLabel?: string;
}) {
  /**
   * Classes LITERAIS de propósito: o Tailwind faz tree-shaking do que está em
   * `@layer components`, e uma classe montada por template string (`surface-${x}`)
   * é invisível para o scanner — a cor sairia purgada do CSS final.
   */
  const cor: Record<Surface, string> = {
    sand: 'surface-sand',
    cream: 'surface-cream',
    gold: 'surface-gold',
    charcoal: 'surface-charcoal',
    graphite: 'surface-graphite',
    wood: 'surface-wood',
    forest: 'surface-forest',
    image: 'surface-image',
  };

  const pad = {
    none: '',
    tight: 'py-block-sm',
    normal: 'py-block',
    loose: 'py-block-lg',
  }[padding];

  const escura = ['charcoal', 'graphite', 'wood', 'forest', 'image'].includes(surface);

  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      data-surface={surface}
      className={`surface ${cor[surface]} relative isolate ${texture && escura ? 'texture' : ''} ${pad} ${className}`}
    >
      {children}
    </Tag>
  );
}
