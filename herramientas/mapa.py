"""Arma img/fondos/mapa-barrio.svg: el barrio con calles continuas, arroyo, árboles y faroles.
Reutiliza las viñetas de cada zona (dibujadas en Figma) desde herramientas/fuentes/mapa-vinetas.svg.
Uso: python3 herramientas/mapa.py  →  escribe img/fondos/mapa-barrio.svg e imprime las posiciones de las zonas."""
import xml.etree.ElementTree as ET, math, random, json, os
ET.register_namespace('', 'http://www.w3.org/2000/svg')
NS = '{http://www.w3.org/2000/svg}'
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FUENTE = os.path.join(RAIZ, 'herramientas/fuentes/mapa-vinetas.svg')
SALIDA = os.path.join(RAIZ, 'img/fondos/mapa-barrio.svg')
W, H = 1024, 1580
K = '#5A3526'
rnd = random.Random(7)
# Filtros para las zonas que aún no se encienden (la app los aplica por zona).
FILTROS = ('<defs><filter id="f-apagado" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".26 .5 .1 0 .06  .24 .52 .1 0 .06  .22 .46 .14 0 .07  0 0 0 1 0"/></filter>'
           '<filter id="f-tenue" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values=".55"/></filter></defs>')

r = ET.parse(FUENTE).getroot()
defs = ET.tostring(r.find(NS + 'defs')).decode().replace(' xmlns="http://www.w3.org/2000/svg"', '')
islas = {c.get('id'): c for c in r.find(NS + 'g') if c.get('id')}
# id de la viñeta, zona, caja original (x, y, ancho, alto)
ZONAS = [
    ('family-island', 'casa', (61, 124, 382, 253)), ('street-island', 'cuadra', (579, 127, 380, 254)),
    ('canal-island', 'arroyo', (56, 459, 395, 260)), ('mangrove-island', 'cienaga', (582, 489, 377, 235)),
    ('solar-island', 'techos', (65, 801, 377, 256)), ('park-island', 'parque', (580, 747, 376, 315)),
    ('school-island', 'colegio', (57, 1158, 390, 267)), ('workshop-plaza', 'plaza', (579, 1154, 381, 272)),
]
FILAS = [96, 476, 856, 1236]          # base (borde inferior del pedestal) - alto: se alinean por abajo
BASE = [FILAS[0] + 250, FILAS[1] + 250, FILAS[2] + 250, FILAS[3] + 250]

out = []
A = out.append

# ---------- Suelo ----------
A(f'<rect width="{W}" height="{H}" fill="#E4ECBC"/>')
# Manchas de pasto suaves (irregulares)
def mancha(cx, cy, rx, ry, col, n=14, var=.16):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1 + rnd.uniform(-var, var)
        pts.append((cx + math.cos(a) * rx * k, cy + math.sin(a) * ry * k))
    d = f'M{pts[0][0]:.0f} {pts[0][1]:.0f} '
    for i in range(n):
        p0, p1 = pts[i], pts[(i + 1) % n]
        mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        d += f'Q{p0[0]:.0f} {p0[1]:.0f} {mx:.0f} {my:.0f} '
    return f'<path d="{d}Z" fill="{col}"/>'
for (gid, z, (x, y, w, h)), fila in zip(ZONAS, [0, 0, 1, 1, 2, 2, 3, 3]):
    cx = x + w / 2; cy = BASE[fila] - 70
    A(mancha(cx, cy, w * .6, 150, '#D3E2A0'))
# Textura: puntitos y matas de pasto
for _ in range(90):
    x, y = rnd.uniform(20, W - 20), rnd.uniform(20, H - 20)
    A(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rnd.uniform(3,6):.1f}" ry="{rnd.uniform(1.5,3):.1f}" fill="#C9DA94" opacity=".8"/>')

