/* chispa 2.0 · motor de minijuegos.
   Siete juegos de 8 niveles con 3 chispas. Ninguno tiene tiempo límite: lo que se mueve se puede pausar
   y vuelve a pasar; todo se resuelve tocando (arrastrar es opcional). Las chispas premian pensar, no correr. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc, I = CH.I, P = CH.prog;
  const J = CH.JUEGOS = {};
  const NIVELES = 8;

  /* ---------- Utilidades compartidas ---------- */
  // Azar con semilla: el mismo nivel sale igual cada vez que se juega.
  CH.semilla = s => { let x = (s >>> 0) || 1; return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; }; };
  CH.mezclarCon = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  CH.estrellasHTML = (n, max = 3) => `<span class="estrellas" role="img" aria-label="${n} de ${max} chispas">${Array.from({ length: max }, (_, i) => i < n ? I.estrella : I.estrellaVacia).join('')}</span>`;
  const cara = quien => `<span class="jg-cara" aria-hidden="true">${quien === 'cocuyo' ? CH.cocuyo('feliz', 'jg-cara-img') : CH.cara(quien, 'jg-cara-img')}</span>`;
  CH.caraHTML = cara;

  /* ---------- Progreso de los juegos ---------- */
  CH.epDeJuego = id => { for (const z of CH.ZONAS) for (const ep of (CH.RUTAS[z.id] || [])) if (ep.pasos.some(p => p.tipo === 'juego' && p.juego === id)) return ep; return null; };
  P.juegoAbierto = id => {
    const G = CH.E.juegos[id];
    if (G && Object.keys(G).length) return true;
    const ep = CH.epDeJuego(id);
    return ep ? !!CH.E.eps[ep.id] : false;
  };
  P.nivelAbierto = (id, n) => n === 1 || ((CH.E.juegos[id] || {})[n - 1] || 0) >= 1;
  P.estrellasDe = id => Object.values(CH.E.juegos[id] || {}).reduce((a, x) => a + x, 0);
  P.nivelesSuperados = () => Object.values(CH.E.juegos).reduce((a, g) => a + Object.keys(g).length, 0);

  /* ---------- Bucle de animación (se detiene al salir, con diálogos abiertos o si se pausa) ---------- */
  let parar = [];
  // Cada bucle también se detiene solo cuando su tablero sale de la pantalla.
  const detener = () => { const l = parar; parar = []; l.forEach(f => { try { f(); } catch (e) { /* nada */ } }); };

  CH.registrarJuego = def => {
    def.info = CH.JUEGOS_INFO.find(x => x.id === def.id);
    def.jugar = o => jugarNivel(def, o.nivel || 1, o.dentro || null);
    J[def.id] = def;
  };

  /* =========================================================
     UN NIVEL
     ========================================================= */
  function jugarNivel(def, n, dentro) {
    detener();
    const Z = CH.zona(def.info.zona), quien = def.quien;
    let lienzo, hoja, marco;
    if (dentro) {
      lienzo = dentro.lienzo; hoja = dentro.hoja; marco = lienzo.closest('.ep');
      if (marco) marco.classList.add('con-juego');
    } else {
      CH.pintar(`<div class="ep juego-ep con-juego" style="--z:${Z.color};--zt:${Z.tinta}">
        <div class="ep-fondo" aria-hidden="true">${CH.fondo(Z.id)}</div>
        <div class="ep-barra">
          <button class="btn-redondo" data-pausa aria-label="Pausa">${I.pausa}</button>
          <div class="jg-titulo"><span>${esc(def.info.nombre)}</span><b>Nivel ${n} de ${NIVELES}</b></div>
          <button class="btn-redondo" data-voz aria-label="Repetir la voz">${I.voz}</button>
        </div>
        <h1 class="solo-lector">${esc(def.info.nombre)}, nivel ${n} de ${NIVELES}</h1>
        <div class="ep-lienzo" data-lienzo></div>
        <section class="ep-hoja" data-hoja aria-label="Controles del juego"></section>
      </div>`, { clase: 'modo-ep' });
      lienzo = CH.$main.querySelector('[data-lienzo]'); hoja = CH.$main.querySelector('[data-hoja]');
      marco = CH.$main.querySelector('.ep');
      CH.on('[data-pausa]', 'click', () => pausa(def, n));
      CH.on('[data-voz]', 'click', () => CH.repetir());
    }
    lienzo.innerHTML = `<div class="jg-tablero jg-${def.id}" data-tablero></div>`;
    hoja.dataset.juego = def.id;
    hoja.innerHTML = `<div class="jg-cab"><span class="chip-act">${dentro ? 'Minijuego' : 'Nivel ' + n + ' de ' + NIVELES}</span><span class="jg-cuenta" data-cuenta aria-live="polite"></span></div>
      <div class="jg-msg" data-msg data-tipo="info" role="status">${cara(quien)}<div class="jg-msg-t"><p class="titulo" data-msg-t></p><p data-msg-x></p></div></div>
      <div class="jg-ctrl" data-ctrl></div>
      <div data-acciones class="acciones"></div>`;
    const tablero = lienzo.querySelector('[data-tablero]'), ctrl = hoja.querySelector('[data-ctrl]');
    let errores = 0, seguidos = 0, terminado = false;

    const api = {
      n, def, dentro: !!dentro, tablero, ctrl, hoja, Z,
      experto: CH.E.nivel === 'experto',
      // Sin movimiento automático si el adulto activó «Juegos sin tiempo» o si se pidió menos movimiento.
      quieto: !!CH.E.aj.sinTiempo || CH.menosMovimiento(),
      pausado: false,
      get errores() { return errores; },
      get seguidos() { return seguidos; },
      get terminado() { return terminado; },
      // Mensaje del guía en la hoja: tipo 'info' | 'bien' | 'casi'.
      decir(titulo, texto = '', tipo = 'info', voz = true) {
        const m = hoja.querySelector('[data-msg]'); if (!m) return;
        m.dataset.tipo = tipo;
        m.querySelector('[data-msg-t]').textContent = titulo || '';
        m.querySelector('[data-msg-x]').textContent = texto || '';
        m.classList.remove('nuevo'); void m.offsetWidth; m.classList.add('nuevo');
        if (voz) CH.hablar({ t: [titulo, texto].filter(Boolean).join(' ') });
      },
      cuenta(t) { const c = hoja.querySelector('[data-cuenta]'); if (c) c.textContent = t; },
      acierto(el, n = 8) { seguidos = 0; CH.sonido('bien'); if (el) CH.chispas(el, n); },
      fallo() { errores++; seguidos++; CH.sonido('casi'); return seguidos; },
      // Estrellas por errores: hasta a errores = 3, hasta b = 2, más = 1.
      porErrores(a = 1, b = 3) { return errores <= a ? 3 : errores <= b ? 2 : 1; },
      alSalir(fn) { parar.push(fn); },
      bucle(fn) {
        let ult = performance.now(), id = 0, vivo = true;
        const paso = t => {
          if (!vivo) return;
          if (!document.body.contains(tablero) || terminado) { vivo = false; return; }
          const dt = Math.min(64, t - ult); ult = t;
          if (!api.pausado && !document.querySelector('.velo') && !document.hidden) fn(dt);
          id = requestAnimationFrame(paso);
        };
        id = requestAnimationFrame(paso);
        parar.push(() => { vivo = false; cancelAnimationFrame(id); });
      },
      ganar(estrellas, resumen = '') { ganar(estrellas, resumen); }
    };

    function ganar(estrellas, resumen) {
      if (terminado) return; terminado = true; detener();
      tablero.setAttribute('inert', ''); tablero.classList.add('jg-listo');
      const G = CH.E.juegos[def.id] || (CH.E.juegos[def.id] = {});
      G[n] = Math.max(G[n] || 0, estrellas);
      const cromo = n === NIVELES && CH.ganarCromo('juego-' + def.id);
      CH.guardar();
      const tit = estrellas === 3 ? CH.azar(['¡Perfecto!', '¡Tres chispas!', '¡Lo hiciste genial!']) : estrellas === 2 ? '¡Nivel superado!' : '¡Lo lograste!';
      const consejo = estrellas < 3 ? (def.consejo || 'Juégalo otra vez para ganar más chispas.') : '';
      CH.sonido(cromo ? 'cromo' : 'estrella');
      ctrl.innerHTML = '';
      const m = hoja.querySelector('[data-msg]'); if (m) m.remove();
      const fin = document.createElement('div'); fin.className = 'jg-fin'; fin.setAttribute('role', 'status');
      fin.innerHTML = `${CH.estrellasHTML(estrellas)}<h2 class="hoja-titulo">${esc(tit)}</h2>${resumen ? `<p>${esc(resumen)}</p>` : ''}${consejo ? `<p class="t-nota">${esc(consejo)}</p>` : ''}
        ${cromo ? `<p class="jg-cromo">${I.estrella}<span>¡Ganaste el cromo «${esc(def.info.nombre)}»! Ya está en tu álbum.</span></p>` : ''}
        ${dentro && n < NIVELES ? `<p class="t-nota">Hay ${NIVELES} niveles. Los demás los juegas desde la zona ${esc(Z.nombre)}.</p>` : ''}`;
      ctrl.before(fin);
      setTimeout(() => CH.chispas(fin.querySelector('.estrellas'), 16), 60);
      const voz = { t: [tit, resumen, cromo ? '¡Ganaste un cromo!' : ''].filter(Boolean).join(' ') };
      if (dentro) { dentro.seguir(dentro.terminar, { texto: 'Seguir', voz, auto: false }); return; }
      const acc = hoja.querySelector('[data-acciones]');
      acc.innerHTML = `${n < NIVELES ? `<a class="btn btn-primario" href="#juego/${def.id}/${n + 1}">Siguiente nivel</a>` : `<a class="btn btn-primario" href="#album">Ver mi álbum</a>`}
        <button class="btn btn-borde" data-otra>Jugar otra vez</button><a class="btn-texto" href="#juego/${def.id}">Ver los niveles</a>`;
      acc.querySelector('[data-otra]').addEventListener('click', () => jugarNivel(def, n, null));
      const f = acc.querySelector('.btn'); if (f) f.focus({ preventScroll: true });
      CH.hablar(voz);
    }

    def.crear(api);
    return api;
  }

  function pausa(def, n) {
    CH.callar();
    const d = CH.dialogo(`<h2 class="t-sub">Pausa</h2><p>El juego te espera. No hay prisa.</p>
      <div class="acciones-dlg"><button class="btn btn-primario" data-seguir>Seguir</button><button class="btn btn-borde" data-otra>Empezar el nivel otra vez</button>
      <a class="btn btn-borde" href="#juego/${def.id}">Elegir otro nivel</a><a class="btn-texto" href="#barrio">Salir al barrio</a></div>`, 'Pausa');
    d.querySelector('[data-seguir]').addEventListener('click', () => CH.cerrarDialogo());
    d.querySelector('[data-otra]').addEventListener('click', () => { CH.cerrarDialogo(); jugarNivel(def, n, null); });
  }

  /* =========================================================
     PANTALLA DE NIVELES: #juego/<id>  ·  #juego/<id>/<n> juega ese nivel
     ========================================================= */
  CH.PANTALLAS.juego = param => {
    const [id, nS] = String(param || '').split('/');
    const def = J[id];
    if (!def) return CH.ir('#barrio');
    if (!P.juegoAbierto(id)) return CH.ir('#zona/' + def.info.zona);
    if (nS) {
      const n = +nS;
      if (n >= 1 && n <= NIVELES && P.nivelAbierto(id, n)) { jugarNivel(def, n, null); return; }
      return CH.ir('#juego/' + id);
    }
    const z = CH.zona(def.info.zona), G = CH.E.juegos[id] || {}, total = P.estrellasDe(id);
    let sig = 1; for (let k = 1; k <= NIVELES; k++) { if (!G[k]) { sig = k; break; } sig = k; }
    const todos = Object.keys(G).length === NIVELES;
    if (todos) { const mejorable = [...Array(NIVELES)].map((_, i) => i + 1).find(k => G[k] < 3); sig = mejorable || NIVELES; }
    const nivelesHTML = [...Array(NIVELES)].map((_, i) => {
      const k = i + 1, e = G[k] || 0, abierto = P.nivelAbierto(id, k);
      const et = !abierto ? `Nivel ${k}, se abre al superar el ${k - 1}` : e ? `Nivel ${k}, ${e} de 3 chispas` : `Nivel ${k}, sin jugar`;
      const dentroHTML = `<b>${k}</b>${abierto ? `<span class="mini-est" aria-hidden="true">${[0, 1, 2].map(j => j < e ? I.estrella : I.estrellaVacia).join('')}</span>` : `<span class="candado" aria-hidden="true">${I.candado}</span>`}`;
      return `<li>${abierto ? `<a class="nivel-j ${e ? 'jugado' : ''} ${k === sig ? 'sugerido' : ''}" href="#juego/${id}/${k}" aria-label="${et}">${dentroHTML}</a>` : `<span class="nivel-j cerrado" role="img" aria-label="${et}">${dentroHTML}</span>`}</li>`;
    }).join('');
    const quienFig = def.quien === 'cocuyo' ? CH.cocuyo('celebrando', 'zona-quien') : CH.personaje(def.quien, 'zona-quien');
    CH.pintar(`<div class="pantalla zona-p juego-sel" style="--z:${z.color};--zt:${z.tinta}">
      <header class="zona-cab"><a class="btn-redondo" href="#zona/${z.id}" aria-label="Volver a ${esc(z.nombre)}">${I.atras}</a>
        <div class="crece"><span class="zona-et-c">Minijuego · ${esc(z.nombre)}</span><h1 class="t-titulo">${esc(def.info.nombre)}</h1></div></header>
      <div class="zona-heroe" aria-hidden="true">${CH.fondo(z.id, 'zona-fondo')}${quienFig}</div>
      <p class="como-j">${esc(CH.texto(def.como))}</p>
      <ol class="niveles-j" aria-label="Niveles">${nivelesHTML}</ol>
      <p class="t-nota">${total} de ${NIVELES * 3} chispas. Supera el nivel 8 y ganas un cromo.</p>
      <a class="btn btn-primario" href="#juego/${id}/${sig}">${todos ? (G[sig] < 3 ? 'Mejorar el nivel ' + sig : 'Jugar el nivel 8 otra vez') : sig === 1 && !G[1] ? '¡A jugar!' : 'Jugar el nivel ' + sig}</a>
    </div>${CH.nav ? CH.nav('barrio') : ''}`, { voz: { t: def.info.nombre + '. ' + CH.texto(def.como) } });
  };
})();
