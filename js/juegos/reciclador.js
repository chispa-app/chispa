/* Minijuego 2 · Ruta del reciclador (Cuadra).
   Rosa recoge las bolsas blancas (lo aprovechable) y las lleva a la estación de clasificación.
   Se mueve tocando una casilla vecina o con las flechas. Las estrellas premian la ruta corta, nunca la rapidez.
   Desde el nivel 6 el carrito tiene un límite y hay que descargar en la estación a mitad de camino. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const K = '#5A3526', W = `stroke="${K}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const v = c => `<svg viewBox="0 0 48 48" aria-hidden="true">${c}</svg>`;
  Object.assign(CH.ICO, {
    bolsaBlanca: v(`<path d="M15 18c-5 4-7 12-5 18 2 5 7 7 14 7s12-2 14-7c2-6 0-14-5-18z" fill="#FFF" ${W}/><path d="M18 18c2-3 2-7 0-10M30 18c-2-3-2-7 0-10M18 8c3 3 9 3 12 0" fill="none" ${W}/><path d="M17 26c4 2 10 2 14 0" fill="none" stroke="#B9A88F" stroke-width="2" stroke-linecap="round"/>`),
    bolsaNegra: v(`<path d="M15 18c-5 4-7 12-5 18 2 5 7 7 14 7s12-2 14-7c2-6 0-14-5-18z" fill="#2B2B2B" ${W}/><path d="M18 18c2-3 2-7 0-10M30 18c-2-3-2-7 0-10M18 8c3 3 9 3 12 0" fill="none" ${W}/>`),
    carro: v(`<path d="M5 30v-6l5-8h22l7 8h4v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="#1F6FA8" ${W}/><path d="M13 18h8v7h-11zM24 18h8l5 7H24z" fill="#DDEBF3" ${W}/><circle cx="14" cy="34" r="5" fill="#2B211D"/><circle cx="35" cy="34" r="5" fill="#2B211D"/><circle cx="14" cy="34" r="2" fill="#B9A88F"/><circle cx="35" cy="34" r="2" fill="#B9A88F"/>`),
    cono: v(`<path d="M20 8h8l9 30H11z" fill="#E85D2A" ${W}/><path d="M17 20h14M14.5 29h19" stroke="#FFF" stroke-width="4"/><rect x="7" y="37" width="34" height="5" rx="2" fill="#E85D2A" ${W}/>`)
  });

  // R: Rosa · E: estación · b: bolsa blanca · n: bolsa negra (no se recoge) · # carro · % obra · A árbol.
  const MAPAS = [
    { cap: 0, m: ['R...', '.#b.', '....', 'b..E'] },
    { cap: 0, m: ['R..#E', '.#...', '.b.#.', '...b.', '#b...'] },
    { cap: 0, m: ['..n.b', 'R#.#.', '.#...', '.b.%n', '...bE'] },
    { cap: 0, m: ['b...R', '.%#..', '..b.#', 'n#..b', 'E..#b'] },
    { cap: 0, m: ['R..#..', '.#..b.', '.b.A..', '...#.n', '#.b...', 'b..%.E'] },
    { cap: 2, m: ['b..#.b', '.#....', '...E%.', '.A....', 'b..#.b', '..R...'] },
    { cap: 3, m: ['b.n..b', '.#.##.', '..E...', '#.%.Ab', 'b.....', '.#R#.b'] },
    { cap: 2, m: ['b..#.b', '.#.nb.', '..%E#.', 'b.....', '.#.A.#', 'b.R..b'] }
  ];
  const OBST = { '#': ['carro', 'Carro parqueado'], '%': ['cono', 'Obra en la calle'], A: ['arbol', 'Árbol'] };
  const INTRO = [
    ['¡Hola! Soy Rosa.', 'Recojo las bolsas blancas y las llevo a la estación. Toca una casilla junto a mí para caminar.'],
    ['Tres bolsas hoy.', 'Busca un camino corto: así me canso menos.'],
    ['Las bolsas negras no son para mí.', 'Esas se las lleva el camión de la basura. Yo solo recojo las blancas.'],
    ['Cuatro bolsas.', 'Piensa antes de caminar: ¿cuál recojo primero?'],
    ['Una cuadra más grande.', 'Recoge todas y llega a la estación.'],
    ['Mi carrito solo lleva 2 bolsas.', 'Cuando se llene, pasa por la estación a descargar.'],
    ['Ahora caben 3 bolsas.', 'Planea la ruta: cinco bolsas y un carrito pequeño.'],
    ['¡El reto final!', 'Seis bolsas y un carrito de 2. Pasa por la estación las veces que haga falta.']
  ];

  // Ruta más corta (búsqueda en anchura sobre posición, bolsas recogidas y bolsas en el carrito).
  function rutaMasCorta(m, cap) {
    const F = m.length, C = m[0].length; let ini; const bolsas = [];
    m.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'R') ini = [r, c]; if (ch === 'b') bolsas.push(r * C + c); }));
    const todos = (1 << bolsas.length) - 1, capM = cap || 99;
    const q = [[ini[0], ini[1], 0, 0, 0]], vis = new Set([ini.join() + ',0,0']);
    while (q.length) {
      const [r, c, mask, lleva, d] = q.shift();
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= F || nc >= C || '#%A'.includes(m[nr][nc])) continue;
        let nm = mask, nl = lleva; const i = bolsas.indexOf(nr * C + nc);
        if (i >= 0 && !(mask & (1 << i)) && lleva < capM) { nm |= 1 << i; nl++; }
        if (m[nr][nc] === 'E') nl = 0;
        if (nm === todos && nl === 0) return d + 1;
        const k = `${nr},${nc},${nm},${nl}`; if (!vis.has(k)) { vis.add(k); q.push([nr, nc, nm, nl, d + 1]); }
      }
    }
    return 0;
  }

  CH.registrarJuego({
    id: 'reciclador', quien: 'rosa',
    como: { t: 'Ayuda a Rosa a recoger las bolsas blancas de la cuadra y llevarlas a la estación de clasificación. Las estrellas son para la ruta más corta: piensa antes de caminar.' },
    consejo: 'Para tres estrellas, busca una ruta más corta. Puedes deshacer pasos.',
    crear(api) {
      const { m, cap } = MAPAS[api.n - 1], F = m.length, C = m[0].length;
      const opt = rutaMasCorta(m, cap);
      let pos, eca; const bolsaEn = new Map(); let nb = 0;
      m.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'R') pos = [r, c]; if (ch === 'E') eca = [r, c]; if (ch === 'b') bolsaEn.set(r * C + c, nb++); }));
      let recogidas = 0, lleva = 0, entregadas = 0, pasos = 0;      // recogidas: máscara de bits
      const historia = [], pisadas = new Set([pos[0] * C + pos[1]]);
      const capM = cap || 99;

      api.tablero.innerHTML = `<div class="rec" style="--cols:${C};--filas:${F}" role="group" aria-label="Mapa de la cuadra. Con las flechas del teclado o los botones de abajo mueves a Rosa.">${m.map((row, r) => [...row].map((_, c) => `<button class="rec-c" data-r="${r}" data-c="${c}"></button>`).join('')).join('')}</div>`;
      api.ctrl.innerHTML = `<div class="rec-datos"><span><b data-pasos>0</b> pasos</span>${cap ? `<span class="rec-carrito">${CH.objeto('reciclador')}<b data-lleva>0</b> de ${cap}</span>` : ''}<span><b data-entregadas>0</b> de ${nb} en la estación</span></div>
        <div class="rec-flechas" role="group" aria-label="Mover a Rosa">
          <button class="btn-redondo" data-mover="0,-1" aria-label="Izquierda">${flecha(180)}</button><button class="btn-redondo" data-mover="-1,0" aria-label="Arriba">${flecha(270)}</button>
          <button class="btn-redondo" data-mover="1,0" aria-label="Abajo">${flecha(90)}</button><button class="btn-redondo" data-mover="0,1" aria-label="Derecha">${flecha(0)}</button>
          <button class="btn btn-borde btn-chico" data-deshacer>${CH.I.deshacer}Deshacer</button></div>`;
      const celdas = [...api.tablero.querySelectorAll('.rec-c')];
      const celda = (r, c) => celdas[r * C + c];

      function flecha(g) { return `<svg viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(${g}deg)"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
      const tieneBolsa = (r, c) => { const i = bolsaEn.get(r * C + c); return i !== undefined && !(recogidas & (1 << i)); };
      const libre = (r, c) => r >= 0 && c >= 0 && r < F && c < C && !OBST[m[r][c]];

      function pintar() {
        celdas.forEach(el => {
          const r = +el.dataset.r, c = +el.dataset.c, ch = m[r][c], aqui = pos[0] === r && pos[1] === c;
          const cerca = Math.abs(pos[0] - r) + Math.abs(pos[1] - c) === 1 && libre(r, c);
          let ico = '', et = '';
          if (OBST[ch]) { ico = CH.objeto(OBST[ch][0]); et = OBST[ch][1]; }
          else if (ch === 'E') { ico = CH.ilus('objeto', 'eca') + (entregadas ? `<span class="rec-insignia">${entregadas}</span>` : ''); et = 'Estación de clasificación' + (entregadas ? `, ${entregadas} bolsas` : ''); }
          else if (tieneBolsa(r, c)) { ico = CH.objeto('bolsaBlanca'); et = 'Bolsa blanca'; }
          else if (ch === 'n') { ico = CH.objeto('bolsaNegra'); et = 'Bolsa negra, es para el camión'; }
          else et = 'Calle';
          el.className = `rec-c ${OBST[ch] ? 'obst' : ''} ${ch === 'E' ? 'eca' : ''} ${cerca ? 'cerca' : ''} ${pisadas.has(r * C + c) ? 'pisada' : ''} ${aqui ? 'aqui' : ''}`;
          el.innerHTML = `<span class="rec-ico">${ico}</span>${aqui ? `<span class="rec-rosa">${CH.caraHTML('rosa')}${lleva ? `<span class="rec-lleva">${lleva}</span>` : ''}</span>` : ''}`;
          el.setAttribute('aria-label', `Fila ${r + 1}, columna ${c + 1}: ${aqui ? 'Rosa está aquí. ' : ''}${et}${cerca ? '. Puedes ir' : ''}`);
          el.tabIndex = aqui ? 0 : -1;
        });
        api.ctrl.querySelector('[data-pasos]').textContent = pasos;
        api.ctrl.querySelector('[data-entregadas]').textContent = entregadas;
        const l = api.ctrl.querySelector('[data-lleva]'); if (l) l.textContent = lleva;
        api.ctrl.querySelector('[data-deshacer]').disabled = !historia.length;
        api.cuenta(`${entregadas} de ${nb}`);
      }

      function mover(r, c) {
        if (api.terminado) return;
        const dist = Math.abs(pos[0] - r) + Math.abs(pos[1] - c);
        if (dist === 0) return;
        if (!libre(r, c)) { api.decir(OBST[m[r]?.[c]] ? `Ahí hay un obstáculo: ${OBST[m[r][c]][1].toLowerCase()}.` : 'Por ahí no se puede.', 'Busca otro camino.', 'info'); return; }
        if (dist !== 1) { api.decir('Rosa camina de a una casilla.', 'Toca una de las casillas marcadas junto a ella.', 'info'); return; }
        historia.push({ pos: pos.slice(), recogidas, lleva, entregadas, pasos, pis: [...pisadas] });
        pos = [r, c]; pasos++; pisadas.add(r * C + c);
        const i = bolsaEn.get(r * C + c);
        let msg = null;
        if (i !== undefined && !(recogidas & (1 << i))) {
          if (lleva < capM) { recogidas |= 1 << i; lleva++; CH.sonido('pop'); msg = ['¡Bolsa al carrito!', cap ? `Llevas ${lleva} de ${cap}.` : '', 'bien']; }
          else msg = ['El carrito está lleno.', 'Primero ve a la estación a descargar.', 'casi'];
        } else if (m[r][c] === 'n') msg = ['Esa bolsa es negra.', 'No se aprovecha: se la lleva el camión de la basura.', 'info'];
        if (m[r][c] === 'E' && lleva) {
          entregadas += lleva; const n = lleva; lleva = 0;
          msg = [`¡${n === 1 ? 'Una bolsa' : n + ' bolsas'} en la estación!`, entregadas < nb ? `Faltan ${nb - entregadas}.` : '', 'bien'];
          CH.sonido('bien');
        }
        pintar();
        const el = celda(r, c); el.focus({ preventScroll: true });
        if (!api.quieto) { const t = el.querySelector('.rec-rosa'); if (t) t.classList.add('salta'); }
        if (entregadas === nb) {
          CH.chispas(el, 14);
          const est = pasos <= opt + 1 ? 3 : pasos <= opt + 5 ? 2 : 1;
          api.ganar(est, pasos <= opt ? `¡Encontraste la ruta más corta: ${pasos} pasos!` : `Rosa caminó ${pasos} pasos. La ruta más corta tenía ${opt}.`);
          return;
        }
        if (msg) { api.decir(msg[0], msg[1], msg[2]); if (msg[2] === 'bien') CH.chispas(el, 6); }
      }

      celdas.forEach(el => el.addEventListener('click', () => mover(+el.dataset.r, +el.dataset.c)));
      api.ctrl.querySelectorAll('[data-mover]').forEach(b => b.addEventListener('click', () => { const [dr, dc] = b.dataset.mover.split(',').map(Number); mover(pos[0] + dr, pos[1] + dc); }));
      api.tablero.addEventListener('keydown', ev => {
        const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[ev.key];
        if (!d) return; ev.preventDefault(); mover(pos[0] + d[0], pos[1] + d[1]);
      });
      api.ctrl.querySelector('[data-deshacer]').addEventListener('click', () => {
        const h = historia.pop(); if (!h || api.terminado) return;
        pos = h.pos; recogidas = h.recogidas; lleva = h.lleva; entregadas = h.entregadas; pasos = h.pasos;
        pisadas.clear(); h.pis.forEach(x => pisadas.add(x));
        CH.sonido('toque'); pintar();
        api.decir('Paso deshecho.', `Llevas ${pasos} pasos.`, 'info', false);
      });
      pintar();
      api.decir(INTRO[api.n - 1][0], INTRO[api.n - 1][1]);
    }
  });
})();
