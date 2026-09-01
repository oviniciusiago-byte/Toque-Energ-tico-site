#!/usr/bin/env python3
"""
Gera a TEXTURA FLUIDA VERDE — a "assinatura emocional" pedida no briefing:
mármore/pintura fluida em sálvia, musgo, oliva e azul-petróleo acinzentado,
baixa saturação e acabamento fosco.

É autoral e procedural: nada de imagem licenciada de terceiros. Serve como
placeholder de alta qualidade até existir uma versão produzida.

Uso:  python3 scripts/make-fluid-texture.py
"""
import math
import os
import random

from PIL import Image, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, 'public', 'images', 'texture')

# Paleta do briefing: sálvia, musgo, oliva profundo, petróleo acinzentado.
PALETA_LUZ = [
    (53, 64, 36),    # Kombu — oliva profundo
    (74, 81, 54),    # musgo
    (136, 144, 99),  # verde-sálvia
    (98, 116, 112),  # azul-petróleo acinzentado
    (168, 176, 140), # sálvia claro (área de luminosidade)
    (63, 78, 66),    # verde sombra
]

# Variante de SOMBRA, para servir de fundo atrás de texto: mesma alma, mas na
# faixa escura. Assim o véu sobre ela pode ser leve e o movimento da textura
# aparece — com véu forte a textura sumia.
PALETA_SOMBRA = [
    (24, 30, 19),    # oliva quase preto
    (38, 46, 30),    # Kombu escuro
    (53, 64, 36),    # Kombu
    (52, 66, 64),    # petróleo escuro
    (92, 100, 70),   # musgo iluminado — o veio mais claro que a legibilidade
    (74, 81, 54),    #   permite (medido: mantém 4.5:1 com o texto creme)
    (32, 40, 30),    # sombra
]


def ruido_valor(largura, altura, celulas, semente):
    """Ruído de valor interpolado — a base do movimento orgânico."""
    rnd = random.Random(semente)
    cols, rows = celulas + 1, celulas + 1
    grade = [[rnd.random() for _ in range(cols)] for _ in range(rows)]

    def amostra(u, v):
        x, y = u * celulas, v * celulas
        x0, y0 = int(x), int(y)
        x1, y1 = min(x0 + 1, cols - 1), min(y0 + 1, rows - 1)
        tx, ty = x - x0, y - y0
        # suavização smoothstep, para não deixar aresta de interpolação
        tx = tx * tx * (3 - 2 * tx)
        ty = ty * ty * (3 - 2 * ty)
        a = grade[y0][x0] * (1 - tx) + grade[y0][x1] * tx
        b = grade[y1][x0] * (1 - tx) + grade[y1][x1] * tx
        return a * (1 - ty) + b * ty

    return amostra


def gerar(largura=1800, altura=1200, semente=7, paleta=None):
    # três oitavas + deslocamento de domínio: é o que dá o aspecto de fluido
    base = ruido_valor(largura, altura, 4, semente)
    med = ruido_valor(largura, altura, 9, semente + 101)
    fino = ruido_valor(largura, altura, 18, semente + 202)
    warp_x = ruido_valor(largura, altura, 3, semente + 303)
    warp_y = ruido_valor(largura, altura, 3, semente + 404)

    paleta = paleta or PALETA_LUZ
    img = Image.new('RGB', (largura, altura))
    px = img.load()
    passo = 2  # amostra a cada 2px e depois desfoca: rápido e suave

    for y in range(0, altura, passo):
        v = y / altura
        for x in range(0, largura, passo):
            u = x / largura

            # deslocamento de domínio — dobra o campo como tinta na água
            du = (warp_x(u, v) - 0.5) * 0.34
            dv = (warp_y(u, v) - 0.5) * 0.34
            uu, vv = min(max(u + du, 0), 1), min(max(v + dv, 0), 1)

            n = base(uu, vv) * 0.6 + med(uu, vv) * 0.28 + fino(uu, vv) * 0.12
            # veios: o seno cria as faixas de mármore
            n = (n + 0.12 * math.sin(n * 9.0 + uu * 3.2)) % 1.0

            # mapeia para a paleta com interpolação suave
            pos = n * (len(paleta) - 1)
            i = int(pos)
            t = pos - i
            c1, c2 = paleta[i], paleta[min(i + 1, len(paleta) - 1)]
            cor = (
                int(c1[0] + (c2[0] - c1[0]) * t),
                int(c1[1] + (c2[1] - c1[1]) * t),
                int(c1[2] + (c2[2] - c1[2]) * t),
            )

            for dy in range(passo):
                for dx in range(passo):
                    if x + dx < largura and y + dy < altura:
                        px[x + dx, y + dy] = cor

    # fosco e desfocado: o briefing pede legibilidade acima da textura
    return img.filter(ImageFilter.GaussianBlur(9))


def main():
    os.makedirs(DESTINO, exist_ok=True)
    saidas = (
        ('fluid-green', 7, PALETA_LUZ),
        ('fluid-green-alt', 23, PALETA_LUZ),
        ('fluid-green-dark', 11, PALETA_SOMBRA),
    )
    for nome, semente, paleta in saidas:
        caminho = os.path.join(DESTINO, f'{nome}.jpg')
        if os.path.exists(caminho):
            print(f'já existe: {nome}.jpg')
            continue
        gerar(semente=semente, paleta=paleta).save(
            caminho, 'JPEG', quality=86, optimize=True
        )
        print(f'gerado: {nome}.jpg')


if __name__ == '__main__':
    main()
