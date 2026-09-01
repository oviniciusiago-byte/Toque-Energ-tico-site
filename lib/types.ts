export type Disponibilidade = 'pronta-entrega' | 'sob-consulta' | 'sazonal';

export interface Produto {
  slug: string;
  nome: string;
  /** Nome em itálico serifado nas listagens (opcional — default = nome). */
  nomeCurto?: string;
  categoria: string; // slug da categoria
  conceito: string[]; // 3 palavras
  descricaoCurta: string;
  intencao: string;
  aroma?: string;
  composicao?: string;
  volume?: string; // ex.: "120 ml"
  preco?: string; // ex.: "R$ 58" | "a partir de R$ 50"
  precoBase?: number; // para ordenação
  disponibilidade: Disponibilidade;
  modoDeUso?: string;
  cuidados?: string;
  fechamento?: string;
  /** Como adquirir — itens sob consulta. */
  comoAdquirir?: string;
  imagens: string[]; // /images/products/{slug}-N.jpg
  destaque?: boolean; // carro-chefe
  relacionados?: string[]; // slugs
  /** Só o Spray de Proteção carrega linguagem de intenção energética. */
  terapeutico?: boolean;
}

export interface Categoria {
  slug: string;
  nome: string;
  /** Nome curto para nav/breadcrumb. */
  nomeCurto?: string;
  intro: string;
  /** Bloco de modo de uso comum a toda a linha (opcional). */
  modoDeUsoLinha?: string;
  cuidadosLinha?: string;
  notaLinha?: string;
  capa: string;
  /** Categoria criada, mas fora do lançamento (ex.: Velas). */
  oculta?: boolean;
  /**
   * Acento próprio da linha. Só as Brumas usam o verde Tiffany, como pede o
   * briefing: "apenas como acento de frescor, especialmente na linha de
   * brumas". As demais herdam o dourado da superfície.
   */
  acento?: 'tiffany';
}

export interface DisponibilidadeInfo {
  label: string;
  descricao: string;
  nota?: string;
}
