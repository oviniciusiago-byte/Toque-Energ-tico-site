/**
 * PLACEHOLDER de logo — a marca ainda não tem vetor aberto (pendência do
 * briefing). A estrela é uma irradiação simples: um centro com raios, sem
 * nenhum símbolo esotérico. Substituir quando o vetor final chegar.
 */
export function Estrela({ className = '', size = 20 }: { className?: string; size?: number }) {
  const raios = 8;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {Array.from({ length: raios }, (_, i) => {
        const a = (i * Math.PI * 2) / raios;
        const longo = i % 2 === 0;
        const r1 = 2.4;
        const r2 = longo ? 10.6 : 6.2;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * r1}
            y1={12 + Math.sin(a) * r1}
            x2={12 + Math.cos(a) * r2}
            y2={12 + Math.sin(a) * r2}
            stroke="currentColor"
            strokeWidth={longo ? 0.95 : 0.65}
            strokeLinecap="round"
            opacity={longo ? 1 : 0.5}
          />
        );
      })}
      <circle cx="12" cy="12" r="1.05" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 leading-none">
      <Estrela size={compacto ? 16 : 19} className="text-[color:var(--s-accent)]" />
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
