import { disponibilidades } from '@/content/site';
import type { Disponibilidade } from '@/lib/types';

/**
 * Badge de disponibilidade — hairline, nunca preenchimento chapado.
 * `pronta-entrega` recebe o acento da superfície; os outros ficam discretos.
 */
export default function Badge({
  disponibilidade,
  comNota = false,
  className = '',
}: {
  disponibilidade: Disponibilidade;
  comNota?: boolean;
  className?: string;
}) {
  const info = disponibilidades[disponibilidade];
  const destaque = disponibilidade === 'pronta-entrega';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.16em] ${className}`}
      style={{
        borderColor: 'var(--s-line)',
        color: destaque ? 'var(--s-accent)' : 'var(--s-faint)',
      }}
    >
      <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-current" />
      {info.label}
      {comNota && info.nota ? (
        <span className="tracking-normal [text-transform:none] opacity-75">· {info.nota}</span>
      ) : null}
    </span>
  );
}
