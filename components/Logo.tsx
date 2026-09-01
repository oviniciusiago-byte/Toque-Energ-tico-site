import Star from '@/components/Star';

/**
 * Assinatura da marca no header e no drawer.
 * A estrela vem de `components/Star.tsx` — trocar o vetor oficial lá reflete
 * aqui e em todo o site.
 */
export default function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 leading-none">
      <Star size={compacto ? 15 : 18} className="text-[color:var(--s-accent)]" />
      <span className="flex flex-col">
        <span className="display whitespace-nowrap text-[0.95rem] tracking-[0.005em] sm:text-[1.12rem]">
          Toque Energético
        </span>
        {!compacto && (
          <span className="mt-[0.3rem] hidden font-sans text-[0.5rem] uppercase tracking-[0.32em] text-[color:var(--s-faint)] min-[440px]:block">
            Presença · Proteção · Harmonia
          </span>
        )}
      </span>
    </span>
  );
}
