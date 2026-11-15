/* Minijuego 6 · Sombra para todos (Parque).
   Cada árbol da sombra a su casilla y a las cuatro de al lado. Hay que dar sombra a los lugares calientes
   (bancas, paradero, juegos, camino al colegio) con los menos árboles posibles. No se siembra en la calle,
   en la cancha ni debajo de los cables. Tocar un árbol lo quita: probar es parte del juego. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const K = '#5A3526', W = `stroke="${K}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const v = c => `<svg viewBox="0 0 48 48" aria-hidden="true">${c}</svg>`;
  Object.assign(CH.ICO, {
    paradero: v(`<path d="M6 12h36v5H6z" fill="#1F7A5C" ${W}/><path d="M9 17v24M39 17v24" ${W}/><rect x="13" y="26" width="22" height="5" rx="2" fill="#E7C89B" ${W}/><path d="M15 31v6M33 31v6" ${W}/><circle cx="40" cy="8" r="5" fill="#FFB627" ${W}/>`),
    columpio: v(`<path d="M6 42 14 8h20l8 34M14 8h20" fill="none" ${W}/><path d="M20 8v22M28 8v22" stroke="${K}" stroke-width="2"/><rect x="17" y="30" width="14" height="5" rx="2" fill="#E85D2A" ${W}/>`),
    poste: v(`<path d="M24 6v36" stroke="#6E6470" stroke-width="5" stroke-linecap="round"/><path d="M12 12h24" ${W}/><path d="M2 14c8 4 14 4 22-2s14-6 22-2" fill="none" stroke="#2B211D" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="#FFB627"/><circle cx="36" cy="12" r="2.5" fill="#FFB627"/>`)
  });
  const NV = [
    ['....', '.B.P', '....', '....'],
    ['..B..', '...J.', 'ccccc', '.P...'],
    ['www..', '.B.P.', '.....', 'ccccc', '.J.A.'],
    ['..P..', '.B.J.', '.kk..', '.kkA.', '..B..'],
    ['wwwwww', 'B.P...', '....J.', 'cccccc', '.A.B..'],
    ['..P...', '.B.J..', 'cccccc', '..A...', '.Bkk..', '....P.'],
    ['wwwwww', 'B.P...', '...A.J', 'cccccc', '.J.B..', '..kk.P'],
    ['P.B..w', '...J.w', 'A.kk.w', '..kkB.', 'cccccc', 'B..P.J']
  ];
  const OPT = [1, 2, 2, 2, 3, 3, 4, 5];      // mínimo de árboles, calculado por búsqueda completa
  const SOL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#FFB627" stroke="#2B211D" stroke-width="1.6"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2 2M16.7 16.7l2 2M5.3 18.7l2-2M16.7 7.3l2-2" stroke="#C2451C" stroke-width="2" stroke-linecap="round"/></svg>';
  const LUGAR = { B: ['banca', 'La banca'], P: ['paradero', 'El paradero'], J: ['columpio', 'Los juegos'], A: ['escuela', 'El camino al colegio'] };
  const INTRO = [
    ['¡Buenas! Soy Don Abel.', 'Un árbol da sombra a su alrededor: arriba, abajo y a los lados. ¿Dónde siembras uno solo para dar sombra a la banca y al paradero?'],
    ['La calle no es para sembrar.', 'Busca dónde un árbol cuida dos lugares a la vez.'],
    ['¡Cuidado con los cables!', 'Debajo de los cables no se siembra: el árbol crecería contra ellos.'],
    ['La cancha es para jugar.', 'Cinco lugares calientes. Se puede con muy pocos árboles.'],
    ['Más lugares al sol.', 'Mira bien antes de sembrar.'],
    ['Un parque grande.', 'Seis lugares calientes: piensa en los que están juntos.'],
    ['Casi eres jardinero experto.', 'Siete lugares calientes y pocos árboles.'],
    ['¡El reto final!', 'Ocho lugares calientes. Sombra para todo el barrio.']
  ];

  CH.registrarJuego({
    id: 'sombra', quien: 'don-abel',
    como: { t: 'Siembra árboles para dar sombra a las bancas, el paradero, los juegos y el camino al colegio. Cada árbol cubre su casilla y las cuatro de al lado. Usa los menos árboles posibles.' },
    consejo: 'Para tres estrellas, busca casillas que den sombra a dos o tres lugares a la vez.',
    crear(api) {
      const m = NV[api.n - 1], F = m.length, C = m[0].length, opt = OPT[api.n - 1], tope = opt + 2;
      const arboles = new Set(), calientes = [];
      m.forEach((row, r) => [...row].forEach((ch, c) => { if (LUGAR[ch]) calientes.push(r * C + c); }));
      const cerca = (a, b) => Math.abs(Math.floor(a / C) - Math.floor(b / C)) + Math.abs((a % C) - (b % C)) <= 1;
      const conSombra = i => [...arboles].some(t => cerca(t, i));
      const tipo = i => m[Math.floor(i / C)][i % C];

      api.tablero.innerHTML = `<div class="sb" style="--cols:${C};--filas:${F}" role="group" aria-label="Mapa del parque">${[...Array(F * C).keys()].map(i => `<button class="sb-c t-${{ '.': 'pasto', c: 'calle', k: 'cancha', w: 'cables' }[tipo(i)] || 'lugar'}" data-i="${i}"></button>`).join('')}</div>`;
      api.ctrl.innerHTML = `<div class="red-datos sb-datos"><span class="sb-arboles">${CH.objeto('arbol')}<b data-usados>0</b> de ${tope} árboles</span><span><b data-frescos>0</b> de ${calientes.length} con sombra</span></div>`;
      const celdas = [...api.tablero.querySelectorAll('.sb-c')];

      function pintar() {
        celdas.forEach((el, i) => {
          const t = tipo(i), r = Math.floor(i / C) + 1, c = (i % C) + 1, arbol = arboles.has(i), sombra = conSombra(i);
          let ico = '', et = '';
          if (LUGAR[t]) { ico = CH.objeto(LUGAR[t][0]); et = `${LUGAR[t][1]}, ${sombra ? 'con sombra' : 'al sol'}`; }
          else if (t === 'w') { ico = CH.objeto('poste'); et = 'Cables: aquí no se siembra'; }
          else if (t === 'c') et = 'Calle: aquí no se siembra';
          else if (t === 'k') et = 'Cancha: aquí no se siembra';
          else et = arbol ? 'Árbol sembrado. Toca para quitarlo' : 'Pasto: puedes sembrar';
          el.classList.toggle('con-arbol', arbol); el.classList.toggle('sombra', sombra && !arbol);
          el.classList.toggle('fresco', !!LUGAR[t] && sombra); el.classList.toggle('caliente', !!LUGAR[t] && !sombra);
          el.innerHTML = `${arbol ? `<span class="sb-arbol">${CH.objeto('arbol')}</span>` : ico ? `<span class="sb-ico">${ico}</span>` : ''}${LUGAR[t] ? `<span class="sb-marca" aria-hidden="true">${sombra ? CH.I.check : SOL}</span>` : ''}`;
          el.setAttribute('aria-label', `Fila ${r}, columna ${c}: ${et}`);
        });
        const frescos = calientes.filter(conSombra).length;
        api.ctrl.querySelector('[data-usados]').textContent = arboles.size;
        api.ctrl.querySelector('[data-frescos]').textContent = frescos;
        api.cuenta(`${frescos} de ${calientes.length} con sombra`);
        return frescos;
      }

      celdas.forEach((el, i) => el.addEventListener('click', () => {
        if (api.terminado) return;
        const t = tipo(i);
        if (t === 'c') return api.decir('Eso es la calle.', 'Ahí pasan los carros: no se siembra.', 'info', false);
        if (t === 'k') return api.decir('Esa es la cancha.', 'Ahí se juega: siembra alrededor.', 'info', false);
        if (t === 'w') return api.decir('Ahí pasan cables.', 'El árbol crecería contra ellos. Siémbralo lejos de los cables.', 'info');
        if (LUGAR[t]) return api.decir(`${LUGAR[t][1]} no se mueve.`, 'Siembra un árbol junto a ese lugar.', 'info', false);
        if (arboles.has(i)) { arboles.delete(i); CH.sonido('pasa'); pintar(); return api.decir('Árbol quitado.', 'Prueba en otro lugar.', 'info', false); }
        if (arboles.size >= tope) return api.decir('No te quedan árboles.', 'Toca un árbol para quitarlo y prueba otro lugar.', 'casi');
        const antes = calientes.filter(conSombra);
        arboles.add(i); CH.sonido('pop');
        const frescos = pintar();
        const nuevos = calientes.filter(conSombra).filter(x => !antes.includes(x));
        if (!api.quieto) { const a = el.querySelector('.sb-arbol'); if (a) a.classList.add('crece'); }
        if (frescos === calientes.length) {
          CH.chispas(api.tablero.querySelector('.sb'), 18);
          const est = arboles.size <= opt ? 3 : arboles.size === opt + 1 ? 2 : 1;
          const dato = api.n === 1 || api.n === 8 ? ' Bajo la sombra, el piso puede estar entre 11 y 25 °C más fresco (EPA).' : '';
          setTimeout(() => api.ganar(est, (arboles.size <= opt ? `¡Sombra para todos con solo ${arboles.size} árbol${arboles.size > 1 ? 'es' : ''}!` : `Usaste ${arboles.size} árboles. Se podía con ${opt}.`) + dato), api.quieto ? 0 : 450);
          return;
        }
        if (nuevos.length >= 2) { api.acierto(el, 10); api.decir(`¡Un árbol, ${nuevos.length} lugares con sombra!`, 'Así se aprovecha cada árbol.', 'bien'); }
        else if (nuevos.length === 1) { api.acierto(el, 6); api.decir(`¡${LUGAR[tipo(nuevos[0])][1]} ya tiene sombra!`, `Faltan ${calientes.length - frescos}.`, 'bien', false); }
        else api.decir('Árbol sembrado.', 'Pero no le da sombra a ningún lugar caliente. Puedes quitarlo.', 'info', false);
      }));
      pintar();
      api.decir(INTRO[api.n - 1][0], INTRO[api.n - 1][1]);
    }
  });
})();
