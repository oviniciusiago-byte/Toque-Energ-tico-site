#!/usr/bin/env python3
"""
Gera os PLACEHOLDERS de imagem do projeto (gradientes na paleta da marca com o
nome do arquivo escrito por cima), para o site rodar antes das fotos reais.

Uso:  npm run placeholders
Ele NÃO sobrescreve arquivo existente — quando você colocar a foto real com o
mesmo nome, ela é preservada. Para regerar um placeholder, apague o arquivo.

Os nomes vêm da própria camada de conteúdo (content/produtos.ts e
content/categorias.ts), então adicionar um produto e rodar o script basta.
"""
import hashlib
import os
import re
import sys

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:  # pragma: no cover
    sys.exit('Pillow não encontrado. Instale com: python3 -m pip install --user Pillow')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(RAIZ, 'public')

# paleta da marca (globals.css)
PARES = [
    ((244, 238, 226), (228, 218, 200)),  # off-white → cream
    ((234, 225, 208), (206, 178, 124)),  # cream → dourado claro
    ((90, 86, 82), (46, 44, 41)),        # cimento queimado → escuro
    ((62, 45, 33), (28, 25, 22)),        # madeira → carvão
    ((233, 226, 212), (168, 133, 66)),   # off-white → dourado
    ((36, 46, 39), (22, 29, 24)),        # verde botânico
]

FONTES = [
    '/System/Library/Fonts/Supplemental/Georgia.ttf',
    '/System/Library/Fonts/Supplemental/Times New Roman.ttf',
    '/System/Library/Fonts/Helvetica.ttc',
]


def fonte(px):
    for caminho in FONTES:
        if os.path.exists(caminho):
            try:
                return ImageFont.truetype(caminho, px)
            except OSError:
                continue
    return ImageFont.load_default()


def gerar(caminho_rel, w, h, rotulo):
    destino = os.path.join(PUB, caminho_rel.lstrip('/'))
    if os.path.exists(destino):
        return False
    os.makedirs(os.path.dirname(destino), exist_ok=True)

    semente = int(hashlib.md5(caminho_rel.encode()).hexdigest()[:8], 16)
    a, b = PARES[semente % len(PARES)]
    escuro = sum(a) / 3 < 128

    # gradiente diagonal
    img = Image.new('RGB', (w, h))
    px = img.load()
    for y in range(h):
        for x in range(0, w, 4):
            t = ((x / w) * 0.45 + (y / h) * 0.55)
            cor = (
                int(a[0] + (b[0] - a[0]) * t),
                int(a[1] + (b[1] - a[1]) * t),
                int(a[2] + (b[2] - a[2]) * t),
            )
            for dx in range(4):
                if x + dx < w:
                    px[x + dx, y] = cor

    # luz lateral (o motivo da irradiação)
    luz = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(luz)
    cx = w * (0.28 + (semente % 5) * 0.11)
    cy = h * (0.3 + (semente % 3) * 0.14)
    r = max(w, h) * 0.42
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=120 if escuro else 70)
    luz = luz.filter(ImageFilter.GaussianBlur(max(w, h) // 7))
    brilho = Image.new('RGB', (w, h), (220, 195, 138) if escuro else (255, 252, 244))
    img = Image.composite(brilho, img, luz.point(lambda v: int(v * 0.65)))

    # Sem rótulo impresso: a imagem é um gradiente tonal limpo, para o site
    # poder ser apresentado ao cliente antes das fotos reais. O aviso de que
    # são placeholders fica no README, não queimado no pixel.
    _ = rotulo

    img.save(destino, 'JPEG', quality=82, optimize=True)
    return True


def ler(arquivo):
    with open(os.path.join(RAIZ, arquivo), encoding='utf-8') as f:
        return f.read()


def imagens_de_produtos():
    """Lê as chamadas img('slug', n) de content/produtos.ts."""
    fonte_ts = ler('content/produtos.ts')
    saida = []
    for slug, n in re.findall(r"img\(\s*'([^']+)'(?:\s*,\s*(\d+))?\s*\)", fonte_ts):
        total = int(n) if n else 2
        for i in range(1, total + 1):
            saida.append((f'/images/products/{slug}-{i}.jpg', slug))
    # slugs gerados em loop (banhos usam img(b.slug))
    if "img(b.slug)" in fonte_ts:
        bloco = fonte_ts[fonte_ts.index('const banhosBase'):fonte_ts.index('const banhos:')]
        for slug in re.findall(r"slug:\s*'([^']+)'", bloco):
            for i in (1, 2):
                saida.append((f'/images/products/{slug}-{i}.jpg', slug))
    return saida


def imagens_de_categorias():
    fonte_ts = ler('content/categorias.ts')
    return [(c, c.rsplit('/', 1)[-1][:-4]) for c in re.findall(r"capa:\s*'([^']+)'", fonte_ts)]


EDITORIAIS = [
    'maos-preparo',
    'maos-buque',
    'preparo-mesa',
    'fundadora',
    'ritual-brumas',
    'ritual-banhos',
    'ritual-oleos',
    'ritual-rollons',
    'ritual-incensos',
    'banhos-escalda-pes',
    'brumas-aromas-ambientes',
    'oleos-de-ritual',
    'roll-ons-oleos-essenciais',
    'incensos-naturais',
    'presentes-complementos',
]


def main():
    tarefas = [('/images/hero-poster.jpg', 1920, 1080, 'hero-poster')]

    for caminho, slug in imagens_de_produtos():
        tarefas.append((caminho, 1000, 1250, slug))

    for caminho, slug in imagens_de_categorias():
        tarefas.append((caminho, 1000, 1333, slug))

    for nome in EDITORIAIS:
        tarefas.append((f'/images/editorial/{nome}.jpg', 1800, 1200, nome))

    criados = 0
    for caminho, w, h, rotulo in tarefas:
        if gerar(caminho, w, h, rotulo):
            criados += 1

    print(f'{criados} placeholder(s) criado(s) · {len(tarefas) - criados} já existia(m)')


if __name__ == '__main__':
    main()
