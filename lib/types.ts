export type Disponibilidade = 'pronta-entrega' | 'sob-consulta' | 'sazonal';

/** Uma erva do preparo e a intenção que a cliente atribui a ela no rótulo. */
export interface Erva {
  nome: string;
  intencao?: string;
}

export interface Produto {
  slug: string;
  nome: string;
  /** Subtítulo do rótulo real: "Banho de Prosperidade", "Banho de Luz e Acolhimento". */
  subtitulo?: string;
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
  /**
   * Cor do rótulo real do produto (hex). Vira o acento da página daquele
   * produto — é o que faz cada banho parecer ele mesmo, e não um template.
   * O briefing autoriza: "as cores específicas dos produtos podem aparecer
   * em pequenos detalhes das respectivas categorias".
   */
  cor?: string;
  /**
   * Parente legível da cor do rótulo, para usar como acento de TEXTO sobre
   * superfície escura. Cinco das oito cores reais reprovam 4.5:1 no escuro
   * (o vinho do Encantamento fica em 1.23:1), então `cor` fica só na amostra
   * decorativa e `corAcento` carrega o texto. Valores calculados, não
   * escolhidos a olho.
   */
  corAcento?: string;
  /** Ervas do preparo, com a intenção que o rótulo atribui a cada uma. */
  ervas?: Erva[];
  /** Benefícios em lista, quando o rótulo os traz assim. */
  beneficios?: string[];
  /** Decreto que acompanha o produto ("EU SOU LUZ"). */
  decreto?: { titulo: string; descricao: string };
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
