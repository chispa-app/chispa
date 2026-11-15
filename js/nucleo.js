/* chispa 2.0 · núcleo: estado, voz, sonido, imágenes, rutas y progreso.
   Sin cuentas ni servidor: todo vive en este aparato (localStorage). */
'use strict';
(() => {
  const CH = window.CH, A = window.ARTE;
  const $main = document.getElementById('principal');
  const $anuncio = document.getElementById('anuncio');
  const CLAVE = 'chispa-v2';

  /* ================= ESTADO ================= */
  const AJ = { voz: true, vozLenta: false, subtitulos: true, letra: 'normal', movimiento: 'normal', sinTiempo: false, limite: 3 };
  const BASE = () => ({
    v: 2, visto: false, avatar: 'trenzas', nivel: 'explorador',
    eps: {},            // id de episodio → { estrellas, fecha }
    enCurso: null,      // { ep, paso } para seguir donde iba
    cromos: [], nuevos: [],
    juegos: {},         // juego → { nivel: estrellas }
    reto: {},           // día (1..14) → fecha en que se hizo
    manglar: null,      // fecha en que se sembró
    dias: [],           // fechas en que se abrió la app (para el manglar)
    bitacora: [],       // [{ fecha, bolsas, botellas, luces }]
    misiones: {},       // id de episodio → true si se cumplió
    inventos: [], dibujos: [], problema: null, accesorio: null,
    sesion: { dia: '', nuevos: 0 },
    aj: Object.assign({}, AJ)
  });
  function cargar() {
    let g = null;
    try { g = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { g = null; }
    if (g && g.v === 2) { const b = BASE(); const r = Object.assign(b, g); r.aj = Object.assign({}, AJ, g.aj || {}); return r; }
    const b = BASE();
    try { // Trae lo útil de la versión 1, si existe.
      const v1 = JSON.parse(localStorage.getItem('chispa-v1'));
      if (v1) { b.nivel = v1.nivel || b.nivel; b.aj.voz = v1.voz !== false; b.aj.letra = v1.letra || 'normal'; b.aj.movimiento = v1.movimiento || 'normal'; }
    } catch (e) { /* sin versión anterior */ }
    return b;
  }
  CH.E = cargar();
  CH.guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(CH.E)); } catch (e) { /* sin almacenamiento: la app sigue */ } };
  CH.borrarTodo = () => { CH.E = BASE(); CH.guardar(); aplicarAjustes(); };

  const pad = n => String(n).padStart(2, '0');
  CH.hoy = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  function registrarDia() {
    const h = CH.hoy();
    if (!CH.E.dias.includes(h)) { CH.E.dias.push(h); if (CH.E.dias.length > 120) CH.E.dias.shift(); }
    if (CH.E.sesion.dia !== h) CH.E.sesion = { dia: h, nuevos: 0 };
    CH.guardar();
  }
  function aplicarAjustes() {
    const d = document.documentElement;
    d.dataset.letra = CH.E.aj.letra;
    d.dataset.movimiento = CH.E.aj.movimiento;
    d.dataset.nivel = CH.E.nivel;
  }
  CH.aplicarAjustes = aplicarAjustes;
  CH.menosMovimiento = () => CH.E.aj.movimiento === 'menos' || matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= UTILIDADES ================= */
  CH.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  CH.azar = arr => arr[Math.floor(Math.random() * arr.length)];
  CH.mezclar = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  CH.anunciar = t => { $anuncio.textContent = ''; setTimeout(() => { $anuncio.textContent = t; }, 40); };
  CH.texto = l => (typeof l === 'string' ? l : (l && (CH.E.nivel === 'experto' && l.x ? l.x : l.t)) || '');
  CH.nivel = (o, k) => (CH.E.nivel === 'experto' && o['x' + k] !== undefined) ? o['x' + k] : o[k];
  CH.zona = id => CH.ZONAS.find(z => z.id === id);

  /* ================= VOZ ================= */
  // Usa archivos grabados si existen (js/audios.js los lista); si no, la voz del sistema.
  const GRABADAS = new Set(window.AUDIOS || []);
  let audio = null, ultima = null, vozElegida = null;
  function elegirVoz() {
    if (!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices();
    const pref = ['es-CO', 'es-US', 'es-419', 'es-MX', 'es-'];
    for (const p of pref) { const v = vs.find(x => x.lang && x.lang.replace('_', '-').startsWith(p)); if (v) return v; }
    return null;
  }
  if ('speechSynthesis' in window) { vozElegida = elegirVoz(); speechSynthesis.onvoiceschanged = () => { vozElegida = elegirVoz(); }; }
  CH.callar = () => {
    if (audio) { try { audio.pause(); } catch (e) { /* nada */ } audio = null; }
    if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) { /* nada */ } }
  };
  // l: texto o { t, x, v }. fin() solo se llama si la voz terminó de sonar.
  CH.hablar = (l, fin) => {
    CH.callar();
    const t = CH.texto(l); if (!t) return;
    ultima = l;
    if (!CH.E.aj.voz) return;
    const id = l && l.v;
    if (id && GRABADAS.has(id)) {
      try {
        audio = new Audio('audio/' + id + '.mp3'); audio.playbackRate = CH.E.aj.vozLenta ? 0.85 : 1;
        if (fin) audio.onended = fin;
        const p = audio.play(); if (p && p.catch) p.catch(() => {});
      } catch (e) { /* sin audio */ }
      return;
    }
    if (!('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(t.replace(/«|»/g, ''));
      u.lang = (vozElegida && vozElegida.lang) || 'es-CO';
      if (vozElegida) u.voice = vozElegida;
      u.rate = CH.E.aj.vozLenta ? 0.8 : 0.98; u.pitch = 1.08;
      if (fin) u.onend = fin;
      speechSynthesis.speak(u);
    } catch (e) { /* sin voz: el texto sigue en pantalla */ }
  };
  CH.repetir = () => { if (ultima) CH.hablar(ultima); };

  /* ================= SONIDOS (sintetizados, sin archivos) ================= */
  let ctx = null;
  const NOTAS = { bien: [660, 880], casi: [440, 392], toque: [540], enciende: [523, 659, 784, 1047], cromo: [784, 988, 1175, 1568], pop: [700], pasa: [380, 300], estrella: [988, 1319] };
  CH.sonido = tipo => {
    if (!CH.E.aj.voz) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      (NOTAS[tipo] || [600]).forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = tipo === 'casi' ? 'triangle' : 'sine'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.1, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3);
      });
    } catch (e) { /* sin sonido */ }
  };

  /* ================= IMÁGENES ================= */
  // js/imagenes.js lista los archivos que existen. Si falta uno, se dibuja un respaldo.
  const HAY = new Set(window.IMAGENES || []);
  const RUTA = {
    cocuyo: id => `img/cocuyo/cocuyo-${id}.svg`,
    personaje: id => `img/personajes/personaje-${id}.svg`,
    avatar: id => `img/avatares/avatar-${id}.svg`,
    fondo: id => `img/fondos/fondo-${id}.svg`,
    mapa: () => 'img/fondos/mapa-barrio.svg',
    escena: id => `img/escenas/${id}.svg`,
    objeto: id => `img/objetos/${id}.svg`
  };
  const COC_VIEJO = { celebrando: 'bien', saludando: 'hola', feliz: 'bien', curioso: 'idea', sorprendido: 'casi', pensando: 'pensando', senalando: 'idea', dormido: 'descansa' };
  CH.hayImagen = (tipo, id) => HAY.has(RUTA[tipo](id));
  // Devuelve HTML de una ilustración: <img> si existe el archivo; si no, un respaldo dibujado.
  CH.ilus = (tipo, id, o = {}) => {
    const src = RUTA[tipo](id), cls = 'ilus ilus-' + tipo + (o.cls ? ' ' + o.cls : ''), alt = o.alt || '';
    if (HAY.has(src)) return `<img class="${cls}" src="${src}" alt="${CH.esc(alt)}" ${alt ? '' : 'aria-hidden="true"'} decoding="async" draggable="false">`;
    const rol = alt ? `role="img" aria-label="${CH.esc(alt)}"` : 'aria-hidden="true"';
    if (tipo === 'cocuyo') return `<span class="${cls}" ${rol}>${A.cocuyo[COC_VIEJO[id] || 'hola']}</span>`;
    if (tipo === 'personaje' || tipo === 'avatar') {
      const p = tipo === 'personaje' ? CH.PERSONAJES[id] : null;
      if (id === 'cocuyo') return CH.ilus('cocuyo', 'saludando', o);
      const z = p ? CH.ZONAS.find(x => x.quien === id) : null;
      return `<span class="${cls} respaldo-persona" ${rol} style="--c:${z ? z.color : '#E85D2A'}"><span>${CH.esc((p ? p.nombre : 'Tú').charAt(0))}</span></span>`;
    }
    if (tipo === 'objeto') return `<span class="${cls}" ${rol}>${CH.objeto(id)}</span>`;
    if (tipo === 'fondo' || tipo === 'mapa' || tipo === 'escena') return '';
    return '';
  };
  // Íconos de objetos: los nuevos (CH.ICO) y los de la versión 1 (ARTE.obj).
  CH.objeto = id => (CH.ICO && CH.ICO[id]) || A.obj[id] || `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#FFF0D6" stroke="#5A3526" stroke-width="2.5"/></svg>`;
  CH.cocuyo = (exp, cls = '', alt = '') => CH.ilus('cocuyo', exp, { cls: 'cocuyo ' + cls, alt });
  CH.personaje = (id, cls = '', alt = '') => id === 'cocuyo' ? CH.cocuyo('saludando', cls, alt) : CH.ilus('personaje', id, { cls: 'personaje ' + cls, alt });
  CH.avatar = (id, cls = '', alt = '') => CH.ilus('avatar', id, { cls: 'avatar ' + cls, alt });
  CH.fondo = (id, cls = '') => CH.ilus('fondo', id, { cls });

  /* ================= ÍCONOS DE INTERFAZ ================= */
  const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  CH.I = {
    voz: s('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>'),
    pausa: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1.6" fill="currentColor"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.6" fill="currentColor"/></svg>',
    atras: s('<path d="M14.5 5.5 8 12l6.5 6.5"/>'),
    cerrar: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
    barrio: s('<path d="M4 11 12 4.5 20 11v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1V11z"/>'),
    album: s('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12.5 9.5h4M7.5 14.5h4"/>', '') .replace('</svg>', '<rect x="7.5" y="7.5" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="12.5" y="12.5" width="4" height="4" rx="1" fill="currentColor" stroke="none"/></svg>'),
    reto: s('<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/><path d="m9 14.5 2 2 4-4"/>'),
    casillero: s('<path d="M7 9a5 5 0 0 1 10 0v10.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9z"/><path d="M10 4.2h4M9.5 13h5v3.5h-5z"/>'),
    estrella: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.5l-5.2 2.8 1-5.8L3.5 9.4l5.9-.8L12 3.2z" fill="#FFB627" stroke="#2B211D" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    estrellaVacia: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.5l-5.2 2.8 1-5.8L3.5 9.4l5.9-.8L12 3.2z" fill="#EFE3CF" stroke="#8C7A66" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    candado: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="10.5" width="13" height="10" rx="2.5" fill="currentColor"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>',
    check: s('<path d="m6 12.5 4 4 8-8.5"/>', 'stroke-width="2.8"'),
    ajustes: s('<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2.5M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.8 1.8M16.2 16.2 18 18M6 18l1.8-1.8M16.2 7.8 18 6"/>'),
    lupa: s('<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>'),
    borrar: s('<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5"/>'),
    deshacer: s('<path d="M9 7 4.5 11.5 9 16"/><path d="M5 11.5h9a5 5 0 0 1 0 10h-2"/>'),
    lapiz: s('<path d="m4 20 1-4.5L16 4.5l3.5 3.5L8.5 19 4 20z"/>'),
    flecha: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    imprimir: s('<path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="6" rx="1"/>'),
    hoja: s('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.5-.5 4.6-2 5.8-4"/>')
  };
  // Íconos de la barra de progreso según el tipo de actividad.
  CH.ICONO_ACT = { escena: 'voz', busca: 'lupa', arrastra: 'flecha', ordena: 'flecha', vm: 'check', une: 'flecha', estima: 'estrella', ad: 'lupa', construye: 'ajustes', charla: 'voz', dibuja: 'lapiz', dato: 'estrella', juego: 'estrella', mision: 'barrio', elige: 'check', bitacora: 'reto', infografia: 'album', cartel: 'album' };

  /* ================= PINTAR Y RUTAS ================= */
  CH.$main = $main;
  CH.pintar = (html, o = {}) => {
    CH.callar(); cerrarDialogo(true);
    $main.className = o.clase || '';
    $main.innerHTML = html;
    window.scrollTo(0, 0);
    const h = $main.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (o.voz) setTimeout(() => CH.hablar(o.voz, o.alTerminarVoz), 320);
  };
  CH.on = (sel, ev, fn, raiz = $main) => raiz.querySelectorAll(sel).forEach(el => el.addEventListener(ev, fn));
  CH.ir = h => { if (location.hash === h) ruta(); else location.hash = h; };
  CH.PANTALLAS = {};
  function ruta() {
    registrarDia();
    const h = decodeURIComponent(location.hash.replace('#', '')) || 'barrio';
    const [nombre, ...resto] = h.split('/');
    const param = resto.join('/');
    if (!CH.E.visto && nombre !== 'adultos') return CH.PANTALLAS.apertura();
    const fn = CH.PANTALLAS[nombre] || CH.PANTALLAS.barrio;
    fn(param);
  }
  CH.ruta = ruta;
  window.addEventListener('hashchange', ruta);

  /* ================= DIÁLOGO ================= */
  let dlg = null, antes = null;
  function cerrarDialogo(silencio) {
    if (!dlg) return;
    dlg.remove(); dlg = null;
    if (!silencio && antes && document.body.contains(antes)) antes.focus();
  }
  CH.cerrarDialogo = () => cerrarDialogo(false);
  CH.dialogo = (html, etiqueta) => {
    cerrarDialogo(true); antes = document.activeElement;
    dlg = document.createElement('div'); dlg.className = 'velo';
    dlg.innerHTML = `<div class="dialogo" role="dialog" aria-modal="true" aria-label="${CH.esc(etiqueta || 'Aviso')}">${html}</div>`;
    document.body.appendChild(dlg);
    const foco = () => [...dlg.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter(x => !x.disabled);
    const f = foco(); if (f[0]) f[0].focus();
    dlg.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') { ev.preventDefault(); cerrarDialogo(false); }
      if (ev.key === 'Tab') { const l = foco(); if (!l.length) return; const i = l.indexOf(document.activeElement); if (ev.shiftKey && i <= 0) { ev.preventDefault(); l[l.length - 1].focus(); } else if (!ev.shiftKey && i === l.length - 1) { ev.preventDefault(); l[0].focus(); } }
    });
    return dlg;
  };

  /* ================= CELEBRACIÓN ================= */
  CH.chispas = (el, n = 14) => {
    if (!el || CH.menosMovimiento()) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i'); c.className = 'chispa-fx';
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4, d = 50 + Math.random() * 60;
      c.style.left = (r.left + r.width / 2) + 'px'; c.style.top = (r.top + r.height / 2) + 'px';
      c.style.setProperty('--dx', Math.cos(a) * d + 'px'); c.style.setProperty('--dy', Math.sin(a) * d + 'px');
      document.body.appendChild(c); setTimeout(() => c.remove(), 900);
    }
  };

  /* ================= PROGRESO ================= */
  const P = CH.prog = {
    hecho: id => !!CH.E.eps[id],
    cuantos: z => (CH.RUTAS[z] || []).filter(ep => CH.E.eps[ep.id]).length,
    total: z => (CH.RUTAS[z] || []).length,
    completa: z => P.total(z) > 0 && P.cuantos(z) === P.total(z),
    rutasCompletas: () => CH.ZONAS.filter(z => z.id !== 'plaza' && P.completa(z.id)).length,
    algunEpisodio: () => Object.keys(CH.E.eps).length > 0,
    abierta: z => z === 'casa' || (z === 'plaza' ? P.rutasCompletas() >= 4 : P.algunEpisodio()),
    siguiente: z => (CH.RUTAS[z] || []).find(ep => !CH.E.eps[ep.id]) || null,
    epAbierto: id => { const [z, n] = id.split(/-(?=\d+$)/); const r = CH.RUTAS[z] || []; const i = r.findIndex(e => e.id === id); return P.abierta(z) && i >= 0 && (i === 0 || !!CH.E.eps[r[i - 1].id]); },
    estrellasEps: () => Object.values(CH.E.eps).reduce((a, e) => a + (e.estrellas || 0), 0),
    estrellasJuegos: () => Object.values(CH.E.juegos).reduce((a, j) => a + Object.values(j).reduce((b, x) => b + x, 0), 0),
    estrellas: () => P.estrellasEps() + P.estrellasJuegos(),
    zonasEncendidas: () => CH.ZONAS.filter(z => P.cuantos(z.id) > 0).length,
    sugerida: () => {
      if (CH.E.enCurso && CH.RUTAS && P.epAbierto(CH.E.enCurso.ep) && !CH.E.eps[CH.E.enCurso.ep]) { const z = CH.E.enCurso.ep.replace(/-\d+$/, ''); return { zona: z, ep: CH.RUTAS[z].find(e => e.id === CH.E.enCurso.ep) }; }
      for (const z of CH.ZONAS) { if (!P.abierta(z.id)) continue; const ep = P.siguiente(z.id); if (ep && P.cuantos(z.id) > 0) return { zona: z.id, ep }; }
      for (const z of CH.ZONAS) { if (!P.abierta(z.id)) continue; const ep = P.siguiente(z.id); if (ep) return { zona: z.id, ep }; }
      return null;
    }
  };
  CH.ganarCromo = id => {
    if (!id || CH.E.cromos.includes(id)) return false;
    CH.E.cromos.push(id); CH.E.nuevos.push(id); CH.guardar(); return true;
  };

  /* ================= ARRANQUE ================= */
  CH.arrancar = () => {
    aplicarAjustes();
    ruta();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  };
})();
