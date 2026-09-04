import Star from '@/components/Star';

/**
 * Assinatura da marca, montada como no rótulo real: a estrela acima, "TOQUE"
 * em caixa-alta bem espaçada e "ENERGÉTICO" empilhado abaixo, menor.
 *
 * No header a versão é horizontal (a estrela ao lado) por questão de altura;
 * a empilhada é a do rótulo e aparece na abertura e no rodapé.
 */
export default function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-3 leading-none">
      <Star
        size={compacto ? 17 : 21}
        orbita={!compacto}
        className="shrink-0 text-[color:var(--s-accent)]"
      />
      <span className="flex flex-col gap-[0.18em]">
        <span className="display whitespace-nowrap text-[0.82rem] uppercase tracking-[0.3em] sm:text-[0.9rem]">
          Toque
        </span>
        <span className="font-sans text-[0.5rem] uppercase tracking-[0.34em] text-[color:var(--s-muted)] sm:text-[0.55rem]">
          Energético
        </span>
      </span>
    </span>
  );
}

/** Versão empilhada e centrada — abertura, rodapé, tela de entrada. */
export function LogoStacked({
  size = 'md',
  className = '',
}: {
  size?: 'md' | 'lg';
  className?: string;
}) {
  const grande = size === 'lg';
  return (
    <span className={`flex flex-col items-center ${className}`}>
      <Star size={grande ? 46 : 34} className="text-[color:var(--s-accent)]" />
      <span
        className={`display mt-5 uppercase ${
          grande ? 'text-[1.6rem] tracking-[0.42em] sm:text-[2.1rem]' : 'text-[1.1rem] tracking-[0.38em]'
        }`}
      >
        Toque
      </span>
      <span
        className={`font-sans uppercase text-[color:var(--s-muted)] ${
          grande ? 'mt-2 text-[0.68rem] tracking-[0.5em]' : 'mt-1.5 text-[0.56rem] tracking-[0.44em]'
        }`}
      >
        Energético
      </span>
    </span>
  );
}
