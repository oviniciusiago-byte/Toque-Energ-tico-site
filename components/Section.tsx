import type { ReactNode } from 'react';

export type Surface =
  /* base neutra — a casa */
  | 'paper'
  | 'ink'
  | 'smoke'
  /* luz */
  | 'bone' /* creme/Bone — fundo claro principal */
  | 'tan' /* neutro de transição */
  | 'sage' /* sálvia pálido — identidade na luz */
  /* sombra */
  | 'olive' /* Kombu — a sombra principal */
  | 'moss' /* musgo profundo — identidade na sombra */
  | 'noir' /* Café Noir — sombra quente */
  | 'concrete' /* cimento queimado — cenário de produto */
  | 'image'; /* sobre foto ou textura fluida */

/**
 * Bloco de cor. Cada seção do site declara a sua superfície e, com isso,
 * define fundo, cor de texto, texto secundário, hairline e acento para tudo
 * que está dentro dela — botões inclusive, que invertem automaticamente.
 *
 * Trocar a cor de uma seção = trocar uma palavra (`surface="moss"`).
 */
export default function Section({
  children,
  surface = 'bone',
  id,
  className = '',
  padding = 'normal',
  texture = false,
  as: Tag = 'section',
  ariaLabel,
  secao,
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
  /** Nome curto para a trilha lateral (SideRail). */
  secao?: string;
}) {
  /**
   * Classes LITERAIS de propósito: o Tailwind faz tree-shaking do que está em
   * `@layer components`, e uma classe montada por template string (`surface-${x}`)
   * é invisível para o scanner — a cor sairia purgada do CSS final.
   */
  const cor: Record<Surface, string> = {
    paper: 'surface-paper',
    ink: 'surface-ink',
    smoke: 'surface-smoke',
    bone: 'surface-bone',
    tan: 'surface-tan',
    sage: 'surface-sage',
    olive: 'surface-olive',
    moss: 'surface-moss',
    noir: 'surface-noir',
    concrete: 'surface-concrete',
    image: 'surface-image',
  };

  const pad = {
    none: '',
    tight: 'py-block-sm',
    normal: 'py-block',
    loose: 'py-block-lg',
  }[padding];

  const escura = ['ink', 'smoke', 'olive', 'moss', 'noir', 'concrete', 'image'].includes(surface);

  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      data-surface={surface}
      data-secao={secao}
      className={`surface ${cor[surface]} relative isolate ${texture && escura ? 'texture' : ''} ${pad} ${className}`}
    >
      {children}
    </Tag>
  );
}
