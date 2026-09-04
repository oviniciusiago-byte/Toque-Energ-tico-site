#!/usr/bin/env python3
"""
Confere os tokens de superfície contra a WCAG 2.1 (AA = 4.5:1 para texto
normal). Os valores são lidos de `app/globals.css`, então o script não sai do ar
quando uma cor muda.

Uso:  python3 scripts/check-contrast.py
"""
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(RAIZ, 'app', 'globals.css')


def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def luz(rgb):
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def razao(a, b):
    la, lb = luz(a), luz(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def mistura(fg, bg, alfa):
    return tuple(round(alfa * f + (1 - alfa) * b) for f, b in zip(fg, bg))


def ler_css():
    with open(CSS, encoding='utf-8') as f:
        css = f.read()

    canais = {
        m.group(1): tuple(int(x) for x in m.group(2).split())
        for m in re.finditer(r'--([a-z-]+)-rgb:\s*(\d+ \d+ \d+);', css)
    }

    superficies = {}
    for bloco in re.finditer(r'\.surface-([a-z]+)\s*\{(.*?)\n  \}', css, re.S):
        nome, corpo = bloco.group(1), bloco.group(2)
        dados = {}
        for token in ('bg', 'fg', 'muted', 'faint'):
            m = re.search(rf'--s-{token}:\s*([^;]+);', corpo)
            if m:
                dados[token] = m.group(1).strip()
        superficies[nome] = dados
    return canais, superficies


def resolver(valor, canais):
    """Converte `rgb(var(--x-rgb) / 0.7)` ou `var(--x)` em (rgb, alfa)."""
    m = re.search(r'--([a-z-]+?)(?:-rgb)?\)', valor)
    if not m:
        return None, None
    nome = m.group(1)
    rgb = canais.get(nome) or canais.get(nome.replace('-rgb', ''))
    if rgb is None:
        return None, None
    alfa = re.search(r'/\s*([0-9.]+)\s*\)', valor)
    return rgb, float(alfa.group(1)) if alfa else 1.0



def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[k:k + 2], 16) for k in (0, 2, 4))


def rumo_a(base, destino, t):
    """Caminha `base` na direção de `destino` por `t` (0..1). Ambos em RGB."""
    return mistura(destino, base, t)


def cores_dos_banhos():
    """
    Le a cor de rotulo de cada banho direto de content/produtos.ts.

    Le de dentro do array `banhosBase` em vez de filtrar por `categoria`: os
    banhos so ganham a categoria depois, por mapeamento, entao o campo nao
    fica perto do slug e o filtro achava so 2 dos 8.
    """
    caminho = os.path.join(RAIZ, 'content', 'produtos.ts')
    if not os.path.exists(caminho):
        return {}
    texto = open(caminho, encoding='utf-8').read()
    i = texto.find('const banhosBase')
    if i < 0:
        return {}
    fim = texto.find('\n];', i)
    bloco = texto[i:fim if fim > 0 else len(texto)]
    achados = {}
    for m in re.finditer(r"slug:\s*'([a-z0-9-]+)'", bloco):
        slug = m.group(1)
        c = re.search(r"cor:\s*'(#[0-9A-Fa-f]{6})'", bloco[m.start():m.start() + 1400])
        if c:
            achados[slug] = c.group(1)
    return achados


def checar_rampa():
    """
    Espelha lib/contraste.ts::rampaLegivel e confere os tres tons da cena dos
    banhos.

    Existe porque a hierarquia daquele texto ja foi feita com classes
    `opacity-*` uma vez — e opacidade mistura o texto com o fundo, derrubando
    o contraste sem que nada acuse. Na medicao da epoca, 23 das 48 camadas
    reprovavam 4.5:1. Este teste nao pega alguem reintroduzindo opacidade no
    JSX; pega alvo de rampa mexido e cor de rotulo nova que nao caiba.
    """
    ALVOS = (('forte', 6.2), ('medio', 5.2), ('suave', 4.7))
    PRETO, BRANCO = hex_rgb('#050403'), hex_rgb('#FFFCF7')

    def extremo(campo, escura):
        return rumo_a(campo, PRETO, 0.88) if escura else rumo_a(campo, BRANCO, 0.92)

    def degrau(campo, ext, alvo):
        melhor = ext
        for k in range(101):
            c = rumo_a(ext, campo, k / 100)
            if razao(c, campo) < alvo:
                break
            melhor = c
        return melhor

    banhos = cores_dos_banhos()
    if not banhos:
        print('(nenhuma cor de banho encontrada — rampa nao verificada)')
        return []

    print()
    print('Rampa de leitura da cena dos banhos')
    print(f'{"banho":<30}{"forte":>8}{"medio":>8}{"suave":>8}')
    print('-' * 54)
    falhas = []
    for slug, cor in sorted(banhos.items()):
        base = hex_rgb(cor)
        campo = esc = None
        for k in range(61):
            t = k / 100
            for destino, escura in ((hex_rgb('#000000'), False), (hex_rgb('#FFFFFF'), True)):
                tentativa = rumo_a(base, destino, t)
                if razao(extremo(tentativa, escura), tentativa) >= 6.4:
                    campo, esc = tentativa, escura
                    break
            if campo is not None:
                break
        if campo is None:
            falhas.append(f'{slug}: nenhum campo legivel')
            continue
        ext = extremo(campo, esc)
        linha = f'{slug:<30}'
        for nome, alvo in ALVOS:
            r = razao(degrau(campo, ext, alvo), campo)
            linha += f'{r:>8.2f}'
            if r < 4.5:
                falhas.append(f'{slug}/{nome} = {r:.2f}:1')
        print(linha)
    return falhas


def main():
    canais, superficies = ler_css()
    falhas = []
    print(f"{'superficie':<12}{'token':<8}{'contraste':>10}   status")
    print('-' * 44)

    for nome, dados in superficies.items():
        if 'bg' not in dados or 'fg' not in dados:
            continue
        bg, _ = resolver(dados['bg'], canais)
        fg, _ = resolver(dados['fg'], canais)
        if bg is None or fg is None:
            continue

        for token in ('fg', 'muted', 'faint'):
            if token not in dados:
                continue
            cor, alfa = resolver(dados[token], canais)
            if cor is None:
                continue
            r = razao(mistura(cor, bg, alfa), bg)
            ok = r >= 4.5
            if not ok:
                falhas.append(f'{nome}/{token} = {r:.2f}:1')
            print(f'{nome:<12}{token:<8}{r:>7.2f}:1   {"OK" if ok else "FALHA"}')

    falhas += checar_rampa()

    print()
    if falhas:
        print('FALHAS (abaixo de 4.5:1):')
        for f in falhas:
            print('  -', f)
        sys.exit(1)
    print('Todos os tokens passam AA (4.5:1).')


if __name__ == '__main__':
    main()
