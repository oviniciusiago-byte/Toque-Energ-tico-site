/**
 * Contraste WCAG em tempo de render.
 *
 * Existe porque a cena dos banhos usa a COR REAL do rótulo como fundo de tela
 * cheia, e cor de produto não nasce pensando em legibilidade: das oito, uma
 * (#6E7378, o cinza da Limpeza Densa) reprova 4.5:1 tanto com tinta escura
 * quanto com papel claro. Em vez de escolher a olho para cada produto, a
 * escolha é calculada — e vale para qualquer cor nova que entre no catálogo.
 */
const TINTA = '#0F0E0C';
const PAPEL = '#F2EDE4';
const ALVO = 4.6; /* um fio acima de 4.5 para absorver arredondamento */

type RGB = [number, number, number];

function paraRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function paraHex([r, g, b]: RGB) {
  const p = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}`;
}

function canal(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminancia(hex: string) {
  const [r, g, b] = paraRgb(hex);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contraste(a: string, b: string) {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Dado o fundo desejado, devolve o par (fundo, texto) que passa AA.
 * Se nenhuma das duas tintas passar, escurece ou clareia o FUNDO até passar —
 * preservando o matiz, então a cor continua reconhecível como a do rótulo.
 */
export function parLegivel(fundo: string): { fundo: string; texto: string } {
  const comTinta = contraste(TINTA, fundo);
  const comPapel = contraste(PAPEL, fundo);

  if (comTinta >= ALVO || comPapel >= ALVO) {
    return { fundo, texto: comTinta >= comPapel ? TINTA : PAPEL };
  }

  // Nenhuma passa: caminha o fundo na direção que já estava mais perto.
  const rumo: RGB = comPapel > comTinta ? [0, 0, 0] : [255, 255, 255];
  const texto = comPapel > comTinta ? PAPEL : TINTA;
  const base = paraRgb(fundo);

  for (let i = 1; i <= 100; i += 1) {
    const t = i / 100;
    const passo = paraHex([
      base[0] + (rumo[0] - base[0]) * t,
      base[1] + (rumo[1] - base[1]) * t,
      base[2] + (rumo[2] - base[2]) * t,
    ]);
    if (contraste(texto, passo) >= ALVO) return { fundo: passo, texto };
  }

  return { fundo: comPapel > comTinta ? '#1A1815' : PAPEL, texto };
}

/** Mistura duas cores hex. `t` de 0 (a) a 1 (b). */
export function misturar(a: string, b: string, t: number) {
  const [ar, ag, ab] = paraRgb(a);
  const [br, bg, bb] = paraRgb(b);
  const k = Math.max(0, Math.min(1, t));
  return paraHex([ar + (br - ar) * k, ag + (bg - ag) * k, ab + (bb - ab) * k]);
}

/** Tinta legível para um fundo qualquer, sem mexer no fundo. */
export function tintaPara(fundo: string) {
  return contraste(TINTA, fundo) >= contraste(PAPEL, fundo) ? TINTA : PAPEL;
}