# ---------- Arroyo (de la zona Arroyo a la Ciénaga, pasa bajo la avenida) ----------
arroyo = 'M360 716 C 380 770, 440 812, 512 812 S 620 790, 652 712'
A(f'<path d="{arroyo}" fill="none" stroke="#B7CF85" stroke-width="84" stroke-linecap="round"/>')
A(f'<path d="{arroyo}" fill="none" stroke="{K}" stroke-width="52" stroke-linecap="round"/>')
A(f'<path d="{arroyo}" fill="none" stroke="#8FD1E3" stroke-width="44" stroke-linecap="round"/>')
A(f'<path d="{arroyo}" fill="none" stroke="#5DB6D3" stroke-width="26" stroke-linecap="round"/>')
A(f'<path d="M398 776 c12 6 24 6 36 0 M596 786 c12 -6 24 -8 34 -16" fill="none" stroke="#EAF8FC" stroke-width="4" stroke-linecap="round"/>')

# ---------- Calles (por capas: así los cruces se funden y no parecen ramas) ----------
avenida = 'M512 -40 C 488 120, 538 250, 512 400 S 486 640, 512 806 S 540 1010, 512 1190 S 488 1500, 512 1800'
calles = ['M-40 404 C 200 396, 820 412, 1064 404', 'M-40 1188 C 200 1180, 820 1196, 1064 1188']
def capa(ds, ancho, color, extra=''):
    for d in ds: A(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{ancho}" stroke-linecap="butt" {extra}/>')
AV, CA = 74, 54            # asfalto: avenida y calles
ANDEN = 15
capa([avenida], AV + 2 * ANDEN + 6, K); capa(calles, CA + 2 * ANDEN + 6, K)
capa([avenida], AV + 2 * ANDEN, '#FCF1DE'); capa(calles, CA + 2 * ANDEN, '#FCF1DE')
capa([avenida], AV + 6, '#D8BE97'); capa(calles, CA + 6, '#D8BE97')
capa([avenida], AV, '#9C93A8'); capa(calles, CA, '#AAA1B5')
# Puente del arroyo sobre la avenida: barandas
A(f'<g stroke="{K}" stroke-width="2.5" fill="#E9D9BE"><rect x="452" y="782" width="12" height="58" rx="4"/><rect x="560" y="782" width="12" height="58" rx="4"/></g>')
# Línea central de la avenida
A(f'<path d="{avenida}" fill="none" stroke="#FFF3D3" stroke-width="5" stroke-dasharray="26 24" stroke-linecap="round"/>')
# Cebras en los cruces
def cebra(cx, cy, horiz, n=5, largo=40, ancho=9, paso=15):
    g = []
    for i in range(n):
        o = (i - (n - 1) / 2) * paso
        if horiz: g.append(f'<rect x="{cx + o - ancho / 2:.0f}" y="{cy - largo / 2:.0f}" width="{ancho}" height="{largo}" rx="2"/>')
        else: g.append(f'<rect x="{cx - largo / 2:.0f}" y="{cy + o - ancho / 2:.0f}" width="{largo}" height="{ancho}" rx="2"/>')
    return '<g fill="#FFF8E8">' + ''.join(g) + '</g>'
for cy in (404, 1188):
    A(cebra(512, cy - 62, False, n=4, largo=56)); A(cebra(512, cy + 62, False, n=4, largo=56))
    A(cebra(420, cy, True, n=4, largo=44)); A(cebra(604, cy, True, n=4, largo=44))

# ---------- Senderos de adoquín: de cada pedestal a la avenida ----------
for (gid, z, (x, y, w, h)), fila in zip(ZONAS, [0, 0, 1, 1, 2, 2, 3, 3]):
    izq = x < 400
    yb = BASE[fila] - 52
    x0, x1 = (x + w - 30, 452) if izq else (x + 30, 572)
    A(f'<path d="M{x0} {yb} L{x1} {yb}" stroke="{K}" stroke-width="30" stroke-linecap="round"/>')
    A(f'<path d="M{x0} {yb} L{x1} {yb}" stroke="#EAD3AE" stroke-width="24" stroke-linecap="round"/>')
    A(f'<path d="M{x0} {yb} L{x1} {yb}" stroke="#D9BC92" stroke-width="2" stroke-dasharray="10 8"/>')

# ---------- Viñetas de las zonas ----------
pins = {}
for (gid, z, (x, y, w, h)), fila in zip(ZONAS, [0, 0, 1, 1, 2, 2, 3, 3]):
    dy = BASE[fila] - (y + h)
    g = ET.tostring(islas[gid]).decode().replace(' xmlns="http://www.w3.org/2000/svg"', '')
    A(f'<g id="z-{z}" class="zona-arte" transform="translate(0 {dy})">{g}</g>')
    pins[z] = {'x': round((x + w / 2) / W * 100, 1), 'y': round((BASE[fila] - 18) / H * 100, 1)}

# ---------- Árboles, palmas, faroles y flores ----------
def arbol(x, y, s=1, c1='#4E9A68', c2='#6DB784'):
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="26" rx="26" ry="8" fill="#000" opacity=".12"/>'
            f'<path d="M-4 24 V4 h8 V24z" fill="#8A5A3C" stroke="{K}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<path d="M0 -42 C 22 -42 34 -26 30 -10 C 36 2 24 14 8 12 C 2 18 -10 18 -14 12 C -30 14 -38 0 -30 -12 C -36 -28 -20 -44 0 -42Z" fill="{c1}" stroke="{K}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<path d="M-14 -26 C -8 -34 4 -36 12 -30" fill="none" stroke="{c2}" stroke-width="6" stroke-linecap="round"/></g>')
