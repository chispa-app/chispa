"""Arma img/fondos/mapa-barrio.svg: el barrio como una maqueta isométrica.
Composición: pocas calles anchas (una avenida, una calle que la cruza en una glorieta y dos calles
secundarias), manzanas grandes y las ocho zonas como edificios protagonistas, con andenes, árboles,
gente y carros. Cada zona va en un grupo z-<zona>: la app la apaga o la enciende, y en las zonas
encendidas se prenden las ventanas. El arroyo cruza el barrio bajo dos puentes hasta la Ciénaga.
Uso: python3 herramientas/maqueta.py  →  escribe el SVG e imprime la posición de las etiquetas."""
import math, random, json, os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, 'img/fondos/mapa-barrio.svg')
W, H = 1024, 1580
C, D = 200, 100          # una unidad del mundo en pantalla (isométrico 2:1)
CX, CY = 512, 760        # la glorieta, en el centro
K = '#5A3526'
TR = f'stroke="{K}" stroke-width="2.4" stroke-linejoin="round"'
T2 = f'stroke="{K}" stroke-width="1.8" stroke-linejoin="round"'

def P(u, v, h=0): return (CX + (u - v) * C, CY + (u + v) * D - h)
def pts(*ps): return ' '.join(f'{x:.1f},{y:.1f}' for x, y in ps)
def poly(ps, fill, extra=TR, cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<polygon{c} points="{pts(*ps)}" fill="{fill}" {extra}/>'
def linea(a, b, color, w, extra=''):
    return f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="{color}" stroke-width="{w}" stroke-linecap="round" {extra}/>'
def mezcla(hexa, f):
    h = hexa.lstrip('#'); r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    if f >= 0: r, g, b = (int(x + (255 - x) * f) for x in (r, g, b))
    else: r, g, b = (int(x * (1 + f)) for x in (r, g, b))
    return f'#{r:02X}{g:02X}{b:02X}'
def rombo(u0, v0, u1, v1, h=0): return [P(u0, v0, h), P(u1, v0, h), P(u1, v1, h), P(u0, v1, h)]

# ================================================================ piezas
def sombra(u0, v0, u1, v1, h):
    s = h / 120
    return poly([P(u1, v0), P(u1 + s, v0 - s * .2), P(u1 + s, v1 - s * .2), P(u1, v1), P(u0, v1)], '#24331A', 'opacity=".22"')

def caja(u0, v0, u1, v1, h, pared, techo=None, ventanas=0, pisos=1, puerta=False, techo_tipo='plano', teja='#E46F55', base=0, sombra_on=True, ventanas_der=None):
    o = []
    if sombra_on and base == 0: o.append(sombra(u0, v0, u1, v1, h))
    izq, der = pared, mezcla(pared, -.17)
    o.append(poly([P(u0, v1, base), P(u1, v1, base), P(u1, v1, h), P(u0, v1, h)], izq))
    o.append(poly([P(u1, v0, base), P(u1, v1, base), P(u1, v1, h), P(u1, v0, h)], der))
    if base == 0 and h > 30:   # zócalo: asienta el edificio en el suelo
        o.append(poly([P(u0, v1, 0), P(u1, v1, 0), P(u1, v1, 7), P(u0, v1, 7)], mezcla(pared, -.25), 'stroke="none" opacity=".55"'))
        o.append(poly([P(u1, v0, 0), P(u1, v1, 0), P(u1, v1, 7), P(u1, v0, 7)], mezcla(pared, -.35), 'stroke="none" opacity=".55"'))
    if ventanas:
        ap = (h - base) / pisos
        for p in range(pisos):
            hb = base + ap * p + ap * .34; ht = hb + ap * .4
            for k in range(ventanas):
                if puerta and p == 0 and k == ventanas // 2: continue
                a = u0 + (u1 - u0) * (k + .5) / ventanas; w = min(.07, (u1 - u0) / ventanas * .27)
                o.append(poly([P(a - w, v1, hb - 3), P(a + w, v1, hb - 3), P(a + w, v1, ht + 3), P(a - w, v1, ht + 3)], '#FFFFFF', 'stroke="none"'))
                o.append(poly([P(a - w * .8, v1, hb), P(a + w * .8, v1, hb), P(a + w * .8, v1, ht), P(a - w * .8, v1, ht)], '#A9D8EA', T2, 'ventana'))
            nv = ventanas_der if ventanas_der is not None else max(1, ventanas - 1)
            for k in range(nv):
                b = v0 + (v1 - v0) * (k + .5) / nv; w = min(.06, (v1 - v0) / nv * .24)
                o.append(poly([P(u1, b - w, hb), P(u1, b + w, hb), P(u1, b + w, ht), P(u1, b - w, ht)], '#7FB2C8', T2, 'ventana'))
    if puerta:
        a = u0 + (u1 - u0) * (ventanas // 2 + .5) / max(1, ventanas) if ventanas else (u0 + u1) / 2
        w = min(.06, (u1 - u0) * .08); hp = base + min(46, (h - base) / pisos * .7)
        o.append(poly([P(a - w, v1, base), P(a + w, v1, base), P(a + w, v1, hp), P(a - w, v1, hp)], '#8A5A3C'))
        o.append(poly([P(a - w * 1.6, v1 + .03, hp + 4), P(a + w * 1.6, v1 + .03, hp + 4), P(a + w * 1.6, v1, hp + 10), P(a - w * 1.6, v1, hp + 10)], teja if techo_tipo == 'dos' else mezcla(pared, -.3), T2))
    if techo_tipo == 'plano':
        t = techo or mezcla(pared, .25)
        o.append(poly(rombo(u0, v0, u1, v1, h), t))
        m = min(.04, (u1 - u0) * .08)
        o.append(poly(rombo(u0 + m, v0 + m, u1 - m, v1 - m, h), mezcla(t, -.07), 'stroke="none"'))
    else:
        vm = (v0 + v1) / 2; hr = h + (v1 - v0) * 85; ov = .03
        o.append(poly([P(u0 - ov, v0 - ov, h), P(u1 + ov, v0 - ov, h), P(u1 + ov, vm, hr), P(u0 - ov, vm, hr)], mezcla(teja, .2)))
        o.append(poly([P(u1, v0, h), P(u1, v1, h), P(u1, vm, hr)], der))
        o.append(poly([P(u0 - ov, vm, hr), P(u1 + ov, vm, hr), P(u1 + ov, v1 + ov, h), P(u0 - ov, v1 + ov, h)], teja))
        for k in range(1, 5):
            f = k / 5
            o.append(linea(P(u0, vm + (v1 - vm) * f, hr + (h - hr) * f), P(u1, vm + (v1 - vm) * f, hr + (h - hr) * f), mezcla(teja, -.18), 2, 'opacity=".55"'))
        o.append(linea(P(u0 - ov, vm, hr), P(u1 + ov, vm, hr), mezcla(teja, -.3), 3))
    return o

def arbol(u, v, s=1, c1='#4E9A68'):
    x, y = P(u, v); r = 30 * s
    return [f'<ellipse cx="{x + r * .8:.1f}" cy="{y + 3:.1f}" rx="{r * 1.1:.1f}" ry="{r * .42:.1f}" fill="#24331A" opacity=".22"/>',
            f'<path d="M{x - 4 * s:.1f} {y:.1f}V{y - 26 * s:.1f}h{8 * s:.1f}V{y:.1f}z" fill="#8A5A3C" {TR}/>',
            f'<circle cx="{x:.1f}" cy="{y - 26 * s - r * .7:.1f}" r="{r:.1f}" fill="{c1}" {TR}/>',
            f'<path d="M{x + r * .92:.1f} {y - 26 * s - r * .45:.1f}a{r:.1f} {r:.1f} 0 0 1 {-r * 1.55:.1f} {r * 1.05:.1f}a{r * 1.05:.1f} {r * 1.05:.1f} 0 0 0 {r * 1.55:.1f} {-r * 1.05:.1f}z" fill="{mezcla(c1, -.25)}" opacity=".75"/>',
            f'<circle cx="{x - r * .35:.1f}" cy="{y - 26 * s - r * 1.05:.1f}" r="{r * .3:.1f}" fill="{mezcla(c1, .32)}"/>']

def palma(u, v, s=1):
    x, y = P(u, v)
    o = [f'<ellipse cx="{x + 22 * s:.1f}" cy="{y + 3:.1f}" rx="{26 * s:.1f}" ry="{9 * s:.1f}" fill="#24331A" opacity=".2"/>',
         f'<path d="M{x - 4 * s:.1f} {y:.1f}C{x - 6 * s:.1f} {y - 40 * s:.1f} {x - 1 * s:.1f} {y - 70 * s:.1f} {x + 2 * s:.1f} {y - 92 * s:.1f}L{x + 7 * s:.1f} {y - 92 * s:.1f}C{x + 5 * s:.1f} {y - 70 * s:.1f} {x + 4 * s:.1f} {y - 40 * s:.1f} {x + 5 * s:.1f} {y:.1f}Z" fill="#B07A50" {TR}/>']
    for a in (-160, -120, -60, -20, 30, 150):
        r = math.radians(a); ex, ey = x + 4 * s + math.cos(r) * 46 * s, y - 92 * s + math.sin(r) * 26 * s + 14 * s
        o.append(f'<path d="M{x + 4 * s:.1f} {y - 92 * s:.1f}Q{(x + ex) / 2:.1f} {y - 112 * s:.1f} {ex:.1f} {ey:.1f}Q{(x + ex) / 2 + 4:.1f} {y - 96 * s:.1f} {x + 4 * s:.1f} {y - 92 * s:.1f}z" fill="#5FA66F" {TR}/>')
    return o

def arbusto(u, v, s=1, c='#5FA66F'):
    x, y = P(u, v)
    return [f'<ellipse cx="{x + 6:.1f}" cy="{y + 2:.1f}" rx="{20 * s:.1f}" ry="{7 * s:.1f}" fill="#24331A" opacity=".18"/>',
            f'<path d="M{x - 18 * s:.1f} {y:.1f}c-4 -14 8 -22 14 -14 2 -10 16 -10 18 0 8 -6 16 2 10 14z" fill="{c}" {T2}/>',
            f'<circle cx="{x - 6 * s:.1f}" cy="{y - 10 * s:.1f}" r="{3 * s:.1f}" fill="{"#F2788C" if (int(u * 10) + int(v * 10)) % 2 else "#FFD34D"}"/>']

def farol(u, v):
    x, y = P(u, v)
    return [f'<g class="farol"><ellipse cx="{x + 8:.1f}" cy="{y + 2:.1f}" rx="10" ry="4" fill="#24331A" opacity=".22"/>',
            f'<path d="M{x:.1f} {y:.1f}V{y - 62:.1f}q0 -10 10 -10h6" fill="none" stroke="#4A3F4F" stroke-width="4.5" stroke-linecap="round"/>',
            f'<circle class="farol-luz" cx="{x + 18:.1f}" cy="{y - 66:.1f}" r="22" fill="#FFE58A" opacity="0"/>',
            f'<path d="M{x + 10:.1f} {y - 74:.1f}h14l-3 9h-8z" fill="#FFD34D" stroke="{K}" stroke-width="2" stroke-linejoin="round"/></g>']

def persona(u, v, ropa, piel='#C98B60', pelo='#2B211D'):
    x, y = P(u, v)
    return [f'<ellipse cx="{x + 5:.1f}" cy="{y + 1:.1f}" rx="8" ry="3" fill="#24331A" opacity=".22"/>',
            f'<path d="M{x - 3:.1f} {y:.1f}v-11M{x + 3:.1f} {y:.1f}v-11" stroke="#3A2E3F" stroke-width="3.5" stroke-linecap="round"/>',
            f'<rect x="{x - 6:.1f}" y="{y - 25:.1f}" width="12" height="15" rx="5" fill="{ropa}" stroke="{K}" stroke-width="1.6"/>',
            f'<circle cx="{x:.1f}" cy="{y - 31:.1f}" r="6" fill="{piel}" stroke="{K}" stroke-width="1.6"/>',
            f'<path d="M{x - 6:.1f} {y - 32:.1f}a6 6 0 0 1 12 0c-3 -2 -9 -2 -12 0z" fill="{pelo}"/>']

def caneca(u, v, color, s=1):
    x, y = P(u, v); w, h = 10 * s, 22 * s
    tapa = '#D6D0C8' if color == '#FFFFFF' else mezcla(color, -.25)
    return [f'<path d="M{x - w:.1f} {y - h:.1f}h{2 * w:.1f}l-2 {h:.1f}h{-2 * w + 4:.1f}z" fill="{color}" stroke="{K}" stroke-width="2" stroke-linejoin="round"/>',
            f'<path d="M{x - w - 2:.1f} {y - h - 5:.1f}h{2 * w + 4:.1f}v5h{-2 * w - 4:.1f}z" fill="{tapa}" stroke="{K}" stroke-width="2" stroke-linejoin="round"/>']

def carro(u, v, color, eje='u', largo=.2, alto=18):
    a = .09
    if eje == 'u': u0, u1, v0, v1 = u - largo / 2, u + largo / 2, v - a, v + a
    else: u0, u1, v0, v1 = u - a, u + a, v - largo / 2, v + largo / 2
    o = caja(u0, v0, u1, v1, alto, color, mezcla(color, .25))
    if eje == 'u': c = (u0 + (u1 - u0) * .28, v0 + .015, u1 - (u1 - u0) * .18, v1 - .015)
    else: c = (u0 + .015, v0 + (v1 - v0) * .28, u1 - .015, v1 - (v1 - v0) * .18)
    o += caja(*c, alto + 14, '#CFEAF5', '#FFFFFF', base=alto, sombra_on=False)
    return o

def bus(u, v):
    o = caja(u - .09, v - .34, u + .09, v + .34, 40, '#E85D2A', '#F7A07E')
    for k in range(5):
        b = v - .28 + k * .13
        o.append(poly([P(u + .09, b, 22), P(u + .09, b + .09, 22), P(u + .09, b + .09, 34), P(u + .09, b, 34)], '#CFEAF5', T2))
    o.append(poly([P(u - .09, v + .34, 22), P(u + .09, v + .34, 22), P(u + .09, v + .34, 34), P(u - .09, v + .34, 34)], '#CFEAF5', T2))
    return o

def agua(ps):
    return [poly(ps, '#7CC8E0', 'stroke="#2E86AB" stroke-width="3" stroke-linejoin="round"')]

def ondas(u, v, w=14):
    x, y = P(u, v)
    return f'<path d="M{x - w:.1f} {y:.1f}q{w:.1f} -6 {2 * w:.1f} 0" stroke="#E6F7FC" stroke-width="3" fill="none" stroke-linecap="round"/>'

def ordenar(obs):
    s = []
    for _, g in sorted(obs, key=lambda t: t[0]): s += g
    return s

# ================================================================ calles
CALLES = [('u', 0, .26), ('v', 0, .26), ('u', -3, .17), ('v', -3, .17), ('u', 3, .17), ('v', 3, .17)]
AN = .1
def banda(eje, n, w, a0=-9, a1=9):
    return [P(n - w, a0), P(n + w, a0), P(n + w, a1), P(n - w, a1)] if eje == 'u' else [P(a0, n - w), P(a1, n - w), P(a1, n + w), P(a0, n + w)]
out = []; A = out.append
A(f'<rect width="{W}" height="{H}" fill="#C4DE94"/>')
r0 = random.Random(3)
d = ''.join(f'M{r0.uniform(0, W):.0f} {r0.uniform(0, H):.0f}l3 -7 3 7' for _ in range(220))
A(f'<path d="{d}" stroke="#A9C978" stroke-width="2" fill="none" stroke-linecap="round"/>')
for e, n, w in CALLES: A(poly(banda(e, n, w + AN + .014), K, 'stroke="none"'))
for e, n, w in CALLES: A(poly(banda(e, n, w + AN), '#F3E6D0', 'stroke="none"'))
d = []
for e, n, w in CALLES:
    for k in range(-90, 90):
        t = k / 10
        for sg in (-1, 1):
            a, b = (P(n + sg * w, t), P(n + sg * (w + AN), t)) if e == 'u' else (P(t, n + sg * w), P(t, n + sg * (w + AN)))
            if -20 < a[0] < W + 20 and -20 < a[1] < H + 20: d.append(f'M{a[0]:.0f} {a[1]:.0f}L{b[0]:.0f} {b[1]:.0f}')
A(f'<path d="{"".join(d)}" stroke="#E2D0B2" stroke-width="1.6"/>')
for e, n, w in CALLES: A(poly(banda(e, n, w + .012), '#CDB89A', 'stroke="none"'))
for e, n, w in CALLES: A(poly(banda(e, n, w), '#8F8A9E', 'stroke="none"'))
def elipse(u, v, r, fill, extra=''):
    x, y = P(u, v); return f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r * C * 1.414:.1f}" ry="{r * D * 1.414:.1f}" fill="{fill}" {extra}/>'
A(elipse(0, 0, .62, '#8F8A9E'))
d = []
nodos = [-3, 0, 3]
for e, n, w in CALLES:
    t = -9.0
    while t < 9:
        a, b = t, t + .22
        if all(abs((a + b) / 2 - m) > (.75 if m == 0 and n == 0 else .45) for m in nodos):
            q = [P(n - .012, a), P(n + .012, a), P(n + .012, b), P(n - .012, b)] if e == 'u' else [P(a, n - .012), P(b, n - .012), P(b, n + .012), P(a, n + .012)]
            d.append('M' + 'L'.join(f'{x:.0f} {y:.0f}' for x, y in q) + 'Z')
        t += .5
A(f'<path d="{"".join(d)}" fill="#FFF3D0"/>')
d = []
for (i, j) in [(a, b) for a in nodos for b in nodos]:
    wi = .26 if i == 0 else .17; wj = .26 if j == 0 else .17
    gap = .38 if (i, j) == (0, 0) else 0
    for sg in (-1, 1):
        for k in range(6):
            t = -wi + .03 + k * (2 * wi - .06) / 5
            b0 = j + sg * (wj + .02 + gap); b1 = b0 + sg * .12
            d.append('M' + 'L'.join(f'{x:.0f} {y:.0f}' for x, y in [P(i + t - .014, b0), P(i + t + .014, b0), P(i + t + .014, b1), P(i + t - .014, b1)]) + 'Z')
            t = -wj + .03 + k * (2 * wj - .06) / 5
            a0 = i + sg * (wi + .02 + gap); a1 = a0 + sg * .12
            d.append('M' + 'L'.join(f'{x:.0f} {y:.0f}' for x, y in [P(a0, j + t - .014), P(a1, j + t - .014), P(a1, j + t + .014), P(a0, j + t + .014)]) + 'Z')
A(f'<path d="{"".join(d)}" fill="#FFFFFF" opacity=".92"/>')
A(elipse(0, 0, .38, '#F3E6D0', f'stroke="{K}" stroke-width="2.4"'))
A(elipse(0, 0, .32, '#9FCB6E', 'stroke="#7FAE55" stroke-width="2"'))

# ================================================================ arroyo (franja u + v = 1, bajo dos puentes)
S0, WA = 1.0, .2
def franja(u0, u1, w):
    return [P(u0, S0 - w - u0), P(u1, S0 - w - u1), P(u1, S0 + w - u1), P(u0, S0 + w - u0)]
for (u0, u1) in [(-2.6, -.36), (.36, .64), (1.36, 3.4)]:
    A(poly(franja(u0, u1, WA), '#B9A27E'))
    A(poly(franja(u0, u1, WA * .7), '#7CC8E0', 'stroke="#2E86AB" stroke-width="2.5" stroke-linejoin="round"'))
for fu in (-2.2, -1.5, -.9, .5, 1.7, 2.3):
    A(ondas(fu, S0 - fu))
for e in (-.38, .38):      # puentes: las calles pasan por encima del arroyo, con barandas a lado y lado
    for (p0, p1) in [(P(e, S0 - WA - e), P(e, S0 + WA - e)), (P(S0 - WA - e, e), P(S0 + WA - e, e))]:
        A(linea((p0[0], p0[1] - 10), (p1[0], p1[1] - 10), K, 10)); A(linea((p0[0], p0[1] - 10), (p1[0], p1[1] - 10), '#F3E6D0', 6))
        A(linea(p0, (p0[0], p0[1] - 10), K, 3)); A(linea(p1, (p1[0], p1[1] - 10), K, 3))

# ================================================================ zonas
G = {}
def z(nombre, prof, svg): G.setdefault(nombre, []).append((prof, svg))

# Casa: casa de dos pisos con jardín, cerca y canecas
z('casa', -3.2, poly(rombo(-2.75, -1.95, -1.55, -.6), '#D4E9A6', 'stroke="#9DBE6B" stroke-width="3"'))
z('casa', -3.0, caja(-2.6, -1.8, -1.75, -1.15, 96, '#F7C9C9', ventanas=3, pisos=2, puerta=True, techo_tipo='dos', teja='#D9667B'))
z('casa', -2.8, caja(-1.75, -1.8, -1.6, -1.35, 60, '#FFE3A3', ventanas=1, techo_tipo='dos', teja='#E46F55'))
for k in range(12):
    a = -2.7 + k * .09
    z('casa', -2.2, [linea(P(a, -.66), P(a, -.66, 18), '#FFFFFF', 4)])
z('casa', -2.19, [linea(P(-2.7, -.66, 12), P(-1.71, -.66, 12), '#FFFFFF', 3)])
for k, col in enumerate(['#FFFFFF', '#2B2B2B', '#2E7D45']):
    z('casa', -2.4 + k * .01, caneca(-1.72, -1.0 + k * .11, col))
z('casa', -2.6, arbusto(-2.55, -.85)); z('casa', -2.5, arbusto(-2.25, -.82, .9))
z('casa', -3.4, arbol(-2.0, -2.25, 1.1, '#5FA66F'))
z('casa', -2.3, persona(-2.0, -.95, '#5B4BD6', '#8A5A3C'))

# Cuadra: tres casas de colores pegadas y el punto de reciclaje
z('cuadra', -3.2, poly(rombo(-1.95, -2.75, -.6, -1.55), '#E9DDC6', 'stroke="#C9B48F" stroke-width="3"'))
for k, (pc, tj) in enumerate([('#F6A38E', '#C9573F'), ('#9ED9CF', '#3E8E8A'), ('#FFD98A', '#D98A3D')]):
    v0 = -2.6 + k * .36
    z('cuadra', -2.9 + k * .1, caja(-1.8, v0, -1.3, v0 + .34, 74 + k * 10, pc, ventanas=1, pisos=1, puerta=True, techo_tipo='dos', teja=tj, ventanas_der=1))
z('cuadra', -2.0, caja(-1.1, -2.5, -.82, -2.2, 34, '#2E7D45', '#3E9B5E'))
for k, col in enumerate(['#FFFFFF', '#2B2B2B', '#2E7D45']):
    z('cuadra', -1.9, caneca(-.9, -2.05 + k * .1, col))
z('cuadra', -1.85, caja(-1.08, -1.78, -.88, -1.62, 26, '#E7C89B', '#F2DDB8'))
z('cuadra', -1.8, persona(-.86, -1.92, '#1F7A5C', '#8A5A3C'))
z('cuadra', -3.0, arbol(-1.05, -2.62, .95))

# Arroyo (a la izquierda, junto a la glorieta): casa, puente peatonal sobre el canal y la trampa
def UV(X, Y):
    a, b = (X - CX) / C, (Y - CY) / D
    return ((a + b) / 2, (b - a) / 2)
z('arroyo', -.6, caja(-1.42, .42, -.98, .8, 62, '#C9D7F2', ventanas=2, puerta=True, techo_tipo='dos', teja='#1F6FA8'))
z('arroyo', -.3, arbol(-.75, .55, .8))
pu = lambda s_, k: ((s_ + k) / 2, (s_ - k) / 2)
q = [P(*pu(.8, -2.25), 12), P(*pu(.8, -2.12), 12), P(*pu(1.2, -2.12), 12), P(*pu(1.2, -2.25), 12)]
z('arroyo', 1.25, [poly(q, '#C98B55'), linea(P(*pu(.8, -2.25), 28), P(*pu(1.2, -2.25), 28), K, 3), linea(P(*pu(.8, -2.12), 28), P(*pu(1.2, -2.12), 28), K, 3)])
d = ''.join(f'M{P(*pu(S0 - .09 + k * .03, -1.85))[0]:.1f} {P(*pu(S0 - .09 + k * .03, -1.85))[1]:.1f}v-22' for k in range(7))
z('arroyo', 1.3, [f'<path d="{d}" stroke="#4A3F4F" stroke-width="3.4" stroke-linecap="round"/>'])
z('arroyo', .2, persona(*pu(.15, -1.7), '#E85D2A'))
z('arroyo', .1, arbusto(*pu(.05, -2.3)))

# Ciénaga: laguna, manglares, canoa, garza y muelle
lag = [(770, 725), (860, 668), (960, 640), (1012, 700), (1004, 830), (900, 862), (800, 800)]
z('cienaga', -.9, agua(lag) + [ondas(*UV(880, 740)), ondas(*UV(940, 790)), ondas(*UV(830, 770), 10)])
for (X, Y, s_) in [(800, 735, .8), (880, 690, .85), (975, 680, .9), (990, 790, .85), (905, 845, .8)]:
    u, v = UV(X, Y); x, y = X, Y
    raices = ''.join(f'<path d="M{x:.1f} {y - 20 * s_:.1f}Q{x + dd * 16 * s_:.1f} {y - 12 * s_:.1f} {x + dd * 22 * s_:.1f} {y + 3:.1f}" stroke="#8A4B2A" stroke-width="3" fill="none" stroke-linecap="round"/>' for dd in (-1, -.4, .4, 1))
    z('cienaga', u + v, [raices] + arbol(u, v, s_, '#2E8B57')[2:])
cx, cy = 905, 760
z('cienaga', UV(cx, cy)[0] + UV(cx, cy)[1] + .1, [f'<path d="M{cx - 40:.1f} {cy:.1f}q40 18 80 0l-8 10q-32 10 -64 0z" fill="#C98B55" {TR}/>', f'<path d="M{cx + 6:.1f} {cy - 2:.1f}l26 -34" stroke="{K}" stroke-width="3"/>'])
gx, gy = 820, 820
z('cienaga', UV(gx, gy)[0] + UV(gx, gy)[1], [f'<path d="M{gx:.1f} {gy:.1f}v-18M{gx + 6:.1f} {gy:.1f}v-18" stroke="{K}" stroke-width="2.4"/>',
                    f'<path d="M{gx - 10:.1f} {gy - 18:.1f}c0 -14 18 -16 22 -6 4 -10 0 -22 6 -26 4 -2 8 0 6 4l12 -2-12 6c-4 8 0 16-4 22-6 8-30 10-30 2z" fill="#FFFFFF" {TR}/>'])

# Techos: edificios con paneles y un molino
def paneles(u0, v0, u1, v1, h, nu=2, nv=3):
    g = []
    for a in range(nu):
        for b in range(nv):
            pu0 = u0 + .04 + a * (u1 - u0 - .08) / nu; pu1 = pu0 + (u1 - u0 - .08) / nu - .03
            pv0 = v0 + .04 + b * (v1 - v0 - .08) / nv; pv1 = pv0 + (v1 - v0 - .08) / nv - .03
            g.append(poly([P(pu0, pv0, h + 12), P(pu1, pv0, h + 12), P(pu1, pv1, h + 3), P(pu0, pv1, h + 3)], '#2F4F8F', T2))
            g.append(linea(P((pu0 + pu1) / 2, pv0, h + 12), P((pu0 + pu1) / 2, pv1, h + 3), '#8FB3F0', 1.5))
    return g
z('techos', 1.6, caja(.5, 1.6, 1.1, 2.3, 120, '#FFE3A3', '#F2D48A', ventanas=3, pisos=3, puerta=True) + paneles(.5, 1.6, 1.1, 2.3, 120))
z('techos', 2.4, caja(.35, 2.45, .85, 2.9, 80, '#F7D6B5', '#E9C49C', ventanas=2, pisos=2, puerta=True) + paneles(.35, 2.45, .85, 2.9, 80, 2, 2))
mx, my = P(.45, 1.35)
z('techos', 1.75, [f'<ellipse cx="{mx + 10:.1f}" cy="{my + 2:.1f}" rx="16" ry="5" fill="#24331A" opacity=".2"/>', f'<path d="M{mx - 3:.1f} {my:.1f}L{mx - 1.5:.1f} {my - 150:.1f}h3L{mx + 3:.1f} {my:.1f}z" fill="#FFFFFF" {TR}/>',
                   f'<g class="aspas" style="transform-origin:{mx:.1f}px {my - 152:.1f}px">' + ''.join(f'<path d="M{mx:.1f} {my - 152:.1f}l-5 -6 5 -56 5 56z" fill="#FFFFFF" {TR} transform="rotate({a} {mx:.1f} {my - 152:.1f})"/>' for a in (0, 120, 240)) + f'<circle cx="{mx:.1f}" cy="{my - 152:.1f}" r="7" fill="#FFB627" {TR}/></g>'])
z('techos', 2.9, persona(.95, 2.75, '#FFB627'))

# Parque: árboles, juegos, bancas y sendero
z('parque', 1.4, poly(rombo(1.45, .45, 2.75, 1.75), '#B5DB8C', 'stroke="#8FB866" stroke-width="3"'))
z('parque', 1.45, poly([P(1.45, 1.05), P(2.75, 1.05), P(2.75, 1.17), P(1.45, 1.17)], '#EAD3AE', 'stroke="#D2B88E" stroke-width="2"'))
for (u, v, s) in [(1.7, .65, 1.05), (2.3, .6, .95), (2.6, 1.45, 1.0), (1.65, 1.55, .9)]:
    z('parque', u + v, arbol(u, v, s))
z('parque', 3.0, caja(2.05, 1.3, 2.2, 1.45, 50, '#E85D2A', '#F28B5F'))
r0a, r1a = P(2.2, 1.37, 50), P(2.45, 1.37, 0)
z('parque', 3.1, [linea(r0a, r1a, '#FFD34D', 11), linea(r0a, r1a, K, 2, 'opacity=".5"')])
sx, sy = P(1.95, .85)
z('parque', 2.8, [f'<path d="M{sx - 26:.1f} {sy:.1f}L{sx - 18:.1f} {sy - 54:.1f}H{sx + 26:.1f}L{sx + 34:.1f} {sy:.1f}" fill="none" stroke="#5B4BD6" stroke-width="5" stroke-linejoin="round"/>',
                  f'<path d="M{sx:.1f} {sy - 54:.1f}v34M{sx + 10:.1f} {sy - 54:.1f}v34" stroke="{K}" stroke-width="2"/><rect x="{sx - 3:.1f}" y="{sy - 22:.1f}" width="16" height="5" rx="2" fill="#E85D2A" stroke="{K}" stroke-width="1.6"/>'])
bx, by = P(2.35, 1.0)
z('parque', 3.36, [f'<path d="M{bx - 20:.1f} {by:.1f}h40" stroke="#B5763F" stroke-width="7" stroke-linecap="round"/><path d="M{bx - 16:.1f} {by:.1f}v8M{bx + 16:.1f} {by:.1f}v8" stroke="{K}" stroke-width="2.4"/>'])
z('parque', 3.2, persona(2.5, 1.2, '#D9667B', '#E7B58C')); z('parque', 2.9, persona(1.8, 1.12, '#1F6FA8'))

# Colegio (abajo, a la izquierda): edificio de dos pisos, bandera y cancha
z('colegio', 6.6, poly(rombo(2.05, 3.85, 2.68, 4.32), '#E9876A', 'stroke="#FFFFFF" stroke-width="3"'))
z('colegio', 6.61, [linea(P(2.36, 3.85), P(2.36, 4.32), '#FFFFFF', 3)])
z('colegio', 6.0, caja(1.55, 3.33, 2.68, 3.78, 108, '#FFF2D6', '#F1D6AE', ventanas=5, pisos=2, puerta=True, ventanas_der=2))
fx, fy = P(1.75, 3.92)
z('colegio', 6.2, [f'<path d="M{fx:.1f} {fy:.1f}V{fy - 130:.1f}" stroke="#6E6470" stroke-width="4"/>', f'<path d="M{fx:.1f} {fy - 130:.1f}h36l-6 11 6 11h-36z" fill="#5B4BD6" {TR}/>'])
z('colegio', 6.7, persona(1.95, 4.05, '#FFFFFF', '#8A5A3C')); z('colegio', 6.75, persona(2.05, 3.98, '#5B4BD6'))

# Plaza (abajo, a la derecha): el taller de inventores, fuente y palmas
z('plaza', 5.0, poly(rombo(3.3, 1.3, 4.75, 2.7), '#EADBC4', 'stroke="#C9B48F" stroke-width="3"'))
d = ''.join(f'M{P(3.3 + k * .24, 1.3)[0]:.0f} {P(3.3 + k * .24, 1.3)[1]:.0f}L{P(3.3 + k * .24, 2.7)[0]:.0f} {P(3.3 + k * .24, 2.7)[1]:.0f}' for k in range(1, 6))
d += ''.join(f'M{P(3.3, 1.3 + k * .24)[0]:.0f} {P(3.3, 1.3 + k * .24)[1]:.0f}L{P(4.75, 1.3 + k * .24)[0]:.0f} {P(4.75, 1.3 + k * .24)[1]:.0f}' for k in range(1, 6))
z('plaza', 5.01, [f'<path d="{d}" stroke="#DCC8AA" stroke-width="2"/>'])
z('plaza', 5.6, caja(3.4, 1.4, 4.15, 1.95, 96, '#4E3E57', '#5D4B68', ventanas=3, pisos=1, puerta=True))
for k in range(8):
    a0 = 3.4 + k * .094
    z('plaza', 5.65, [poly([P(a0, 1.95, 70), P(a0 + .094, 1.95, 70), P(a0 + .094, 2.07, 54), P(a0, 2.07, 54)], '#FFB627' if k % 2 == 0 else '#FFF6E0', T2)])
gx, gy = P(3.78, 1.67, 112)
z('plaza', 5.66, [f'<circle cx="{gx:.1f}" cy="{gy:.1f}" r="18" fill="#FFB627" {TR}/><circle cx="{gx:.1f}" cy="{gy:.1f}" r="7" fill="#3A2E3F"/>'])
fx, fy = P(4.4, 2.3)
z('plaza', 6.7, [f'<ellipse cx="{fx:.1f}" cy="{fy:.1f}" rx="44" ry="22" fill="#CFC6B8" {TR}/><ellipse cx="{fx:.1f}" cy="{fy - 4:.1f}" rx="35" ry="16" fill="#7CC8E0"/>',
                 f'<path d="M{fx:.1f} {fy - 6:.1f}v-30" stroke="#CFC6B8" stroke-width="6"/><path d="M{fx:.1f} {fy - 36:.1f}c-10 4-14 12-16 22M{fx:.1f} {fy - 36:.1f}c10 4 14 12 16 22" stroke="#9FDCEC" stroke-width="3" fill="none" stroke-linecap="round"/>'])
z('plaza', 5.9, palma(4.55, 1.45, .9)); z('plaza', 6.2, palma(3.45, 2.6, .85))
z('plaza', 6.4, persona(3.95, 2.3, '#FFB627', '#8A5A3C')); z('plaza', 6.45, persona(4.08, 2.2, '#1F7A5C'))

# ================================================================ resto del barrio
F = []
def f(prof, svg): F.append((prof, svg))
for (u, v, pc, tj) in [(-3.7, -2.3, '#C9D7F2', '#1F6FA8'), (-2.3, -3.7, '#FFE3A3', '#C9573F'), (-1.3, -1.2, '#E8D2F0', '#8A6FD6'),
                       (3.6, 3.8, '#F6C1B0', '#C9573F'), (4.3, 3.5, '#BFE3D9', '#3E8E8A'), (3.5, 4.6, '#FFFFFF', '#E46F55'),
                       (-.8, 3.4, '#F7D6B5', '#D98A3D'), (3.4, -.8, '#C9D7F2', '#8A6FD6')]:
    f(u + v + .4, caja(u, v, u + .42, v + .36, 58, pc, ventanas=2, puerta=True, techo_tipo='dos', teja=tj))
for (u, v, s) in [(-2.4, -2.5, 1.0), (-.9, -.8, .9), (-.7, -1.4, .85), (-3.6, -3.2, 1.0), (-2.8, .5, .9), (.6, -2.6, .95), (.8, .6, .85), (.6, 3.2, .9),
                  (3.2, .5, .9), (2.9, 2.7, 1.0), (2.1, 3.4, .9), (-.7, 3.4, .9), (3.3, -.7, .85), (5.0, 3.4, 1.0), (3.4, 5.2, .95), (-1.2, 4.6, .9), (4.7, -1.2, .9)]:
    f(u + v, arbol(u, v, s))
for (u, v) in [(-.45, -.45), (.42, .28), (-.45, .45), (.45, -.45), (-3.4, -3.4), (3.4, 3.4), (-3.4, 2.6), (2.6, -3.4)]:
    f(u + v + .01, farol(u, v))
for (u, v) in [(-1.0, .55), (.55, -1.0), (2.8, 3.3), (-2.6, -1.0)]:
    f(u + v, arbusto(u, v))
for (u, v, c) in [(-.42, -1.6, '#E85D2A'), (-1.6, .42, '#5B4BD6'), (.42, 2.6, '#1F7A5C'), (2.6, .42, '#FFB627'), (-.42, 3.4, '#3A2E3F')]:
    f(u + v, persona(u, v, c))
x, y = P(0, 0)   # estatua de Cocuyo en la glorieta
f(-.01, [f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="26" ry="13" fill="#CFC6B8" {TR}/><path d="M{x - 20:.1f} {y:.1f}v-24h40v24" fill="#E7DED2" {TR}/><ellipse cx="{x:.1f}" cy="{y - 24:.1f}" rx="20" ry="10" fill="#F3ECE2" {TR}/>',
         f'<ellipse cx="{x - 18:.1f}" cy="{y - 60:.1f}" rx="11" ry="6" fill="#FFFFFF" opacity=".9" {T2}/><ellipse cx="{x + 18:.1f}" cy="{y - 60:.1f}" rx="11" ry="6" fill="#FFFFFF" opacity=".9" {T2}/>',
         f'<circle cx="{x:.1f}" cy="{y - 50:.1f}" r="16" fill="#FFD34D" {TR}/><circle cx="{x:.1f}" cy="{y - 74:.1f}" r="12" fill="#E85D2A" {TR}/>',
         f'<path d="M{x - 6:.1f} {y - 85:.1f}l-6 -10M{x + 6:.1f} {y - 85:.1f}l6 -10" stroke="{K}" stroke-width="2.4" stroke-linecap="round"/>'])
for (u, v, c, e) in [(-.13, -1.9, '#E85D2A', 'v'), (.13, 2.2, '#1F6FA8', 'v'), (-2.0, .13, '#FFB627', 'u'), (2.0, -.13, '#2E8B57', 'u'), (3.07, 3.8, '#D9667B', 'v'), (-3.07, -4.2, '#5B4BD6', 'v')]:
    f(u + v + .1, carro(u, v, c, e))
f(-3.3, bus(.13, -3.6))

# ================================================================ armar
todo = [(p, None, s) for p, s in F] + [(min(p for p, _ in l), n, l) for n, l in G.items()]
todo.sort(key=lambda t: t[0])
for p, nombre, cosa in todo:
    if nombre: A(f'<g id="z-{nombre}" class="zona-arte">' + ''.join(ordenar(cosa)) + '</g>')
    else: out.extend(cosa)

ET = {'casa': P(-2.1, -.55), 'cuadra': P(-.55, -2.1), 'arroyo': (150, 925), 'cienaga': (874, 925),
      'techos': (215, 1170), 'parque': (790, 1170), 'colegio': (190, 1478), 'plaza': (834, 1478)}
pins = {k: {'x': round(x / W * 100, 1), 'y': round(y / H * 100, 1)} for k, (x, y) in ET.items()}

defs = ('<defs><filter id="f-apagado" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".26 .5 .1 0 .06  .24 .52 .1 0 .06  .22 .46 .14 0 .07  0 0 0 1 0"/></filter>'
        '<filter id="f-tenue" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values=".55"/></filter>'
        '<radialGradient id="g-luz" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".3"/><stop offset=".6" stop-color="#FFF6D8" stop-opacity="0"/><stop offset="1" stop-color="#3A2E3F" stop-opacity=".18"/></radialGradient></defs>')
A(f'<rect width="{W}" height="{H}" fill="url(#g-luz)" pointer-events="none"/>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>Mapa del barrio</title>{defs}'
       f'<g id="mapa-barrio">' + ''.join(out) + '</g></svg>')
open(SALIDA, 'w').write(svg)
print(json.dumps(pins))
