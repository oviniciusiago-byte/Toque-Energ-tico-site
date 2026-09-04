'use client';

/**
 * O motor de movimento do site: um único lugar que carrega o GSAP, registra os
 * plugins e nomeia as curvas e os tempos.
 *
 * Por que centralizar: antes cada componente fazia o seu próprio
 * `import('gsap')` e escrevia o seu próprio cubic-bezier à mão. O resultado é
 * um site onde cada seção tem um tempo diferente — que é exatamente o que
 * separa "tem animação" de "tem direção de movimento". Aqui as curvas têm
 * nome, e o nome é usado por extenso no lugar do número.
 *
 * O GSAP continua entrando por import dinâmico (fica fora do bundle inicial) e
 * o carregamento é memoizado: quem chamar segundo espera a mesma promessa.
 */

export type Motor = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  SplitText: typeof import('gsap/SplitText').SplitText;
};

/**
 * Tempos. Um vocabulário curto e fechado — se um movimento não couber em três
 * durações, o problema é o movimento, não a tabela.
 */
export const dur = {
  curta: 0.45,
  media: 0.85,
  longa: 1.25,
} as const;

/** Intervalo entre irmãos numa revelação em cascata. */
export const cascata = 0.075;

/** Respiro antes de uma revelação começar. */
export const respiro = 0.12;

/** Acima disto, as cenas fixadas entram. Abaixo, tudo vira rolagem comum. */
export const larguraCena = 1024;

/**
 * As curvas, por nome.
 *
 * `saida` é a mesma curva que já vive no CSS como `--ease-calm`
 * (`cubic-bezier(0.22, 1, 0.36, 1)`) — o site inteiro desacelera do mesmo
 * jeito, esteja a transição em CSS ou em JS.
 *
 * `entrada` é o espelho dela: acelera saindo. Um elemento que some não deve
 * desacelerar, senão parece que travou.
 *
 * `assenta` é simétrica, para quando algo atravessa a tela de ponta a ponta.
 *
 * `banho` é a única curva de verdade multi-ponto: sobe, hesita perto do fim e
 * só então assenta. É a curva da cena dos banhos — a hesitação é o instante em
 * que a cor de um rótulo cruza com a do próximo.
 */
export const curvas = {
  saida: '0.22, 1, 0.36, 1',
  entrada: '0.5, 0, 0.75, 0',
  assenta: '0.75, 0, 0.25, 1',
  banho: 'M0,0 C0.13,0.38 0.28,0.72 0.42,0.84 0.53,0.93 0.62,0.9 0.72,0.93 0.85,0.97 0.93,1 1,1',
} as const;

let pendente: Promise<Motor> | null = null;

/** Carrega o GSAP + plugins e registra as curvas. Memoizado. */
export function carregarMotor(): Promise<Motor> {
  if (!pendente) {
    pendente = (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { CustomEase }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('gsap/CustomEase'),
      ]);

      gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

      /* Registrar duas vezes o mesmo nome é inofensivo, mas a memoização acima
         garante que isto rode uma vez só por carregamento de página. */
      for (const [nome, curva] of Object.entries(curvas)) {
        CustomEase.create(nome, curva);
      }

      /* Em desenvolvimento, publica o motor. O GSAP entra por import
         dinâmico e não fica em `window`, o que tornava impossível sondar os
         triggers do console — era preciso instrumentar o código toda vez.
         Com isto: `__motor.ScrollTrigger.getAll()`. Fora do bundle de
         produção, porque o `if` é eliminado no build. */
      if (process.env.NODE_ENV !== 'production') {
        (window as unknown as { __motor?: unknown }).__motor = { gsap, ScrollTrigger, SplitText };
      }

      return { gsap, ScrollTrigger, SplitText };
    })();
  }
  return pendente;
}

/** Quem pediu para reduzir movimento não recebe cena nenhuma. */
export function movimentoReduzido(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

type Lenis = {
  scrollTo: (alvo: number | HTMLElement, opcoes?: object) => void;
  /** Relê a altura do documento. Obrigatório depois de qualquer coisa que
      mude o tamanho da página por JS — sem isto o Lenis mantém o limite de
      rolagem antigo e o fim do site fica inalcançável. */
  resize: () => void;
  /** Velocidade atual da rolagem. Perto de zero = o deslize terminou. */
  velocity: number;
};

/** O Lenis publicado pelo SmoothScroll, quando existe. */
export function lenis(): Lenis | undefined {
  return (window as unknown as { __lenis?: Lenis }).__lenis;
}
