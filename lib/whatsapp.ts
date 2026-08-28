/**
 * WhatsApp — a jornada do site termina aqui. Sem carrinho, sem checkout.
 *
 * TODO: trocar WPP pelo número real da Fernanda (formato: 55 + DDD + número).
 */
export const WPP = '55XXXXXXXXXXX'; // TODO: número real — [confirmar com a cliente]

/** true quando o número já foi preenchido de verdade. */
export const WPP_CONFIGURADO = !/X/.test(WPP);

export const wppLink = (msg: string) =>
  `https://wa.me/${WPP}?text=${encodeURIComponent(msg)}`;

/** Mensagens padrão por contexto. */
export const wppMsg = {
  geral: 'Olá! Vim pelo site da Toque Energético e gostaria de saber mais sobre os produtos.',
  produto: (nome: string, volume?: string, preco?: string) => {
    const detalhe = [volume, preco].filter(Boolean).join(' · ');
    return `Olá! Tenho interesse no ${nome}${detalhe ? ` (${detalhe})` : ''}. Ele está disponível?`;
  },
  categoria: (nome: string) =>
    `Olá! Gostaria de saber mais sobre a linha ${nome} da Toque Energético.`,
  sobConsulta: (nome: string) =>
    `Olá! Queria conversar sobre o ${nome} — é feito sob consulta, certo? Gostaria de entender as possibilidades.`,
  sazonal: (nome: string) =>
    `Olá! Queria saber quais ${nome} estão disponíveis no lote atual.`,
  atacado:
    'Olá! Tenho interesse em revenda / atacado da Toque Energético. Posso contar um pouco sobre o meu negócio?',
  ondeEncontrar:
    'Olá! Gostaria de saber onde encontrar a Toque Energético — feiras ou pontos de venda.',
} as const;
