import type { Produto } from '@/lib/types';

/**
 * Catálogo — fonte: `docs/toque-energetico-copy-site-v1.md`.
 *
 * Marcações [confirmar: …] são literais: dependem da fórmula real do produto e
 * precisam da Fernanda antes de publicar (composição, notas de aroma e avisos
 * de segurança sobretudo). Não preencher por conta própria.
 *
 * Imagens: /images/products/{slug}-1.jpg (principal, fiel à embalagem),
 * -2 (editorial), -3 (detalhe / modo de uso — só carros-chefe).
 */

const img = (slug: string, n = 2) =>
  Array.from({ length: n }, (_, i) => `/images/products/${slug}-${i + 1}.jpg`);

/* -------------------------------------------------------------------------- */
/* Brumas, Aromas & Ambientes                                                 */
/* -------------------------------------------------------------------------- */

const brumas: Produto[] = [
  {
    slug: 'spray-de-protecao',
    nome: 'Spray de Proteção',
    categoria: 'brumas-aromas-ambientes',
    conceito: ['Presença', 'Limites', 'Centramento'],
    descricaoCurta: 'O borrifo que te traz de volta ao centro nos dias de muita troca.',
    intencao:
      'Criado para apoiar a proteção da sua energia pessoal e a manutenção de um campo mais seu — com limites próprios. Acompanha dias movimentados, ambientes de muita gente, períodos de maior exposição ou aqueles momentos em que você percebe que está sendo levado pelo que acontece ao redor. A proposta não é criar isolamento, e sim favorecer presença, discernimento e uma relação mais consciente com a própria energia.',
    aroma: 'Lavanda, suave e limpa.',
    composicao:
      'Essências florais e óleos essenciais cuidadosamente selecionados. [confirmar: lista completa de essências]',
    volume: '120 ml',
    preco: 'R$ 58',
    precoBase: 58,
    disponibilidade: 'pronta-entrega',
    modoDeUso:
      'Borrife ao redor do corpo ou no ambiente sempre que quiser fazer uma pausa, respirar e voltar para si. Evite contato com os olhos e as mucosas.',
    cuidados:
      'Uso externo. Não ingerir. Mantenha fora do alcance de crianças. Em caso de gravidez ou pele sensível, consulte um profissional.',
    fechamento: 'Volte para si. Respire. Esteja na sua presença.',
    imagens: img('spray-de-protecao', 3),
    destaque: true,
    terapeutico: true,
    relacionados: ['brumas-de-harmonia', 'oleo-de-ritual-lavanda', 'calmaria'],
  },
  {
    slug: 'bruma-de-frescor',
    nome: 'Bruma de Frescor — Perfume de Passar',
    nomeCurto: 'Bruma de Frescor',
    categoria: 'brumas-aromas-ambientes',
    conceito: ['Frescor', 'Leveza', 'Companhia'],
    descricaoCurta: 'O perfume de passar que acompanha o corpo pelo dia, sem peso.',
    intencao:
      'Uma bruma leve para vestir depois do banho ou renovar no meio do dia. Não é um perfume que anuncia; é um que acompanha — discreto o bastante para ser só seu. Para começar a manhã ou para dar um respiro à tarde.',
    aroma: '[confirmar: notas — sugestão de perfil fresco/floral leve]',
    composicao: '[confirmar: base e óleos essenciais]',
    // TODO [confirmar]: a cliente pediu para verificar este volume (feedback, item 16)
    volume: '120 ml',
    preco: 'R$ 58',
    precoBase: 58,
    disponibilidade: 'pronta-entrega',
    modoDeUso:
      'Borrife sobre a pele, após o banho ou quando quiser renovar. Reaplique à vontade.',
    cuidados:
      'Uso externo. Evite contato com os olhos. Pode manchar tecidos delicados — teste antes. [confirmar]',
    fechamento: 'Um frescor que fica com você.',
    imagens: img('bruma-de-frescor', 3),
    destaque: true,
    relacionados: ['spray-de-protecao', 'brumas-de-harmonia', 'sache-lavanda-da-alma'],
  },
  {
    slug: 'brumas-de-harmonia',
    nome: 'Brumas de Harmonia',
    categoria: 'brumas-aromas-ambientes',
    conceito: ['Ambiente', 'Pausa', 'Equilíbrio'],
    descricaoCurta: 'O ar do cômodo muda — e o estado de quem está nele, também.',
    intencao:
      'Para os espaços onde você vive. Borrife ao chegar em casa, antes de dormir, no início de um trabalho que pede concentração ou depois de um dia agitado. Não perfuma só o ambiente: marca uma transição — do lado de fora para o lado de dentro.',
    aroma: '[confirmar: notas]',
    composicao: '[confirmar: base e óleos essenciais]',
    // TODO [confirmar]: a cliente pediu para verificar este volume (feedback, item 16)
    volume: '120 ml',
    preco: 'R$ 58',
    precoBase: 58,
    disponibilidade: 'pronta-entrega',
    modoDeUso:
      'Borrife no ambiente, à altura do ar, quantas vezes desejar. Evite superfícies e tecidos delicados.',
    cuidados:
      'Uso ambiental. Não borrife diretamente sobre pessoas, alimentos ou animais. Mantenha fora do alcance de crianças.',
    fechamento: 'Mude o ar. O resto acompanha.',
    imagens: img('brumas-de-harmonia', 3),
    destaque: true,
    relacionados: ['spray-de-protecao', 'incensos-naturais', 'aura-botanica'],
  },
  {
    slug: 'aura-botanica',
    nome: 'Aura Botânica — Buquê para Carro',
    nomeCurto: 'Aura Botânica',
    categoria: 'brumas-aromas-ambientes',
    conceito: ['Trajeto', 'Presença', 'Aroma'],
    descricaoCurta: 'Um buquê botânico para o carro, com essência para reavivar quando quiser.',
    intencao:
      'Porque o carro também é um lugar onde a gente passa a vida. A Aura Botânica leva um pequeno buquê seco e uma essência de 10 ml para renovar o aroma quando ele começar a se despedir. Transforma o trajeto — de casa ao trabalho, do trabalho a casa — num intervalo mais seu.',
    aroma: '[confirmar: notas da essência]',
    composicao:
      'Buquê botânico seco + essência aromática concentrada 10 ml. [confirmar: flores/ervas do buquê]',
    volume: 'Buquê + essência aromática 10 ml',
    preco: 'R$ 56',
    precoBase: 56,
    disponibilidade: 'pronta-entrega',
    modoDeUso:
      'Fixe o buquê no ambiente do carro. Pingue algumas gotas da essência sobre ele sempre que quiser reavivar o aroma.',
    cuidados:
      'Uso ambiental. Não ingerir. Mantenha a essência fora do alcance de crianças. Evite contato direto da essência com superfícies do veículo.',
    fechamento: 'Que o caminho tenha o seu aroma.',
    imagens: img('aura-botanica'),
    relacionados: ['brumas-de-harmonia', 'buque-botanico', 'sache-lavanda-da-alma'],
  },
];

