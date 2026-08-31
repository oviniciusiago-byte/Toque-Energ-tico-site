import type { DisponibilidadeInfo, Disponibilidade } from '@/lib/types';

/** Textos globais, nav e dados de contato. Fonte: copy v1. */
export const site = {
  nome: 'Toque Energético',
  assinatura: 'Presença, Proteção, Harmonia.',
  tresPalavras: ['Presença', 'Proteção', 'Harmonia'],
  descricao:
    'Produtos artesanais de autocuidado e harmonização — ervas, flores, aromas e óleos essenciais preparados um a um, em Belo Horizonte.',
  cidade: 'Belo Horizonte — Minas Gerais',
  instagram: {
    handle: '@fernandapavan803',
    url: 'https://instagram.com/fernandapavan803',
  },
  url: 'https://toqueenergetico.com.br', // TODO: domínio final
} as const;

export const nav = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Rituais', href: '/rituais' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
] as const;

export const navSecundaria = [
  { label: 'Perguntas frequentes', href: '/faq' },
  { label: 'Onde encontrar', href: '/onde-encontrar' },
  { label: 'Atacado e revenda', href: '/atacado' },
] as const;

/** Legenda de disponibilidade — aparece no catálogo e nos badges. */
export const disponibilidades: Record<Disponibilidade, DisponibilidadeInfo> = {
  'pronta-entrega': {
    label: 'Pronta entrega',
    descricao: 'disponível para envio imediato.',
  },
  'sob-consulta': {
    label: 'Sob consulta',
    descricao: 'personalizado ou feito sob encomenda.',
  },
  sazonal: {
    label: 'Sazonal',
    descricao: 'produzido em pequenos lotes, conforme a estação.',
    nota: 'conforme o lote',
  },
};

/** Faixa fina no topo do site. Curta, factual, sem promessa. */
export const anuncio = {
  texto: 'Feito à mão em Belo Horizonte · pedido e frete combinados pelo WhatsApp',
} as const;

/**
 * Faixa de valores (o bloco dourado da home).
 * Tudo aqui é verificável no briefing — nada de promessa de resultado.
 */
export const valores = [
  { titulo: 'Feito à mão', texto: 'em pequenos lotes, um preparo por vez' },
  { titulo: 'Ervas e flores', texto: 'com óleos essenciais selecionados' },
  { titulo: 'Testado por quem faz', texto: 'quase sete anos de ajuste' },
  { titulo: 'Pedido no WhatsApp', texto: 'frete combinado pelo seu endereço' },
] as const;

/** Números editoriais da home — os valores vêm da camada de conteúdo. */
export const numeros = [
  { valor: '7', unidade: 'anos', legenda: 'de preparo artesanal, testado na própria vida' },
  { valor: 'AUTO_CATEGORIAS', unidade: 'linhas', legenda: 'de banhos a incensos, cada uma com o seu ritual' },
  { valor: 'AUTO_PRODUTOS', unidade: 'produtos', legenda: 'no catálogo, cada um com uma intenção' },
] as const;

/** Copy da Home — cada bloco corresponde a uma seção da página. */
export const home = {
  hero: {
    kicker: 'Toque Energético',
    titulo: 'Presença, Proteção, Harmonia.',
    subtitulo:
      'Produtos artesanais que transformam gestos simples em pequenos rituais de presença. Ervas, flores, aromas e óleos essenciais preparados um a um — para voltar a si sem sair do mundo.',
    ctaPrimario: { label: 'Conhecer os produtos', href: '/catalogo' },
    ctaSecundario: { label: 'Falar no WhatsApp' },
  },
  ideia: {
    kicker: 'A ideia',
    texto:
      'Nada aqui promete resolver a sua vida. O que oferecemos é mais simples e mais raro: um instante de pausa. Um aroma que te traz de volta. Um banho que fecha o dia. Um gesto pequeno que reorganiza o resto.',
  },
  destaques: {
    kicker: 'Destaques',
    titulo: 'Por onde começar',
    cta: { label: 'Ver todos os produtos', href: '/catalogo' },
    /** Linha de apoio de cada carro-chefe na home (copy própria da seção). */
    linhas: {
      'spray-de-protecao': 'presença, limites e centramento para os dias de muita troca.',
      'bruma-de-frescor': 'o perfume de passar que acompanha o corpo pelo dia.',
      'brumas-de-harmonia': 'o ambiente que muda quando o ar muda.',
      'banhos-escalda-pes': 'oito banhos, oito intenções, um mesmo cuidado.',
    } as Record<string, string>,
  },
  categorias: {
    kicker: 'Categorias',
    titulo: 'O catálogo',
  },
  manifesto: {
    /** Tipografia-manifesto: revelada palavra a palavra. */
    frase: 'Um gesto pequeno que reorganiza o resto.',
  },
  editorial: {
    label: 'Feito à mão',
    frase: 'Cada preparo passa por duas mãos antes de chegar às suas.',
    apoio:
      'Produção artesanal em pequenos lotes. É por isso que uma cor pode variar de um preparo para o outro — e é por isso que cada um chega inteiro.',
    assinatura: 'Maria Fernanda Pavan · Belo Horizonte / MG',
  },
  faixaEditorial: {
    label: 'Presença',
    frase: 'O que é cuidado por dentro aparece por fora.',
    apoio:
      'A referência é a estrela: um centro que irradia para todos os lados. Presença, proteção e harmonia não são coisas que se compram — são estados que pequenos rituais ajudam a lembrar.',
  },
  feitoAMao: {
    kicker: 'Feito à mão',
    titulo: 'Feito à mão, testado por quem faz',
    texto:
      'Há quase sete anos cada fórmula nasce, é testada e ajustada pelas próprias mãos que a criaram. Produção artesanal, em pequenos lotes. É por isso que uma cor pode variar de um preparo para o outro — e é por isso que cada um chega inteiro.',
    cta: { label: 'A nossa história', href: '/sobre' },
  },
  comoUsar: {
    kicker: 'Como usar',
    titulo: 'Cada produto vem com o seu ritual',
    texto:
      'Nada complicado: um borrifo, uma respiração, um banho morno no fim do dia.',
    cta: { label: 'Ver os rituais', href: '/rituais' },
  },
  depoimentos: {
    kicker: 'Quem usa',
    titulo: 'Do outro lado do cuidado',
    // TODO [confirmar]: inserir 2–3 mensagens reais de clientes já recebidas.
    placeholder:
      '[confirmar: inserir 2–3 mensagens reais de clientes já recebidas]',
  },
  fechamento: {
    kicker: 'Fechamento',
    titulo: 'Volte para si.',
    texto:
      'Escolha o seu produto e converse com a gente pelo WhatsApp. A entrega é combinada de acordo com o seu endereço.',
    cta: { label: 'Falar no WhatsApp' },
  },
} as const;

