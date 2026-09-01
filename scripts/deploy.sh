#!/usr/bin/env bash
#
# Publica em produção e VERIFICA. Existe porque um deploy já falhou em
# silêncio: a saída da CLI estava sendo filtrada por um grep, o erro não
# casava com o filtro, e o terminal ficou quieto como se tivesse dado certo.
#
# Regras deste script:
#   1. nunca filtrar a saída da CLI — ela vai inteira para o log;
#   2. conferir o código de saída de cada etapa;
#   3. não confiar no "deploy criado": esperar ficar Ready e testar o site;
#   4. sair com código != 0 em qualquer falha, para não passar batido.
#
# Uso:  npm run deploy
set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RAIZ"

DOMINIO="https://toque-energetico.vercel.app"
LOG="$RAIZ/.vercel/ultimo-deploy.log"
mkdir -p "$(dirname "$LOG")"

falhar() {
  printf '\n\033[31m✗ %s\033[0m\n' "$1" >&2
  printf '  log completo: %s\n' "$LOG" >&2
  exit 1
}

printf '→ publicando em produção…\n'
# tee: a saída aparece E fica no log. Sem grep, sem head.
if ! npx vercel deploy --prod --yes 2>&1 | tee "$LOG"; then
  falhar 'a CLI da Vercel retornou erro'
fi

URL="$(grep -oE 'https://toque-energetico-[a-z0-9]+-[a-z0-9-]+\.vercel\.app' "$LOG" | head -1)"
[ -n "$URL" ] || falhar 'não encontrei a URL do deploy na saída da CLI'
printf '→ deploy: %s\n' "$URL"

printf '→ esperando ficar Ready…\n'
for _ in $(seq 1 60); do
  ESTADO="$(npx vercel inspect "$URL" 2>&1 | grep -oE 'READY|ERROR|CANCELED|BUILDING|QUEUED' | head -1)"
  case "$ESTADO" in
    READY) break ;;
    ERROR | CANCELED) falhar "o build terminou em $ESTADO" ;;
  esac
  sleep 5
done
[ "${ESTADO:-}" = 'READY' ] || falhar 'tempo esgotado esperando o build'

printf '→ conferindo o site no ar…\n'
ROTAS='/ /catalogo /catalogo/brumas-aromas-ambientes /produto/spray-de-protecao /sobre /rituais /faq /contato /onde-encontrar /atacado'
ERROS=0
for r in $ROTAS; do
  CODIGO="$(curl -s -o /dev/null -w '%{http_code}' "$DOMINIO$r")"
  if [ "$CODIGO" != '200' ]; then
    printf '   \033[31m%s → %s\033[0m\n' "$r" "$CODIGO"
    ERROS=$((ERROS + 1))
  fi
done
[ "$ERROS" -eq 0 ] || falhar "$ERROS rota(s) fora do ar"

# O domínio curto precisa estar apontando para ESTE deploy, senão a cliente
# continua vendo a versão anterior.
if ! npx vercel alias ls 2>&1 | grep -q "${URL#https://}.*toque-energetico.vercel.app"; then
  printf '   \033[33m⚠ o domínio curto pode não ter apontado para este deploy\033[0m\n'
fi

printf '\n\033[32m✓ no ar: %s\033[0m\n' "$DOMINIO"
printf '  %d rotas conferidas · deploy %s\n' "$(echo $ROTAS | wc -w | tr -d ' ')" "${URL##*/}"