/* -------------------------------------------------------------------------- */
/* Óleos de Ritual — 30 ml                                                    */
/* -------------------------------------------------------------------------- */

const MODO_OLEOS =
  'Aqueça algumas gotas entre as mãos e aplique sobre a pele, com toques lentos. Ideal após o banho, com a pele ainda morna.';
const CUIDADOS_OLEOS =
  'Uso externo. Faça um teste em pequena área antes do primeiro uso. Evite exposição solar direta logo após aplicar. Em caso de gravidez ou pele sensível, consulte um profissional.';

const oleos: Produto[] = [
  {
    slug: 'oleo-de-ritual-rosas-com-geranio',
    nome: 'Óleo de Ritual — Rosas com Gerânio',
    nomeCurto: 'Rosas com Gerânio',
    categoria: 'oleos-de-ritual',
    conceito: ['Coração', 'Acolhimento', 'Toque'],
    descricaoCurta: 'Rosas e gerânio em imersão — o óleo do cuidado com o próprio coração.',
    intencao:
      'Um óleo para desacelerar o toque. A rosa e o gerânio conversam num aroma cálido e envolvente, para os momentos em que você quer se tratar com um pouco mais de gentileza.',
    aroma: 'Rosa e gerânio — floral, quente, encorpado.',
    composicao:
      'Óleo vegetal de coco, pétalas de rosa e gerânio em imersão, óleos essenciais. [confirmar]',
    volume: '30 ml',
    preco: 'a partir de R$ 58',
    precoBase: 58,
    disponibilidade: 'pronta-entrega',
    modoDeUso: MODO_OLEOS,
    cuidados: CUIDADOS_OLEOS,
    fechamento: 'Toque-se como se cuida do que se ama.',
    imagens: img('oleo-de-ritual-rosas-com-geranio'),
    relacionados: ['eixo-rosa', 'oleo-de-ritual-lavanda', 'oleo-de-ritual-jasmim'],
  },
  {
    slug: 'oleo-de-ritual-lavanda',
    nome: 'Óleo de Ritual — Lavanda',
    nomeCurto: 'Lavanda',
    categoria: 'oleos-de-ritual',
    conceito: ['Calma', 'Descanso', 'Silêncio'],
    descricaoCurta: 'Lavanda em imersão — para baixar o volume do dia.',
    intencao:
      'O óleo da noite, ou de qualquer hora que peça calma. A lavanda acompanha o gesto de desacelerar: aplique nas mãos, nos ombros, nos pés, antes de dormir.',
    aroma: 'Lavanda — herbácea, serena, limpa.',
    composicao:
      'Óleo vegetal de coco, flores de lavanda em imersão, óleo essencial de lavanda. [confirmar]',
    volume: '30 ml',
    preco: 'a partir de R$ 58',
    precoBase: 58,
    disponibilidade: 'pronta-entrega',
    modoDeUso: MODO_OLEOS,
    cuidados: CUIDADOS_OLEOS,
    fechamento: 'Desacelere. O corpo sabe o caminho.',
    imagens: img('oleo-de-ritual-lavanda'),
    relacionados: ['calmaria', 'sache-lavanda-da-alma', 'oleo-de-ritual-rosas-com-geranio'],
  },
  {
    slug: 'oleo-de-ritual-jasmim',
    nome: 'Óleo de Ritual — Jasmim',
    nomeCurto: 'Jasmim',
    categoria: 'oleos-de-ritual',
    conceito: ['Presença', 'Sensualidade', 'Flor'],
    descricaoCurta: 'Jasmim em imersão — um óleo de presença e aroma pleno.',
    intencao:
      'O jasmim não sussurra. Este é o óleo para os dias em que você quer se sentir inteira, presente, um pouco mais viva na própria pele.',
    aroma: 'Jasmim — floral intenso, doce, marcante.',
    composicao:
      'Óleo vegetal de coco, flores de jasmim em imersão, óleos essenciais. [confirmar]',
    volume: '30 ml',
    preco: 'a partir de R$ 58',
    precoBase: 58,
    disponibilidade: 'pronta-entrega',
    modoDeUso: MODO_OLEOS,
    cuidados: CUIDADOS_OLEOS,
    fechamento: 'Esteja inteira. Esteja aqui.',
    imagens: img('oleo-de-ritual-jasmim'),
    relacionados: [
      'encantamento-e-poder-pessoal',
      'oleo-de-ritual-rosas-com-geranio',
      'oleo-de-ritual-lavanda',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Banhos & Escalda-Pés — R$ 24                                               */
/* Modo de uso e cuidados vêm do bloco da categoria (categorias.ts).          */
/* -------------------------------------------------------------------------- */

/*
 * Banhos & Escalda-Pés — dados vindos dos RÓTULOS REAIS (fotos de agosto/2026).
 * Nome, subtítulo, os três verbos, a descrição, as ervas e a intenção de cada
 * erva são transcrições do rótulo; a cor é a do próprio rótulo do produto.
 *
 * Onde o rótulo não foi fotografado, o campo fica [confirmar] — nada inventado.
 *
 * ⚠️ Para o Vinicius: em "Limpeza Densa" o rótulo fala em "mau olhado" e
 * "larvas astrais". É a linguagem da própria cliente, transcrita fielmente,
 * mas contrasta com o pedido dela de evitar espiritualidade baseada no medo.
 * Decisão dela — ver a nota no fim deste arquivo.
 */

/** O decreto em papel que acompanha os banhos. */
const DECRETO_EU_SOU_LUZ = {
  titulo: 'Eu sou luz',
  descricao: 'Um decreto de presença e transmutação, em papel, que acompanha o preparo.',
};

const banhosBase = [
  {
    slug: 'aurora-dourada',
    nome: 'Aurora Dourada',
    subtitulo: 'Banho de Prosperidade',
    conceito: ['Prospera', 'Ilumina', 'Abre caminhos'],
    cor: '#E8DCC0',
    corAcento: '#E8DCC0',
    descricaoCurta: 'Sal grosso marinho, especiarias e flores para abrir caminhos.',
    intencao:
      'Uma infusão de sal grosso marinho, ervas, especiarias e flores potentes para abrir caminhos, trazer movimento, atrair abundância e elevar sua energia e poder pessoal.',
    aroma: 'Laranja doce e especiarias — cítrico, quente, resinoso.',
    ervas: [
      { nome: 'Folha de laranjeira' },
      { nome: 'Anis estrelado' },
      { nome: 'Canela' },
      { nome: 'Folha de pitanga' },
      { nome: 'Folha de louro' },
      { nome: 'Cravo' },
      { nome: 'Rosa amarela' },
      { nome: 'Óleo essencial de wild orange' },
    ],
    composicao:
      'Sal grosso marinho, folha de laranjeira, anis estrelado, canela, folha de pitanga, folha de louro, cravo e rosa amarela, com óleo essencial de wild orange.',
  },
  {
    slug: 'alegria',
    nome: 'Alegria',
    subtitulo: 'Banho de Alegria',
    conceito: ['Ilumina', 'Revitaliza', 'Floresce'],
    cor: '#E0A62E',
    corAcento: '#E0A62E',
    descricaoCurta: 'Para os dias de cansaço, desânimo e tristeza sem motivo aparente.',
    intencao:
      'Revitaliza, refresca e ilumina o ser. Purifica o corpo, clareia a mente e desperta o brilho da alma. Ideal para momentos de cansaço, desânimo e tristeza — seja sem motivo aparente, seja por ambientes densos.',
    aroma: 'Herbáceo e fresco — alecrim, manjericão e hortelã.',
    ervas: [
      { nome: 'Calêndula', intencao: 'Energiza e reanima, resgatando o poder e a estima pessoal.' },
      { nome: 'Alecrim', intencao: 'Traz força e equilíbrio mental, alegra, clareia e ilumina.' },
      { nome: 'Manjericão', intencao: 'Harmonizador energético; perfuma fortalecendo o espírito.' },
      { nome: 'Sálvia', intencao: 'Purificação.' },
      { nome: 'Hortelã', intencao: 'Acalma e refresca, estimula a intuição e a sensibilidade.' },
    ],
    composicao: 'Calêndula, alecrim, manjericão, sálvia e hortelã.',
  },
  {
    slug: 'calmaria',
    nome: 'Calmaria',
    subtitulo: 'Banho de Calmaria',
    conceito: ['Silencia', 'Equilibra', 'Acolhe'],
    cor: '#7B76D8',
    corAcento: '#AFA6CE',
    descricaoCurta: 'Sal marinho com camomila, lavanda e alecrim, para o fim do dia.',
    intencao:
      'Um convite ao descanso da mente e ao relaxamento do corpo. A delicadeza da camomila, a suavidade da lavanda e a força protetora do alecrim se unem ao poder de purificação do sal marinho.',
    aroma: 'Lavanda e camomila — floral, serena, limpa.',
    ervas: [
      { nome: 'Sal marinho', intencao: 'Purificação.' },
      { nome: 'Camomila', intencao: 'Delicadeza; acalma a mente inquieta.' },
      { nome: 'Lavanda', intencao: 'Suavidade; alivia o estresse e a tensão.' },
      { nome: 'Alecrim', intencao: 'Força protetora; traz clareza.' },
    ],
    beneficios: [
      'Acalma a mente inquieta',
      'Alivia o estresse e a tensão',
      'Traz clareza e proteção energética',
    ],
    composicao: 'Sal marinho com camomila, lavanda e alecrim.',
  },
  {
    slug: 'limpeza-densa',
    nome: 'Limpeza Densa',
    subtitulo: 'Banho de Limpeza Densa',
    conceito: ['Purifica', 'Renova', 'Reequilibra'],
    cor: '#6E7378',
    corAcento: '#B1ABA3',
    descricaoCurta: 'Para os dias que ficaram pesados. Limpa profundamente.',
    intencao:
      'Para os dias que ficaram pesados. Um banho para deixar ir o que já não é seu — o cansaço acumulado, o ambiente que grudou, o excesso do dia. Sai mais leve do que entrou.',
    aroma: 'Eucalipto e alecrim — verde, resinoso, penetrante.',
    ervas: [
      { nome: 'Arruda', intencao: 'Descarrego e limpeza.' },
      {
        nome: 'Alecrim',
        intencao: 'Proteção energética, gerando uma aura de positividade e boas energias.',
      },
      { nome: 'Guiné', intencao: 'Forte poder de limpeza e purificação.' },
      { nome: 'Casca de alho', intencao: 'Transmutação energética densa.' },
      { nome: 'Eucalipto', intencao: 'Limpa renovando as vibrações.' },
      { nome: 'Boldo', intencao: 'Purificação, promovendo leveza e harmonia.' },
      {
        nome: 'Óleo essencial de eucalipto-limão',
        intencao: 'Libera mágoas e ressentimentos.',
      },
    ],
    composicao:
      'Arruda, alecrim, guiné, casca de alho, eucalipto e boldo, com óleo essencial de eucalipto-limão.',
    modoDeUso:
      'Dissolva o conteúdo em água morna e envolva-se neste ritual de autocuidado. Foque nas suas intenções e faça as suas orações.',
  },
  {
    slug: 'encantamento-e-poder-pessoal',
    nome: 'Encantamento & Poder Pessoal',
    subtitulo: 'Banho de Encantamento e Poder Pessoal',
    conceito: ['Magnetismo', 'Confiança', 'Presença'],
    cor: '#8E2436',
    corAcento: '#CCA39B',
    descricaoCurta: 'Desperta o magnetismo e fortalece a autoestima.',
    intencao:
      'Desperta o poder do feminino, ativa o magnetismo e fortalece a autoestima. Um banho para os dias em que você precisa ocupar o próprio espaço — não para parecer outra pessoa, mas para lembrar de quem você já é.',
    aroma: 'Jasmim e rosa com canela — floral intenso, doce, quente.',
    ervas: [
      { nome: 'Jasmim', intencao: 'Inspira autoestima e atrai amor.' },
      { nome: 'Artemísia', intencao: 'Visão espiritual e poder feminino.' },
      { nome: 'Cravo', intencao: 'Magnetismo, proteção e sensualidade.' },
      { nome: 'Rosa vermelha', intencao: 'Amor-próprio e abertura do coração.' },
      { nome: 'Hibisco', intencao: 'Libera emoções e ativa o feminino.' },
      { nome: 'Folha de canela', intencao: 'Atração, calor e prosperidade.' },
    ],
    composicao: 'Jasmim, artemísia, cravo, rosa vermelha, hibisco e folha de canela.',
  },
  {
    slug: 'paz-na-alma',
    nome: 'Paz na Alma',
    subtitulo: 'Banho de Luz e Acolhimento',
    conceito: ['Silêncio', 'Presença', 'Reconexão'],
    cor: '#EDE6DA',
    corAcento: '#EDE6DA',
    descricaoCurta: 'Há um lugar em você onde a paz permanece.',
    intencao:
      'Para aquietar o que anda inquieto. Um banho de reconciliação com o próprio dia, com o próprio ritmo, consigo. Paz não como ausência — como presença.',
    aroma: '[confirmar]',
    composicao: '[confirmar: ervas deste preparo]',
    fechamento: 'Há um lugar em você onde a paz permanece. Volte para ele.',
  },
  {
    slug: 'primavere-se',
    nome: 'Primavere-se',
    conceito: ['Energiza', 'Renova', 'Floresce'],
    cor: '#E8613C',
    corAcento: '#E7987C',
    descricaoCurta: 'Um banho de recomeço, para quando algo dentro pede a virada.',
    intencao:
      'Um banho de recomeço. Para quando algo dentro pede para virar a página, abrir a janela, deixar entrar. Floresça no seu tempo.',
    aroma: '[confirmar]',
    composicao: '[confirmar: ervas deste preparo]',
  },
  {
    slug: 'eixo-rosa',
    nome: 'Eixo Rosa',
    conceito: ['Harmoniza', 'Acolhe', 'Equilibra'],
    cor: '#D96E8A',
    corAcento: '#DE99A2',
    descricaoCurta: 'O banho do coração, pela via do afeto.',
    intencao:
      'O banho do coração. Para se acolher com a mesma gentileza que você oferece aos outros — e voltar ao próprio eixo pela via do afeto.',
    aroma: '[confirmar]',
    composicao: '[confirmar: ervas deste preparo]',
  },
];

const banhos: Produto[] = banhosBase.map((b, i) => ({
  ...b,
  categoria: 'banhos-escalda-pes',
  preco: 'R$ 24',
  precoBase: 24,
  disponibilidade: 'pronta-entrega' as const,
  decreto: DECRETO_EU_SOU_LUZ,
  imagens: img(b.slug),
  relacionados: [
    banhosBase[(i + 1) % banhosBase.length].slug,
    banhosBase[(i + 2) % banhosBase.length].slug,
    'spray-de-protecao',
  ],
}));

/* -------------------------------------------------------------------------- */
/* Roll-ons · Incensos · Presentes                                            */
/* -------------------------------------------------------------------------- */

const outros: Produto[] = [
  {
    slug: 'roll-on-personalizado',
    nome: 'Roll-on de Óleos Essenciais',
    nomeCurto: 'Roll-on personalizado',
    categoria: 'roll-ons-oleos-essenciais',
    conceito: ['Sinergia', 'Bolso', 'Personalizado'],
    descricaoCurta:
      'Uma combinação de óleos essenciais feita para o que você procura, no tamanho de levar junto.',
    intencao:
      'Você conta o que precisa — foco para trabalhar, calma para dormir, presença para respirar no meio do dia — e preparamos a sinergia. É um produto de bolso, para reaplicar nos pulsos ou nas têmporas sempre que quiser retornar à intenção que escolheu.',
    comoAdquirir:
      'Fale com a gente pelo WhatsApp para montar a sua combinação. Cada roll-on é preparado sob consulta.',
    volume: '10 ml',
    preco: 'a partir de R$ 50',
    precoBase: 50,
    disponibilidade: 'sob-consulta',
    modoDeUso:
      'Aplique nos pulsos, têmporas ou atrás das orelhas. Evite contato com os olhos.',
    cuidados:
      'Uso externo. Faça um teste em pequena área. Em caso de gravidez ou pele sensível, consulte um profissional. [confirmar: restrições por sinergia]',
    fechamento: 'A sua intenção, do tamanho de um gesto.',
    imagens: img('roll-on-personalizado'),
    relacionados: ['oleo-de-ritual-lavanda', 'spray-de-protecao', 'amuleto-de-harmonia'],
  },
  {
    slug: 'incensos-naturais',
    nome: 'Incensos Naturais',
    categoria: 'incensos-naturais',
    conceito: ['Estação', 'Erva', 'Fumaça'],
    descricaoCurta: 'Incensos feitos com as ervas e flores de cada estação, em pequenos lotes.',
    intencao:
      'Um jeito antigo de marcar o tempo e o espaço. Nossos incensos mudam ao longo do ano, acompanhando o que a estação oferece — por isso o aroma e a disponibilidade variam de lote para lote. Vale perguntar o que há agora.',
    preco: 'conforme o lote',
    disponibilidade: 'sazonal',
    modoDeUso:
      'Acenda a ponta, deixe a chama se firmar e apague suavemente para que libere a fumaça. Use sempre sobre um suporte apropriado, em local ventilado.',
    cuidados:
      'Nunca deixe aceso sem supervisão. Mantenha longe de materiais inflamáveis, crianças e animais. Uso em ambiente ventilado.',
    fechamento: 'Cada estação tem o seu aroma. Pergunte pelo desta.',
    imagens: img('incensos-naturais'),
    relacionados: ['brumas-de-harmonia', 'buque-botanico', 'paz-na-alma'],
  },
  {
    slug: 'sache-lavanda-da-alma',
    nome: 'Sachê Lavanda da Alma',
    categoria: 'presentes-complementos',
    conceito: ['Aroma', 'Gaveta', 'Calma'],
    descricaoCurta: 'Um sachê de lavanda para perfumar gavetas, armários e cantos de descanso.',
    intencao:
      'Pequeno, discreto, duradouro. Para vestir de aroma a gaveta de roupas, o guarda-roupa, a cabeceira. Um daqueles cuidados que a gente sente sem perceber.',
    composicao: 'Lavanda seca. [confirmar]',
    preco: 'R$ 20',
    precoBase: 20,
    disponibilidade: 'pronta-entrega',
    modoDeUso:
      'Coloque entre as roupas, na gaveta ou próximo à cama. Aperte de leve para reavivar o aroma.',
    cuidados: 'Uso externo, não ingerir. Mantenha fora do alcance de crianças.',
    fechamento: 'A calma cabe numa gaveta.',
    imagens: img('sache-lavanda-da-alma'),
    relacionados: ['oleo-de-ritual-lavanda', 'buque-botanico', 'calmaria'],
  },
  {
    slug: 'buque-botanico',
    nome: 'Buquê Botânico',
    categoria: 'presentes-complementos',
    conceito: ['Presente', 'Seco', 'Duradouro'],
    descricaoCurta: 'Um buquê botânico seco, para dar de presente ou para ficar.',
    intencao:
      'Flores que não se despedem na semana seguinte. Um presente afetivo e sóbrio — ou um detalhe para um canto da casa. Por ser artesanal e depender do que há disponível, cada buquê é um pouco único.',
    composicao: 'Flores e ervas secas selecionadas. [confirmar]',
    preco: 'R$ 25',
    precoBase: 25,
    disponibilidade: 'pronta-entrega',
    cuidados:
      'Mantenha longe da umidade e da luz solar direta para durar mais. Pode variar conforme a produção.',
    fechamento: 'Um presente que fica.',
    imagens: img('buque-botanico'),
    relacionados: ['aura-botanica', 'sache-lavanda-da-alma', 'amuleto-de-harmonia'],
  },
  {
    slug: 'amuleto-de-harmonia',
    nome: 'Amuleto de Harmonia',
    categoria: 'presentes-complementos',
    conceito: ['Intenção', 'Guardar', 'Levar'],
    descricaoCurta: 'Um amuleto artesanal preparado com intenção, para levar ou presentear.',
    intencao:
      'Um objeto para carregar consigo — não como promessa, mas como lembrete. Algo pequeno que ancora uma intenção escolhida por você. Preparado sob consulta, com atenção ao que faz sentido para cada pessoa.',
    composicao: '[confirmar: materiais e elementos]',
    preco: 'a partir de R$ 50',
    precoBase: 50,
    disponibilidade: 'sob-consulta',
    comoAdquirir:
      'Fale com a gente pelo WhatsApp para conversar sobre a intenção e a disponibilidade.',
    cuidados: 'Objeto artesanal — pequenas variações fazem parte. [confirmar]',
    fechamento: 'Um lembrete de bolso para o que importa.',
    imagens: img('amuleto-de-harmonia'),
    relacionados: ['roll-on-personalizado', 'buque-botanico', 'sache-lavanda-da-alma'],
  },
];

export const produtos: Produto[] = [...brumas, ...oleos, ...banhos, ...outros];

/* -------------------------------------------------------------------------- */
/* Seletores                                                                  */
/* -------------------------------------------------------------------------- */

export const getProduto = (slug: string) => produtos.find((p) => p.slug === slug);

export const produtosPorCategoria = (categoria: string) =>
  produtos.filter((p) => p.categoria === categoria);

export const produtosDestaque = () => produtos.filter((p) => p.destaque);

export const getRelacionados = (produto: Produto, limite = 3) => {
  const escolhidos = (produto.relacionados ?? [])
    .map(getProduto)
    .filter((p): p is Produto => Boolean(p));
  if (escolhidos.length >= limite) return escolhidos.slice(0, limite);
  // completa com vizinhos da mesma categoria
  const extras = produtosPorCategoria(produto.categoria).filter(
    (p) => p.slug !== produto.slug && !escolhidos.some((e) => e.slug === p.slug),
  );
  return [...escolhidos, ...extras].slice(0, limite);
};

export const contagemPorCategoria = (categoria: string) =>
  produtosPorCategoria(categoria).length;

/* --------------------------------------------------------------------------
 * NOTA — decisão pendente da cliente
 *
 * O rótulo de "Limpeza Densa" descreve a arruda como "descarrego e limpeza de
 * mau olhado" e a casca de alho como "limpeza de larvas astrais". Transcrevi as
 * intenções das ervas de forma fiel, mas SUAVIZEI essas duas expressões
 * ("descarrego e limpeza"; "transmutação energética densa"), porque o briefing
 * dela pede explicitamente para evitar espiritualidade baseada no medo.
 *
 * Não é uma decisão minha para tomar em definitivo: se ela preferir o texto
 * exato do rótulo, é só devolver as duas frases aqui.
 * ------------------------------------------------------------------------ */
