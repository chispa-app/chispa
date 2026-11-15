/* Minijuego 5 · Red del barrio (Techos).
   Rompecabezas de cables: se toca una casilla para girarla hasta que la energía del panel (y del molino, al final)
   llegue a todas las casas. Cada nivel se arma con semilla, siempre igual y con solución. Las estrellas premian
   girar poco, no la rapidez. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];            // arriba, derecha, abajo, izquierda
  const NOM = ['arriba', 'la derecha', 'abajo', 'la izquierda'];
  const rot = m => ((m << 1) | (m >> 3)) & 15;                 // gira 90° a la derecha
  const rotN = (m, k) => { for (let i = 0; i < ((k % 4) + 4) % 4; i++) m = rot(m); return m; };
  const bits = m => [0, 1, 2, 3].filter(d => m & (1 << d));
  const periodo = m => m === 15 || m === 0 ? 1 : (m === 5 || m === 10) ? 2 : 4;
  // filas, columnas, casas fijas, fuentes [fila, col, tipo]
  const NV = [
    { F: 3, C: 3, fijas: true, src: [[1, 1, 'panel']] },
    { F: 3, C: 3, fijas: true, src: [[0, 1, 'panel']] },
    { F: 4, C: 3, fijas: false, src: [[0, 1, 'panel']] },
    { F: 4, C: 4, fijas: false, src: [[1, 1, 'panel']] },
    { F: 4, C: 4, fijas: false, src: [[0, 0, 'panel']] },
    { F: 5, C: 4, fijas: false, src: [[2, 1, 'panel']] },
    { F: 5, C: 5, fijas: false, src: [[0, 0, 'panel'], [4, 4, 'molino']] },
    { F: 5, C: 5, fijas: false, src: [[1, 3, 'panel'], [3, 1, 'molino']] }
  ];
  const INTRO = [
    ['¡Hola! Soy Vale.', 'El panel solar ya tiene energía. Toca los cables para girarlos y lleva la luz a las casas.'],
    ['Otra cuadra a oscuras.', 'Gira los cables hasta que todas las casas se enciendan.'],
    ['Ahora las casas también giran.', 'Mira hacia dónde sale el cable de cada casa.'],
    ['Una red más grande.', 'Empieza por las esquinas: ahí hay menos caminos posibles.'],
    ['El panel está en la esquina.', 'Sigue la energía casilla por casilla.'],
    ['¡Más casas!', 'Piensa antes de girar: menos giros, más estrellas.'],
    ['Llegó un molino de viento.', 'La brisa también da energía, de día y de noche. Cada casa necesita una de las dos.'],
    ['¡El reto final!', 'Sol y viento para todo el barrio.']
  ];

  function generar(cfg, rnd) {
    const { F, C } = cfg, N = F * C, con = new Array(N).fill(0), dueno = new Array(N).fill(-1);
    const front = [];
    const vecino = (i, d) => { const r = Math.floor(i / C) + DIRS[d][0], c = (i % C) + DIRS[d][1]; return r < 0 || c < 0 || r >= F || c >= C ? -1 : r * C + c; };
    const agregar = i => { for (let d = 0; d < 4; d++) front.push([i, d]); };
    cfg.src.forEach(([r, c], k) => { dueno[r * C + c] = k; agregar(r * C + c); });
    while (front.length) {
      // Mezcla de «seguir el camino» y «al azar»: caminos largos con pocas ramas.
      const idx = rnd() < 0.55 ? front.length - 1 - Math.floor(rnd() * Math.min(4, front.length)) : Math.floor(rnd() * front.length);
      const [a, d] = front.splice(idx, 1)[0], b = vecino(a, d);
      if (b < 0 || dueno[b] >= 0) continue;
      con[a] |= 1 << d; con[b] |= 1 << ((d + 2) % 4); dueno[b] = dueno[a]; agregar(b);
    }
    return { con, vecino };
  }

  CH.registrarJuego({
    id: 'red', quien: 'vale',
    como: { t: 'Toca los cables para girarlos y lleva la energía del panel solar a todas las casas del barrio. Gira lo menos posible para ganar tres estrellas.' },
    consejo: 'Para tres estrellas, piensa antes de girar: cada toque cuenta.',
    crear(api) {
      const cfg = NV[api.n - 1], { F, C } = cfg;
      const rnd = CH.semilla(7919 * api.n + 17);
      const { con, vecino } = generar(cfg, rnd);
      const fuentes = new Map(cfg.src.map(([r, c, t]) => [r * C + c, t]));
      const casas = new Set(); con.forEach((m, i) => { if (!fuentes.has(i) && bits(m).length === 1) casas.add(i); });
      // Giros: cada casilla guarda cuántas veces está girada respecto a la solución.
      const giro = con.map((m, i) => {
        if (fuentes.has(i) || (cfg.fijas && casas.has(i)) || periodo(m) === 1) return 0;
        return Math.floor(rnd() * 4);
      });
      // Que no empiece resuelta y que haya trabajo de verdad.
      const tieneTrabajo = () => giro.filter((g, i) => g % periodo(con[i]) !== 0).length;
      for (let i = 0; tieneTrabajo() < Math.ceil(con.length * 0.45) && i < con.length * 3; i++) {
        const k = Math.floor(rnd() * con.length); if (!fuentes.has(k) && !(cfg.fijas && casas.has(k)) && periodo(con[k]) > 1) giro[k] = (giro[k] + 1) % 4;
      }
      const minGiros = giro.reduce((a, g, i) => { const p = periodo(con[i]); return a + ((p - (g % p)) % p); }, 0);
      const visual = giro.map(g => g);   // grados acumulados en cuartos (para que la animación siempre gire igual)
      let giros = 0;
      const actual = i => rotN(con[i], giro[i]);
      const girable = i => !fuentes.has(i) && !(cfg.fijas && casas.has(i));

      function encendidas() {
        const on = new Set([...fuentes.keys()]), q = [...fuentes.keys()];
        while (q.length) {
          const a = q.shift(), ma = actual(a);
          for (const d of bits(ma)) { const b = vecino(a, d); if (b < 0 || on.has(b)) continue; if (actual(b) & (1 << ((d + 2) % 4))) { on.add(b); q.push(b); } }
        }
        return on;
      }

      const brazo = d => `<path d="M50 50 L${[50, 100, 50, 0][d]} ${[0, 50, 100, 50][d]}"/>`;
      function svgCelda(i, on) {
        const m = con[i];
        const brazos = bits(m).map(brazo).join('');
        const centro = casas.has(i) || fuentes.has(i) ? '' : `<circle cx="50" cy="50" r="${bits(m).length > 2 ? 11 : 8}" class="nudo"/>`;
        return `<svg viewBox="0 0 100 100" aria-hidden="true"><g class="brazos" style="transform:rotate(${visual[i] * 90}deg)"><g class="cable-borde">${brazos}</g><g class="cable">${brazos}</g>${centro}</g></svg>
          ${casas.has(i) ? `<span class="red-casa">${casaSVG(on.has(i))}</span>` : ''}${fuentes.has(i) ? `<span class="red-fuente">${CH.objeto(fuentes.get(i))}</span>` : ''}`;
      }
      const casaSVG = luz => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 22 24 7l18 15v19H6z" fill="${luz ? '#FFF0D6' : '#CBBBA6'}" stroke="#2B211D" stroke-width="2.5" stroke-linejoin="round"/><rect x="12" y="25" width="8" height="8" rx="1.5" fill="${luz ? '#FFD34D' : '#5E5560'}" stroke="#2B211D" stroke-width="2"/><rect x="28" y="25" width="8" height="8" rx="1.5" fill="${luz ? '#FFD34D' : '#5E5560'}" stroke="#2B211D" stroke-width="2"/><path d="M21 41v-6h6v6" fill="#E85D2A" stroke="#2B211D" stroke-width="2"/></svg>`;
      function etiqueta(i, on) {
        const r = Math.floor(i / C) + 1, c = (i % C) + 1, dirs = bits(actual(i)).map(d => NOM[d]);
        const tipo = fuentes.has(i) ? (fuentes.get(i) === 'panel' ? 'Panel solar' : 'Molino de viento')
          : casas.has(i) ? (on.has(i) ? 'Casa encendida' : 'Casa apagada')
          : (dirs.length === 2 && (actual(i) === 5 || actual(i) === 10) ? 'Cable recto' : dirs.length === 2 ? 'Cable en curva' : dirs.length === 3 ? 'Cable en T' : 'Cruce de cables');
        const sale = dirs.length ? `, sale hacia ${dirs.join(' y ')}` : '';
        return `Fila ${r}, columna ${c}: ${tipo}${sale}${!casas.has(i) && !fuentes.has(i) ? (on.has(i) ? ', con energía' : ', sin energía') : ''}${girable(i) ? '. Toca para girar' : ''}`;
      }

      api.tablero.innerHTML = `<div class="red" style="--cols:${C};--filas:${F}" role="group" aria-label="Red de cables del barrio">${con.map((_, i) => `<button class="red-c ${fuentes.has(i) ? 'fuente' : ''} ${casas.has(i) ? 'casa' : ''}" data-i="${i}" ${girable(i) ? '' : 'aria-disabled="true"'}></button>`).join('')}</div>`;
      api.ctrl.innerHTML = `<div class="red-datos"><span><b data-giros>0</b> giros</span><span><b data-luz>0</b> de ${casas.size} casas con luz</span></div>`;
      const celdas = [...api.tablero.querySelectorAll('.red-c')];
      let antes = 0;

      function pintar(primera) {
        const on = encendidas();
        celdas.forEach((el, i) => {
          if (primera) el.innerHTML = svgCelda(i, on);
          else {
            const g = el.querySelector('.brazos'); if (g) g.style.transform = `rotate(${visual[i] * 90}deg)`;
            const ca = el.querySelector('.red-casa'); if (ca) ca.innerHTML = casaSVG(on.has(i));
          }
          el.classList.toggle('on', on.has(i));
          el.setAttribute('aria-label', etiqueta(i, on));
        });
        const luz = [...casas].filter(i => on.has(i)).length;
        api.ctrl.querySelector('[data-luz]').textContent = luz;
        api.ctrl.querySelector('[data-giros]').textContent = giros;
        api.cuenta(`${luz} de ${casas.size} casas`);
        return luz;
      }

      celdas.forEach((el, i) => el.addEventListener('click', () => {
        if (api.terminado) return;
        if (!girable(i)) {
          api.decir(fuentes.has(i) ? 'Esta es la fuente de energía.' : 'Esta casa no gira en este nivel.', 'Gira los cables que la rodean.', 'info', false);
          return;
        }
        giro[i] = (giro[i] + 1) % 4; visual[i]++; giros++;
        CH.sonido('toque');
        const luz = pintar(false);
        if (luz > antes) {
          CH.sonido('enciende');
          [...casas].forEach(k => { if (encendidas().has(k)) celdas[k].classList.add('brilla'); });
          if (luz < casas.size) api.decir(luz === 1 ? '¡Una casa encendida!' : `¡${luz} casas encendidas!`, `Faltan ${casas.size - luz}.`, 'bien', false);
        }
        antes = luz;
        if (luz === casas.size) {
          CH.chispas(api.tablero.querySelector('.red'), 20);
          const est = giros <= minGiros + 2 ? 3 : giros <= minGiros * 2 + 4 ? 2 : 1;
          setTimeout(() => api.ganar(est, giros <= minGiros ? `¡Todo el barrio con luz en solo ${giros} giros!` : `Encendiste ${casas.size} casas con ${giros} giros. Se podía con ${minGiros}.`), api.quieto ? 0 : 450);
        }
      }));
      antes = pintar(true);
      api.decir(INTRO[api.n - 1][0], INTRO[api.n - 1][1]);
    }
  });
})();
