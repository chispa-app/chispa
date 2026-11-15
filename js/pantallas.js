/* chispa 2.0 · pantallas: apertura, barrio, zona, episodio, cierre, álbum, reto, manglar, casillero, adultos y diploma. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc, I = CH.I, P = CH.prog, S = CH.PANTALLAS;
  const nivelNombre = () => CH.E.nivel === 'experto' ? 'Experto' : 'Explorador';

  /* ---------- Navegación inferior ---------- */
  const nav = actual => {
    const n = CH.E.nuevos.length;
    const it = (h, txt, ic, extra = '') => `<a href="#${h}" ${actual === h ? 'aria-current="page"' : ''}>${I[ic]}<span>${txt}</span>${extra}</a>`;
    return `<nav class="nav" aria-label="Secciones">${it('barrio', 'Barrio', 'barrio')}${it('album', 'Álbum', 'album', n ? `<b class="insignia" aria-hidden="true">${n}</b><span class="solo-lector">, ${n} cromo${n > 1 ? 's' : ''} nuevo${n > 1 ? 's' : ''}</span>` : '')}${it('reto', 'Reto', 'reto')}${it('casillero', 'Casillero', 'casillero')}</nav>`;
  };
  CH.nav = nav;
  const estrellasHTML = (n, max = 3) => `<span class="estrellas" role="img" aria-label="${n} de ${max} estrellas">${Array.from({ length: max }, (_, i) => i < n ? I.estrella : I.estrellaVacia).join('')}</span>`;

  /* ================= APERTURA ================= */
  S.apertura = () => {
    // Escena corta: el barrio a oscuras y Cocuyo que lo enciende.
    CH.pintar(`<div class="apertura-escena">
      <div class="noche-mapa" aria-hidden="true">${CH.hayImagen('mapa', '') ? CH.ilus('mapa', '', { cls: 'mapa-noche' }) : mapaRespaldo(true)}</div>
      <div class="apertura-texto">${CH.cocuyo('saludando', 'apertura-coc')}
        <h1 class="t-display claro">Tu barrio está apagado.</h1>
        <p class="claro">Con cada idea verde lo vamos a encender.</p>
        <button class="btn btn-primario" data-sig>Encender</button></div>
    </div>`, { clase: 'modo-noche', voz: { t: '¡Hola! Soy Cocuyo, una luciérnaga. Tu barrio está apagado. Con cada idea verde lo vamos a encender.' } });
    CH.on('[data-sig]', 'click', ev => { CH.sonido('enciende'); CH.chispas(ev.currentTarget, 18); setTimeout(eleccion, CH.menosMovimiento() ? 0 : 450); });
  };
  function eleccion() {
    let av = CH.E.avatar, nv = CH.E.nivel;
    CH.pintar(`<div class="pantalla apertura">
      <div class="brillo-fondo" aria-hidden="true"></div>
      <div class="barra"><span class="logo crece">${window.ARTE.logo}</span><a class="btn btn-borde btn-chico" href="#adultos">Adultos</a></div>
      <div class="habla-grande">${CH.cocuyo('saludando', 'coc-apertura')}<p class="globo">¡Hola! Soy Cocuyo. ¿Quién va a inventar hoy?</p></div>
      <div><h1 class="t-titulo">Elige tu inventor</h1><p class="t-nota">Lo puedes cambiar luego. No pedimos tu nombre.</p></div>
      <div class="avatares" role="radiogroup" aria-label="Inventores">${CH.AVATARES.map(a => `<button role="radio" aria-checked="${a.id === av}" data-av="${a.id}" aria-label="${esc(a.nombre)}">${CH.avatar(a.id, 'av-img')}<span class="marca" aria-hidden="true">${I.check}</span></button>`).join('')}</div>
      <h2 class="etiqueta-campo" id="lbl-edad">¿Cuántos años tienes?</h2>
      <div class="niveles" role="radiogroup" aria-labelledby="lbl-edad">
        <button role="radio" data-nv="explorador" aria-checked="${nv === 'explorador'}"><b>Explorador</b><span>8 a 10 años</span></button>
        <button role="radio" data-nv="experto" aria-checked="${nv === 'experto'}"><b>Experto</b><span>11 a 12 años</span></button></div>
      <div class="abajo fila"><button class="btn-redondo" data-voz aria-label="Escuchar">${I.voz}</button><button class="btn btn-primario crece" data-ok>¡Vamos a inventar!</button></div>
    </div>`, { voz: { t: '¿Quién va a inventar hoy? Elige tu inventor y tu edad.' } });
    CH.on('[data-voz]', 'click', () => CH.hablar({ t: '¿Quién va a inventar hoy? Elige tu inventor y tu edad.' }));
    CH.on('[data-av]', 'click', ev => { av = ev.currentTarget.dataset.av; CH.$main.querySelectorAll('[data-av]').forEach(b => b.setAttribute('aria-checked', b.dataset.av === av)); CH.sonido('toque'); });
    CH.on('[data-nv]', 'click', ev => { nv = ev.currentTarget.dataset.nv; CH.$main.querySelectorAll('[data-nv]').forEach(b => b.setAttribute('aria-checked', b.dataset.nv === nv)); CH.sonido('toque'); });
    CH.on('[data-ok]', 'click', () => { CH.E.avatar = av; CH.E.nivel = nv; CH.E.visto = true; CH.guardar(); CH.aplicarAjustes(); CH.ir('#barrio'); });
  }

  /* ================= BARRIO (mapa) ================= */
  function mapaRespaldo(apagado) {
    // Mapa dibujado mientras llega la ilustración: islas de color y un camino.
    return `<svg class="mapa-respaldo ${apagado ? 'apagado' : ''}" viewBox="0 0 1024 1536" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="1024" height="1536" fill="#F8E6CB"/>
      <path d="M512 40 C 380 260, 650 420, 512 600 S 380 980, 512 1160 S 640 1400, 512 1520" fill="none" stroke="#FFF7EA" stroke-width="70" stroke-linecap="round"/>
      ${CH.ZONAS.map(z => `<g transform="translate(${z.mapa.x * 10.24} ${z.mapa.y * 15.36})"><ellipse rx="170" ry="120" fill="${z.color}" opacity=".28"/><ellipse rx="120" ry="80" fill="${z.color}" stroke="#5A3526" stroke-width="6"/></g>`).join('')}
    </svg>`;
  }
  // El mapa va en línea (no como <img>) para encender cada zona y los faroles según el avance.
  let mapaSVG = null;
  const cargarMapa = () => mapaSVG ? Promise.resolve(mapaSVG) : !CH.hayImagen('mapa', '') ? Promise.resolve(null)
    : fetch('img/fondos/mapa-barrio.svg').then(r => r.ok ? r.text() : null).then(t => { mapaSVG = t; return t; }).catch(() => null);
  const estadoZona = id => P.completa(id) ? 'completa' : !P.abierta(id) ? 'cerrada' : P.cuantos(id) ? 'encendida' : 'abierta';
  function encenderMapa(raiz) {
    const svg = raiz && raiz.querySelector('svg'); if (!svg) return;
    CH.ZONAS.forEach(z => {
      const g = svg.querySelector('#z-' + z.id); if (!g) return;
      const e = estadoZona(z.id);
      g.setAttribute('class', 'zona-arte ' + e);
      if (e === 'cerrada') g.setAttribute('filter', 'url(#f-apagado)'); else if (e === 'abierta') g.setAttribute('filter', 'url(#f-tenue)'); else g.removeAttribute('filter');
    });
    const faroles = [...svg.querySelectorAll('.farol')], n = Math.round(P.zonasEncendidas() / 8 * faroles.length);
    faroles.forEach((f, i) => f.classList.toggle('on', i < n));
  }
  S.barrio = () => {
    const sug = P.sugerida(), enc = P.zonasEncendidas(), est = P.estrellas();
    const zonas = CH.ZONAS.map(z => {
      const n = P.cuantos(z.id), t = P.total(z.id), e = estadoZona(z.id), abierta = e !== 'cerrada';
      const estado = e === 'completa' ? `<span class="badge" aria-hidden="true">${I.check}</span>` : e === 'cerrada' ? `<span class="badge cerrado" aria-hidden="true">${I.candado}</span>` : n ? `<span class="badge num" aria-hidden="true">${n}/${t}</span>` : '';
      const desc = `${z.nombre}: ${e === 'completa' ? 'completa' : e === 'cerrada' ? (z.id === 'plaza' ? 'se abre al completar cuatro rutas' : 'se abre después del primer episodio') : n ? n + ' de ' + t + ' episodios' : 'sin empezar'}`;
      const persona = e === 'completa' && z.quien !== 'familia' && z.quien !== 'cocuyo' ? `<button class="vecino" data-vecino="${z.id}" aria-label="Hablar con ${esc(CH.PERSONAJES[z.quien].nombre)}">${CH.personaje(z.quien, 'vecino-img')}</button>` : '';
      return `<div class="zona-pin ${e}" style="left:${z.mapa.x}%;top:${z.mapa.y}%;--z:${z.color};--zt:${z.tinta}">
        <span class="luz" aria-hidden="true"></span>${abierta ? `<a class="zona-toque" href="#zona/${z.id}" tabindex="-1" aria-hidden="true"></a>` : `<a class="zona-toque" href="#barrio" tabindex="-1" aria-hidden="true" data-cerrada="${z.id}"></a>`}${persona}
        <a class="zona-et" href="${abierta ? '#zona/' + z.id : '#barrio'}" ${abierta ? '' : 'aria-disabled="true" data-cerrada="' + z.id + '"'} aria-label="${esc(desc)}"><span>${esc(z.nombre)}</span>${estado}</a></div>`;
    }).join('');
    const zs = sug && CH.zona(sug.zona);
    const tarjeta = sug ? (() => { const i = CH.RUTAS[sug.zona].indexOf(sug.ep) + 1; return `<a class="seguir-tarjeta" href="#ep/${sug.ep.id}" style="--z:${zs.color};--zt:${zs.tinta}">
        <span class="seguir-cara" aria-hidden="true">${zs.quien === 'cocuyo' || zs.quien === 'familia' ? CH.cocuyo('feliz') : CH.personaje(zs.quien)}</span>
        <span class="crece"><span class="seguir-zona">${esc(zs.nombre)} · episodio ${i} de ${P.total(sug.zona)}</span><b>${esc(sug.ep.titulo)}</b></span>
        <span class="btn btn-primario btn-chico" aria-hidden="true">${P.algunEpisodio() ? 'Seguir' : 'Empezar'}${I.flecha}</span></a>`; })()
      : `<a class="seguir-tarjeta" href="#album"><span class="seguir-cara" aria-hidden="true">${CH.cocuyo('celebrando')}</span><span class="crece"><span class="seguir-zona">¡Barrio completo!</span><b>Juega los minijuegos o completa tu álbum</b></span><span class="btn btn-primario btn-chico" aria-hidden="true">Álbum${I.flecha}</span></a>`;
    // Cocuyo espera sobre la avenida, a la altura de la zona sugerida.
    const cy = zs ? Math.max(4, zs.mapa.y - 15) : 4;
    CH.pintar(`<div class="pantalla-mapa">
      <header class="barra-mapa">
        <a class="mi-inventor" href="#casillero" aria-label="Mi casillero">${CH.avatar(CH.E.avatar, 'av-mini')}</a>
        <div class="crece"><b class="barra-nombre">${nivelNombre()}</b>
          <span class="barra-avance"><span class="segmentos" aria-hidden="true">${CH.ZONAS.map((z, k) => `<i class="${k < enc ? 'si' : ''}"></i>`).join('')}</span><span class="t-nota">${enc} de 8 zonas</span></span></div>
        <span class="pildora" role="img" aria-label="${est} estrellas">${I.estrella}<b>${est}</b></span>
      </header>
      <h1 class="solo-lector">Tu barrio: ${enc} de 8 zonas encendidas</h1>
      <div class="mapa" role="group" aria-label="Mapa del barrio">
        <div class="mapa-img" aria-hidden="true">${mapaSVG || (CH.hayImagen('mapa', '') ? CH.ilus('mapa', '') : mapaRespaldo(false))}</div>
        <span class="coc-mapa-pos" style="top:${cy}%" aria-hidden="true">${CH.cocuyo('feliz', 'coc-mapa')}</span>
        ${zonas}
      </div>
      <div class="flota-abajo">${tarjeta}</div>
    </div>${nav('barrio')}`, { clase: 'modo-mapa' });
    const caja = CH.$main.querySelector('.mapa-img');
    if (mapaSVG) encenderMapa(caja);
    else cargarMapa().then(t => { if (t && document.body.contains(caja)) { caja.innerHTML = t; encenderMapa(caja); } });
    // En pantallas bajitas, que la zona sugerida quede a la vista.
    if (zs && innerHeight < 700) { const pin = CH.$main.querySelector(`.zona-pin[style*="${zs.mapa.y}%"]`); if (pin) requestAnimationFrame(() => window.scrollTo(0, Math.max(0, pin.getBoundingClientRect().top + scrollY - innerHeight * .45))); }
    CH.on('[data-cerrada]', 'click', ev => {
      ev.preventDefault();
      const z = ev.currentTarget.dataset.cerrada;
      CH.hablar(z === 'plaza' ? { t: 'La plaza se abre cuando completes cuatro rutas.' } : { t: 'Primero termina tu primer episodio en la casa.' });
      CH.anunciar(z === 'plaza' ? 'La plaza se abre cuando completes cuatro rutas.' : 'Primero termina tu primer episodio en la casa.');
    });
    CH.on('[data-vecino]', 'click', ev => {
      const z = CH.zona(ev.currentTarget.dataset.vecino), s = CH.SORPRESAS.find(x => x.zona === z.id);
      CH.hablar({ t: s ? s.dato : '¡Hola!' }); CH.chispas(ev.currentTarget, 8);
    });
  };

  /* ================= ZONA (ruta) ================= */
  S.zona = id => {
    const z = CH.zona(id); if (!z || !P.abierta(id)) return CH.ir('#barrio');
    const ruta = CH.RUTAS[id], J = CH.JUEGOS_INFO.find(j => j.zona === id);
    const eps = ruta.map((ep, i) => {
      const hecho = CH.E.eps[ep.id], abierto = P.epAbierto(ep.id);
      const dentro = `<span class="num" aria-hidden="true">${hecho ? I.check : abierto ? i + 1 : I.candado}</span>
        <span class="crece"><b>${esc(ep.titulo)}</b>${hecho ? estrellasHTML(hecho.estrellas) : `<span class="t-nota">${abierto ? 'Listo para jugar' : 'Se abre al terminar el anterior'}</span>`}${ep.dorado ? '<span class="dorado-et">Cromo dorado</span>' : ''}</span>`;
      return `<li>${abierto ? `<a class="ep-fila ${hecho ? 'hecho' : 'listo'}" href="#ep/${ep.id}" aria-label="${hecho ? 'Repetir' : 'Jugar'}: ${esc(ep.titulo)}${hecho ? ', ' + hecho.estrellas + ' de 3 estrellas' : ''}">${dentro}<span class="btn ${hecho ? 'btn-borde' : 'btn-primario'} btn-chico" aria-hidden="true">${hecho ? 'Repetir' : 'Jugar'}</span></a>`
        : `<div class="ep-fila cerrado">${dentro}</div>`}</li>`;
    }).join('');
    const juego = J && CH.JUEGOS && CH.JUEGOS[J.id] ? (() => {
      const abierto = P.juegoAbierto(J.id), epJ = CH.epDeJuego(J.id), est = P.estrellasDe(J.id);
      const nota = abierto ? `${est} de 24 estrellas` : `Se abre en el episodio ${ruta.indexOf(epJ) + 1}`;
      return `<section class="tarjeta juego-t ${abierto ? '' : 'cerrado'}"><span class="juego-ico" aria-hidden="true">${CH.ilus('objeto', J.o)}</span><div class="crece"><span class="t-nota">Minijuego · 8 niveles</span><b>${esc(J.nombre)}</b><span class="t-nota">${nota}</span></div>${abierto ? `<a class="btn btn-borde btn-chico" href="#juego/${J.id}" aria-label="Jugar ${esc(J.nombre)}">Jugar</a>` : `<span class="candado-j" aria-hidden="true">${I.candado}</span>`}</section>`;
    })() : '';
    CH.pintar(`<div class="pantalla zona-p" style="--z:${z.color};--zt:${z.tinta}">
      <header class="zona-cab"><a class="btn-redondo" href="#barrio" aria-label="Volver al barrio">${I.atras}</a>
        <div class="crece"><span class="zona-et-c">${esc(z.nombre)}</span><h1 class="t-titulo">${esc(z.tema)}</h1></div></header>
      <div class="zona-heroe" aria-hidden="true">${CH.fondo(id, 'zona-fondo')}${z.quien === 'cocuyo' ? CH.cocuyo('celebrando', 'zona-quien') : CH.personaje(z.quien, 'zona-quien')}</div>
      <p class="t-nota">Con ${esc(z.quienNombre.replace(/^Tu /, 'tu ').replace(/^La /, 'la '))} · ${P.cuantos(id)} de ${P.total(id)} episodios</p>
      <ol class="eps">${eps}</ol>
      ${juego}
      ${id === 'cienaga' ? '<a class="btn btn-borde" href="#manglar">Ver mi manglar</a>' : ''}
    </div>${nav('barrio')}`, { voz: { t: z.nombre + '. ' + z.tema + '.' } });
  };

  /* ================= EPISODIO ================= */
  S.ep = id => {
    const z = id.replace(/-\d+$/, ''), ep = (CH.RUTAS[z] || []).find(e => e.id === id);
    if (!ep || !P.epAbierto(id)) return CH.ir('#barrio');
    // Límite suave diario: después de N episodios nuevos, Cocuyo propone descansar (los repasos siguen abiertos).
    if (!CH.E.eps[id] && CH.E.sesion.nuevos >= CH.E.aj.limite && !(CH.E.enCurso && CH.E.enCurso.ep === id)) return descanso(ep, z);
    CH.jugarEpisodio(ep, z);
  };
  function descanso(ep, z) {
    CH.pintar(`<div class="pantalla centrada">${CH.cocuyo('dormido', 'grande')}<h1 class="t-titulo">¿Descansamos?</h1><p>${esc(CH.FRASES.descanso)}</p>
      <div class="abajo"><a class="btn btn-primario" href="#barrio">Volver al barrio</a><button class="btn-texto" data-igual>Jugar igual este episodio</button></div></div>`, { voz: { t: CH.FRASES.descanso } });
    CH.on('[data-igual]', 'click', () => CH.jugarEpisodio(ep, z));
  }

  /* ================= CIERRE ================= */
  // Artículo y concordancia de cada zona: «el parque brilla», «los techos brillan».
  const NOMBRE_ZONA = { casa: ['la casa', 'brilla', 'encendida'], cuadra: ['la cuadra', 'brilla', 'encendida'], arroyo: ['el arroyo', 'brilla', 'encendido'], cienaga: ['la ciénaga', 'brilla', 'encendida'], techos: ['los techos', 'brillan', 'encendidos'], parque: ['el parque', 'brilla', 'encendido'], colegio: ['el colegio', 'brilla', 'encendido'], plaza: ['la plaza', 'brilla', 'encendida'] };
  const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
  CH.nombreZona = id => NOMBRE_ZONA[id] || [CH.zona(id).nombre, 'brilla', 'encendida'];
  const CONFETI = ['#FFB627', '#E85D2A', '#D9667B', '#1F7A5C', '#5B4BD6', '#1F6FA8', '#FFE58A'];
  S.cierre = ({ ep, zona, estrellas, nuevo, cromoNuevo }) => {
    const z = CH.zona(zona), cromo = CH.cromos().find(c => c.id === ep.id);
    const completa = P.completa(zona), i = CH.RUTAS[zona].indexOf(ep) + 1, n = P.cuantos(zona), t = P.total(zona);
    let sorpresa = null;
    if (completa) { const s = CH.SORPRESAS.find(x => x.zona === zona); if (s && CH.ganarCromo(s.id)) sorpresa = s; }
    const plazaNueva = nuevo && zona !== 'plaza' && completa && P.rutasCompletas() === 4;
    const fin = ep.id === 'plaza-5';
    const [art, verbo, enc] = CH.nombreZona(zona);
    const titulo = fin ? '¡El barrio entero brilla!' : completa && nuevo ? `¡${mayus(art)} ${enc}!` : `¡${mayus(art)} ${verbo} más!`;
    const falta = t - n;
    const avance = completa ? `¡Encendiste ${art}!` : `Faltan ${falta} episodio${falta > 1 ? 's' : ''} para encender ${art}`;
    const voz = { t: `${titulo} ${cromoNuevo ? 'Ganaste un cromo nuevo.' : ''} ${sorpresa ? '¡Sorpresa! ' + sorpresa.dato : ''} ${plazaNueva ? '¡Se abrió la plaza, el taller de inventores!' : ''}` };
    const confeti = CH.menosMovimiento() ? '' : Array.from({ length: 28 }, (_, k) => `<i style="--x:${(k * 37) % 100}%;--d:${(k % 7) * .12}s;--r:${(k * 53) % 360}deg;--c:${CONFETI[k % CONFETI.length]};--t:${2.4 + (k % 5) * .35}s"></i>`).join('');
    CH.pintar(`<div class="pantalla cierre" style="--z:${z.color}">
      <div class="cierre-cielo" aria-hidden="true"><span class="cierre-rayos"></span><span class="cierre-halo"></span><span class="confeti">${confeti}</span></div>
      <div class="cierre-cab">${CH.cocuyo('celebrando', 'coc-cierre')}
        <h1 class="t-display claro">${esc(titulo)}</h1>
        <p class="claro suave">Terminaste el episodio ${i}: ${esc(ep.titulo)}${/[?!]$/.test(ep.titulo) ? '' : '.'}</p>
        <span class="estrellas cierre-estrellas" role="img" aria-label="${estrellas} de 3 estrellas">${[0, 1, 2].map(k => `<span style="--k:${k}">${k < estrellas ? I.estrella : I.estrellaVacia}</span>`).join('')}</span></div>
      ${cromo ? `<div class="cierre-cromo">${cromoNuevo ? '<span class="cinta-nuevo">¡Cromo nuevo!</span>' : ''}<button class="cromo-t ${cromo.tipo} ${cromoNuevo ? 'aparece' : ''}" data-voltear aria-label="Cromo: ${esc(cromo.t)}. Toca para ver el dato.">${cromoHTML(cromo)}<span class="cromo-brillo" aria-hidden="true"></span></button></div>` : ''}
      ${!fin ? `<div class="cierre-avance"><span class="segmentos" aria-hidden="true">${CH.RUTAS[zona].map(e => `<i class="${CH.E.eps[e.id] ? 'si' : ''}"></i>`).join('')}</span><span>${esc(mayus(z.nombre))} · ${n} de ${t} · ${esc(avance)}</span></div>` : ''}
      ${sorpresa ? `<p class="aviso-claro">${CH.personaje(sorpresa.p, 'mini-cara')}<span><b>¡Sorpresa!</b> ${esc(sorpresa.dato)} Búscalo en tu mapa.</span></p>` : ''}
      ${plazaNueva ? `<p class="aviso-claro">${CH.cocuyo('senalando', 'mini-cara')}<span>¡Se abrió la Plaza: el taller de inventores!</span></p>` : ''}
      <div class="abajo">${fin ? '<a class="btn btn-primario" href="#diploma">Ver mi diploma</a>' : cromo ? `<a class="btn btn-primario" href="#album/${zona}">Pegar en mi álbum</a>` : `<a class="btn btn-primario" href="#zona/${zona}">Seguir</a>`}<a class="btn btn-claro" href="#barrio">Volver al barrio</a></div>
    </div>`, { clase: 'modo-noche', voz });
    CH.sonido('cromo');
    setTimeout(() => CH.chispas(CH.$main.querySelector('.cierre-cromo .cromo-t') || CH.$main.querySelector('.coc-cierre'), 24), CH.menosMovimiento() ? 0 : 1300);
    CH.on('[data-voltear]', 'click', ev => { ev.currentTarget.classList.toggle('volteado'); if (cromo) CH.hablar({ t: cromo.dato }); });
  };

  /* ================= ÁLBUM ================= */
  function cromoHTML(c) {
    const z = CH.zona(c.zona), color = z ? z.color : '#FFB627', tinta = z ? z.tinta : '#2B211D';
    const arte = c.p ? CH.personaje(c.p, 'cromo-arte') : c.o === 'cocuyo' ? CH.cocuyo('celebrando', 'cromo-arte') : CH.ilus('objeto', c.o || 'estrella', { cls: 'cromo-arte' });
    const n = CH.cromos().findIndex(x => x.id === c.id) + 1;
    if (c.tipo === 'sello') return `<span class="cromo-cara sello-cara"><span class="punto-luz" aria-hidden="true"></span><b>${esc(c.t)}</b></span>
      <span class="cromo-dorso sello-dorso" style="--c:#FFB627"><span>${esc(c.dato)}</span></span>`;
    return `<span class="cromo-cara" style="--c:${color};--t:${tinta}"><span class="cromo-cab"><span class="cab-largo">${esc(z ? z.nombre : 'Reto')} · </span>N.º ${n}</span><span class="cromo-marco">${arte}</span><span class="cromo-nombre">${esc(c.t)}</span></span>
      <span class="cromo-dorso" style="--c:${color}"><span>${esc(c.dato)}</span>${c.f && CH.F[c.f] ? `<small>Fuente: ${esc(CH.F[c.f].nombre)}</small>` : ''}</span>`;
  }
  CH.cromoHTML = cromoHTML;
  // El álbum es un libro: portada → índice de 9 secciones → página de cada sección.
  const GRUPOS = () => [...CH.ZONAS.map(z => ({ id: z.id, n: z.nombre, tema: z.tema, c: z.color, t: z.tinta })), { id: 'reto', n: 'Reto', tema: 'Reto de 14 días', c: '#3A2E3F', t: '#FFFFFF' }];
  const tiene = id => CH.E.cromos.includes(id);
  S.album = param => {
    const todos = CH.cromos(), grupos = GRUPOS();
    if (!param) return albumPortada(todos);
    if (param === 'indice') return albumIndice(todos, grupos);
    const g = grupos.find(x => x.id === param);
    return g ? albumPagina(todos, grupos, g) : CH.ir('#album');
  };
  function albumPortada(todos) {
    const n = CH.E.cromos.length, nuevos = CH.E.nuevos.length;
    CH.pintar(`<div class="pantalla album-portada">
      <h1 class="solo-lector">Mi álbum</h1>
      <button class="libro" data-abrir aria-label="Abrir mi álbum. Tienes ${n} de ${todos.length} cromos.">
        <span class="libro-paginas" aria-hidden="true"></span>
        <span class="libro-tapa" aria-hidden="true">
          <span class="libro-lomo"></span>
          <span class="libro-sello">Álbum de inventor</span>
          <span class="libro-titulo">Mi barrio<br>verde</span>
          <span class="libro-coc">${CH.cocuyo('celebrando')}</span>
          <span class="libro-cuenta"><b>${n}</b> de ${todos.length} cromos</span>
          <span class="libro-barra"><i style="width:${Math.round(n / todos.length * 100)}%"></i></span>
        </span>
      </button>
      ${nuevos ? `<p class="aviso-nuevo"><b>${nuevos}</b> cromo${nuevos > 1 ? 's' : ''} nuevo${nuevos > 1 ? 's' : ''} para pegar</p>` : ''}
      <button class="btn btn-primario" data-abrir>Abrir mi álbum</button>
    </div>${nav('album')}`, { voz: { t: `Tu álbum. Tienes ${n} de ${todos.length} cromos.` } });
    CH.on('[data-abrir]', 'click', () => {
      const libro = CH.$main.querySelector('.libro'); libro.classList.add('abierto'); CH.sonido('pasa');
      setTimeout(() => CH.ir('#album/indice'), CH.menosMovimiento() ? 0 : 520);
    });
  }
  function albumIndice(todos, grupos) {
    const nuevos = CH.E.nuevos;
    CH.pintar(`<div class="pantalla album-indice">
      <header class="barra"><a class="btn-redondo" href="#album" aria-label="Cerrar el álbum">${I.atras}</a>
        <div class="crece"><h1 class="t-titulo">Mi álbum</h1><span class="t-nota">${CH.E.cromos.length} de ${todos.length} cromos · elige una sección</span></div></header>
      <ul class="secciones">${grupos.map(g => {
        const lista = todos.filter(c => c.zona === g.id), ok = lista.filter(c => tiene(c.id)).length, hay = lista.some(c => nuevos.includes(c.id));
        const arte = g.id === 'reto' ? `<span class="seccion-reto">${frascoSVG(Object.keys(CH.E.reto).length, true)}</span>` : CH.fondo(g.id, 'seccion-fondo');
        return `<li><a class="seccion ${ok === lista.length ? 'llena' : ''}" href="#album/${g.id}" style="--z:${g.c};--zt:${g.t}" aria-label="${esc(g.n)}: ${ok} de ${lista.length} cromos${hay ? ', con cromos nuevos' : ''}">
          <span class="seccion-arte" aria-hidden="true">${arte}</span>
          <span class="seccion-pie" aria-hidden="true"><b>${esc(g.n)}</b><span>${ok}/${lista.length}</span></span>
          <span class="seccion-barra" aria-hidden="true"><i style="width:${Math.round(ok / lista.length * 100)}%"></i></span>
          ${hay ? '<span class="seccion-nuevo" aria-hidden="true">Nuevo</span>' : ''}</a></li>`;
      }).join('')}</ul>
    </div>${nav('album')}`);
  }
  function albumPagina(todos, grupos, g) {
    const lista = todos.filter(c => c.zona === g.id), ok = lista.filter(c => tiene(c.id)).length;
    const nuevos = CH.E.nuevos.filter(id => lista.some(c => c.id === id));
    const i = grupos.indexOf(g), ant = grupos[(i + grupos.length - 1) % grupos.length], sig = grupos[(i + 1) % grupos.length];
    const sellos = g.id === 'reto';
    CH.pintar(`<div class="pantalla album-pagina" style="--z:${g.c};--zt:${g.t}">
      <header class="barra"><a class="btn-redondo" href="#album/indice" aria-label="Volver al índice del álbum">${I.atras}</a>
        <div class="crece"><span class="zona-et-c">${esc(g.n)}</span><h1 class="t-titulo">${esc(g.tema)}</h1></div>
        <span class="pildora" role="img" aria-label="${ok} de ${lista.length} cromos">${ok}/${lista.length}</span></header>
      <div class="album-hoja ${sellos ? 'sellos' : ''}">
        <ul class="cromos">${lista.map(c => {
          const num = todos.indexOf(c) + 1;
          return tiene(c.id)
            ? `<li><button class="cromo-t mini ${c.tipo} ${nuevos.includes(c.id) ? 'es-nuevo' : ''}" data-cromo="${c.id}" aria-label="Cromo ${num}: ${esc(c.t)}. Toca para ver el dato.">${cromoHTML(c)}</button></li>`
            : `<li><span class="cromo-vacio" role="img" aria-label="Cromo ${num}, sin ganar"><b>${num}</b></span></li>`;
        }).join('')}</ul>
      </div>
      <p class="t-nota centrado">${ok ? 'Toca un cromo para darle la vuelta y leer su dato.' : 'Juega los episodios para ganar estos cromos.'}</p>
      <nav class="album-pasar" aria-label="Otras secciones"><a class="btn btn-borde btn-chico" href="#album/${ant.id}">${I.atras}<span>${esc(ant.n)}</span></a><a class="btn btn-borde btn-chico" href="#album/${sig.id}"><span>${esc(sig.n)}</span>${I.flecha}</a></nav>
    </div>${nav('album')}`, { voz: { t: `${g.n}. ${ok} de ${lista.length} cromos.` } });
    // Los cromos nuevos de esta sección ya se vieron: se pegan con una animación.
    if (nuevos.length) { CH.E.nuevos = CH.E.nuevos.filter(id => !nuevos.includes(id)); CH.guardar(); CH.sonido('cromo'); }
    CH.on('[data-cromo]', 'click', ev => { const c = todos.find(x => x.id === ev.currentTarget.dataset.cromo); ev.currentTarget.classList.toggle('volteado'); CH.hablar({ t: c.t + '. ' + c.dato }); });
  }

  /* ================= RETO DE 14 DÍAS ================= */
  // Frasco de cocuyos: cada día hecho enciende uno. 14 lugares fijos dentro del vidrio.
  const LUGARES_F = [[70, 196], [118, 204], [150, 178], [92, 166], [52, 150], [130, 146], [100, 126], [146, 112], [62, 112], [84, 88], [120, 84], [150, 80], [56, 80], [104, 196]];
  function frascoSVG(n, mini, recien = -1) {
    const brillo = Math.min(1, n / 14);
    const bichos = LUGARES_F.map(([x, y], k) => k < n
      ? `<g class="cf ${k === recien ? 'recien' : ''}" style="--k:${k}" transform="translate(${x} ${y})"><circle r="15" fill="url(#f-luz)"/><ellipse cx="0" cy="1" rx="4.5" ry="6" fill="#5A3526"/><circle cx="0" cy="4" r="4" fill="#FFE58A"/><path d="M-4 -2 l-6 -5 M4 -2 l6 -5" stroke="#F4EBDD" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>`
      : `<circle cx="${x}" cy="${y}" r="4" fill="none" stroke="#F4EBDD" stroke-opacity=".28" stroke-width="2" stroke-dasharray="3 3"/>`).join('');
    return `<svg viewBox="0 0 200 250" class="frasco-svg" ${mini ? 'aria-hidden="true"' : `role="img" aria-label="Frasco con ${n} de 14 cocuyos encendidos"`}>
      <defs><radialGradient id="f-luz"><stop offset="0" stop-color="#FFE58A" stop-opacity=".95"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>
      <radialGradient id="f-dentro" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="#FFD34D" stop-opacity="${(.15 + brillo * .6).toFixed(2)}"/><stop offset="1" stop-color="#FFD34D" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="100" cy="238" rx="78" ry="9" fill="#000" opacity=".25"/>
      <path d="M60 46 H140 V58 C168 66 176 84 176 104 V206 C176 222 164 232 148 232 H52 C36 232 24 222 24 206 V104 C24 84 32 66 60 58 Z" fill="#9FC9DE" fill-opacity=".16" stroke="#F4EBDD" stroke-width="3"/>
      <path d="M60 46 H140 V58 C168 66 176 84 176 104 V206 C176 222 164 232 148 232 H52 C36 232 24 222 24 206 V104 C24 84 32 66 60 58 Z" fill="url(#f-dentro)"/>
      ${bichos}
      <path d="M40 112 C40 96 46 86 58 80 M40 128 V196" stroke="#FFFFFF" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" fill="none"/>
      <rect x="50" y="18" width="100" height="30" rx="9" fill="#C2451C" stroke="#2A2130" stroke-width="3"/>
      <path d="M56 30 H144" stroke="#E85D2A" stroke-width="5" stroke-linecap="round"/>
      <path d="M66 18 c4 -12 64 -12 68 0" fill="none" stroke="#C99B6A" stroke-width="3"/></svg>`;
  }
  let retoRecien = -1;
  S.reto = () => {
    const R = CH.E.reto, hechos = Object.keys(R).length, hoy = CH.hoy();
    const hoyHecho = Object.values(R).includes(hoy);
    const dia = hechos + 1;
    const tarjeta = hechos >= 14
      ? `<section class="reto-hoy completo">${CH.cocuyo('celebrando', 'reto-coc')}<div><h2 class="t-sub">¡Frasco lleno!</h2><p>Hiciste las 14 acciones. Tu diploma te espera.</p></div><a class="btn btn-primario" href="#diploma">Ver mi diploma</a></section>`
      : hoyHecho ? `<section class="reto-hoy hecho">${CH.cocuyo('dormido', 'reto-coc')}<div><h2 class="t-sub">¡Encendiste el cocuyo ${hechos}!</h2><p>Vuelve mañana para el día ${dia}. Si un día no puedes, el reto te espera.</p></div></section>`
      : `<section class="reto-hoy"><span class="reto-dia">Día ${dia} de 14</span><h2 class="t-sub">${esc(CH.RETO[dia - 1])}</h2><p class="t-nota">En casa, con tu familia · de 2 a 5 minutos</p><button class="btn btn-primario" data-hice>¡Lo hice!</button></section>`;
    CH.pintar(`<div class="pantalla reto">
      <div class="reto-cielo" aria-hidden="true">${Array.from({ length: 16 }, (_, k) => `<i style="--x:${(k * 41 + 7) % 100}%;--y:${(k * 23 + 5) % 46}%;--d:${(k % 6) * .4}s"></i>`).join('')}</div>
      <header class="reto-cab"><h1 class="t-titulo">Reto de 14 días</h1><p>Cada acción enciende un cocuyo en tu frasco.</p></header>
      <div class="reto-frasco"><div class="frasco">${frascoSVG(hechos, false, retoRecien)}</div><p class="frasco-cuenta"><b>${hechos}</b><span>de 14<br>cocuyos</span></p></div>
      ${tarjeta}
      <ol class="reto-dias" aria-label="Días del reto">${CH.RETO.map((t, i) => { const d = i + 1, h = R[d], es = d === dia && !hoyHecho; return `<li class="${h ? 'hecho' : es ? 'hoy' : ''}"><span class="d" aria-hidden="true">${h ? '<i class="punto-luz"></i>' : d}</span><span class="solo-lector">Día ${d}: ${h ? 'hecho' : es ? 'hoy' : 'pendiente'}.</span></li>`; }).join('')}</ol>
    </div>${nav('reto')}`, { clase: 'modo-noche', voz: hechos < 14 && !hoyHecho ? { t: 'Día ' + dia + '. ' + CH.RETO[dia - 1] } : null });
    retoRecien = -1;
    CH.on('[data-hice]', 'click', ev => {
      CH.E.reto[dia] = hoy; CH.ganarCromo('reto-' + dia); CH.guardar(); CH.sonido('cromo'); retoRecien = hechos;
      if (!CH.menosMovimiento()) {
        const b = ev.currentTarget.getBoundingClientRect(), f = CH.$main.querySelector('.frasco').getBoundingClientRect();
        const v = document.createElement('i'); v.className = 'vuela-cocuyo';
        v.style.left = (b.left + b.width / 2) + 'px'; v.style.top = b.top + 'px';
        v.style.setProperty('--dx', (f.left + f.width / 2 - b.left - b.width / 2) + 'px'); v.style.setProperty('--dy', (f.top + f.height * .55 - b.top) + 'px');
        document.body.appendChild(v); setTimeout(() => v.remove(), 1000);
      }
      setTimeout(S.reto, CH.menosMovimiento() ? 0 : 900);
    });
  };

  /* ================= MANGLAR QUE CRECE CON LOS DÍAS ================= */
  const ETAPAS = [
    { n: 'Propágulo sembrado', especie: null },
    { n: 'Brotan las primeras hojas', especie: 'cangrejo' },
    { n: 'Salen raíces como patas', especie: 'pez' },
    { n: 'Un arbolito con sombra', especie: 'ostra' },
    { n: 'Llegan las aves', especie: 'garza' },
    { n: 'Un pequeño bosque', especie: 'pajaro' },
    { n: '¡Tu manglar está completo!', especie: 'medusa' }
  ];
  CH.etapaManglar = () => { if (!CH.E.manglar) return -1; return Math.min(ETAPAS.length - 1, CH.E.dias.filter(d => d >= CH.E.manglar).length - 1); };
  const manglarSVG = etapa => {
    const arboles = Math.min(5, etapa + 1), alto = 60 + etapa * 22;
    let g = '';
    for (let k = 0; k < arboles; k++) {
      const x = 90 + k * 55 + (k % 2) * 12, h = alto - k * 14, r = Math.max(14, 18 + etapa * 5 - k * 3);
      g += etapa === 0 && k === 0 ? `<path d="M${x} 210 c3 -18 3 -40 0 -58 c-3 18 -3 40 0 58z" fill="#6E8B3D" stroke="#5A3526" stroke-width="3"/>`
        : `<g><path d="M${x} 212 v-${h}" stroke="#8A4B2A" stroke-width="5"/>${etapa >= 2 ? `<path d="M${x} ${212 - h * 0.45} c-12 6 -18 20 -22 30 M${x} ${212 - h * 0.45} c12 6 18 20 22 30" stroke="#8A4B2A" stroke-width="3.5" fill="none" stroke-linecap="round"/>` : ''}<circle cx="${x}" cy="${212 - h}" r="${r}" fill="#2E8B57" stroke="#5A3526" stroke-width="3"/></g>`;
    }
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Tu manglar: ${esc(ETAPAS[etapa].n)}"><rect width="400" height="260" fill="#DDEFE3"/><path d="M0 200 h400 v60 h-400z" fill="#4BA3D3"/><path d="M0 200 c40 -8 80 8 120 0 s80 -8 120 0 s80 8 160 0" fill="none" stroke="#FFF" stroke-width="3" opacity=".6"/>${g}</svg>`;
  };
  S.manglar = () => {
    const e = CH.etapaManglar();
    if (e < 0) {
      CH.pintar(`<div class="pantalla"><div class="barra"><a class="btn-redondo" href="#casillero" aria-label="Volver">${I.atras}</a></div><h1 class="t-titulo">Mi manglar</h1>
        ${CH.personaje('tomas', 'grande')}<p>Tu manglar se siembra con Tomás en el episodio 4 de la Ciénaga. Después crece un poquito cada día que vuelvas.</p></div>${nav('casillero')}`);
      return;
    }
    const especies = ETAPAS.slice(1, e + 1).map(x => x.especie);
    CH.pintar(`<div class="pantalla"><div class="barra"><a class="btn-redondo" href="#casillero" aria-label="Volver">${I.atras}</a></div>
      <h1 class="t-titulo">Mi manglar</h1><p class="t-nota">Etapa ${e + 1} de ${ETAPAS.length}: ${esc(ETAPAS[e].n)}</p>
      <div class="manglar-escena">${manglarSVG(e)}</div>
      <p>Crece una etapa por cada día que abres chispa. Si no vienes, no se marchita: te espera.</p>
      <h2 class="t-sub">Quiénes llegaron</h2>
      <ul class="especies">${especies.length ? especies.map(s => `<li>${CH.ilus('objeto', s)}</li>`).join('') : '<li class="t-nota">Aún nadie. ¡Vuelve mañana!</li>'}</ul>
    </div>${nav('casillero')}`);
  };

  /* ================= CASILLERO (lo mío) ================= */
  S.casillero = () => {
    const est = P.estrellas(), misiones = Object.keys(CH.E.misiones);
    const todosEps = CH.ZONAS.flatMap(z => CH.RUTAS[z.id]);
    CH.pintar(`<div class="pantalla">
      <h1 class="t-titulo">Mi casillero</h1>
      <section class="casillero-yo">${CH.avatar(CH.E.avatar, 'av-grande')}<div><b>${nivelNombre()}</b><span class="pildora">${I.estrella}<b>${est}</b> estrellas</span><button class="btn btn-borde btn-chico" data-cambiar>Cambiar inventor o edad</button></div></section>
      <section><h2 class="t-sub">Accesorios</h2><p class="t-nota">Se abren con estrellas. No hay tienda ni monedas.</p>
        <ul class="accesorios">${CH.ACCESORIOS.map(a => { const ok = est >= a.estrellas; return `<li><button class="acc ${ok ? '' : 'cerrado'}" ${ok ? '' : 'disabled'} data-acc="${a.id}" aria-pressed="${CH.E.accesorio === a.id}">${CH.ilus('objeto', a.o)}<span>${esc(a.n)}</span><small>${ok ? (CH.E.accesorio === a.id ? 'Puesto' : 'Ponerlo') : a.estrellas + ' estrellas'}</small></button></li>`; }).join('')}</ul></section>
      <section><h2 class="t-sub">Misiones en casa</h2>${misiones.length ? `<ul class="lista-misiones">${misiones.map(id => { const ep = todosEps.find(e => e.id === id), m = ep && ep.pasos.find(p => p.tipo === 'mision'); const t = m ? (CH.E.nivel === 'experto' && m.x ? m.x : m.t) : ''; const ok = CH.E.misiones[id]; return `<li class="tarjeta"><p class="t-nota">${esc(ep ? ep.titulo : '')}</p><p>${esc(t)}</p><button class="btn ${ok ? 'btn-borde' : 'btn-oscuro'} btn-chico" data-mision="${id}" aria-pressed="${ok}">${ok ? '¡Hecha!' : 'La hicimos'}</button></li>`; }).join('')}</ul>` : '<p class="t-nota">Aparecen al terminar la última parte de cada ruta.</p>'}</section>
      <section class="fila-enlaces"><a class="btn btn-borde" href="#manglar">${I.hoja}Mi manglar</a><a class="btn btn-borde" href="#bitacora">${I.reto}Bitácora</a><a class="btn btn-borde" href="#galeria">${I.lapiz}Galería</a></section>
    </div>${nav('casillero')}`);
    CH.on('[data-cambiar]', 'click', () => { CH.E.visto = false; CH.guardar(); eleccion(); });
    CH.on('[data-acc]', 'click', ev => { const id = ev.currentTarget.dataset.acc; CH.E.accesorio = CH.E.accesorio === id ? null : id; CH.guardar(); CH.sonido('toque'); S.casillero(); });
    CH.on('[data-mision]', 'click', ev => { const id = ev.currentTarget.dataset.mision; CH.E.misiones[id] = !CH.E.misiones[id]; CH.guardar(); if (CH.E.misiones[id]) { CH.sonido('cromo'); CH.hablar({ t: CH.FRASES.misionHecha }); } S.casillero(); });
  };
  S.bitacora = () => {
    const B = CH.E.bitacora.slice().reverse();
    CH.pintar(`<div class="pantalla"><div class="barra"><a class="btn-redondo" href="#casillero" aria-label="Volver">${I.atras}</a></div>
      <h1 class="t-titulo">Mi bitácora</h1><p class="t-nota">Se guarda solo en este aparato. La empiezas en el Colegio.</p>
      ${B.length ? `<table class="tabla"><caption class="solo-lector">Registros por día</caption><thead><tr><th scope="col">Día</th><th scope="col">Bolsas</th><th scope="col">Botellas</th><th scope="col">Luces sin uso</th></tr></thead><tbody>${B.map(r => `<tr><th scope="row">${esc(r.fecha.slice(5).split('-').reverse().join('/'))}</th><td>${r.bolsas}</td><td>${r.botellas}</td><td>${r.luces}</td></tr>`).join('')}</tbody></table>` : '<p>Aún no hay registros.</p>'}
      ${CH.RUTAS.colegio && CH.E.eps['colegio-3'] ? '<button class="btn btn-primario" data-hoy>Anotar lo de hoy</button>' : ''}
      ${B.length ? CH.infografiaHTML((CH.E.infografia || {}).color, (CH.E.infografia || {}).icono) : ''}
    </div>${nav('casillero')}`);
    CH.on('[data-hoy]', 'click', () => {
      const ep = { id: 'bitacora-libre', titulo: 'Mi bitácora', pasos: [{ tipo: 'bitacora', pide: { t: 'Anota lo de hoy.' } }] };
      // Reutiliza la actividad dentro de un marco simple.
      CH.pintar(`<div class="pantalla"><div data-lienzo class="lienzo-simple"></div><section data-hoja class="hoja-simple"></section></div>`);
      const ctx = { ep, zona: 'colegio', quien: 'seno-ines', lienzo: CH.$main.querySelector('[data-lienzo]'), hoja: CH.$main.querySelector('[data-hoja]'),
        actor(l) { this.lienzo.innerHTML = `<div class="actor"><div class="actor-cuerpo">${CH.personaje('seno-ines', 'actor-fig')}</div><p class="globo">${esc(CH.texto(l))}</p></div>`; },
        respuesta(b, t) { CH.anunciar(t); }, seguir(fn) { fn(); }, terminar() { CH.ir('#bitacora'); S.bitacora(); } };
      CH.ACT.bitacora(ep.pasos[0], ctx);
    });
  };
  S.galeria = () => {
    const D = CH.E.dibujos.slice().reverse();
    CH.pintar(`<div class="pantalla"><div class="barra"><a class="btn-redondo" href="#casillero" aria-label="Volver">${I.atras}</a></div>
      <h1 class="t-titulo">Mi galería</h1><p class="t-nota">Tus dibujos e inventos. Se guardan solo en este aparato.</p>
      ${CH.E.problema ? `<div class="revela">${CH.cartelHTML()}</div>` : ''}
      ${D.length ? `<ul class="galeria">${D.map((d, i) => `<li><figure><img src="${d.img}" alt="Dibujo: ${esc(d.tema)}"><figcaption>${esc(d.tema)}</figcaption></figure></li>`).join('')}</ul>` : '<p>Aún no hay dibujos.</p>'}
    </div>${nav('casillero')}`);
  };

  /* ================= CARTEL Y DIPLOMA ================= */
  CH.cartelHTML = () => {
    const pr = CH.E.problema, te = CH.E.tecno, pa = CH.E.para;
    const boceto = CH.E.dibujos.slice().reverse().find(d => d.ep === 'plaza-3');
    const nombre = te ? te.t.replace(/^(Una|Un|Unos|Unas) /, m => m.trim() === 'Una' || m.trim() === 'Unas' ? 'La ' : 'El ') : 'Mi invento';
    return `<article class="cartel"><span class="cartel-et">Feria del barrio · Invento</span><h2>${esc(nombre.charAt(0).toUpperCase() + nombre.slice(1))}</h2>${pr ? `<p class="cartel-sub">Para resolver: ${esc(pr.t.toLowerCase())}</p>` : ''}
      ${boceto ? `<img class="cartel-boceto" src="${boceto.img}" alt="Boceto del invento">` : `<div class="cartel-ico">${CH.ilus('objeto', (te && te.o) || 'lapiz')}</div>`}
      <dl><dt>Problema</dt><dd>${esc(pr ? pr.t : '—')}</dd><dt>Tecnología verde</dt><dd>${esc(te ? te.t : '—')}</dd><dt>Para</dt><dd>${esc(pa ? pa.t : '—')}</dd><dt>Probado con</dt><dd>Lluvia, sol y noche</dd></dl>
      <p class="cartel-autor">${CH.avatar(CH.E.avatar, 'mini-cara')} Inventor del barrio · chispa</p></article>`;
  };
  S.diploma = () => {
    const fechaTxt = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    CH.pintar(`<div class="pantalla"><div class="barra no-imprimir"><a class="btn-redondo" href="#barrio" aria-label="Volver">${I.atras}</a><span class="crece"></span><button class="btn btn-borde btn-chico" data-imprimir>${I.imprimir}Imprimir</button></div>
      <article class="diploma"><span class="logo">${window.ARTE.logo}</span><p class="t-nota">Diploma de</p><h1 class="t-display">${/^Inventora/.test((CH.AVATARES.find(a => a.id === CH.E.avatar) || {}).nombre || '') ? 'Inventora' : 'Inventor'} del barrio</h1>
      ${CH.avatar(CH.E.avatar, 'av-diploma')}
      <p>Por separar, cuidar el agua y el manglar, ahorrar energía, sembrar sombra, leer datos con lupa e inventar soluciones para su barrio.</p>
      <p class="t-nota">${P.zonasEncendidas()} zonas encendidas · ${CH.E.cromos.length} cromo${CH.E.cromos.length === 1 ? '' : 's'} · ${Object.keys(CH.E.reto).length} día${Object.keys(CH.E.reto).length === 1 ? '' : 's'} de reto</p>
      <p class="firma">${CH.cocuyo('celebrando', 'mini-cara')} Cocuyo · ${esc(fechaTxt)}</p></article>
    </div>`);
    CH.on('[data-imprimir]', 'click', () => window.print());
  };

  /* ================= ADULTOS ================= */
  let puerta = false;
  S.adultos = () => {
    if (!puerta) {
      const a = 11 + Math.floor(Math.random() * 8), b = 12 + Math.floor(Math.random() * 7);
      CH.pintar(`<div class="pantalla"><div class="barra"><a class="btn-redondo" href="#barrio" aria-label="Volver">${I.atras}</a></div>
        <h1 class="t-titulo">Esta parte es para adultos</h1><p>Para entrar, resuelve: <b>${a} × ${b}</b></p>
        <div class="campo"><label for="puerta">Resultado</label><input id="puerta" inputmode="numeric" autocomplete="off"></div><p class="t-nota" data-msg role="status"></p>
        <div class="acciones"><button class="btn btn-primario" data-ok>Entrar</button></div></div>`);
      const entrar = () => { if (+CH.$main.querySelector('#puerta').value === a * b) { puerta = true; S.adultos(); } else CH.$main.querySelector('[data-msg]').textContent = 'Ese no es el resultado. Pídele ayuda a un adulto.'; };
      CH.on('[data-ok]', 'click', entrar);
      CH.$main.querySelector('#puerta').addEventListener('keydown', ev => { if (ev.key === 'Enter') entrar(); });
      return;
    }
    const aj = CH.E.aj;
    const sw = (k, t, d) => `<div class="ajuste"><span><b id="aj-${k}">${t}</b>${d ? `<small>${d}</small>` : ''}</span><button role="switch" aria-checked="${!!aj[k] && aj[k] !== 'normal'}" aria-labelledby="aj-${k}" data-aj="${k}" class="interruptor"><i></i></button></div>`;
    const recientes = Object.entries(CH.E.eps).sort((x, y) => (y[1].fecha > x[1].fecha ? 1 : -1)).slice(0, 4).map(([id]) => { const z = id.replace(/-\d+$/, ''); const ep = CH.RUTAS[z].find(e => e.id === id); return `${CH.zona(z).nombre}: ${ep.titulo}`; });
    const usadas = new Set(); CH.ZONAS.forEach(z => CH.RUTAS[z.id].forEach(ep => { if (ep.cromo && ep.cromo.f) usadas.add(ep.cromo.f); ep.pasos.forEach(p => { if (p.fuente) usadas.add(p.fuente); if (p.pregunta && p.pregunta.fuente) usadas.add(p.pregunta.fuente); (p.cartas || []).concat(p.xcartas || []).forEach(c => c.f && usadas.add(c.f)); }); }));
    CH.pintar(`<div class="pantalla adultos">
      <div class="barra"><a class="btn-redondo" href="#barrio" aria-label="Volver al barrio">${I.atras}</a><div class="crece"><h1 class="t-titulo">Para adultos</h1><span class="t-nota">Familias y docentes</span></div></div>
      <nav class="indice-chips" aria-label="Secciones">${[['progreso', 'Progreso'], ['ajustes', 'Ajustes'], ['familia', 'Familia'], ['aula', 'Modo aula'], ['aprende', 'Qué aprende'], ['privacidad', 'Privacidad'], ['fuentes', 'Fuentes']].map(([h, t]) => `<a class="chip" href="#adultos" data-ir="${h}">${t}</a>`).join('')}</nav>
      <section id="s-progreso" class="tarjeta"><h2>Progreso</h2><div class="stats"><div><b>${P.zonasEncendidas()} de 8</b><span>zonas encendidas</span></div><div><b>${Object.keys(CH.E.eps).length} de 33</b><span>episodios</span></div><div><b>${CH.E.cromos.length}</b><span>cromos</span></div><div><b>${Object.keys(CH.E.reto).length} de 14</b><span>días del reto</span></div><div><b>${P.nivelesSuperados ? P.nivelesSuperados() : 0} de 56</b><span>niveles de minijuegos</span></div><div><b>${P.estrellas()}</b><span>estrellas en total</span></div></div></section>
      <section id="s-ajustes"><h2>Ajustes</h2><div class="lista-ajustes">
        ${sw('voz', 'Voz de Cocuyo y sonidos')}${sw('vozLenta', 'Voz más lenta')}${sw('letra', 'Letra más grande')}${sw('movimiento', 'Menos movimiento')}${sw('sinTiempo', 'Juegos sin tiempo', 'Los minijuegos esperan sin apurar.')}
        <div class="ajuste"><span><b id="aj-lim">Episodios nuevos por día</b><small>Después, Cocuyo propone descansar.</small></span><div class="paso-c"><button class="btn-redondo" data-lim="-1" aria-label="Menos">−</button><output aria-labelledby="aj-lim">${aj.limite}</output><button class="btn-redondo" data-lim="1" aria-label="Más">+</button></div></div>
        <div class="ajuste"><span><b>Nivel</b><small>${nivelNombre()} (${CH.E.nivel === 'experto' ? '11 a 12' : '8 a 10'} años)</small></span><button class="btn btn-borde btn-chico" data-nivel>Cambiar</button></div></div></section>
      <section id="s-familia" class="tarjeta crema"><h2>Rincón de la familia</h2>
        ${recientes.length ? `<p><b>Lo último que aprendió:</b></p><ul>${recientes.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : '<p>Aún no ha terminado episodios.</p>'}
        <p><b>Tres preguntas para la mesa:</b></p><ol><li>¿Qué cosa de la casa podría tener otra vida?</li><li>¿Dónde se siente más fresco en la casa, y por qué?</li><li>¿Qué invento harías para el barrio?</li></ol>
        <p>Las misiones para hacer juntos están en «Casillero». Ninguna lleva a los niños a la calle ni cerca de un arroyo.</p></section>
      <section id="s-aula"><h2>Modo aula</h2><p>Ocho sesiones de 45 minutos. En un computador o televisor horizontal, chispa muestra la escena grande y el panel al lado, para proyectar.</p>
        <ol class="aula">${CH.AULA.map((s, i) => `<li><b>Sesión ${i + 1} · ${esc(CH.zona(s.z).nombre)}: ${esc(s.t)}</b><span>Juntos: un episodio de la ruta en voz alta, con el curso votando cada respuesta (20 min). En grupo: ${esc(s.g)} (20 min). Cierre: el dato con su fuente (5 min).</span></li>`).join('')}</ol>
        <p class="t-nota">Apoya el Proyecto Ambiental Escolar (PRAE, Ley 1549 de 2012).</p></section>
      <section id="s-aprende"><h2>Qué aprende</h2><p>Ocho rutas sobre tecnología verde en su barrio: separar en la fuente, el viaje de los residuos y el trabajo de los recicladores, agua de lluvia y arroyos, manglar y biodiversidad, energía solar y eólica, calor urbano y árboles, lectura honesta de datos e infografía, e invención. Cada dato muestra su fuente.</p></section>
      <section id="s-privacidad"><h2>Privacidad</h2><p>chispa no tiene cuentas, no pide nombres ni datos personales, no usa ubicación, cámara ni micrófono, no muestra publicidad y no envía nada a internet (Ley 1581 de 2012). El avance, los dibujos y la bitácora se guardan solo en este aparato. No hay notificaciones ni rachas que se pierden.</p>
        <button class="btn btn-borde" data-borrar>Borrar todo el avance</button></section>
      <section id="s-fuentes"><h2>Fuentes de los datos</h2><ul class="lista-fuentes">${[...usadas].filter(k => CH.F[k]).map(k => `<li><a href="${CH.F[k].url}" target="_blank" rel="noopener">${esc(CH.F[k].nombre)}</a></li>`).join('')}</ul></section>
      <section><h2>Créditos</h2><p>Proyecto académico de Diseño Gráfico. Ilustraciones generadas con la IA de Figma y editadas a mano; voces del sistema o de ElevenLabs; investigación, diseño y código con apoyo de Claude (IA). Tipografías Bricolage Grotesque y Lexend (licencia OFL).</p></section>
    </div>${nav('')}`);
    CH.on('[data-ir]', 'click', ev => { ev.preventDefault(); const s = document.getElementById('s-' + ev.currentTarget.dataset.ir); if (s) { s.scrollIntoView({ behavior: CH.menosMovimiento() ? 'auto' : 'smooth' }); const h = s.querySelector('h2'); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } });
    CH.on('[data-aj]', 'click', ev => {
      const k = ev.currentTarget.dataset.aj;
      if (k === 'letra') aj.letra = aj.letra === 'mas' ? 'normal' : 'mas';
      else if (k === 'movimiento') aj.movimiento = aj.movimiento === 'menos' ? 'normal' : 'menos';
      else aj[k] = !aj[k];
      if (k === 'voz' && !aj.voz) CH.callar();
      CH.guardar(); CH.aplicarAjustes();
      ev.currentTarget.setAttribute('aria-checked', !!aj[k] && aj[k] !== 'normal');
    });
    CH.on('[data-lim]', 'click', ev => { aj.limite = Math.max(1, Math.min(10, aj.limite + +ev.currentTarget.dataset.lim)); CH.guardar(); ev.currentTarget.parentElement.querySelector('output').textContent = aj.limite; });
    CH.on('[data-nivel]', 'click', () => { CH.E.nivel = CH.E.nivel === 'experto' ? 'explorador' : 'experto'; CH.guardar(); CH.aplicarAjustes(); S.adultos(); });
    CH.on('[data-borrar]', 'click', ev => { const b = ev.currentTarget; if (b.dataset.conf) { CH.borrarTodo(); puerta = false; CH.ir('#barrio'); return; } b.dataset.conf = '1'; b.textContent = 'Toca otra vez para confirmar: se borra todo'; });
  };

  /* ================= ACTIVIDADES ESPECIALES ================= */
  // Siembra del manglar (Ciénaga 4).
  CH.ACT.siembra = (p, ctx) => {
    if (!CH.E.manglar) { CH.E.manglar = CH.hoy(); CH.guardar(); }
    ctx.lienzo.innerHTML = `<div class="revela manglar-escena">${manglarSVG(Math.max(0, CH.etapaManglar()))}</div>`;
    ctx.hoja.innerHTML = '<div data-acciones class="acciones"></div>';
    ctx.respuesta(true, '¡Sembraste tu manglar!', 'Crecerá un poquito cada día que vuelvas. Lo ves en «Casillero».');
    CH.sonido('enciende');
    ctx.seguir(ctx.terminar, { voz: { t: '¡Sembraste tu manglar! Crecerá un poquito cada día que vuelvas.' } });
  };
  // La gráfica tramposa (Colegio 2): dos gráficas con los mismos datos, una con el eje cortado.
  const barras = (a, b, desde) => {
    const h = v => Math.max(4, ((v - desde) / (Math.max(a, b) - desde)) * 120);
    return `<svg viewBox="0 0 160 170" aria-hidden="true"><path d="M24 10v140h126" fill="none" stroke="#2B211D" stroke-width="2"/><text x="20" y="153" text-anchor="end" font-size="11" fill="#2B211D">${desde}</text>
      <rect x="44" y="${150 - h(a)}" width="34" height="${h(a)}" fill="#5B4BD6"/><rect x="98" y="${150 - h(b)}" width="34" height="${h(b)}" fill="#E85D2A"/>
      <text x="61" y="${144 - h(a)}" text-anchor="middle" font-size="12" fill="#2B211D">${a}</text><text x="115" y="${144 - h(b)}" text-anchor="middle" font-size="12" fill="#2B211D">${b}</text></svg>`;
  };
  CH.ACT.trampa = (p, ctx) => {
    let k = 0;
    function uno() {
      const c = p.casos[k], cero = Math.random() < 0.5;
      const izq = cero ? 0 : Math.floor(Math.min(c.a, c.b) * 0.9), der = cero ? Math.floor(Math.min(c.a, c.b) * 0.9) : 0;
      ctx.lienzo.innerHTML = `<div class="graficas"><p class="t-nota">${esc(c.titulo)}</p><div class="dos">
        <button class="grafica-op" data-g="${izq === 0 ? 'cero' : 'cortada'}" aria-label="Gráfica A, el eje empieza en ${izq}">${barras(c.a, c.b, izq)}<b>A</b></button>
        <button class="grafica-op" data-g="${der === 0 ? 'cero' : 'cortada'}" aria-label="Gráfica B, el eje empieza en ${der}">${barras(c.a, c.b, der)}<b>B</b></button></div></div>`;
      ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(CH.texto(p.pide))}</h2><p class="t-nota">Mira dónde empieza el eje.</p><div data-acciones class="acciones"></div>`;
      CH.hablar(p.pide);
      CH.on('[data-g]', 'click', ev => {
        const b = ev.currentTarget;
        if (b.dataset.g === 'cero') {
          ctx.acierto(b); b.classList.add('bien'); ctx.lienzo.querySelectorAll('[data-g]').forEach(x => { x.disabled = true; });
          ctx.respuesta(true, '¡Detective!', c.e);
          ctx.seguir(() => { k++; if (k < p.casos.length) uno(); else ctx.terminar(); }, { voz: { t: c.e } });
        } else { b.classList.add('casi'); b.disabled = true; ctx.fallo(); ctx.respuesta(false, '¡Esa es la tramposa!', 'Su eje no empieza en cero: por eso la diferencia parece enorme.'); }
      }, ctx.lienzo);
    }
    uno();
  };
  // ¿Verdad o mito? muestra la fuente si la carta la tiene.
  const vmBase = CH.ACT.vm;
  CH.ACT.vm = (p, ctx) => {
    const resp = ctx.respuesta;
    ctx.respuesta = (bien, t, x, extra) => { const cartas = CH.nivel(p, 'cartas'); const c = cartas.find(cc => CH.texto(cc.e) === x); return resp(bien, t, x, extra || (c && c.f ? CH.fuenteHTML(c.f) : '')); };
    vmBase(p, ctx);
  };

  /* ---------- Arranque ---------- */
  CH.arrancar();
  cargarMapa();
})();