def palma(x, y, s=1):
    hojas = ''.join(f'<path d="M0 -70 q{math.cos(a)*26:.0f} {math.sin(a)*14-14:.0f} {math.cos(a)*48:.0f} {math.sin(a)*30+4:.0f} q{-math.cos(a)*20:.0f} {-8:.0f} {-math.cos(a)*48:.0f} {-math.sin(a)*30-4:.0f}z" fill="#5FA66F" stroke="{K}" stroke-width="2.2" stroke-linejoin="round"/>' for a in [math.pi*.05, math.pi*.3, math.pi*.7, math.pi*.95, math.pi*1.5])
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="4" rx="22" ry="6" fill="#000" opacity=".12"/>'
            f'<path d="M-4 2 C -6 -30 -2 -50 0 -70 L5 -70 C 4 -50 3 -30 5 2Z" fill="#B07A50" stroke="{K}" stroke-width="2.4" stroke-linejoin="round"/>{hojas}'
            f'<circle cx="-3" cy="-66" r="4" fill="#8A5A3C"/><circle cx="4" cy="-64" r="4" fill="#8A5A3C"/></g>')
def farol(x, y):
    return (f'<g class="farol" transform="translate({x} {y})"><ellipse cx="0" cy="2" rx="9" ry="3" fill="#000" opacity=".15"/>'
            f'<path d="M-2 2 V-46" stroke="#4A3F4F" stroke-width="5" stroke-linecap="round"/>'
            f'<circle class="farol-luz" cx="0" cy="-52" r="16" fill="#FFE58A" opacity=".0"/>'
            f'<path d="M-9 -46 h18 l-4 -12 h-10z" fill="#FFD34D" stroke="{K}" stroke-width="2.2" stroke-linejoin="round"/></g>')
def flores(x, y):
    cols = ['#F2788C', '#FFD34D', '#FFFFFF', '#F59E4C']
    g = f'<g transform="translate({x} {y})"><ellipse cx="0" cy="4" rx="20" ry="9" fill="#9FC57A" stroke="{K}" stroke-width="2"/>'
    for i in range(5):
        a = i * 1.3
        g += f'<circle cx="{math.cos(a)*11:.0f}" cy="{math.sin(a)*4:.0f}" r="4" fill="{cols[i % 4]}" stroke="{K}" stroke-width="1.4"/>'
    return g + '</g>'

