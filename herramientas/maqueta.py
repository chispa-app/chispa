"""Arma img/fondos/mapa-barrio.svg: el barrio como una maqueta isométrica.
Manzanas en rombo separadas por calles con andén, cebras y carros; edificios con volumen
(techo claro, frente medio, costado oscuro) y sombra proyectada. Cada zona es una manzana con id z-<zona>;
la app la apaga o la enciende, y en las zonas encendidas se prenden las ventanas.
Uso: python3 herramientas/maqueta.py  →  escribe el SVG e imprime la posición de las etiquetas."""
import math, random, json, os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, 'img/fondos/mapa-barrio.svg')
W, H = 1024, 1580
C, D = 300, 150          # media celda en pantalla (proporción isométrica 2:1)
Y0 = 30
K = '#5A3526'            # contorno café de las ilustraciones
TR = f'stroke="{K}" stroke-width="2.4" stroke-linejoin="round"'
rnd = random.Random(11)

def P(u, v, h=0):
    return (512 + (u - v) * C, Y0 + (u + v) * D - h)
def pts(*ps): return ' '.join(f'{x:.1f},{y:.1f}' for x, y in ps)
def poly(ps, fill, extra=TR, cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<polygon{c} points="{pts(*ps)}" fill="{fill}" {extra}/>'
def mezcla(hexa, f):
    h = hexa.lstrip('#'); r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    if f >= 0: r, g, b = (int(x + (255 - x) * f) for x in (r, g, b))
    else: r, g, b = (int(x * (1 + f)) for x in (r, g, b))
    return f'#{r:02X}{g:02X}{b:02X}'

# ---------------------------------------------------------------- primitivas
def sombra(u0, v0, u1, v1, h):
    """Sombra proyectada hacia la derecha (luz de arriba a la izquierda)."""
    s = h / 200
    return poly([P(u1, v0), P(u1 + s, v0 - s * .15), P(u1 + s, v1 - s * .15), P(u1, v1), P(u0, v1)], '#2B3A1E', 'opacity=".24"')

def caja(u0, v0, u1, v1, h, pared, techo=None, ventanas=0, puerta=False, pisos=1, techo_tipo='plano', teja='#E46F55', base=0, sombra_on=True):
    o = []
    if sombra_on and base == 0: o.append(sombra(u0, v0, u1, v1, h))
    izq, der = pared, mezcla(pared, -.16)
    # cara izquierda (mira a +v) y derecha (mira a +u)
    o.append(poly([P(u0, v1, base), P(u1, v1, base), P(u1, v1, h), P(u0, v1, h)], izq))
    o.append(poly([P(u1, v0, base), P(u1, v1, base), P(u1, v1, h), P(u1, v0, h)], der))
    # ventanas: en las dos caras visibles, por pisos
    if ventanas:
        alto_piso = (h - base) / pisos
        for p in range(pisos):
            hb = base + alto_piso * p + alto_piso * .38; ht = hb + alto_piso * .36
            for k in range(ventanas):
                a = u0 + (u1 - u0) * (k + .5) / ventanas; w = (u1 - u0) / ventanas * .26
                if puerta and p == 0 and k == ventanas // 2: continue
                o.append(poly([P(a - w, v1, hb), P(a + w, v1, hb), P(a + w, v1, ht), P(a - w, v1, ht)], '#A9D8EA', f'stroke="{K}" stroke-width="1.8" stroke-linejoin="round"', 'ventana'))
            nv = max(1, ventanas - 1)
            for k in range(nv):
                b = v0 + (v1 - v0) * (k + .5) / nv; w = (v1 - v0) / nv * .22
                o.append(poly([P(u1, b - w, hb), P(u1, b + w, hb), P(u1, b + w, ht), P(u1, b - w, ht)], '#86BBD0', f'stroke="{K}" stroke-width="1.8" stroke-linejoin="round"', 'ventana'))
    if puerta:
        a = u0 + (u1 - u0) * (ventanas // 2 + .5) / max(1, ventanas) if ventanas else (u0 + u1) / 2
        w = (u1 - u0) * .07; hp = base + min(52, (h - base) / pisos * .78)
        o.append(poly([P(a - w, v1, base), P(a + w, v1, base), P(a + w, v1, hp), P(a - w, v1, hp)], '#8A5A3C'))
    if techo_tipo == 'plano':
        t = techo or mezcla(pared, .22)
        o.append(poly([P(u0, v0, h), P(u1, v0, h), P(u1, v1, h), P(u0, v1, h)], t))
        m = .025
        o.append(poly([P(u0 + m, v0 + m, h), P(u1 - m, v0 + m, h), P(u1 - m, v1 - m, h), P(u0 + m, v1 - m, h)], mezcla(t, -.08), 'stroke="none"'))
    else:   # dos aguas, cumbrera a lo largo de u
        vm = (v0 + v1) / 2; hr = h + (v1 - v0) * 150; ov = .02
        o.append(poly([P(u0 - ov, v0 - ov, h), P(u1 + ov, v0 - ov, h), P(u1 + ov, vm, hr), P(u0 - ov, vm, hr)], mezcla(teja, .18)))
        o.append(poly([P(u1, v0, h), P(u1, v1, h), P(u1, vm, hr)], der))
        o.append(poly([P(u0 - ov, vm, hr), P(u1 + ov, vm, hr), P(u1 + ov, v1 + ov, h), P(u0 - ov, v1 + ov, h)], teja))
        # tejas: líneas suaves
        for k in range(1, 4):
            f = k / 4
            a0 = P(u0, vm + (v1 - vm) * f, hr + (h - hr) * f); a1 = P(u1, vm + (v1 - vm) * f, hr + (h - hr) * f)
            o.append(f'<path d="M{a0[0]:.1f} {a0[1]:.1f}L{a1[0]:.1f} {a1[1]:.1f}" stroke="{mezcla(teja, -.2)}" stroke-width="2" opacity=".6"/>')
    return o

def arbol(u, v, s=1, c1='#4E9A68'):
    x, y = P(u, v); r = 34 * s
    return [f'<ellipse cx="{x + r * .7:.1f}" cy="{y + 4:.1f}" rx="{r * 1.05:.1f}" ry="{r * .45:.1f}" fill="#2B3A1E" opacity=".18"/>',
            f'<path d="M{x - 4 * s:.1f} {y:.1f}V{y - 30 * s:.1f}h{8 * s:.1f}V{y:.1f}z" fill="#8A5A3C" {TR}/>',
            f'<circle cx="{x:.1f}" cy="{y - 30 * s - r * .7:.1f}" r="{r:.1f}" fill="{c1}" {TR}/>',
            f'<path d="M{x + r * .9:.1f} {y - 30 * s - r * .5:.1f}a{r:.1f} {r:.1f} 0 0 1 {-r * 1.5:.1f} {r * 1.1:.1f}a{r * 1.05:.1f} {r * 1.05:.1f} 0 0 0 {r * 1.5:.1f} {-r * 1.1:.1f}z" fill="{mezcla(c1, -.22)}" opacity=".7"/>',
            f'<circle cx="{x - r * .35:.1f}" cy="{y - 30 * s - r * 1.05:.1f}" r="{r * .32:.1f}" fill="{mezcla(c1, .3)}"/>']

def palma(u, v, s=1):
    x, y = P(u, v); o = [f'<ellipse cx="{x + 20 * s:.1f}" cy="{y + 3:.1f}" rx="{26 * s:.1f}" ry="{9 * s:.1f}" fill="#2B3A1E" opacity=".16"/>',
                         f'<path d="M{x - 4 * s:.1f} {y:.1f}C{x - 6 * s:.1f} {y - 40 * s:.1f} {x - 1 * s:.1f} {y - 70 * s:.1f} {x + 2 * s:.1f} {y - 92 * s:.1f}L{x + 7 * s:.1f} {y - 92 * s:.1f}C{x + 5 * s:.1f} {y - 70 * s:.1f} {x + 4 * s:.1f} {y - 40 * s:.1f} {x + 5 * s:.1f} {y:.1f}Z" fill="#B07A50" {TR}/>']
    for a in (-160, -120, -60, -20, 30, 150):
        r = math.radians(a); ex, ey = x + 4 * s + math.cos(r) * 46 * s, y - 92 * s + math.sin(r) * 26 * s + 14 * s
        o.append(f'<path d="M{x + 4 * s:.1f} {y - 92 * s:.1f}Q{(x + ex) / 2:.1f} {y - 112 * s:.1f} {ex:.1f} {ey:.1f}Q{(x + ex) / 2 + 4:.1f} {y - 96 * s:.1f} {x + 4 * s:.1f} {y - 92 * s:.1f}z" fill="#5FA66F" {TR}/>')
    return o

def farol(u, v):
    x, y = P(u, v)
    return [f'<g class="farol"><ellipse cx="{x + 8:.1f}" cy="{y + 2:.1f}" rx="10" ry="4" fill="#2B3A1E" opacity=".2"/>',
            f'<path d="M{x:.1f} {y:.1f}V{y - 64:.1f}" stroke="#4A3F4F" stroke-width="5" stroke-linecap="round"/>',
            f'<circle class="farol-luz" cx="{x:.1f}" cy="{y - 70:.1f}" r="22" fill="#FFE58A" opacity="0"/>',
            f'<path d="M{x - 10:.1f} {y - 62:.1f}h20l-4 -13h-12z" fill="#FFD34D" stroke="{K}" stroke-width="2" stroke-linejoin="round"/></g>']

def caneca(u, v, color, s=1):
    x, y = P(u, v); w, h = 12 * s, 24 * s
    return [f'<path d="M{x - w:.1f} {y - h:.1f}h{2 * w:.1f}l-2 {h:.1f}h{-2 * w + 4:.1f}z" fill="{color}" stroke="{K}" stroke-width="2" stroke-linejoin="round"/>',
            f'<path d="M{x - w - 2:.1f} {y - h - 5:.1f}h{2 * w + 4:.1f}v5h{-2 * w - 4:.1f}z" fill="{mezcla(color, -.2) if color != "#FFFFFF" else "#D6D0C8"}" stroke="{K}" stroke-width="2" stroke-linejoin="round"/>']

def carro(u, v, color, eje='u'):
    """Carrito sobre la calle; eje = dirección de la calle."""
    l, a, h = .09, .045, 18
    if eje == 'u': u0, u1, v0, v1 = u - l, u + l, v - a, v + a
    else: u0, u1, v0, v1 = u - a, u + a, v - l, v + l
    o = caja(u0, v0, u1, v1, h, color, mezcla(color, .25))
    cu0, cu1, cv0, cv1 = (u0 + (u1 - u0) * .25, u1 - (u1 - u0) * .2, v0 + (v1 - v0) * .1, v1 - (v1 - v0) * .1) if eje == 'u' else (u0 + (u1 - u0) * .1, u1 - (u1 - u0) * .1, v0 + (v1 - v0) * .25, v1 - (v1 - v0) * .2)
    o += caja(cu0, cv0, cu1, cv1, h + 14, '#CFEAF5', '#FFFFFF', base=h, sombra_on=False)
    return o

def agua(ps, borde='#2E86AB'):
    return [poly(ps, '#7CC8E0', f'stroke="{borde}" stroke-width="3" stroke-linejoin="round"')]

# ---------------------------------------------------------------- calles
SW, AN = .07, .034       # media calle y andén (en celdas)
def banda(eje, n, w, a0=-3, a1=10):
    if eje == 'u': return [P(n - w, a0), P(n + w, a0), P(n + w, a1), P(n - w, a1)]
    return [P(a0, n - w), P(a1, n - w), P(a1, n + w), P(a0, n + w)]
out = []
A = out.append
A(f'<rect width="{W}" height="{H}" fill="#C9E09A"/>')
lineas = [('u', n) for n in range(-3, 9)] + [('v', n) for n in range(-3, 9)]
for e, n in lineas: A(poly(banda(e, n, SW + AN + .012), K, 'stroke="none"'))
for e, n in lineas: A(poly(banda(e, n, SW + AN), '#F3E6D0', 'stroke="none"'))
for e, n in lineas: A(poly(banda(e, n, SW + .008), '#CDB89A', 'stroke="none"'))
for e, n in lineas: A(poly(banda(e, n, SW), '#8F8A9E', 'stroke="none"'))
def visible(*ps): return any(-60 < x < W + 60 and -60 < y < H + 60 for x, y in ps)
def sub(ps): return 'M' + 'L'.join(f'{x:.0f} {y:.0f}' for x, y in ps) + 'Z'
# línea central discontinua (sin pisar los cruces), en un solo trazo
d = []
for e, n in lineas:
    for m in range(-3, 9):
        for f in (.3, .56):
            a, b = m + f, m + f + .13
            q = [P(n - .007, a), P(n + .007, a), P(n + .007, b), P(n - .007, b)] if e == 'u' else [P(a, n - .007), P(b, n - .007), P(b, n + .007), P(a, n + .007)]
            if visible(*q): d.append(sub(q))
A(f'<path d="{"".join(d)}" fill="#FFF3D0"/>')
# cebras en los cruces visibles, en un solo trazo
d = []
for i in range(-3, 10):
    for j in range(-3, 10):
        if not visible(P(i, j)): continue
        for k in range(4):
            t = -SW + .018 + k * (2 * SW - .036) / 3
            for sg in (-1, 1):
                b0 = j + sg * (SW + .01); b1 = j + sg * (SW + .06)
                d.append(sub([P(i + t - .008, b0), P(i + t + .008, b0), P(i + t + .008, b1), P(i + t - .008, b1)]))
                a0 = i + sg * (SW + .01); a1 = i + sg * (SW + .06)
                d.append(sub([P(a0, j + t - .008), P(a1, j + t - .008), P(a1, j + t + .008), P(a0, j + t + .008)]))
A(f'<path d="{"".join(d)}" fill="#FFFFFF" opacity=".92"/>')

# ---------------------------------------------------------------- manzanas
M = SW + AN + .012        # borde de la manzana
def suelo(i, j, color, borde='#9DBE6B'):
    return poly([P(i + M, j + M), P(i + 1 - M, j + M), P(i + 1 - M, j + 1 - M), P(i + M, j + 1 - M)], color, f'stroke="{borde}" stroke-width="3" stroke-linejoin="round"')

PASTEL = ['#F6C1B0', '#FFE3A3', '#BFE3D9', '#C9D7F2', '#E8D2F0', '#F7D6B5', '#FFFFFF', '#D8EDC0']
TEJAS = ['#E46F55', '#C9573F', '#8A6FD6', '#3E8E8A', '#D98A3D']

def relleno(i, j):
    """Manzana del barrio que no es zona: casas, edificios o un parquecito."""
    o = [suelo(i, j, '#D4E7A8')]
    r = random.Random(i * 31 + j * 7)
    tipo = r.choice(['casas', 'parquecito']) if i == j else r.choice(['casas', 'casas', 'edificio', 'parquecito'])
    objs = []
    if tipo == 'parquecito':
        for _ in range(5): objs.append((0, arbol(i + r.uniform(.25, .8), j + r.uniform(.25, .8), r.uniform(.7, 1.0))))
    elif tipo == 'edificio':
        pc = r.choice(PASTEL[:6]); objs.append((0, caja(i + .3, j + .3, i + .72, j + .72, r.choice([150, 190]), pc, ventanas=3, pisos=4, puerta=True)))
        objs.append((0, arbol(i + .82, j + .3, .8))); objs.append((0, arbol(i + .3, j + .84, .75)))
    else:
        for (a, b) in [(.24, .24), (.56, .24), (.24, .56), (.56, .56)]:
            if r.random() < .82:
                objs.append((0, caja(i + a, j + b, i + a + .22, j + b + .2, r.choice([46, 56, 64]), r.choice(PASTEL), ventanas=2, puerta=r.random() < .6, techo_tipo='dos', teja=r.choice(TEJAS))))
            else: objs.append((0, arbol(i + a + .1, j + b + .1, .8)))
    objs.sort(key=lambda t: t[0])
    for _, g in objs: o += g
    return o

def ordenar(objetos):
    """objetos: lista de (u + v del frente, [svg]) → pinta de atrás hacia adelante."""
    s = []
    for _, g in sorted(objetos, key=lambda t: t[0]): s += g
    return s

def zona_casa(i, j):
    o = [suelo(i, j, '#CFE6A3')]
    ob = []
    ob.append((i + j + .62 + .62, caja(i + .2, j + .28, i + .62, j + .62, 72, '#F7C9C9', ventanas=3, puerta=True, techo_tipo='dos', teja='#D9667B')))
    ob.append((i + j + 1.42, caja(i + .64, j + .58, i + .84, j + .8, 48, '#FFE3A3', ventanas=1, techo_tipo='dos', teja='#E46F55')))
    # jardín con cerca y canecas de colores
    for k in range(9):
        a = i + .22 + k * .05
        ob.append((i + j + 1.6, [f'<path d="M{P(a, j + .8)[0]:.1f} {P(a, j + .8)[1]:.1f}v-16" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>']))
    ob.append((i + j + 1.61, [f'<path d="M{P(i + .22, j + .8, 11)[0]:.1f} {P(i + .22, j + .8, 11)[1]:.1f}L{P(i + .62, j + .8, 11)[0]:.1f} {P(i + .62, j + .8, 11)[1]:.1f}" stroke="#FFFFFF" stroke-width="3"/>']))
    for k, col in enumerate(['#FFFFFF', '#2B2B2B', '#2E7D45']):
        ob.append((i + j + 1.5 + k * .01, caneca(i + .7 + k * .055, j + .3 + k * .02, col)))
    ob.append((i + j + .7, arbol(i + .78, j + .2, .9, '#5FA66F')))
    ob.append((i + j + 1.7, farol(i + .86, j + .86)))
    return o + ordenar(ob)

def zona_cuadra(i, j):
    o = [suelo(i, j, '#E6D9C2', '#C9B48F')]
    ob = []
    cols = [('#F6A38E', '#C9573F'), ('#9ED9CF', '#3E8E8A'), ('#FFD98A', '#D98A3D')]
    for k, (pc, tj) in enumerate(cols):
        a = .2 + k * .2
        ob.append((i + j + a + .5, caja(i + a, j + .22, i + a + .19, j + .5, 64 + k * 8, pc, ventanas=1, puerta=True, techo_tipo='dos', teja=tj)))
    # punto de reciclaje: contenedor y carrito de Rosa
    ob.append((i + j + 1.35, caja(i + .58, j + .66, i + .78, j + .8, 34, '#2E7D45', '#3E9B5E')))
    ob.append((i + j + 1.36, [f'<path d="M{P(i + .6, j + .8, 22)[0]:.1f} {P(i + .6, j + .8, 22)[1]:.1f}h40" stroke="#FFFFFF" stroke-width="3"/>']))
    for k, col in enumerate(['#FFFFFF', '#2B2B2B', '#2E7D45']):
        ob.append((i + j + 1.3, caneca(i + .3 + k * .06, j + .72, col)))
    ob.append((i + j + 1.5, caja(i + .2, j + .7, i + .3, j + .82, 24, '#E7C89B', '#F2DDB8')))
    ob.append((i + j + .9, arbol(i + .84, j + .3, .85)))
    return o + ordenar(ob)

def canal_en(i, j):
    """Franja de agua donde u + v = 4 (pasa de la manzana Arroyo a la Ciénaga)."""
    s = 4 - (i + j); w = .1
    ps = [(M, s - w - M), (s - w - M, M), (1 - M, s + w - 1 + M), (s + w - 1 + M, 1 - M)]
    ps = [(max(M, min(1 - M, a)), max(M, min(1 - M, b))) for a, b in ps]
    q = [P(i + a, j + b) for a, b in ps]
    o = [poly(q, '#B9A27E', f'stroke="{K}" stroke-width="2.4" stroke-linejoin="round"')]
    w2 = w - .018
    ps2 = [(M, s - w2 - M), (s - w2 - M, M), (1 - M, s + w2 - 1 + M), (s + w2 - 1 + M, 1 - M)]
    ps2 = [(max(M, min(1 - M, a)), max(M, min(1 - M, b))) for a, b in ps2]
    o += agua([P(i + a, j + b) for a, b in ps2])
    for f in (.25, .5, .75):
        x, y = P(i + f, j + s - f); o.append(f'<path d="M{x - 14:.1f} {y:.1f}q14 -5 28 0" stroke="#E6F7FC" stroke-width="3" fill="none" stroke-linecap="round"/>')
    return o

def zona_arroyo(i, j):
    o = [suelo(i, j, '#CFE6A3')]
    # canal que cruza la manzana hacia el cruce (y de ahí a la ciénaga)
    o += canal_en(i, j)
    ob = []
    ob.append((i + j + .7, caja(i + .18, j + .16, i + .44, j + .4, 56, '#C9D7F2', ventanas=2, puerta=True, techo_tipo='dos', teja='#1F6FA8')))
    ob.append((i + j + .78, caja(i + .5, j + .12, i + .7, j + .3, 50, '#FFFFFF', ventanas=1, techo_tipo='dos', teja='#E46F55')))
    ob.append((i + j + 1.6, caja(i + .52, j + .6, i + .76, j + .82, 52, '#F7D6B5', ventanas=2, puerta=True, techo_tipo='dos', teja='#C9573F')))
    # puente peatonal sobre el canal
    q = [P(i + .3, j + .58, 10), P(i + .38, j + .5, 10), P(i + .58, j + .7, 10), P(i + .5, j + .78, 10)]
    ob.append((i + j + 1.08, [poly([P(i + .34, j + .54, 10), P(i + .54, j + .34, 10), P(i + .62, j + .42, 10), P(i + .42, j + .62, 10)], '#C98B55'),
                              f'<path d="M{P(i + .34, j + .54, 26)[0]:.1f} {P(i + .34, j + .54, 26)[1]:.1f}L{P(i + .54, j + .34, 26)[0]:.1f} {P(i + .54, j + .34, 26)[1]:.1f}M{P(i + .42, j + .62, 26)[0]:.1f} {P(i + .42, j + .62, 26)[1]:.1f}L{P(i + .62, j + .42, 26)[0]:.1f} {P(i + .62, j + .42, 26)[1]:.1f}" stroke="{K}" stroke-width="3"/>']))
    # reja de la trampa, cerca de la salida del canal
    d = ''.join(f'M{P(i + .76 + k * .022, j + .2 - k * .022)[0]:.1f} {P(i + .76 + k * .022, j + .2 - k * .022)[1]:.1f}v-22' for k in range(6))
    ob.append((i + j + .97, [f'<path d="{d}" stroke="#4A3F4F" stroke-width="3.2" stroke-linecap="round"/>']))
    ob.append((i + j + 1.2, arbol(i + .22, j + .78, .75)))
    ob.append((i + j + 1.75, farol(i + .14, j + .9)))
    return o + ordenar(ob)

def zona_cienaga(i, j):
    o = [suelo(i, j, '#CFE6A3')]
    o += canal_en(i, j)
    lag = [P(i + .3, j + .2), P(i + .62, j + .2), P(i + .86, j + .4), P(i + .84, j + .74), P(i + .56, j + .84), P(i + .24, j + .7), P(i + .2, j + .44)]
    o += agua(lag)
    for (a, b) in [(.4, .45), (.6, .62), (.35, .7)]:
        x, y = P(i + a, j + b); o.append(f'<path d="M{x - 16:.1f} {y:.1f}q16 -7 32 0" stroke="#E6F7FC" stroke-width="3" fill="none" stroke-linecap="round"/>')
    ob = []
    for (a, b, s) in [(.3, .22, .85), (.56, .2, .8), (.82, .34, .9), (.84, .64, .85), (.28, .62, .8)]:
        x, y = P(i + a, j + b)
        raices = ''.join(f'<path d="M{x:.1f} {y - 22 * s:.1f}Q{x + d * 16 * s:.1f} {y - 14 * s:.1f} {x + d * 22 * s:.1f} {y + 2:.1f}" stroke="#8A4B2A" stroke-width="3" fill="none" stroke-linecap="round"/>' for d in (-1, -.4, .4, 1))
        ob.append((i + j + a + b, [raices] + arbol(i + a, j + b, s, '#2E8B57')[2:]))
    # canoa y garza
    cx, cy = P(i + .5, j + .55)
    ob.append((i + j + 1.05, [f'<path d="M{cx - 40:.1f} {cy:.1f}q40 18 80 0l-8 10q-32 10 -64 0z" fill="#C98B55" {TR}/>', f'<path d="M{cx + 6:.1f} {cy - 2:.1f}l26 -34" stroke="{K}" stroke-width="3"/>']))
    gx, gy = P(i + .7, j + .78)
    ob.append((i + j + 1.5, [f'<path d="M{gx:.1f} {gy:.1f}v-18M{gx + 6:.1f} {gy:.1f}v-18" stroke="{K}" stroke-width="2.4"/>',
                             f'<path d="M{gx - 10:.1f} {gy - 18:.1f}c0 -14 18 -16 22 -6 4 -10 0 -22 6 -26 4 -2 8 0 6 4l12 -2-12 6c-4 8 0 16-4 22-6 8-30 10-30 2z" fill="#FFFFFF" {TR}/>']))
    # muelle
    ob.append((i + j + 1.2, [poly([P(i + .86, j + .44, 6), P(i + .98 - M, j + .44, 6), P(i + .98 - M, j + .54, 6), P(i + .86, j + .54, 6)], '#C98B55')]))
    return o + ordenar(ob)

def zona_techos(i, j):
    o = [suelo(i, j, '#D4E7A8')]
    ob = []
    def paneles(u0, v0, u1, v1, h):
        g = []
        for a in range(2):
            for b in range(3):
                pu0 = u0 + .02 + a * (u1 - u0 - .04) / 2; pu1 = pu0 + (u1 - u0 - .06) / 2
                pv0 = v0 + .02 + b * (v1 - v0 - .04) / 3; pv1 = pv0 + (v1 - v0 - .07) / 3
                g.append(poly([P(pu0, pv0, h + 10), P(pu1, pv0, h + 10), P(pu1, pv1, h + 3), P(pu0, pv1, h + 3)], '#2F4F8F', f'stroke="{K}" stroke-width="1.8" stroke-linejoin="round"'))
                m0, m1 = P((pu0 + pu1) / 2, pv0, h + 10), P((pu0 + pu1) / 2, pv1, h + 3)
                g.append(f'<path d="M{m0[0]:.1f} {m0[1]:.1f}L{m1[0]:.1f} {m1[1]:.1f}" stroke="#8FB3F0" stroke-width="1.5"/>')
        return g
    ob.append((i + j + .95, caja(i + .2, j + .22, i + .52, j + .55, 110, '#FFE3A3', '#F2D48A', ventanas=2, pisos=2, puerta=True) + paneles(i + .2, j + .22, i + .52, j + .55, 110)))
    ob.append((i + j + 1.45, caja(i + .58, j + .5, i + .82, j + .8, 84, '#F7D6B5', '#E9C49C', ventanas=2, pisos=2, puerta=True) + paneles(i + .58, j + .5, i + .82, j + .8, 84)))
    # molino de viento con aspas que giran
    mx, my = P(i + .74, j + .26)
    ob.append((i + j + 1.0, [f'<ellipse cx="{mx + 10:.1f}" cy="{my + 2:.1f}" rx="16" ry="5" fill="#2B3A1E" opacity=".18"/>', f'<path d="M{mx - 3:.1f} {my:.1f}L{mx - 1.5:.1f} {my - 130:.1f}h3L{mx + 3:.1f} {my:.1f}z" fill="#FFFFFF" {TR}/>',
                             f'<g class="aspas" style="transform-origin:{mx:.1f}px {my - 132:.1f}px">' + ''.join(f'<path d="M{mx:.1f} {my - 132:.1f}l-5 -6 5 -52 5 52z" fill="#FFFFFF" {TR} transform="rotate({a} {mx:.1f} {my - 132:.1f})"/>' for a in (0, 120, 240)) + f'<circle cx="{mx:.1f}" cy="{my - 132:.1f}" r="6" fill="#FFB627" {TR}/></g>']))
    ob.append((i + j + 1.6, farol(i + .86, j + .86)))
    return o + ordenar(ob)

def zona_parque(i, j):
    o = [suelo(i, j, '#BFE09A', '#8FB866')]
    sendero = [P(i + M, j + .48), P(i + 1 - M, j + .48), P(i + 1 - M, j + .58), P(i + M, j + .58)]
    o.append(poly(sendero, '#EAD3AE', 'stroke="#D2B88E" stroke-width="2"'))
    ob = []
    for (a, b, s) in [(.25, .25, 1.0), (.5, .22, .9), (.78, .3, 1.05), (.22, .78, .95), (.82, .8, .9)]:
        ob.append((i + j + a + b, arbol(i + a, j + b, s)))
    # rodadero y columpio
    ob.append((i + j + 1.3, caja(i + .56, j + .64, i + .64, j + .72, 46, '#E85D2A', '#F28B5F')))
    r0, r1 = P(i + .64, j + .68, 46), P(i + .78, j + .68, 0)
    ob.append((i + j + 1.36, [f'<path d="M{r0[0]:.1f} {r0[1]:.1f}L{r1[0]:.1f} {r1[1]:.1f}" stroke="#FFD34D" stroke-width="10" stroke-linecap="round"/>', f'<path d="M{r0[0]:.1f} {r0[1]:.1f}L{r1[0]:.1f} {r1[1]:.1f}" stroke="{K}" stroke-width="2" stroke-linecap="round" opacity=".5"/>']))
    sx, sy = P(i + .38, j + .7)
    ob.append((i + j + 1.1, [f'<path d="M{sx - 24:.1f} {sy:.1f}L{sx - 16:.1f} {sy - 50:.1f}H{sx + 24:.1f}L{sx + 32:.1f} {sy:.1f}" fill="none" stroke="#5B4BD6" stroke-width="5" stroke-linejoin="round"/>',
                             f'<path d="M{sx:.1f} {sy - 50:.1f}v32M{sx + 10:.1f} {sy - 50:.1f}v32" stroke="{K}" stroke-width="2"/><rect x="{sx - 3:.1f}" y="{sy - 20:.1f}" width="16" height="5" rx="2" fill="#E85D2A" stroke="{K}" stroke-width="1.6"/>']))
    # banca
    bx, by = P(i + .5, j + .44)
    ob.append((i + j + .94, [f'<path d="M{bx - 20:.1f} {by:.1f}h40" stroke="#B5763F" stroke-width="7" stroke-linecap="round"/><path d="M{bx - 16:.1f} {by:.1f}v8M{bx + 16:.1f} {by:.1f}v8" stroke="{K}" stroke-width="2.4"/>']))
    ob.append((i + j + 1.7, farol(i + .14, j + .86)))
    return o + ordenar(ob)

def zona_colegio(i, j):
    o = [suelo(i, j, '#E6D9C2', '#C9B48F')]
    cancha = [P(i + .52, j + .56), P(i + .84, j + .56), P(i + .84, j + .84), P(i + .52, j + .84)]
    o.append(poly(cancha, '#E9876A', 'stroke="#FFFFFF" stroke-width="3"'))
    a, b = P(i + .68, j + .56), P(i + .68, j + .84)
    o.append(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="#FFFFFF" stroke-width="3"/>')
    ob = []
    ob.append((i + j + .82, caja(i + .18, j + .2, i + .82, j + .44, 104, '#FFF2D6', '#F1D6AE', ventanas=5, pisos=2, puerta=True)))
    ob.append((i + j + .85, caja(i + .18, j + .44, i + .42, j + .82, 70, '#FFF2D6', '#F1D6AE', ventanas=2, pisos=1)))
    # bandera
    fx, fy = P(i + .48, j + .52)
    ob.append((i + j + 1.0, [f'<path d="M{fx:.1f} {fy:.1f}V{fy - 120:.1f}" stroke="#6E6470" stroke-width="4"/>', f'<path d="M{fx:.1f} {fy - 120:.1f}h34l-6 10 6 10h-34z" fill="#5B4BD6" {TR}/>']))
    ob.append((i + j + 1.7, farol(i + .14, j + .86)))
    return o + ordenar(ob)

def zona_plaza(i, j):
    o = [suelo(i, j, '#EADBC4', '#C9B48F')]
    for k in range(1, 5):
        f = M + (1 - 2 * M) * k / 5
        a, b = P(i + f, j + M), P(i + f, j + 1 - M); o.append(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="#DCC8AA" stroke-width="2"/>')
        a, b = P(i + M, j + f), P(i + 1 - M, j + f); o.append(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="#DCC8AA" stroke-width="2"/>')
    ob = []
    # taller de inventores con toldo de rayas
    ob.append((i + j + .85, caja(i + .2, j + .2, i + .56, j + .5, 82, '#3A2E3F', '#4E3E57', ventanas=2, puerta=True)))
    for k in range(6):
        a0 = i + .2 + k * .06
        ob.append((i + j + .86, [poly([P(a0, j + .5, 60), P(a0 + .06, j + .5, 60), P(a0 + .06, j + .58, 46), P(a0, j + .58, 46)], '#FFB627' if k % 2 == 0 else '#FFF6E0', f'stroke="{K}" stroke-width="1.8" stroke-linejoin="round"')]))
    gx, gy = P(i + .38, j + .35, 96)
    ob.append((i + j + .87, [f'<circle cx="{gx:.1f}" cy="{gy:.1f}" r="16" fill="#FFB627" {TR}/><circle cx="{gx:.1f}" cy="{gy:.1f}" r="6" fill="#3A2E3F"/>']))
    # fuente
    fx, fy = P(i + .66, j + .66)
    ob.append((i + j + 1.32, [f'<ellipse cx="{fx:.1f}" cy="{fy:.1f}" rx="46" ry="23" fill="#CFC6B8" {TR}/><ellipse cx="{fx:.1f}" cy="{fy - 4:.1f}" rx="36" ry="17" fill="#7CC8E0"/>',
                              f'<path d="M{fx:.1f} {fy - 6:.1f}v-30" stroke="#CFC6B8" stroke-width="6"/><path d="M{fx:.1f} {fy - 36:.1f}c-10 4-14 12-16 22M{fx:.1f} {fy - 36:.1f}c10 4 14 12 16 22" stroke="#9FDCEC" stroke-width="3" fill="none" stroke-linecap="round"/>']))
    ob.append((i + j + .9, palma(i + .78, j + .24, .9)))
    ob.append((i + j + 1.5, palma(i + .3, j + .78, .85)))
    ob.append((i + j + 1.7, farol(i + .86, j + .86)))
    return o + ordenar(ob)

ZONAS = [  # zona, celda (i, j)
    ('casa', (0, 1)), ('cuadra', (1, 0)), ('arroyo', (1, 2)), ('cienaga', (2, 1)),
    ('techos', (2, 3)), ('parque', (3, 2)), ('colegio', (3, 4)), ('plaza', (4, 3))]
DIBUJA = {'casa': zona_casa, 'cuadra': zona_cuadra, 'arroyo': zona_arroyo, 'cienaga': zona_cienaga,
          'techos': zona_techos, 'parque': zona_parque, 'colegio': zona_colegio, 'plaza': zona_plaza}
celdas_zona = {c: z for z, c in ZONAS}
COLOR = {'casa': '#D9667B', 'cuadra': '#E85D2A', 'arroyo': '#1F6FA8', 'cienaga': '#0F7B70', 'techos': '#FFB627', 'parque': '#1F7A5C', 'colegio': '#5B4BD6', 'plaza': '#3A2E3F'}

# El arroyo pasa bajo el cruce (2, 2)... no: une la manzana Arroyo con la Ciénaga por el cruce (2, 2).
for sg in (-1, 1):
    s = 4 + sg * .1
    a, b = P(2 - M, s - 2 + M), P(2 + M, s - 2 - M)
    A(f'<path d="M{a[0]:.1f} {a[1] - 8:.1f}L{b[0]:.1f} {b[1] - 8:.1f}" stroke="{K}" stroke-width="9" stroke-linecap="round"/><path d="M{a[0]:.1f} {a[1] - 8:.1f}L{b[0]:.1f} {b[1] - 8:.1f}" stroke="#F3E6D0" stroke-width="5" stroke-linecap="round"/>')

# Carros en las calles (detrás de las manzanas que tienen delante)
carros = [(.5, 1, '#E85D2A', 'u'), (2, 3.45, '#1F6FA8', 'v'), (3.55, 3, '#FFB627', 'u'), (1, .5, '#5B4BD6', 'v'), (4, 4.6, '#2E8B57', 'v'), (2.4, 5, '#D9667B', 'u'), (-0.4, 2, '#3E8E8A', 'u'), (3, 1.5, '#F2F2F2', 'v')]
for (u, v, col, e) in carros:
    out += carro(u, v, col, e)

pins = {}
celdas = sorted({(i, j) for i in range(-3, 9) for j in range(-3, 9) if abs(i - j) <= 2 and -1 <= i + j <= 10}, key=lambda c: (c[0] + c[1], c[0]))
for (i, j) in celdas:
    if (i, j) in celdas_zona:
        z = celdas_zona[(i, j)]
        aro = poly([P(i + M - .012, j + M - .012), P(i + 1 - M + .012, j + M - .012), P(i + 1 - M + .012, j + 1 - M + .012), P(i + M - .012, j + 1 - M + .012)], 'none', f'stroke="{COLOR[z]}" stroke-width="7" stroke-linejoin="round" opacity=".9"')
        A(f'<g id="z-{z}" class="zona-arte">' + aro + ''.join(DIBUJA[z](i, j)) + '</g>')
        x, y = P(i + .5, j + .5)
        pins[z] = {'x': round(x / W * 100, 1), 'y': round((y + D * .9) / H * 100, 1)}
    else:
        A('<g>' + ''.join(relleno(i, j)) + '</g>')

# Luz de maqueta: viñeta suave en los bordes
defs = ('<defs><filter id="f-apagado" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".26 .5 .1 0 .06  .24 .52 .1 0 .06  .22 .46 .14 0 .07  0 0 0 1 0"/></filter>'
        '<filter id="f-tenue" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values=".55"/></filter>'
        '<radialGradient id="g-vineta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#3A2E3F" stop-opacity="0"/><stop offset="1" stop-color="#3A2E3F" stop-opacity=".22"/></radialGradient>'
        '<linearGradient id="g-sol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".35"/><stop offset=".5" stop-color="#FFF6D8" stop-opacity="0"/></linearGradient></defs>')
A(f'<rect width="{W}" height="{H}" fill="url(#g-sol)" pointer-events="none"/>')
A(f'<rect width="{W}" height="{H}" fill="url(#g-vineta)" pointer-events="none"/>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>Mapa del barrio</title>{defs}'
       f'<g id="mapa-barrio">' + ''.join(out) + '</g></svg>')
open(SALIDA, 'w').write(svg)
print(json.dumps(pins))
