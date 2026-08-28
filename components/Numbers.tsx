import { RevealGroup, RevealItem } from '@/components/Reveal';

/** Trio de números editoriais. Os valores vêm da camada de conteúdo. */
export default function Numbers({
  itens,
}: {
  itens: { valor: string; unidade: string; legenda: string }[];
}) {
  return (
    <RevealGroup className="grid gap-y-10 sm:grid-cols-3 sm:gap-x-8" stagger={0.1}>
      {itens.map((n) => (
        <RevealItem key={n.legenda} className="border-t border-[color:var(--s-line)] pt-6">
          <p className="display flex items-baseline gap-2 text-d2">
            <span className="tnum">{n.valor}</span>
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--s-accent)]">
              {n.unidade}
            </span>
          </p>
          <p className="body mt-4 max-w-prose-sm text-[0.9rem]">{n.legenda}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
