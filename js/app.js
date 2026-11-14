/* chispa · app. Sin cuentas ni servidor: el progreso vive solo en este celular (localStorage). */
'use strict';
(() => {
  const C = window.CONTENIDO, A = window.ARTE;
  const $main = document.getElementById('principal');
  const $anuncio = document.getElementById('anuncio');
  const CLAVE = 'chispa-v1';

  /* ---------- Estado ---------- */
  const base = { visto: false, apodo: '', nivel: 'explorador', hechos: [], misiones: {}, inventos: [], voz: true, letra: 'normal', movimiento: 'normal', sesion: { dia: '', n: 0, descanso: false }, completoVisto: false };
  let E = cargar();
  function cargar() {
    try { const g = JSON.parse(localStorage.getItem(CLAVE)); return Object.assign({}, base, g || {}); } catch (e) { return Object.assign({}, base); }
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (e) { /* sin almacenamiento: la app sigue */ } }
  function hoy() { return new Date().toISOString().slice(0, 10); }
  function aplicarAjustes() {
    document.documentElement.dataset.letra = E.letra;
    document.documentElement.dataset.movimiento = E.movimiento;
  }
  aplicarAjustes();

  /* ---------- Utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const azar = arr => arr[Math.floor(Math.random() * arr.length)];
  const mezclar = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const anunciar = t => { $anuncio.textContent = ''; setTimeout(() => { $anuncio.textContent = t; }, 30); };
  const ICON = {
    audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    atras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    chispa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 C12.7 7.6 16.4 11.3 22 12 C16.4 12.7 12.7 16.4 12 22 C11.3 16.4 7.6 12.7 2 12 C7.6 11.3 11.3 7.6 12 2 Z" fill="#FFB627" stroke="#2B211D" stroke-width="1.6"/></svg>',
    casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>',
    candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    blanca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7 10"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7L19 13"/><path d="m14 16-3 3 3 3"/><path d="M8.3 13.3 7 10l-3.3 1.3"/><path d="m9.3 5.7 1.4-2.4a1.8 1.8 0 0 1 3.1 0L16 7"/><path d="m13.4 7.6 2.6-.6.7 2.6"/></svg>',
    negra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11l4 5M14 11l-4 5"/></svg>',
    verde: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.5-.5 4.6-2 5.8-4"/></svg>',
    especial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="6" width="10" height="15" rx="2"/><path d="M10 3h4v3h-4z"/><path d="M12 10v6M9 13h6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1F7A5C"/><path d="M7 12.5 L10.5 16 L17 8.5" stroke="#FFFFFF" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const coc = (exp, cls = '') => `<div class="cocuyo ${cls}">${A.cocuyo[exp]}</div>`;
  const obj = k => (k && k.startsWith('cocuyo:')) ? A.cocuyo[k.slice(7)] : (A.obj[k] || '');

  /* ---------- Voz ---------- */
  let audio = null;
  function hablar(id) {
    callar();
    if (!E.voz || !id) return;
    try {
      audio = new Audio('audio/' + id + '.mp3');
      audio.volume = 0.9;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* sin voz: el texto sigue en pantalla */ }
  }
  function callar() { if (audio) { try { audio.pause(); } catch (e) {} audio = null; } }

  /* ---------- Sonidos cortos (sintetizados, sin archivos) ---------- */
  let ctx = null;
  function sonido(tipo) {
    if (!E.voz) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notas = { bien: [660, 880], casi: [440, 392], toque: [520], enciende: [523, 659, 784, 1047] }[tipo] || [600];
      notas.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3);
      });
    } catch (e) {}
  }

  /* ---------- Render ---------- */
  function pintar(html, voz) {
    callar();
    $main.innerHTML = html;
    $main.scrollTop = 0; window.scrollTo(0, 0);
    const h = $main.querySelector('h1, .t-display, .t-titulo');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (voz) setTimeout(() => hablar(voz), 250);
  }
  function on(sel, ev, fn) { $main.querySelectorAll(sel).forEach(el => el.addEventListener(ev, fn)); }
  const ir = h => { if (location.hash === h) ruta(); else location.hash = h; };

  /* ---------- Rutas ---------- */
  function ruta() {
    const h = location.hash.replace('#', '') || 'barrio';
    if (!E.visto && h !== 'adultos') return bienvenida(0);
    if (h === 'misiones') return misiones();
    if (h === 'adultos') return adultos();
    const m = h.match(/^m([1-5])$/);
    if (m) return modulo(+m[1]);
    barrio();
  }
  window.addEventListener('hashchange', ruta);

  /* ---------- Navegación inferior ---------- */
  function nav(actual) {
    const it = (h, txt, ic) => `<a href="#${h}" ${actual === h ? 'aria-current="page"' : ''}>${ic}${txt}</a>`;
    return `<nav class="nav" aria-label="Secciones">${it('barrio', 'Barrio', ICON.chispa)}${it('misiones', 'Misiones', ICON.casa)}${it('adultos', 'Adultos', ICON.candado)}</nav>`;
  }

  /* ================= BIENVENIDA ================= */
  function bienvenida(paso) {
    const B = C.bienvenida;
    if (paso < 3) {
      const f = B[paso];
      pintar(`<div class="pantalla">
        <div class="barra"><span class="logo crece">${A.logo}</span><button class="btn-redondo" data-voz aria-label="Escuchar">${ICON.audio}</button></div>
        ${coc(paso === 0 ? 'hola' : paso === 1 ? 'idea' : 'bien', 'grande')}
        <h1 class="t-display" style="text-align:center">${esc(f.texto)}</h1>
        <div class="puntos" aria-hidden="true">${[0, 1, 2].map(i => `<i class="${i <= paso ? 'si' : ''}"></i>`).join('')}</div>
        <div class="abajo"><button class="btn btn-primario" data-sig>${paso < 2 ? 'Siguiente' : '¡Vamos!'}</button></div>
      </div>`, f.voz);
      on('[data-voz]', 'click', () => hablar(f.voz));
      on('[data-sig]', 'click', () => { sonido('toque'); bienvenida(paso + 1); });
      return;
    }
    if (paso === 3) {
      const sug = ['Inventora', 'Inventor', 'Chispita', 'Genio verde'];
      pintar(`<div class="pantalla">
        <div class="barra"><button class="btn-redondo suave" data-atras aria-label="Atrás">${ICON.atras}</button><span class="crece"></span><button class="btn-redondo" data-voz aria-label="Escuchar">${ICON.audio}</button></div>
        <div class="habla">${coc('hola', 'mini')}<p class="globo">${esc(B[3].texto)}</p></div>
        <h1 class="t-titulo">Tu apodo de inventor</h1>
        <div class="apodos" role="group" aria-label="Apodos sugeridos">${sug.map(s => `<button type="button" aria-pressed="${E.apodo === s}" data-ap="${esc(s)}">${esc(s)}</button>`).join('')}</div>
        <div class="campo"><label for="apodo">O escribe uno</label><input id="apodo" maxlength="14" autocomplete="off" autocapitalize="words" value="${esc(E.apodo)}" placeholder="Máximo 14 letras"></div>
        <p class="t-nota">No uses tu nombre completo. Tu apodo solo se guarda en este celular.</p>
        <div class="abajo"><button class="btn btn-primario" data-sig>Siguiente</button></div>
      </div>`, B[3].voz);
      const inp = $main.querySelector('#apodo');
      on('[data-ap]', 'click', ev => { inp.value = ev.currentTarget.dataset.ap; $main.querySelectorAll('[data-ap]').forEach(b => b.setAttribute('aria-pressed', b === ev.currentTarget)); });
      on('[data-voz]', 'click', () => hablar(B[3].voz));
      on('[data-atras]', 'click', () => bienvenida(2));
      on('[data-sig]', 'click', () => { E.apodo = inp.value.trim().slice(0, 14) || 'Inventor'; guardar(); bienvenida(4); });
      return;
    }
    elegirNivel(() => { E.visto = true; guardar(); ir('#barrio'); });
  }
  function elegirNivel(listo) {
    pintar(`<div class="pantalla">
      <div class="barra"><span class="crece"></span><button class="btn-redondo" data-voz aria-label="Escuchar">${ICON.audio}</button></div>
      <h1 class="t-titulo">${esc(C.nivel.texto)}</h1>
      <div class="opciones">
        <button class="opcion" data-n="explorador" aria-pressed="${E.nivel === 'explorador'}">${coc('hola', 'mini')}<span><b>Explorador</b><br><span class="t-nota">8 a 10 años · retos para empezar</span></span></button>
        <button class="opcion" data-n="experto" aria-pressed="${E.nivel === 'experto'}">${coc('idea', 'mini')}<span><b>Experto</b><br><span class="t-nota">11 y 12 años · retos con trampas</span></span></button>
      </div>
      <div class="abajo"><button class="btn btn-primario" data-ok>Listo</button></div>
    </div>`, C.nivel.voz);
    on('[data-voz]', 'click', () => hablar(C.nivel.voz));
    on('[data-n]', 'click', ev => { E.nivel = ev.currentTarget.dataset.n; $main.querySelectorAll('[data-n]').forEach(b => b.setAttribute('aria-pressed', b.dataset.n === E.nivel)); sonido('toque'); });
    on('[data-ok]', 'click', () => { guardar(); listo(); });
  }

  /* ================= BARRIO (inicio) ================= */
  function barrio() {
    const n = E.hechos.length;
    const sig = C.modulos.find(m => !E.hechos.includes(m.id));
    const tarjeta = sig
      ? `<div class="tarjeta siguiente"><div class="crece"><span class="t-nota">${n === 0 ? 'Tu primer invento' : 'Siguiente invento'}</span><span class="t-sub">${esc(sig.titulo)}</span></div><a class="btn btn-primario" href="#m${sig.id}">${n === 0 ? 'Empezar' : 'Seguir'}</a></div>`
      : `<div class="tarjeta siguiente"><div class="crece"><span class="t-nota">Barrio completo</span><span class="t-sub">Inventa algo nuevo</span></div><a class="btn btn-primario" href="#m5">Taller</a></div>`;
    const repaso = n ? `<div class="fila" style="flex-wrap:wrap;gap:8px" aria-label="Volver a jugar">${C.modulos.filter(m => E.hechos.includes(m.id)).map(m => `<a class="btn btn-borde" style="min-height:48px;padding:0 14px;font-size:15px" href="#m${m.id}">${m.id}. ${esc(m.titulo)}</a>`).join('')}</div>` : '';
    pintar(`<div class="pantalla">
      <div class="barra"><span class="logo crece">${A.logo}</span></div>
      <div class="fila" style="align-items:baseline;justify-content:space-between"><h1 class="t-titulo">${E.apodo ? 'Tu barrio, ' + esc(E.apodo) : 'Tu barrio'}</h1><span class="t-nota">${n} de 5</span></div>
      <div class="barrio" role="img" aria-label="Tu barrio de noche: ${n} de 5 partes encendidas">${A.barrio[n]}</div>
      ${tarjeta}
      ${repaso}
    </div>${nav('barrio')}`);
  }

  /* ================= MÓDULO ================= */
  const ILUS = {
    1: ['bolsa', 'bolsa', 'casa', 'botella', 'servilleta', 'banano', 'cocuyo:idea'],
    2: ['bolsa', 'reciclador', 'reciclador', 'eca', 'fabrica', 'bolsa', 'cocuyo:idea'],
    3: ['hoja', 'cocuyo:casi', 'botella', 'pez', 'bolsa', 'hoja', 'cocuyo:idea'],
    4: ['cocuyo:pensando', 'fabrica', 'sol', 'panel', 'molino', 'bateria', 'cocuyo:idea'],
    5: ['cocuyo:bien', 'cocuyo:idea', 'cocuyo:pensando', 'casa', 'luciernaga']
  };
  function modulo(id) {
    const M = C.modulos[id - 1];
    // Solo se abre el siguiente módulo o uno ya hecho.
    const sig = C.modulos.find(m => !E.hechos.includes(m.id));
    if (!E.hechos.includes(id) && sig && sig.id !== id) return ir('#barrio');
    const pasos = ['historia', 'juego', 'dato', 'mision'];
    let paso = 0;
    const cab = (i, voz) => `<div class="barra"><a class="btn-redondo suave" href="#barrio" aria-label="Salir al barrio">${ICON.cerrar}</a><div class="progreso" role="progressbar" aria-label="Avance del módulo" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${i}"><i style="width:${(i / 4) * 100}%"></i></div><button class="btn-redondo" data-voz aria-label="Escuchar">${ICON.audio}</button></div>`;
    const siguiente = () => { paso++; mostrar(); };
    function mostrar() {
      const p = pasos[paso];
      if (p === 'historia') historia(M, cab, siguiente);
      else if (p === 'juego') juego(M, cab, siguiente);
      else if (p === 'dato') dato(M, cab, siguiente);
      else if (p === 'mision') mision(M, cab, () => terminar(M));
    }
    mostrar();
  }

  /* ---- Historia ---- */
  function historia(M, cab, listo) {
    let i = 0;
    const H = M.historia;
    function frase() {
      const f = H[i];
      pintar(`<div class="pantalla">${cab(0)}
        <p class="t-nota">Módulo ${M.id} · ${esc(M.titulo)}</p>
        <div class="escena"><div class="ilus">${obj(ILUS[M.id][i])}</div><p class="frase">${esc(f.texto)}</p></div>
        <div class="puntos" aria-hidden="true">${H.map((_, k) => `<i class="${k <= i ? 'si' : ''}"></i>`).join('')}</div>
        <div class="abajo"><button class="btn btn-primario" data-sig>${i < H.length - 1 ? 'Siguiente' : '¡A jugar!'}</button>${i > 0 ? '<button class="btn-texto" data-atras>Volver a la frase anterior</button>' : ''}</div>
      </div>`, f.voz);
      on('[data-voz]', 'click', () => hablar(f.voz));
      on('[data-sig]', 'click', () => { sonido('toque'); if (i < H.length - 1) { i++; frase(); } else listo(); });
      on('[data-atras]', 'click', () => { i--; frase(); });
    }
    frase();
  }

  /* ---- Juegos ---- */
  function juego(M, cab, listo) {
    const J = M.juego, nivel = E.nivel;
    if (J.tipo === 'clasificar') return clasificar(M, J[nivel], nivel === 'experto', cab, listo);
    if (J.tipo === 'ordenar') return nivel === 'experto' ? elegir(M, J.experto, cab, listo) : ordenar(M, J.explorador, cab, listo);
    if (J.tipo === 'atrapar') return atrapar(M, J[nivel], cab, () => nivel === 'experto' ? preguntas(M, J.experto.preguntas, cab, listo) : listo());
    if (J.tipo === 'energia') return energia(M, J[nivel], J.fuentes, cab, listo);
    if (J.tipo === 'inventar') return inventar(M, J, cab, listo);
  }

  function respuestaHTML(bien, titulo, texto) {
    return `<div class="respuesta ${bien ? 'bien' : 'casi'}" role="status">${coc(bien ? 'bien' : 'casi')}<div><p class="titulo">${esc(titulo)}</p><p>${esc(texto)}</p></div></div>`;
  }

  /* Clasificar (módulo 1) */
  function clasificar(M, items, experto, cab, listo) {
    const lista = mezclar(items); let k = 0, intentos = 0;
    const tipos = experto ? ['blanca', 'negra', 'verde', 'especial'] : ['blanca', 'negra', 'verde'];
    const etiqueta = { blanca: ['Blanca', 'reciclable'], negra: ['Negra', 'no reciclable'], verde: ['Verde', 'orgánico'], especial: ['Punto especial', 'ninguna caneca'] };
    const pref = 'm' + M.id + (experto ? '-x-' : '-e-');
    function uno() {
      const it = lista[k]; intentos = 0;
      pintar(`<div class="pantalla">${cab(1)}
        <h1 class="t-titulo">${esc(M.juego.instruccion.texto)}</h1>
        <div class="objeto entra"><div class="ilus">${obj(it.id)}</div><p class="nombre">${esc(it.nombre)}</p></div>
        <p class="t-nota" style="text-align:center">${k + 1} de ${lista.length}</p>
        <div data-resp></div>
        <div class="canecas abajo" role="group" aria-label="Canecas">${tipos.map(t => `<button class="caneca" data-c="${t}">${ICON[t]}<span><b>${etiqueta[t][0]}</b> · ${etiqueta[t][1]}</span></button>`).join('')}</div>
      </div>`, k === 0 ? M.juego.instruccion.voz : null);
      on('[data-voz]', 'click', () => hablar(M.juego.instruccion.voz));
      on('.caneca', 'click', ev => {
        const b = ev.currentTarget, c = b.dataset.c, resp = $main.querySelector('[data-resp]');
        if (c === it.caneca) {
          b.classList.add('bien'); sonido('bien');
          const t = azar(C.comunes.bien);
          resp.innerHTML = respuestaHTML(true, t.texto, it.si); anunciar(t.texto + ' ' + it.si);
          hablar(pref + it.id + '-si');
          $main.querySelectorAll('.caneca').forEach(x => { x.disabled = true; });
          const sig = document.createElement('button'); sig.className = 'btn btn-oscuro'; sig.textContent = k < lista.length - 1 ? 'Siguiente' : 'Terminar';
          sig.addEventListener('click', () => { k++; if (k < lista.length) uno(); else listo(); });
          $main.querySelector('.canecas').replaceWith(sig); sig.focus();
        } else {
          intentos++; b.classList.add('casi'); b.disabled = true; sonido('casi');
          resp.innerHTML = respuestaHTML(false, '¡Casi!', it.casi); anunciar('Casi. ' + it.casi);
          hablar(pref + it.id + '-casi');
        }
      });
    }
    uno();
  }

  /* Ordenar (módulo 2, Explorador) */
  function ordenar(M, pasos, cab, listo) {
    const desorden = mezclar(pasos); let n = 0;
    pintar(`<div class="pantalla">${cab(1)}
      <h1 class="t-titulo">${esc(M.juego.instruccion.texto)}</h1>
      <p class="t-nota">Toca los pasos en orden, del primero al último.</p>
      <ol class="ruta" aria-label="El viaje">${pasos.map((_, i) => `<li class="paso" data-hueco="${i}"><span class="num">${i + 1}</span><span>…</span></li>`).join('')}</ol>
      <div data-resp></div>
      <div class="opciones abajo">${desorden.map(p => `<button class="opcion" data-p="${p.id}"><span class="ilus">${obj(p.id)}</span><span>${esc(p.nombre)}</span></button>`).join('')}</div>
    </div>`, M.juego.instruccion.voz);
    on('[data-voz]', 'click', () => hablar(M.juego.instruccion.voz));
    on('[data-p]', 'click', ev => {
      const b = ev.currentTarget, p = pasos.find(x => x.id === b.dataset.p), resp = $main.querySelector('[data-resp]');
      if (p === pasos[n]) {
        const hueco = $main.querySelector(`[data-hueco="${n}"]`);
        hueco.classList.add('lleno'); hueco.lastElementChild.textContent = p.nombre;
        b.remove(); sonido('bien'); resp.innerHTML = '';
        hablar('m' + M.id + '-e-' + p.id + '-si'); anunciar(p.si);
        n++;
        if (n === pasos.length) {
          resp.innerHTML = respuestaHTML(true, '¡Eso es!', 'Así viaja una botella cuando se separa bien.');
          const sig = document.createElement('button'); sig.className = 'btn btn-oscuro'; sig.textContent = 'Seguir';
          sig.addEventListener('click', listo); $main.querySelector('.opciones').replaceWith(sig); sig.focus();
        }
      } else {
        sonido('casi'); b.classList.add('casi'); setTimeout(() => b.classList.remove('casi'), 700);
        resp.innerHTML = respuestaHTML(false, '¡Casi!', '¿Qué pasa justo después? Piensa en el orden.'); anunciar('Casi. Piensa en el orden.');
        hablar(azar(C.comunes.casi).voz);
      }
    });
  }

  /* Elegir 4R (módulo 2, Experto) */
  function elegir(M, X, cab, listo) {
    const casos = mezclar(X.casos); let k = 0;
    function uno() {
      const c = casos[k];
      pintar(`<div class="pantalla">${cab(1)}
        <h1 class="t-titulo">${esc(X.instruccion.texto)}</h1>
        <div class="tarjeta" style="font-weight:600;font-size:20px">${esc(c.nombre)}</div>
        <p class="t-nota">${k + 1} de ${casos.length}</p>
        <div data-resp></div>
        <div class="opciones dos abajo">${X.opciones.map(o => `<button class="opcion" style="justify-content:center;text-align:center" data-o="${o}">${o}</button>`).join('')}</div>
      </div>`, k === 0 ? X.instruccion.voz : null);
      on('[data-voz]', 'click', () => hablar(X.instruccion.voz));
      on('[data-o]', 'click', ev => {
        const b = ev.currentTarget, resp = $main.querySelector('[data-resp]');
        if (b.dataset.o === c.correcta) {
          b.classList.add('bien'); sonido('bien');
          resp.innerHTML = respuestaHTML(true, azar(C.comunes.bien).texto, c.si); anunciar(c.si); hablar('m' + M.id + '-x-' + c.id + '-si');
          const sig = document.createElement('button'); sig.className = 'btn btn-oscuro'; sig.textContent = k < casos.length - 1 ? 'Siguiente' : 'Terminar';
          sig.addEventListener('click', () => { k++; if (k < casos.length) uno(); else listo(); });
          $main.querySelector('.opciones').replaceWith(sig); sig.focus();
        } else {
          b.classList.add('casi'); b.disabled = true; sonido('casi');
          resp.innerHTML = respuestaHTML(false, '¡Casi!', c.casi); anunciar(c.casi); hablar('m' + M.id + '-x-' + c.id + '-casi');
        }
      });
    }
    uno();
  }

  /* Atrapar (módulo 3) */
  function atrapar(M, cfg, cab, listo) {
    pintar(`<div class="pantalla">${cab(1)}
      <h1 class="t-titulo" style="font-size:22px">${esc(M.juego.instruccion.texto)}</h1>
      <div class="marcador" aria-live="polite"><span data-at>Atrapaste 0</span><span data-es>Se escaparon 0</span></div>
      <div class="arroyo" data-arroyo><div class="manglar">${A.obj.hoja.replace('<svg', '<svg width="22" height="22"')}Manglar</div></div>
      <div data-resp></div>
      <div class="abajo"><button class="btn btn-primario" data-ini>Empezar</button></div>
    </div>`, M.juego.instruccion.voz);
    on('[data-voz]', 'click', () => hablar(M.juego.instruccion.voz));
    const $a = $main.querySelector('[data-arroyo]');
    let atrapadas = 0, escapadas = 0, total = 0, vivos = 0, fin = false;
    const lentitud = (E.movimiento === 'menos' || matchMedia('(prefers-reduced-motion: reduce)').matches) ? 1.5 : 1;
    function soltar() {
      if (total >= cfg.cantidad || fin) return;
      total++; vivos++;
      const natural = Math.random() < 0.28;
      const tipo = natural ? azar(cfg.natural) : azar(cfg.basura);
      const b = document.createElement('button');
      b.className = 'flota' + (natural ? ' natural' : '');
      b.setAttribute('aria-label', natural ? (tipo === 'pez' ? 'Pez' : tipo === 'hoja' ? 'Hoja' : 'Semilla') : 'Basura: ' + tipo);
      b.innerHTML = obj(tipo);
      const ancho = $a.clientWidth - 64;
      b.style.left = Math.round(Math.random() * ancho) + 'px';
      $a.appendChild(b);
      const dur = (7000 / cfg.velocidad) * lentitud, alto = $a.clientHeight * 0.82 - 64;
      const t0 = performance.now(); let vivo = true;
      function paso(t) {
        if (!vivo) return;
        const r = Math.min(1, (t - t0) / dur);
        b.style.transform = `translateY(${r * alto}px) rotate(${Math.sin(r * 9) * 8}deg)`;
        if (r < 1) requestAnimationFrame(paso);
        else { vivo = false; b.remove(); vivos--; if (!natural) { escapadas++; $main.querySelector('[data-es]').textContent = 'Se escaparon ' + escapadas; } revisar(); }
      }
      requestAnimationFrame(paso);
      b.addEventListener('click', () => {
        if (!vivo) return;
        if (natural) { sonido('casi'); $main.querySelector('[data-resp]').innerHTML = respuestaHTML(false, '¡Ese déjalo!', tipo === 'pez' ? 'Los peces viven en el agua.' : 'Las hojas y semillas son parte del río.'); return; }
        vivo = false; b.classList.add('atrapada'); sonido('bien'); atrapadas++; vivos--;
        $main.querySelector('[data-at]').textContent = 'Atrapaste ' + atrapadas;
        setTimeout(() => b.remove(), 360); revisar();
      });
    }
    function revisar() {
      if (total >= cfg.cantidad && vivos === 0 && !fin) {
        fin = true;
        const basura = atrapadas + escapadas;
        $main.querySelector('[data-resp]').innerHTML = respuestaHTML(true, `Atrapaste ${atrapadas} de ${basura}`, escapadas ? 'Lo que se escapa llega a la ciénaga. Por eso la trampa del arroyo ayuda tanto.' : '¡No se escapó nada! El manglar está a salvo.');
        const b = $main.querySelector('[data-ini]'); b.textContent = 'Seguir'; b.disabled = false; b.onclick = listo; b.focus();
      }
    }
    on('[data-ini]', 'click', ev => {
      if (fin) return;
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Atrapa la basura…';
      soltar(); const iv = setInterval(() => { if (total >= cfg.cantidad || !document.body.contains($a)) clearInterval(iv); else soltar(); }, 1500 / cfg.velocidad * lentitud);
    });
  }

  /* Preguntas (módulo 3, Experto) */
  function preguntas(M, Q, cab, listo) {
    let k = 0;
    function una() {
      const q = Q[k];
      pintar(`<div class="pantalla">${cab(1)}
        <h1 class="t-titulo">${esc(q.texto)}</h1>
        <div data-resp></div>
        <div class="opciones abajo">${q.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      </div>`, q.voz);
      on('[data-voz]', 'click', () => hablar(q.voz));
      on('[data-i]', 'click', ev => {
        const b = ev.currentTarget, resp = $main.querySelector('[data-resp]');
        if (+b.dataset.i === q.correcta) {
          b.classList.add('bien'); sonido('bien'); resp.innerHTML = respuestaHTML(true, azar(C.comunes.bien).texto, q.si); anunciar(q.si); hablar('m' + M.id + '-q-' + q.id + '-si');
          const sig = document.createElement('button'); sig.className = 'btn btn-oscuro'; sig.textContent = 'Seguir';
          sig.addEventListener('click', () => { k++; if (k < Q.length) una(); else listo(); });
          $main.querySelector('.opciones').replaceWith(sig); sig.focus();
        } else { b.classList.add('casi'); b.disabled = true; sonido('casi'); resp.innerHTML = respuestaHTML(false, '¡Casi!', q.casi); anunciar(q.casi); hablar('m' + M.id + '-q-' + q.id + '-casi'); }
      });
    }
    una();
  }

  /* Energía (módulo 4) */
  function energia(M, casos, F, cab, listo) {
    let k = 0;
    const pref = 'm' + M.id + (E.nivel === 'experto' ? '-x-' : '-e-');
    function uno() {
      const c = casos[k];
      const noche = /noche/i.test(c.nombre), brisa = /brisa/i.test(c.nombre), nublado = /nublado/i.test(c.nombre);
      const ilus = noche ? 'cocuyo:descansa' : nublado ? 'cocuyo:pensando' : 'sol';
      pintar(`<div class="pantalla">${cab(1)}
        <h1 class="t-titulo">${esc(M.juego.instruccion.texto)}</h1>
        <div class="cielo ${noche ? 'noche' : 'dia'}"><span class="ilus">${obj(brisa ? 'molino' : ilus)}</span><span>${esc(c.nombre)}</span></div>
        <p class="t-nota">${k + 1} de ${casos.length}</p>
        <div data-resp></div>
        <div class="opciones tres abajo">${Object.entries(F).map(([id, n]) => `<button class="opcion" data-f="${id}"><span class="ilus">${obj(id)}</span>${esc(n)}</button>`).join('')}</div>
      </div>`, k === 0 ? M.juego.instruccion.voz : null);
      on('[data-voz]', 'click', () => hablar(M.juego.instruccion.voz));
      on('[data-f]', 'click', ev => {
        const b = ev.currentTarget, resp = $main.querySelector('[data-resp]');
        if (b.dataset.f === c.correcta) {
          b.classList.add('bien'); sonido('bien'); resp.innerHTML = respuestaHTML(true, azar(C.comunes.bien).texto, c.si); anunciar(c.si); hablar(pref + c.id + '-si');
          const sig = document.createElement('button'); sig.className = 'btn btn-oscuro'; sig.textContent = k < casos.length - 1 ? 'Siguiente' : 'Terminar';
          sig.addEventListener('click', () => { k++; if (k < casos.length) uno(); else listo(); });
          $main.querySelector('.opciones').replaceWith(sig); sig.focus();
        } else { b.classList.add('casi'); b.disabled = true; sonido('casi'); resp.innerHTML = respuestaHTML(false, '¡Casi!', c.casi); anunciar(c.casi); hablar(pref + c.id + '-casi'); }
      });
    }
    uno();
  }

  /* Inventar (módulo 5) */
  function inventar(M, J, cab, listo) {
    const pasos = J.pasos.concat(E.nivel === 'experto' ? [J.experto] : []);
    const elegido = {}; let k = 0;
    function uno() {
      const p = pasos[k];
      pintar(`<div class="pantalla">${cab(1)}
        <div class="habla">${coc('pensando', 'mini')}<p class="globo">Paso ${k + 1} de ${pasos.length}</p></div>
        <h1 class="t-titulo">${esc(p.texto)}</h1>
        <div class="opciones">${p.opciones.map(o => `<button class="opcion" data-o="${o.id}" aria-pressed="false">${esc(o.nombre)}</button>`).join('')}</div>
        <div class="abajo"><button class="btn btn-primario" data-sig disabled>Siguiente</button></div>
      </div>`, p.voz);
      on('[data-voz]', 'click', () => hablar(p.voz));
      on('[data-o]', 'click', ev => { elegido[p.id] = p.opciones.find(o => o.id === ev.currentTarget.dataset.o); $main.querySelectorAll('[data-o]').forEach(b => b.setAttribute('aria-pressed', b === ev.currentTarget)); sonido('toque'); $main.querySelector('[data-sig]').disabled = false; });
      on('[data-sig]', 'click', () => { k++; if (k < pasos.length) uno(); else resultado(); });
    }
    function resultado() {
      const nombre = `${elegido.tecno.nombre} de ${E.apodo || 'un inventor'}`;
      const inv = { nombre, problema: elegido.problema.nombre, para: elegido.quien.nombre, medir: elegido.medir ? elegido.medir.nombre : '', fecha: hoy() };
      E.inventos.push(inv); guardar(); sonido('enciende');
      pintar(`<div class="pantalla">${cab(1)}
        ${coc('bien', 'grande')}
        <div class="invento"><span class="t-nota" style="color:#FFD98A">Tu invento</span><span class="nombre">${esc(nombre)}</span>
          <p>Resuelve: <b>${esc(inv.problema.toLowerCase())}</b>.</p><p>Es para: <b>${esc(inv.para.toLowerCase())}</b>.</p>${inv.medir ? `<p>Sabrás que funciona ${esc(inv.medir.charAt(0).toLowerCase() + inv.medir.slice(1))}.</p>` : ''}</div>
        <div class="abajo"><button class="btn btn-primario" data-sig>Seguir</button></div>
      </div>`, J.cierre.voz);
      on('[data-voz]', 'click', () => hablar(J.cierre.voz));
      on('[data-sig]', 'click', listo);
    }
    uno();
  }

  /* ---- Dato ---- */
  function dato(M, cab, listo) {
    const D = M.dato;
    pintar(`<div class="pantalla">${cab(2)}
      <div class="habla">${coc('idea', 'mini')}<p class="globo">${esc(C.comunes.datoTitulo.texto)}</p></div>
      <h1 class="t-titulo" style="font-size:24px">${esc(D.pregunta.texto)}</h1>
      <div class="opciones abajo">${D.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(o)}</button>`).join('')}</div>
    </div>`, D.pregunta.voz);
    on('[data-voz]', 'click', () => hablar(D.pregunta.voz));
    on('[data-i]', 'click', ev => {
      const acerto = +ev.currentTarget.dataset.i === D.correcta;
      sonido(acerto ? 'bien' : 'toque');
      pintar(`<div class="pantalla">${cab(3)}
        <p class="t-nota">${acerto ? '¡Le atinaste!' : 'Respuesta: ' + esc(D.opciones[D.correcta])}</p>
        <h1 class="t-titulo" style="font-size:24px">${esc(D.revela.texto)}</h1>
        ${picto(D.picto)}
        <p class="fuente">Fuente: ${esc(D.fuente.nombre)}</p>
        ${M.curioso ? `<div class="tarjeta"><p class="t-nota" style="font-weight:600;color:var(--brasa-texto)">¿Sabías que…?</p><p>${esc(M.curioso.texto)}</p></div>` : ''}
        <div class="abajo"><button class="btn btn-primario" data-sig>Seguir</button></div>
      </div>`, D.revela.voz);
      on('[data-voz]', 'click', () => hablar(D.revela.voz));
      on('[data-sig]', 'click', listo);
    });
  }
  function picto(P) {
    if (P.icono === 'luciernaga') return `<div class="tarjeta" style="display:flex;justify-content:center;background:var(--noche)">${coc('idea', 'grande')}</div>`;
    if (P.comparar) {
      const filas = P.comparar.map(c => {
        const n = c.valor / P.unidad, llenos = Math.floor(n), resto = n - llenos;
        let ics = ''; for (let i = 0; i < llenos; i++) ics += `<span>${obj(P.icono)}</span>`;
        if (resto > 0.05) ics += `<span style="clip-path:inset(0 ${Math.round((1 - resto) * 100)}% 0 0)">${obj(P.icono)}</span>`;
        return `<div class="fila-b"><span class="eti">${esc(c.etiqueta)}</span><span class="ics">${ics}</span></div>`;
      }).join('');
      return `<figure class="barras" style="margin:0">${filas}<figcaption class="t-nota">${esc(P.leyenda)}</figcaption></figure>`;
    }
    let ics = '';
    for (let i = 0; i < P.total; i++) {
      const on = i < P.resaltados;
      const parcial = P.parcial && i === P.total - 1;
      ics += `<span class="ic ${on ? 'on' : ''}" style="animation-delay:${i * 70}ms${parcial ? `;clip-path:inset(0 ${Math.round((1 - P.parcial) * 100)}% 0 0)` : ''}">${obj(P.icono)}</span>`;
    }
    return `<figure style="margin:0;display:flex;flex-direction:column;gap:6px"><div class="picto">${ics}</div><figcaption class="t-nota">${esc(P.leyenda)}</figcaption></figure>`;
  }

  /* ---- Misión ---- */
  function mision(M, cab, listo) {
    const m = M.mision[E.nivel];
    pintar(`<div class="pantalla">${cab(4)}
      <p class="t-nota">${esc(C.comunes.mision.texto)}</p>
      <div class="tarjeta-oscura mision">${ICON.casa.replace('currentColor', '#FFB627')}<div><p class="t-nota" style="color:#FFD98A">Con tu familia</p><h1 class="t-sub" style="color:var(--papel)">${esc(m.texto)}</h1></div></div>
      ${coc('hola', 'grande')}
      <div class="abajo"><button class="btn btn-primario" data-ok>¡Acepto la misión!</button><p class="t-nota" style="text-align:center">La marcas como hecha en «Misiones» cuando la cumplan.</p></div>
    </div>`, m.voz);
    on('[data-voz]', 'click', () => hablar(m.voz));
    on('[data-ok]', 'click', () => { if (!(M.id in E.misiones)) E.misiones[M.id] = false; guardar(); listo(); });
  }

  /* ---- Terminar módulo: el barrio se enciende ---- */
  function terminar(M) {
    const nuevo = !E.hechos.includes(M.id);
    if (nuevo) E.hechos.push(M.id);
    if (E.sesion.dia !== hoy()) E.sesion = { dia: hoy(), n: 0, descanso: false };
    E.sesion.n++; guardar();
    const n = E.hechos.length;
    sonido('enciende');
    const todo = n === 5 && !E.completoVisto;
    const voz = todo ? C.comunes.completo : C.comunes.enciende;
    pintar(`<div class="pantalla enciende">
      <div class="barra"><span class="logo crece">${A.logo}</span><button class="btn-redondo" data-voz aria-label="Escuchar">${ICON.audio}</button></div>
      <h1 class="t-titulo">${todo ? '¡Tu barrio entero brilla!' : nuevo ? '¡Se encendió ' + esc(M.parte.toLowerCase()) + '!' : '¡Repaso completo!'}</h1>
      <div class="barrio" role="img" aria-label="Tu barrio: ${n} de 5 partes encendidas">${A.barrio[n]}</div>
      <div class="habla">${coc('bien', 'mini')}<p class="globo">${esc(voz.texto)}</p></div>
      <div class="abajo"><button class="btn btn-primario" data-ok>Ver mi barrio</button></div>
    </div>`, voz.voz);
    if (todo) { E.completoVisto = true; guardar(); }
    on('[data-voz]', 'click', () => hablar(voz.voz));
    on('[data-ok]', 'click', () => {
      if (E.sesion.n >= 2 && !E.sesion.descanso && n < 5) { E.sesion.descanso = true; guardar(); return descanso(); }
      ir('#barrio');
    });
  }
  function descanso() {
    const d = C.comunes.descanso;
    pintar(`<div class="pantalla">
      <div class="barra"><span class="crece"></span><button class="btn-redondo" data-voz aria-label="Escuchar">${ICON.audio}</button></div>
      ${coc('descansa', 'grande')}
      <h1 class="t-titulo" style="text-align:center">${esc(d.texto)}</h1>
      <div class="abajo"><button class="btn btn-primario" data-ok>Volver al barrio</button></div>
    </div>`, d.voz);
    on('[data-voz]', 'click', () => hablar(d.voz));
    on('[data-ok]', 'click', () => ir('#barrio'));
  }

  /* ================= MISIONES ================= */
  function misiones() {
    const hechos = C.modulos.filter(m => m.id in E.misiones);
    const lista = hechos.length ? hechos.map(m => {
      const t = m.mision[E.nivel].texto, ok = E.misiones[m.id];
      return `<li class="tarjeta" style="display:flex;flex-direction:column;gap:10px"><p class="t-nota">Módulo ${m.id} · ${esc(m.titulo)}</p><p style="font-weight:500">${esc(t)}</p><button class="btn ${ok ? 'btn-borde' : 'btn-oscuro'}" data-m="${m.id}" aria-pressed="${ok}">${ok ? '¡Hecha! ✓' : 'La hicimos'}</button></li>`;
    }).join('') : `<li class="tarjeta"><p>Aún no tienes misiones. Termina tu primer módulo y aparecerá aquí.</p></li>`;
    const inv = E.inventos.length ? `<h2 class="t-sub">Tus inventos</h2><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">${E.inventos.map(i => `<li class="invento"><span class="nombre" style="font-size:22px">${esc(i.nombre)}</span><span>Resuelve: ${esc(i.problema.toLowerCase())}</span></li>`).join('')}</ul>` : '';
    pintar(`<div class="pantalla">
      <h1 class="t-titulo">Misiones en casa</h1>
      <p class="t-nota">Retos para hacer con tu familia. Márcalos cuando los cumplan.</p>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">${lista}</ul>
      ${inv}
    </div>${nav('misiones')}`);
    on('[data-m]', 'click', ev => {
      const id = ev.currentTarget.dataset.m; E.misiones[id] = !E.misiones[id]; guardar();
      if (E.misiones[id]) { sonido('bien'); hablar(C.comunes.misionHecha.voz); anunciar(C.comunes.misionHecha.texto); }
      misiones();
    });
  }

  /* ================= ADULTOS ================= */
  let puertaAbierta = false;
  function adultos() {
    if (!puertaAbierta) {
      const a = 11 + Math.floor(Math.random() * 8), b = 12 + Math.floor(Math.random() * 7);
      pintar(`<div class="pantalla">
        <div class="barra"><a class="btn-redondo suave" href="#barrio" aria-label="Volver">${ICON.atras}</a></div>
        <h1 class="t-titulo">Esta parte es para adultos</h1>
        <p>Para entrar, resuelve: <b>${a} × ${b}</b></p>
        <div class="campo"><label for="puerta">Resultado</label><input id="puerta" inputmode="numeric" autocomplete="off"></div>
        <p class="t-nota" data-msg role="status"></p>
        <div class="abajo"><button class="btn btn-oscuro" data-ok>Entrar</button></div>
      </div>${nav('adultos')}`);
      on('[data-ok]', 'click', () => {
        if (+$main.querySelector('#puerta').value === a * b) { puertaAbierta = true; adultos(); }
        else $main.querySelector('[data-msg]').textContent = 'Ese no es el resultado. Pídele ayuda a un adulto.';
      });
      return;
    }
    const fuentes = [];
    C.modulos.forEach(m => { fuentes.push(m.dato.fuente); if (m.curioso) fuentes.push(m.curioso.fuente); });
    const unicas = fuentes.filter((f, i) => fuentes.findIndex(g => g.url === f.url) === i);
    pintar(`<div class="pantalla adultos">
      <div class="barra"><a class="btn-redondo suave" href="#barrio" aria-label="Volver al barrio">${ICON.atras}</a><span class="logo crece">${A.logo}</span></div>
      <h1 class="t-titulo">Para familias y docentes</h1>
      <section><h2>Qué es chispa</h2><p>Una app gratuita para niños de 8 a 12 años sobre tecnología verde en su ciudad: separar residuos, reciclar, cuidar el agua y el manglar, usar energía limpia e inventar soluciones. Cada módulo dura entre 10 y 15 minutos y termina con una misión para hacer en casa.</p></section>
      <section><h2>Modo aula</h2>
        <ol><li>Proyecte la app o úsela en un celular por grupo.</li><li>Haga un módulo por sesión de 30 minutos: historia y juego en voz alta, con el curso votando cada respuesta.</li><li>En el dato, pida al curso adivinar antes de revelar y discuta la fuente.</li><li>Convierta la misión en tarea para la casa y revísela la clase siguiente.</li><li>El módulo 5 sirve de cierre: cada grupo presenta un invento.</li></ol>
        <p class="t-nota">Apoya el Proyecto Ambiental Escolar (PRAE, Ley 1549 de 2012) y el componente Ciencia, Tecnología y Sociedad de las pruebas Saber de Ciencias Naturales.</p></section>
      <section><h2>Privacidad</h2><p>chispa no tiene cuentas, no pide datos personales, no usa ubicación, cámara ni micrófono, no muestra publicidad y no envía nada a internet. El apodo y el avance se guardan solo en este dispositivo.</p></section>
      <section><h2>Ajustes</h2>
        <div class="opciones">
          <button class="opcion" data-aj="voz" aria-pressed="${E.voz}">Voz y sonidos: ${E.voz ? 'encendidos' : 'apagados'}</button>
          <button class="opcion" data-aj="letra" aria-pressed="${E.letra === 'mas'}">Letra más grande: ${E.letra === 'mas' ? 'sí' : 'no'}</button>
          <button class="opcion" data-aj="movimiento" aria-pressed="${E.movimiento === 'menos'}">Menos movimiento: ${E.movimiento === 'menos' ? 'sí' : 'no'}</button>
          <button class="opcion" data-aj="nivel">Nivel: ${E.nivel === 'experto' ? 'Experto (11–12)' : 'Explorador (8–10)'} · cambiar</button>
          <button class="opcion" data-aj="borrar">Borrar el avance y empezar de cero</button>
        </div></section>
      <section><h2>Fuentes de los datos</h2><ul class="lista-fuentes">${unicas.map(f => `<li><a href="${f.url}" target="_blank" rel="noopener">${esc(f.nombre)}</a></li>`).join('')}</ul></section>
      <section><h2>Créditos</h2><p>Proyecto académico de Diseño Gráfico. Ilustración, identidad e interfaz diseñadas para esta app. Voces, efectos y música generados con ElevenLabs; investigación, diseño y código con apoyo de Claude (IA). Tipografías Bricolage Grotesque y Lexend (licencia OFL).</p></section>
    </div>${nav('adultos')}`);
    on('[data-aj]', 'click', ev => {
      const k = ev.currentTarget.dataset.aj;
      if (k === 'voz') { E.voz = !E.voz; callar(); }
      if (k === 'letra') E.letra = E.letra === 'mas' ? 'normal' : 'mas';
      if (k === 'movimiento') E.movimiento = E.movimiento === 'menos' ? 'normal' : 'menos';
      if (k === 'nivel') return elegirNivel(() => { guardar(); adultos(); });
      if (k === 'borrar') {
        const b = ev.currentTarget;
        if (b.dataset.conf) { E = Object.assign({}, base); guardar(); aplicarAjustes(); puertaAbierta = false; return ir('#barrio'); }
        b.dataset.conf = '1'; b.textContent = 'Toca otra vez para confirmar: se borra todo'; return;
      }
      guardar(); aplicarAjustes(); adultos();
    });
  }

  /* ---------- Arranque ---------- */
  ruta();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
