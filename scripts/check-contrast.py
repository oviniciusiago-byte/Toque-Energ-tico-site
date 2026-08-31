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

    print()
    if falhas:
        print('FALHAS (abaixo de 4.5:1):')
        for f in falhas:
            print('  -', f)
        sys.exit(1)
    print('Todos os tokens passam AA (4.5:1).')


if __name__ == '__main__':
    main()