/** Páginas de conteúdo simples (copy v1, seções 2 e 5–10). */
export const paginas = {
  catalogo: {
    h1: 'Catálogo',
    intro:
      'Tudo o que a Toque Energético prepara, reunido por categoria. Os preços estão em cada produto; o frete é calculado à parte, conforme o seu endereço, e combinado pelo WhatsApp. Alguns itens são personalizados ou sazonais e aparecem como sob consulta ou conforme o lote.',
  },
  sobre: {
    h1: 'A Toque Energético',
    kicker: 'Nossa história',
    corpo: [
      'A Toque Energético começou como um cuidado privado antes de virar produto. Há quase sete anos, cada fórmula nasce da mesma forma: uma intenção, um preparo à mão, um teste na própria vida de quem a criou. Só depois de passar por aí é que chega até você.',
      'A marca reúne ervas, flores, aromas, óleos essenciais e conhecimento terapêutico numa ideia simples de cuidado energético — o cuidado com aquilo que a gente sente, mas nem sempre nomeia. A referência é a estrela: um centro que irradia para todos os lados. O que existe dentro, quando é cuidado, aparece fora. Presença, proteção e harmonia não são coisas que se compram; são estados que pequenos rituais ajudam a lembrar.',
      'Por isso a gente evita duas coisas com o mesmo cuidado: as promessas mágicas e o discurso do medo. Nada aqui resolve a sua vida por você. O que oferecemos são experiências sensoriais — um aroma, um banho, um gesto — que apoiam movimentos reais, de dentro para fora, no seu tempo.',
    ],
    manifesto: 'Um centro que irradia para todos os lados.',
  },
  rituais: {
    h1: 'Rituais',
    kicker: 'Como usar',
    intro:
      'Ritual aqui não tem nada de complicado. É só um jeito de fazer as coisas com um pouco mais de atenção. Reunimos abaixo as formas de usar cada linha — comece por onde fizer sentido.',
    blocos: [
      {
        titulo: 'Brumas & Sprays',
        texto:
          'Borrife, feche os olhos por um instante e respire fundo uma vez. Deixe o aroma chegar antes de seguir. Use ao mudar de ambiente, ao começar ou ao encerrar algo.',
        imagem: '/images/editorial/ritual-brumas.jpg',
        categoria: 'brumas-aromas-ambientes',
      },
      {
        titulo: 'Banhos & Escalda-Pés',
        texto:
          'Reserve o fim do dia. Faça a infusão, escolha entre o banho completo ou só os pés, e não faça mais nada além de estar ali enquanto a água morna faz o resto.',
        imagem: '/images/editorial/ritual-banhos.jpg',
        categoria: 'banhos-escalda-pes',
      },
      {
        titulo: 'Óleos de Ritual',
        texto:
          'Aqueça poucas gotas entre as mãos e aplique com toques lentos, de preferência com a pele ainda morna do banho. O ritmo do gesto é parte do óleo.',
        imagem: '/images/editorial/ritual-oleos.jpg',
        categoria: 'oleos-de-ritual',
      },
      {
        titulo: 'Roll-ons',
        texto:
          'Aplique nos pulsos ou nas têmporas e respire o aroma de perto. Reaplique sempre que quiser voltar à intenção que escolheu.',
        imagem: '/images/editorial/ritual-rollons.jpg',
        categoria: 'roll-ons-oleos-essenciais',
      },
      {
        titulo: 'Incensos',
        texto:
          'Acenda em local ventilado, sobre suporte, e deixe a fumaça marcar a transição do espaço.',
        imagem: '/images/editorial/ritual-incensos.jpg',
        categoria: 'incensos-naturais',
      },
    ],
    fechamento: 'O ritual não está no produto. Está na pausa que você escolhe fazer.',
  },
  faq: {
    h1: 'Perguntas frequentes',
    kicker: 'FAQ',
    itens: [
      {
        pergunta: 'Como faço para comprar?',
        resposta:
          'Você escolhe os produtos aqui no site e fecha o pedido pelo WhatsApp. É por lá que combinamos disponibilidade, forma de envio e pagamento.',
      },
      {
        pergunta: 'Vocês têm loja física?',
        // TODO [confirmar]: pontos de venda e presença em feiras — ver página "Onde encontrar".
        resposta:
          '[confirmar: pontos de venda e presença em feiras — ver página “Onde encontrar”]',
      },
      {
        pergunta: 'Como funciona o frete?',
        resposta:
          'O frete é calculado individualmente, conforme o seu endereço, e combinado pelo WhatsApp junto com o pedido.',
      },
      {
        pergunta: 'Os produtos são naturais e artesanais?',
        resposta:
          'Sim. Todos são feitos à mão, em pequenos lotes, com ervas, flores e óleos essenciais. Por isso pode haver leve variação de cor e aroma entre um lote e outro — faz parte.',
      },
      {
        pergunta: 'Os produtos têm efeito terapêutico ou medicinal?',
        resposta:
          'Não fazemos promessas de cura nem substituímos acompanhamento profissional. Nossos produtos são experiências sensoriais de autocuidado. Em caso de dúvida de saúde, procure um profissional.',
      },
      {
        pergunta: 'Posso usar durante a gravidez ou se tenho pele sensível?',
        resposta:
          'Alguns óleos essenciais pedem cautela. Se você está grávida, amamentando, tem pele sensível ou alguma condição de saúde, consulte um profissional antes de usar e fale com a gente para orientarmos a escolha.',
      },
      {
        pergunta: 'Vocês fazem produtos personalizados?',
        resposta:
          'Sim. Roll-ons e amuletos são preparados sob consulta. Fale com a gente pelo WhatsApp para montarmos algo com você.',
      },
      {
        pergunta: 'Terão velas?',
        // TODO [confirmar]: previsão das velas.
        resposta: 'Ainda não neste primeiro momento, mas estão nos planos. [confirmar]',
      },
    ],
  },
  contato: {
    h1: 'Fale com a gente',
    kicker: 'Contato',
    corpo:
      'O jeito mais direto de conversar, tirar dúvidas e fechar um pedido é pelo WhatsApp. Respondemos com o mesmo cuidado que colocamos nos produtos.',
    // TODO [confirmar]: número de WhatsApp — preencher em lib/whatsapp.ts
    whatsappPlaceholder: '[confirmar: número]',
    cta: { label: 'Chamar no WhatsApp' },
  },
  ondeEncontrar: {
    h1: 'Onde encontrar',
    kicker: 'Pontos de venda',
    corpo:
      'Além do site, você pode encontrar a Toque Energético em feiras e pontos parceiros ao longo do ano. Como participamos de eventos sazonais, o calendário muda — acompanhe pelo Instagram ou pergunte pelo WhatsApp onde estaremos.',
    // TODO [confirmar]: lista de pontos de venda fixos e feiras agendadas, se houver.
    placeholder:
      '[confirmar: lista de pontos de venda fixos e feiras agendadas, se houver]',
  },
  atacado: {
    h1: 'Atacado e revenda',
    kicker: 'Para lojas e espaços',
    corpo: [
      'Tem uma loja, um espaço de bem-estar ou quer levar a Toque Energético para o seu público? Trabalhamos com condições especiais para revenda e pedidos em maior quantidade.',
      'Fale com a gente pelo WhatsApp contando um pouco sobre o seu negócio. Montamos as condições de acordo com o volume e o mix de produtos.',
    ],
    cta: { label: 'Falar sobre revenda' },
  },
} as const;

/** Newsletter — só UI, sem backend. */
export const newsletter = {
  titulo: 'Receba as novidades',
  texto: 'Novos lotes, feiras e produtos sazonais. Sem excessos.',
  placeholder: 'seu e-mail',
  cta: 'Quero receber',
  // TODO: conectar a um serviço de e-mail (nenhum backend nesta versão).
  aviso: 'Cadastro em breve — por ora, fale com a gente no WhatsApp.',
} as const;
