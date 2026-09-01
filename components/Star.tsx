/**
 * A ESTRELA — um centro que irradia para todos os lados.
 *
 * ⚠️ PLACEHOLDER: este é um desenho provisório. O briefing pede a estrela
 * OFICIAL da marca, preservando desenho, proporções e aparência. Assim que o
 * vetor chegar, substitua o `path` aqui (e `public/logo.svg`) — o resto do site
 * usa este componente, então a troca acontece em um lugar só.
 *
 * Desenhada como oito pontas AFILADAS (quatro cardinais longas, quatro
 * diagonais curtas) em vez de traços cruzados: uma cruz ou um asterisco não
 * comunicam irradiação, e o briefing pede para evitá-los.
 */
function pontos(pontas = 8, longa = 1, curta = 0.52, vale = 0.15) {
  const total = pontas * 2;
  const coords: string[] = [];
  for (let i = 0; i < total; i += 1) {
    const angulo = (i * Math.PI) / pontas - Math.PI / 2;
    const ehPonta = i % 2 === 0;
    const cardinal = (i / 2) % 2 === 0;
    const r = ehPonta ? (cardinal ? longa : curta) : vale;
    coords.push(`${(12 + Math.cos(angulo) * r * 11).toFixed(2)},${(12 + Math.sin(angulo) * r * 11).toFixed(2)}`);
  }
  return coords.join(' ');
}

export default function Star({
  size = 20,
  className = '',
  /** `solida` para marcas e divisores; `contorno` para uso discreto. */
  variante = 'solida',
}: {
  size?: number;
  className?: string;
  variante?: 'solida' | 'contorno';
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <polygon
        points={pontos()}
        fill={variante === 'solida' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={variante === 'solida' ? 0 : 0.7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Divisor de seção: uma hairline que abre espaço para a estrela no centro. */
export function StarDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-[color:var(--s-line)]" />
      <Star size={15} className="text-[color:var(--s-accent)]" />
      <span className="h-px flex-1 bg-[color:var(--s-line)]" />
    </div>
  );
}
