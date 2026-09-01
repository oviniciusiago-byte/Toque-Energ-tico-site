/**
 * Vídeo e áudio do hero — tudo em um lugar só, para o Vinicius trocar sem
 * abrir componente nenhum.
 */
export const HERO = {
  /**
   * Fundo da abertura enquanto não há vídeo: a TEXTURA FLUIDA VERDE, a
   * "assinatura emocional" da marca (sálvia, musgo, oliva e petróleo
   * acinzentado). Gerada por `scripts/make-fluid-texture.py` — autoral, sem
   * imagem licenciada de terceiros. Substituível por uma versão produzida.
   */
  poster: '/images/texture/fluid-green-dark.jpg',
  video: {
    webm: '/video/hero.webm',
    mp4: '/video/hero.mp4',
  },
  /**
   * Deixe `false` enquanto os arquivos de vídeo forem placeholders: o hero
   * mostra apenas o poster (elegante, sem 404 e sem erro no console).
   *
   * TODO: gerar o vídeo (cenas de escalda-pés, borrifo de spray, luz lateral),
   * salvar em /public/video/hero.mp4 + hero.webm e virar esta flag para `true`.
   */
  videoAtivo: false,
} as const;
