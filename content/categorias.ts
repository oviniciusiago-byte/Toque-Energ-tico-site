import type { Categoria } from '@/lib/types';

/**
 * Categorias do catálogo (copy v1, seção 3).
 * Para publicar as Velas: basta remover `oculta: true` e cadastrar os produtos
 * com `categoria: 'velas'`. Nada mais precisa mudar.
 */
export const categorias: Categoria[] = [
  {
    slug: 'banhos-escalda-pes',
    nome: 'Banhos & Escalda-Pés',
    intro:
      'Flores e ervas para dissolver na água. Oito banhos, cada um com uma intenção — do que precisa ser solto ao que precisa ser reacendido. Servem para o corpo inteiro ou só para os pés, no fim de um dia longo.',
    modoDeUsoLinha:
      'Ferva água e desligue o fogo. Adicione as flores e deixe em infusão por alguns minutos, tampado. Coe. Para o banho, despeje sobre o corpo do pescoço para baixo, após o banho comum. Para o escalda-pés, dilua em água morna numa bacia e permaneça pelo tempo que for confortável. Enquanto usa, respire. Não tenha pressa.',
    // TODO [confirmar]: restrições específicas por fórmula.
    cuidadosLinha:
      'Uso externo. Produto artesanal — cor e aroma podem variar entre lotes. Não ingerir. Em caso de gravidez, pele sensível ou alergias, consulte um profissional antes de usar. [confirmar: restrições específicas por fórmula]',
    notaLinha: 'Toda a linha: R$ 24 · pronta entrega',
    capa: '/images/categories/banhos-escalda-pes.jpg',
  },
  {
    slug: 'brumas-aromas-ambientes',
    nome: 'Brumas, Aromas & Ambientes',
    nomeCurto: 'Brumas & Ambientes',
    intro:
      'O que muda o ar muda o estado. Brumas para o corpo, para o ambiente e para os cantos que te acompanham — inclusive o carro. Três sprays e um buquê aromático, do centramento ao frescor.',
    capa: '/images/categories/brumas-aromas-ambientes.jpg',
    acento: 'tiffany',
  },
  {
    slug: 'oleos-de-ritual',
    nome: 'Óleos de Ritual',
    intro:
      'Óleos preparados em base vegetal de coco, com flores em imersão e óleos essenciais. As flores ficam à vista, suspensas na luz. Para a pele, para as mãos, para o momento em que o toque vira ritual.',
    modoDeUsoLinha:
      'Aqueça algumas gotas entre as mãos e aplique sobre a pele, com toques lentos. Ideal após o banho, com a pele ainda morna.',
    cuidadosLinha:
      'Uso externo. Faça um teste em pequena área antes do primeiro uso. Evite exposição solar direta logo após aplicar. Em caso de gravidez ou pele sensível, consulte um profissional.',
    notaLinha: 'Toda a linha: 30 ml · a partir de R$ 58 · pronta entrega',
    capa: '/images/categories/oleos-de-ritual.jpg',
  },
  {
    slug: 'roll-ons-oleos-essenciais',
    nome: 'Roll-ons de Óleos Essenciais',
    nomeCurto: 'Roll-ons',
    intro:
      'Sinergias personalizadas de óleos essenciais em formato de bolso. Você conta o que procura — foco, calma, presença — e preparamos a combinação. Feitos sob consulta.',
    notaLinha: '10 ml · a partir de R$ 50 · sob consulta',
    capa: '/images/categories/roll-ons-oleos-essenciais.jpg',
  },
  {
    slug: 'incensos-naturais',
    nome: 'Incensos Naturais',
    intro:
      'Incensos de produção sazonal, feitos com as ervas e flores de cada estação. Por serem preparados em pequenos lotes, o aroma e a disponibilidade mudam ao longo do ano. Vale perguntar o que há agora.',
    notaLinha: 'Sazonal — valor e disponibilidade conforme o lote',
    capa: '/images/categories/incensos-naturais.jpg',
  },
  {
    slug: 'presentes-complementos',
    nome: 'Presentes & Complementos',
    nomeCurto: 'Presentes',
    intro:
      'Pequenos gestos para dar — ou para guardar. Buquês botânicos, sachês e amuletos que cabem numa lembrança e carregam intenção.',
    capa: '/images/categories/presentes-complementos.jpg',
  },
  {
    // Fora do lançamento inicial. Estrutura pronta: remover `oculta` para publicar.
    slug: 'velas',
    nome: 'Velas Aromáticas',
    intro: '[confirmar: intro da linha de velas]',
    capa: '/images/categories/velas.jpg',
    oculta: true,
  },
];

export const categoriasVisiveis = categorias.filter((c) => !c.oculta);

export const getCategoria = (slug: string) => categorias.find((c) => c.slug === slug);
