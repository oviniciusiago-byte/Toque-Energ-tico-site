/**
 * A ESTRELA — um centro que irradia para todos os lados.
 *
 * Desenhada a partir do rótulo real (fotos de agosto/2026): oito pontas
 * afiladas — quatro longas nos eixos, quatro curtas nas diagonais — com uma
 * cintura estreita no centro, e pequenos pontos orbitando entre as pontas.
 *
 * ⚠️ Ainda é uma RECONSTRUÇÃO, não o vetor oficial. Quando o arquivo aberto
 * chegar, troque só este componente (e `public/logo.svg`): header, divisores,
 * fechamentos e depoimentos todos passam por aqui.
 */
const PONTAS = 8;
const RAIO_LONGO = 11;
const RAIO_CURTO = 5;
/* Cintura 2.4 e não 1: comparei as variações renderizadas e abaixo de ~2 as
   pontas viram agulhas e a estrela desaparece em tamanho pequeno. */
const CINTURA = 2.4;

function pontasDaEstrela() {
  const coords: string[] = [];
  for (let i = 0; i < PONTAS * 2; i += 1) {
    const angulo = (i * Math.PI) / PONTAS - Math.PI / 2;
    const ehPonta = i % 2 === 0;
    const nosEixos = (i / 2) % 2 === 0;
    const r = ehPonta ? (nosEixos ? RAIO_LONGO : RAIO_CURTO) : CINTURA;
    coords.push(
      `${(12 + Math.cos(angulo) * r).toFixed(2)},${(12 + Math.sin(angulo) * r).toFixed(2)}`,
    );
  }
  return coords.join(' ');
}

/** Pontos que orbitam a estrela, como no rótulo. */
const ORBITA = [
  ...Array.from({ length: 8 }, (_, i) => {
    const a = ((i + 0.5) * Math.PI) / 4 - Math.PI / 2;
    return { x: 12 + Math.cos(a) * 6.6, y: 12 + Math.sin(a) * 6.6, r: 0.5 };
  }),
  ...Array.from({ length: 4 }, (_, i) => {
    const a = ((i * 2 + 1) * Math.PI) / 4 - Math.PI / 2;
    return { x: 12 + Math.cos(a) * 8.7, y: 12 + Math.sin(a) * 8.7, r: 0.38 };
  }),
];

export default function Star({
  size = 20,
  className = '',
  /** `orbita` mostra os pontos ao redor; desligue em tamanhos muito pequenos. */
  orbita = true,
}: {
  size?: number;
  className?: string;
  orbita?: boolean;
}) {
  const mostrarOrbita = orbita && size >= 18;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <polygon points={pontasDaEstrela()} />
      {mostrarOrbita
        ? ORBITA.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} opacity={0.72} />
          ))
        : null}
    </svg>
  );
}

/** Divisor de seção: hairline que abre espaço para a estrela no centro. */
export function StarDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-[color:var(--s-line)]" />
      <Star size={16} orbita={false} className="text-[color:var(--s-accent)]" />
      <span className="h-px flex-1 bg-[color:var(--s-line)]" />
    </div>
  );
}