def casita(x, y, s=1, pared='#F2D7B6', lado='#DDB993', techo='#C96A55', techo2='#E9927A'):
    # Casita del fondo en vista 3/4, mismo trazo que las viñetas.
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="6" cy="2" rx="62" ry="12" fill="#000" opacity=".1"/>'
            f'<path d="M-50 0 V-52 H18 V0Z" fill="{pared}" stroke="{K}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<path d="M18 0 V-52 L52 -64 V-12Z" fill="{lado}" stroke="{K}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<path d="M-58 -50 L-16 -92 L26 -50Z" fill="{techo2}" stroke="{K}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<path d="M-16 -92 L22 -104 L58 -62 L26 -50Z" fill="{techo}" stroke="{K}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<rect x="-36" y="-34" width="14" height="14" rx="2" fill="#9FD3E6" stroke="{K}" stroke-width="2"/>'
            f'<path d="M-6 0 V-28 H8 V0" fill="#8A5A3C" stroke="{K}" stroke-width="2" stroke-linejoin="round"/></g>')
def seto(x, y, largo):
    n = max(2, int(largo / 22))
    return '<g>' + ''.join(f'<circle cx="{x + i * largo / (n - 1):.0f}" cy="{y}" r="13" fill="#6AAE72" stroke="{K}" stroke-width="2.2"/>' for i in range(n)) + f'<path d="M{x} {y} H{x + largo}" stroke="#86C08B" stroke-width="6" stroke-linecap="round"/></g>'
def paradero(x, y):
    return (f'<g transform="translate({x} {y})"><ellipse cx="0" cy="2" rx="34" ry="7" fill="#000" opacity=".12"/>'
            f'<path d="M-28 0 V-40 M28 0 V-40" stroke="{K}" stroke-width="4"/>'
            f'<path d="M-36 -40 H36 V-50 H-36Z" fill="#1F7A5C" stroke="{K}" stroke-width="2.4" stroke-linejoin="round"/>'
            f'<rect x="-22" y="-18" width="44" height="7" rx="3" fill="#E7C89B" stroke="{K}" stroke-width="2"/>'
            f'<circle cx="40" cy="-58" r="9" fill="#FFB627" stroke="{K}" stroke-width="2.2"/></g>')
deco = []
# Árboles en las esquinas de los cruces y en los bordes
for (x, y, s) in [(410, 476, .8), (614, 476, .8), (410, 1262, .8), (614, 1262, .8), (420, 54, .8), (604, 64, .85),
                  (36, 438, .8), (990, 440, .8), (40, 1222, .8), (986, 1224, .85), (410, 1566, .75), (614, 1566, .75)]:
    deco.append((y, arbol(x, y, s)))
for (x, y, s) in [(420, 920, .8), (606, 700, .78)]:
    deco.append((y, palma(x, y, s)))
for (x, y) in [(436, 360), (590, 452), (436, 1144), (590, 1236), (590, 120), (590, 1530)]:
    deco.append((y, farol(x, y)))
for (x, y) in [(330, 450), (700, 452), (210, 832), (830, 838), (330, 1236), (690, 1240)]:
    deco.append((y, flores(x, y)))
# Banca y mesa de picnic en el parquecito de abajo
deco.append((1650, f'<g opacity="0" transform="translate(470 1650)"><rect x="-34" y="-10" width="68" height="12" rx="4" fill="#C98B55" stroke="{K}" stroke-width="2.2"/><path d="M-26 2v14M26 2v14" stroke="{K}" stroke-width="3"/></g>'))

# Casitas del fondo, setos y paradero
for (x, y, s_, c) in [(52, 1570, .7, ('#F2D7B6', '#DDB993', '#C96A55', '#E9927A')), (975, 1572, .7, ('#E8D2F0', '#CDB1DA', '#8C5BA8', '#AE84C6'))]:
    deco.append((y, casita(x, y, s_, *c)))
for _, s in sorted(deco): A(s)

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" fill="none">'
       f'<title>Mapa del barrio</title>{FILTROS}{defs}<g id="mapa-barrio">' + ''.join(out) + '</g></svg>')
open(SALIDA, 'w').write(svg)
print(json.dumps(pins))
