/* chispa 2.0 · pantallas: apertura, barrio, zona, episodio, cierre, álbum, reto, manglar, casillero, adultos y diploma. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc, I = CH.I, P = CH.prog, S = CH.PANTALLAS;
  const nivelNombre = () => CH.E.nivel === 'experto' ? 'Experto' : 'Explorador';

  /* ---------- Navegación inferior ---------- */
  // Íconos a color de la barra inferior, en el mismo estilo de ilustración simple del álbum (2.7):
  // barrio = una casita con su árbol y farol, reto = el frasco con cocuyos, casillero = la chispa que se gana.
  const K = '#5A3526', T = `stroke="${K}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
  const ico = c => `<svg viewBox="0 0 32 32" aria-hidden="true">${c}</svg>`;
  const NAV_ICO = {
    barrio: ico(`<ellipse cx="16" cy="29" rx="13.6" ry="2.2" fill="#000" opacity=".12"/><path d="M2.6 23.8c0-1.3 1-2.3 2.3-2.3h22.2c1.3 0 2.3 1 2.3 2.3v1.6c0 1.2-1 2.2-2.2 2.2H4.8c-1.2 0-2.2-1-2.2-2.2z" fill="#4E9A68" ${T}/><path d="M3.5 23.6c0-.8.6-1.4 1.4-1.4h22.2c.8 0 1.4.6 1.4 1.4v.3H3.5z" fill="#7CC27A"/><path d="M24.8 21.8v-5.6" stroke="#8A5A3C" stroke-width="2.2" stroke-linecap="round"/><circle cx="25.2" cy="12.4" r="5.2" fill="#4E9A68" ${T}/><circle cx="23.6" cy="10.8" r="2" fill="#7CC27A"/><circle cx="27" cy="14" r="1" fill="#3E7D3A"/><path d="M15.6 6.6h2.6v4.2l-2.6-2z" fill="#B54E2A" ${T}/><path d="M5.4 14.8 12.2 9l6.8 5.8v7.4H5.4z" fill="#F6E3C8" ${T}/><path d="M12.2 9l6.8 5.8v7.4h-3.4V12.6z" fill="#EBD3B0"/><path d="M3.2 15.6 12.2 6.6l9 9-1.4 1.2-7.6-7.4-7.6 7.4z" fill="#D9673E" ${T}/><path d="M7.4 12.4l4.8-4.6M9 13.8l3.2-3M15.2 9.6l3.4 3.4" stroke="#F08A5D" stroke-width="1" stroke-linecap="round"/><circle cx="9.6" cy="17" r="3.4" fill="#FFD34D" opacity=".35"/><rect x="7.8" y="15.2" width="3.6" height="3.6" rx=".6" fill="#FFD34D"/><path d="M9.6 15.2v3.6M7.8 17h3.6" stroke="#B5852A" stroke-width=".7"/><path d="M13.8 22.2v-4.4c0-.6.5-1.1 1.1-1.1h1.3c.6 0 1.1.5 1.1 1.1v4.4z" fill="#2F7A5A"/><circle cx="16.4" cy="19.6" r=".5" fill="#FFD34D"/><ellipse cx="14.6" cy="23.6" rx="1.1" ry=".6" fill="#E6D3B0"/><ellipse cx="16.8" cy="24.9" rx="1.1" ry=".6" fill="#E6D3B0"/><circle cx="4.8" cy="21" r="1.9" fill="#4E9A68"/><circle cx="6.6" cy="21.4" r="1.6" fill="#6FB25E"/><circle cx="4.4" cy="20.4" r=".6" fill="#F6A6C1"/><circle cx="6.8" cy="20.6" r=".6" fill="#FFD34D"/><circle cx="20.4" cy="21.4" r="1.5" fill="#6FB25E"/><circle cx="20.6" cy="20.8" r=".55" fill="#F6A6C1"/>`),
    album: ico(`<ellipse cx="16" cy="28.8" rx="12" ry="2.2" fill="#000" opacity=".12"/><path d="M19 25.5v5l1.4-1.3 1.4 1.3v-5z" fill="#E85D2A" ${T}/><path d="M8 5.5h16.5a2 2 0 0 1 2 2V25a2 2 0 0 1-2 2H8z" fill="#FFF8EA" ${T}/><path d="M5 4h17.5a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5z" fill="#4A3B52" ${T}/><path d="M5 4h3.6v22H5z" fill="#2A2031" ${T}/><path d="M5.8 7.5h2M5.8 22.5h2" stroke="#8C7898" stroke-width="1.1" stroke-linecap="round"/><rect x="10.6" y="6.3" width="12" height="17.4" rx="1.3" fill="none" stroke="#FFC94D" stroke-width=".9" stroke-dasharray="1.5 1.2"/><path d="M20.3 4h2.2a2 2 0 0 1 2 2v2.2z" fill="#F2B13A" stroke="${K}" stroke-width="1.1" stroke-linejoin="round"/><circle cx="16.6" cy="15.2" r="5" fill="#FFD34D" opacity=".32"/><ellipse cx="14.2" cy="13.6" rx="1.8" ry="1.15" fill="#FFFFFF" fill-opacity=".85" stroke="${K}" stroke-width=".7" transform="rotate(-25 14.2 13.6)"/><ellipse cx="19" cy="13.6" rx="1.8" ry="1.15" fill="#FFFFFF" fill-opacity=".85" stroke="${K}" stroke-width=".7" transform="rotate(25 19 13.6)"/><circle cx="16.6" cy="16.6" r="2.6" fill="#FFE58A" stroke="${K}" stroke-width="1.1"/><circle cx="16.6" cy="12.2" r="1.9" fill="#D9673E" stroke="${K}" stroke-width="1"/><path d="M12.8 20.8h7.6" stroke="#FFC94D" stroke-width="1.4" stroke-linecap="round"/>`),
    reto: ico(`<ellipse cx="16" cy="29.2" rx="10.5" ry="2" fill="#000" opacity=".12"/><circle cx="16" cy="20" r="10" fill="#FFE58A" opacity=".35"/><path d="M11.4 9.6h9.2v1.6c3.6 1.4 5.3 3.8 5.3 7v7.4a2.6 2.6 0 0 1-2.6 2.6H8.7a2.6 2.6 0 0 1-2.6-2.6v-7.4c0-3.2 1.7-5.6 5.3-7z" fill="#3A4E66" ${T}/><path d="M6.6 23.4c3-1.5 6-.6 9.4-1.2 3.4-.6 6.4-.4 9.4.4v2.6a2.6 2.6 0 0 1-2.6 2.6H8.7a2.6 2.6 0 0 1-2.1-1.1z" fill="#4E9A68"/><path d="M8.6 21.5c4-2.4 8.4-2.2 13.4-5.6" stroke="#8A5A3C" stroke-width="1.4" stroke-linecap="round" fill="none"/><circle cx="12.4" cy="17.6" r="3" fill="#FFD34D" opacity=".45"/><circle cx="12.4" cy="17.6" r="1.4" fill="#FFE58A" stroke="${K}" stroke-width=".8"/><circle cx="19.6" cy="21.4" r="2.6" fill="#FFD34D" opacity=".45"/><circle cx="19.6" cy="21.4" r="1.2" fill="#FFE58A" stroke="${K}" stroke-width=".8"/><circle cx="20.4" cy="14.4" r="2.2" fill="#FFD34D" opacity=".4"/><circle cx="20.4" cy="14.4" r="1" fill="#FFE58A" stroke="${K}" stroke-width=".7"/><path d="M9 15.6c0-1.6.8-2.8 2.1-3.4M8.4 18.4v3" stroke="#FFF" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="M11.2 5.2C11 1.6 21 1.6 20.8 5.2" fill="none" stroke="${K}" stroke-width="1.2" stroke-linecap="round"/><rect x="9.6" y="5" width="12.8" height="5" rx="1.6" fill="#E85D2A" ${T}/><path d="M12.4 6.2v2.6M14.8 6.2v2.6M17.2 6.2v2.6M19.6 6.2v2.6" stroke="#9C3417" stroke-width=".9" stroke-linecap="round"/>`),
    casillero: ico(`<ellipse cx="16" cy="29" rx="11" ry="2" fill="#000" opacity=".12"/><rect x="6" y="3.5" width="20" height="24.5" rx="2.5" fill="#1F9E8F" ${T}/><rect x="9" y="6.5" width="14" height="18.5" rx="1.5" fill="#2BB8A6" ${T}/><path d="M11.5 9.5h9M11.5 12h9" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/><rect x="19.2" y="15.5" width="2.6" height="4.6" rx="1.1" fill="#FFD34D" ${T} stroke-width="1.2"/><circle cx="13.6" cy="19.6" r="4.6" fill="#FFE58A" opacity=".55"/><g transform="translate(8.4 14.4) scale(.44)">${(I.estrella.match(/<svg[^>]*>([\s\S]*)<\/svg>/) || ['', ''])[1]}</g>`)
  };
  const nav = actual => {
    const n = CH.E.nuevos.length;
    const it = (h, txt, ic, extra = '') => `<a href="#${h}" ${actual === h ? 'aria-current="page"' : ''}><span class="nav-ico">${NAV_ICO[ic]}</span><span class="nav-txt">${txt}</span>${extra}</a>`;
    return `<nav class="nav" aria-label="Secciones">${it('barrio', 'Barrio', 'barrio')}${it('album', 'Álbum', 'album', n ? `<b class="insignia" aria-hidden="true">${n}</b><span class="solo-lector">, ${n} cromo${n > 1 ? 's' : ''} nuevo${n > 1 ? 's' : ''}</span>` : '')}${it('reto', 'Reto', 'reto')}${it('casillero', 'Casillero', 'casillero')}</nav>`;
  };
  CH.nav = nav;
  const estrellasHTML = (n, max = 3) => `<span class="estrellas" role="img" aria-label="${n} de ${max} chispas">${Array.from({ length: max }, (_, i) => i < n ? I.estrella : I.estrellaVacia).join('')}</span>`;

  /* ================= APERTURA ================= */
  S.apertura = () => {
    // 2.7: escena de bienvenida. El barrio de noche, luciérnagas que flotan, Cocuyo encendido
    // y el eslogan como titular. Debajo, los vecinos que esperan y el botón que enciende.
    const LUCES = [[8, 22, 0], [18, 64, 1.4], [27, 38, 2.6], [36, 12, .8], [44, 56, 3.4], [58, 28, 1.8], [66, 70, .4], [74, 16, 2.2], [82, 48, 3], [90, 30, 1.1], [12, 44, 2.9], [52, 8, 1.6], [70, 58, 3.8], [94, 66, .6]];
    const vecinos = ['familia', 'rosa', 'lina', 'tomas', 'vale', 'don-abel', 'seno-ines'];
    CH.pintar(`<div class="apertura-escena">
      <div class="noche-mapa" aria-hidden="true">${CH.hayImagen('mapaNoche', '') ? CH.ilus('mapaNoche', '', { cls: 'mapa-noche' }) : CH.hayImagen('mapa', '') ? CH.ilus('mapa', '', { cls: 'mapa-noche' }) : mapaRespaldo(true)}</div>
      <div class="luciernagas" aria-hidden="true">${LUCES.map(([x, y, d]) => `<i style="left:${x}%;top:${y}%;animation-delay:-${d}s"></i>`).join('')}</div>
      <div class="ap-logo" aria-hidden="true">${window.ARTE.logo.replace(/#2B211D/gi, '#FFFAF2')}</div>
      <div class="ap-heroe" aria-hidden="true"><span class="ap-halo"></span>${CH.cocuyo('saludando', 'apertura-coc')}</div>
      <div class="apertura-texto">
        <h1 class="ap-eslogan"><span>¿Y si lo</span> <span class="luz">inventas tú?</span></h1>
        <p class="ap-sub">Tu barrio está apagado. Con cada idea verde lo vamos a encender.</p>
        <div class="ap-vecinos" aria-hidden="true"><span class="caras">${vecinos.map(v => CH.cara(v, 'ap-cara')).join('')}</span><span>Tus vecinos te esperan</span></div>
        <button class="btn btn-primario ap-btn" data-sig>Encender mi barrio</button></div>
    </div>`, { clase: 'modo-noche', voz: { t: '¡Hola! Soy Cocuyo, una luciérnaga. ¿Y si lo inventas tú? Tu barrio está apagado. Con cada idea verde lo vamos a encender.' } });
    CH.on('[data-sig]', 'click', ev => { CH.sonido('enciende'); CH.chispas(ev.currentTarget, 18); setTimeout(eleccion, CH.menosMovimiento() ? 0 : 450); });
  };
  // Colores suaves para el fondo de cada inventor, como cromos.
  const TONO_AV = { trenzas: '#FFE3C2', gafas: '#D8EEF7', mochila: '#F6DDE6', silla: '#E3F1D6', audifono: '#E8E2F7', sonrisa: '#FFF1B8' };
  function eleccion() {
    let av = CH.E.avatar, nv = CH.E.nivel;
    const cuerpo = id => CH.hayImagen('avatarCuerpo', id) ? CH.ilus('avatarCuerpo', id, { cls: 'esc-av' }) : CH.avatar(id, 'esc-av');
    CH.pintar(`<div class="pantalla apertura">
      <div class="barra"><span class="logo crece">${window.ARTE.logo}</span><a class="btn btn-borde btn-chico" href="#adultos">Adultos</a></div>
      <div class="escenario" aria-hidden="true">
        ${CH.hayImagen('fondo', 'plaza') ? CH.ilus('fondo', 'plaza', { cls: 'esc-fondo' }) : ''}<span class="esc-velo"></span>
        <span class="esc-coc">${CH.cocuyo('saludando')}</span><span class="esc-chispas"><i></i><i></i><i></i></span>
        <span class="esc-tu" data-esc-av>${cuerpo(av)}</span>
        <span class="esc-piso"></span>
      </div>
      <div class="bloque-eleccion"><h1 class="t-titulo">¿Quién va a inventar hoy?</h1><p class="t-nota">Elige tu inventor. Lo puedes cambiar luego y no pedimos tu nombre.</p></div>
      <div class="avatares" role="radiogroup" aria-label="Inventores">${CH.AVATARES.map(a => `<button role="radio" aria-checked="${a.id === av}" data-av="${a.id}" aria-label="${esc(a.nombre)}" style="--tono:${TONO_AV[a.id] || '#FFF'}">${CH.avatar(a.id, 'av-img')}<span class="marca" aria-hidden="true">${I.check}</span></button>`).join('')}</div>
      <section class="edad" aria-labelledby="lbl-edad">
        <h2 class="edad-titulo" id="lbl-edad">¿Cuántos años tienes?</h2>
        <div class="niveles" role="radiogroup" aria-labelledby="lbl-edad">
          <button role="radio" data-nv="explorador" aria-checked="${nv === 'explorador'}"><span class="nv-ico" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#E3F1D6"/><ellipse cx="24" cy="43" rx="10.5" ry="1.9" fill="#000" opacity=".13"/><path d="M24 27.4v-8.2" stroke="#3E7D3A" stroke-width="2.4" stroke-linecap="round"/><path d="M24 21.8c-5.2.6-9.2-2.1-9.8-7.2 5.2-.6 9.2 2.1 9.8 7.2z" fill="#8BCB7E" stroke="#2B211D" stroke-width="1.6" stroke-linejoin="round"/><path d="M23.2 21c-2.7-.9-5-2.7-6.3-5" fill="none" stroke="#4E9A4A" stroke-width="1" stroke-linecap="round"/><path d="M24 19.6c.3-5.4 4.1-8.9 9.7-8.9-.3 5.4-4.1 8.9-9.7 8.9z" fill="#6FB25E" stroke="#2B211D" stroke-width="1.6" stroke-linejoin="round"/><path d="M24.9 18.7c1.6-2.5 3.9-4.6 6.8-5.8" fill="none" stroke="#3E7D3A" stroke-width="1" stroke-linecap="round"/><ellipse cx="18.4" cy="15.6" rx="1.6" ry=".9" fill="#fff" opacity=".55" transform="rotate(35 18.4 15.6)"/><path d="M14.8 30.6h18.4l-1.9 9.9a2 2 0 0 1-2 1.6H18.7a2 2 0 0 1-2-1.6z" fill="#D9673E" stroke="#2B211D" stroke-width="1.6" stroke-linejoin="round"/><rect x="12.8" y="26.4" width="22.4" height="4.6" rx="1.7" fill="#E8875A" stroke="#2B211D" stroke-width="1.6"/><rect x="14.6" y="27.4" width="9" height="1.3" rx=".65" fill="#fff" opacity=".4"/><circle cx="20.7" cy="34.8" r="1.25" fill="#2B211D"/><circle cx="27.3" cy="34.8" r="1.25" fill="#2B211D"/><circle cx="21.15" cy="34.349999999999994" r=".42" fill="#fff"/><circle cx="27.75" cy="34.349999999999994" r=".42" fill="#fff"/><path d="M22.3 36.8q1.7 1.6 3.4 0" fill="none" stroke="#2B211D" stroke-width="1.25" stroke-linecap="round"/><ellipse cx="18.8" cy="36.599999999999994" rx="1.5" ry=".95" fill="#F4A08A" opacity=".85"/><ellipse cx="29.2" cy="36.599999999999994" rx="1.5" ry=".95" fill="#F4A08A" opacity=".85"/><path d="M37 6l1.10 2.90 2.90 1.10-2.90 1.10-1.10 2.90-1.10-2.90-2.90-1.10 2.90-1.10z" fill="#FFD34D" stroke="#2B211D" stroke-width="1.1" stroke-linejoin="round"/><circle cx="11.4" cy="13.6" r="1.1" fill="#FFD34D"/><circle cx="9" cy="20" r=".7" fill="#FFD34D"/></svg></span><b>Explorador</b><span>8 a 10 años</span></button>
          <button role="radio" data-nv="experto" aria-checked="${nv === 'experto'}"><span class="nv-ico" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#FFF1B8"/><ellipse cx="24" cy="43.2" rx="13" ry="2" fill="#000" opacity=".13"/><path d="M21.4 42.6l.9-12.4h3.4l.9 12.4z" fill="#9A6440" stroke="#2B211D" stroke-width="1.6" stroke-linejoin="round"/><path d="M21.5 42.6c-1.4 0-2.6.1-3.4.6M26.5 42.6c1.4 0 2.6.1 3.4.6" fill="none" stroke="#2B211D" stroke-width="1.3" stroke-linecap="round"/><path d="M24.6 36.4v3.2" stroke="#7A4C30" stroke-width="1" stroke-linecap="round"/><path d="M24 4.6c4.8 0 8.4 3.1 9 7.1 3.3 1 5.5 4 5.5 7.5 0 4.6-3.7 8.3-8.3 8.3H17.8c-4.6 0-8.3-3.7-8.3-8.3 0-3.5 2.2-6.5 5.5-7.5.6-4 4.2-7.1 9-7.1z" fill="#4E9A68" stroke="#2B211D" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.6 12.4c.9-3.4 4.4-5.6 8.4-5.6 2.4 0 4.6.8 6 2.2-1.6-.6-3.4-.8-5.2-.6-4 .5-7 2.2-9.2 4z" fill="#7CC27A"/><ellipse cx="17.6" cy="11.6" rx="2" ry="1.1" fill="#fff" opacity=".45" transform="rotate(-25 17.6 11.6)"/><circle cx="20.6" cy="18.6" r="1.25" fill="#2B211D"/><circle cx="27.4" cy="18.6" r="1.25" fill="#2B211D"/><circle cx="21.05" cy="18.150000000000002" r=".42" fill="#fff"/><circle cx="27.849999999999998" cy="18.150000000000002" r=".42" fill="#fff"/><path d="M22.3 20.6q1.7 1.6 3.4 0" fill="none" stroke="#2B211D" stroke-width="1.25" stroke-linecap="round"/><ellipse cx="18.700000000000003" cy="20.400000000000002" rx="1.5" ry=".95" fill="#F29B86" opacity=".85"/><ellipse cx="29.299999999999997" cy="20.400000000000002" rx="1.5" ry=".95" fill="#F29B86" opacity=".85"/><circle cx="13.6" cy="21.6" r="1.9" fill="#FFD34D" stroke="#2B211D" stroke-width="1.1"/><circle cx="13.1" cy="21.1" r=".5" fill="#fff" opacity=".8"/><circle cx="34.4" cy="14.6" r="1.9" fill="#FFD34D" stroke="#2B211D" stroke-width="1.1"/><circle cx="33.9" cy="14.1" r=".5" fill="#fff" opacity=".8"/><circle cx="32" cy="24.4" r="1.7" fill="#FFD34D" stroke="#2B211D" stroke-width="1.1"/><circle cx="31.5" cy="23.9" r=".5" fill="#fff" opacity=".8"/><circle cx="18.2" cy="26" r="1.5" fill="#FFD34D" stroke="#2B211D" stroke-width="1.1"/><circle cx="17.7" cy="25.5" r=".5" fill="#fff" opacity=".8"/><circle cx="39.6" cy="8.6" r="4.2" fill="#FFE680" opacity=".55"/><path d="M39.6 5.0l0.99 2.61 2.61 0.99-2.61 0.99-0.99 2.61-0.99-2.61-2.61-0.99 2.61-0.99z" fill="#FFD34D" stroke="#2B211D" stroke-width="1.1" stroke-linejoin="round"/></svg></span><b>Experto</b><span>11 a 12 años</span></button></div>
      </section>
      <div class="abajo fila"><button class="btn-redondo" data-voz aria-label="Escuchar">${I.voz}</button><button class="btn btn-primario crece" data-ok>¡Vamos a inventar!</button></div>
    </div>`, { voz: { t: '¿Quién va a inventar hoy? Elige tu inventor y tu edad.' } });
    CH.on('[data-voz]', 'click', () => CH.hablar({ t: '¿Quién va a inventar hoy? Elige tu inventor y tu edad.' }));
    CH.on('[data-av]', 'click', ev => { av = ev.currentTarget.dataset.av; CH.$main.querySelectorAll('[data-av]').forEach(b => b.setAttribute('aria-checked', b.dataset.av === av));
      const tu = CH.$main.querySelector('[data-esc-av]'); if (tu) { tu.innerHTML = cuerpo(av); tu.classList.remove('salta'); void tu.offsetWidth; tu.classList.add('salta'); }
      CH.sonido('toque'); });
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
  // El mapa es una ilustración; cada manzana lleva encima un velo que la apaga o la enciende según el avance.
  const estadoZona = id => P.completa(id) ? 'completa' : !P.abierta(id) ? 'cerrada' : P.cuantos(id) ? 'encendida' : 'abierta';
  S.barrio = () => {
    const sug = P.sugerida(), enc = P.zonasEncendidas(), est = P.estrellas();
    const zonas = CH.ZONAS.map(z => {
      const n = P.cuantos(z.id), t = P.total(z.id), e = estadoZona(z.id), abierta = e !== 'cerrada';
      const estado = e === 'completa' ? `<span class="badge" aria-hidden="true">${I.check}</span>` : e === 'cerrada' ? `<span class="badge cerrado" aria-hidden="true">${I.candado}</span>` : n ? `<span class="badge num" aria-hidden="true">${n}/${t}</span>` : '';
      const desc = `${z.nombre}: ${e === 'completa' ? 'completa' : e === 'cerrada' ? (z.id === 'plaza' ? 'se abre al completar cuatro rutas' : 'se abre después del primer episodio') : n ? n + ' de ' + t + ' episodios' : 'sin empezar'}`;
      const persona = e === 'completa' && z.quien !== 'cocuyo' ? `<button class="vecino" data-vecino="${z.id}" aria-label="Hablar con ${esc(CH.PERSONAJES[z.quien].nombre)}">${CH.personaje(z.quien, 'vecino-img')}</button>` : '';
      return `<div class="zona-pin ${e} ${z.mapa.x < 50 ? 'izq' : 'der'}" data-pin="${z.id}" style="left:${z.mapa.x}%;top:${z.mapa.y}%;--z:${z.color};--zt:${z.tinta}">
        ${persona}
        <a class="zona-et" href="${abierta ? '#zona/' + z.id : '#barrio'}" ${abierta ? '' : 'aria-disabled="true" data-cerrada="' + z.id + '"'} aria-label="${esc(desc)}"><span>${esc(z.nombre)}</span>${estado}</a></div>`;
    }).join('');
    // Manzanas: zona de toque grande y velo de estado (apagada, tenue, encendida).
    // 2.7: el mapa base es la versión de noche; cada manzana tiene encima su versión de día recortada con bordes difusos,
    // cada vez más visible a medida que avanza la zona. Con el barrio completo amanece todo el mapa.
    const noche = CH.hayImagen('mapaNoche', '');
    const nivelLuz = id => { const e = estadoZona(id); return e === 'completa' ? 1 : e === 'cerrada' ? 0 : e === 'abierta' ? 0.16 : 0.4 + 0.45 * P.cuantos(id) / P.total(id); };
    const todoListo = CH.ZONAS.every(z => P.completa(z.id));
    const luces = noche ? CH.ZONAS.map(z => { const [x0, y0, x1, y1] = z.bloque, m = 2.5, a = Math.max(0, x0 - m), b = Math.max(0, y0 - m * .53), w = Math.min(100, x1 + m) - a, h = (y1 + m * .53) - b;
        return `<div class="zona-luz ${estadoZona(z.id)}" style="left:${a}%;top:${b}%;width:${w}%;height:${h}%;--luz:${nivelLuz(z.id)}" aria-hidden="true"><img src="img/fondos/barrio.webp" alt="" style="width:${(10000 / w).toFixed(3)}%;left:${(-a * 100 / w).toFixed(3)}%;top:${(-b * 100 / h).toFixed(3)}%"></div>`; }).join('')
      + (todoListo ? `<div class="mapa-dia" aria-hidden="true">${CH.ilus('mapa', '')}</div>` : '') : '';
    const bloques = CH.ZONAS.map(z => { const [x0, y0, x1, y1] = z.bloque, e = estadoZona(z.id);
      return `<a class="zona-bloque ${e}" href="${e === 'cerrada' ? '#barrio' : '#zona/' + z.id}" ${e === 'cerrada' ? 'data-cerrada="' + z.id + '"' : ''} tabindex="-1" aria-hidden="true" style="left:${x0}%;top:${y0}%;width:${x1 - x0}%;height:${y1 - y0}%"></a>`; }).join('');
    const zs = sug && CH.zona(sug.zona);
    const tarjeta = sug ? (() => { const i = CH.RUTAS[sug.zona].indexOf(sug.ep) + 1; return `<a class="seguir-tarjeta" href="#ep/${sug.ep.id}" style="--z:${zs.color};--zt:${zs.tinta}">
        <span class="seguir-cara" aria-hidden="true">${zs.quien === 'cocuyo' || zs.quien === 'familia' ? CH.cocuyo('feliz') : CH.cara(zs.quien)}</span>
        <span class="crece"><span class="seguir-zona">${esc(zs.nombre)} · ${i} de ${P.total(sug.zona)}</span><b>${esc(sug.ep.titulo)}</b></span>
        <span class="btn btn-primario btn-chico" aria-hidden="true">${P.algunEpisodio() ? 'Seguir' : 'Empezar'}${I.flecha}</span></a>`; })()
      : `<a class="seguir-tarjeta" href="#album"><span class="seguir-cara" aria-hidden="true">${CH.cocuyo('celebrando')}</span><span class="crece"><span class="seguir-zona">¡Barrio completo!</span><b>Completa tu álbum</b></span><span class="btn btn-primario btn-chico" aria-hidden="true">Álbum${I.flecha}</span></a>`;
    // Cocuyo espera en la avenida, frente a la manzana de la zona sugerida (sin zona: junto a su estatua).
    const cy = zs ? (zs.bloque[1] + zs.bloque[3]) / 2 - 5 : 28, cx = zs ? (zs.mapa.x < 50 ? 45 : 55) : 50;
    CH.pintar(`<div class="pantalla-mapa">
      <header class="barra-mapa">
        <a class="mi-inventor" href="#casillero" aria-label="Mi casillero">${CH.avatar(CH.E.avatar, 'av-mini')}</a>
        <div class="crece"><b class="barra-nombre">${nivelNombre()}</b>
          <span class="barra-avance"><span class="segmentos" aria-hidden="true">${CH.ZONAS.map((z, k) => `<i class="${k < enc ? 'si' : ''}"></i>`).join('')}</span><span class="t-nota">${enc} de 8 zonas</span></span></div>
        <span class="pildora" role="img" aria-label="${est} chispas">${I.estrella}<b>${est}</b></span>
      </header>
      <h1 class="solo-lector">Tu barrio: ${enc} de 8 zonas encendidas</h1>
      <div class="mapa-marco">
      <div class="mapa" role="group" aria-label="Mapa del barrio">
        <div class="mapa-img" aria-hidden="true">${noche ? CH.ilus('mapaNoche', '') : CH.hayImagen('mapa', '') ? CH.ilus('mapa', '') : mapaRespaldo(false)}</div>
        ${luces}${bloques}
        <span class="coc-mapa-pos" style="top:${cy}%;left:${cx}%" aria-hidden="true"><span class="coc-halo"></span>${CH.cocuyo('feliz', 'coc-mapa')}</span>
        ${zonas}
      </div>
      <div class="flota-abajo">${tarjeta}</div>
      </div>
    </div>${nav('barrio')}`, { clase: 'modo-mapa' });
    // En pantallas bajitas, que la zona sugerida quede a la vista.
    if (zs && innerHeight < 820) { const pin = CH.$main.querySelector(`[data-pin="${zs.id}"]`); if (pin) requestAnimationFrame(() => window.scrollTo(0, Math.max(0, pin.getBoundingClientRect().top + scrollY - innerHeight * .45))); }
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
      return `<li>${abierto ? `<a class="ep-fila ${hecho ? 'hecho' : 'listo'}" href="#ep/${ep.id}" aria-label="${hecho ? 'Repetir' : 'Jugar'}: ${esc(ep.titulo)}${hecho ? ', ' + hecho.estrellas + ' de 3 chispas' : ''}">${dentro}<span class="btn ${hecho ? 'btn-borde' : 'btn-primario'} btn-chico" aria-hidden="true">${hecho ? 'Repetir' : 'Jugar'}</span></a>`
        : `<div class="ep-fila cerrado">${dentro}</div>`}</li>`;
    }).join('');
    const juego = J && CH.JUEGOS && CH.JUEGOS[J.id] ? (() => {
      const abierto = P.juegoAbierto(J.id), epJ = CH.epDeJuego(J.id), est = P.estrellasDe(J.id);
      const nota = abierto ? `${est} de 24 chispas` : `Se abre en el episodio ${ruta.indexOf(epJ) + 1}`;
      return `<section class="tarjeta juego-t ${abierto ? '' : 'cerrado'}"><span class="juego-ico" aria-hidden="true">${CH.ilus('objeto', J.o)}</span><div class="crece"><span class="t-nota">Minijuego · 8 niveles</span><b>${esc(J.nombre)}</b><span class="t-nota">${nota}</span></div>${abierto ? `<a class="btn btn-borde btn-chico" href="#juego/${J.id}" aria-label="Jugar ${esc(J.nombre)}">Jugar</a>` : `<span class="candado-j" aria-hidden="true">${I.candado}</span>`}</section>`;
    })() : '';
    CH.pintar(`<div class="pantalla zona-p" style="--z:${z.color};--zt:${z.tinta}">
      <header class="zona-cab"><a class="btn-redondo" href="#barrio" aria-label="Volver al barrio">${I.atras}</a>
        <div class="crece"><span class="zona-et-c">${esc(z.nombre)}</span><h1 class="t-titulo">${esc(z.tema)}</h1></div></header>
      <div class="zona-heroe" aria-hidden="true">${CH.vista(id, 'zona-fondo')}${z.quien === 'cocuyo' ? CH.cocuyo('celebrando', 'zona-quien') : CH.personaje(z.quien, 'zona-quien')}</div>
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
        <span class="estrellas cierre-estrellas" role="img" aria-label="${estrellas} de 3 chispas">${[0, 1, 2].map(k => `<span style="--k:${k}">${k < estrellas ? I.estrella : I.estrellaVacia}</span>`).join('')}</span></div>
      ${cromo ? `<div class="cierre-cromo">${cromoNuevo ? '<span class="cinta-nuevo">¡Cromo nuevo!</span>' : ''}<button class="cromo-t ${cromo.tipo} ${cromoNuevo ? 'aparece' : ''}" data-voltear aria-label="Cromo: ${esc(cromo.t)}. Toca para ver el dato.">${cromoHTML(cromo)}<span class="cromo-brillo" aria-hidden="true"></span></button></div>` : ''}
      ${!fin ? `<div class="cierre-avance"><span class="segmentos" aria-hidden="true">${CH.RUTAS[zona].map(e => `<i class="${CH.E.eps[e.id] ? 'si' : ''}"></i>`).join('')}</span><span>${esc(mayus(z.nombre))} · ${n} de ${t} · ${esc(avance)}</span></div>` : ''}
      ${sorpresa ? `<p class="aviso-claro">${CH.cara(sorpresa.p, 'mini-cara')}<span><b>¡Sorpresa!</b> ${esc(sorpresa.dato)} Búscalo en tu mapa.</span></p>` : ''}
      ${plazaNueva ? `<p class="aviso-claro">${CH.cocuyo('senalando', 'mini-cara')}<span>¡Se abrió la Plaza: el taller de inventores!</span></p>` : ''}
      <div class="abajo">${fin ? '<a class="btn btn-primario" href="#diploma">Ver mi diploma</a>' : cromo ? `<a class="btn btn-primario" href="#album/${zona}">${cromoNuevo ? 'Pegar en mi álbum' : 'Ver en mi álbum'}</a>` : `<a class="btn btn-primario" href="#zona/${zona}">Seguir</a>`}<a class="btn btn-claro" href="#barrio">Volver al barrio</a></div>
    </div>`, { clase: 'modo-noche', voz });
    CH.sonido('cromo');
    setTimeout(() => CH.chispas(CH.$main.querySelector('.cierre-cromo .cromo-t') || CH.$main.querySelector('.coc-cierre'), 24), CH.menosMovimiento() ? 0 : 1300);
    CH.on('[data-voltear]', 'click', ev => { ev.currentTarget.classList.toggle('volteado'); if (cromo) CH.hablar({ t: cromo.dato }); });
  };

  /* ================= ÁLBUM ================= */
  function cromoHTML(c) {
    const z = CH.zona(c.zona), color = z ? z.color : '#FFB627', tinta = z ? z.tinta : '#2B211D';
    const arte = c.p ? CH.cara(c.p, 'cromo-arte') : c.o === 'cocuyo' ? CH.cocuyo('celebrando', 'cromo-arte') : CH.ilus('objeto', c.o || 'estrella', { cls: 'cromo-arte' });
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
        <span class="libro-sombra" aria-hidden="true"></span>
        <span class="libro-paginas" aria-hidden="true"></span>
        <span class="libro-interior" aria-hidden="true">
          <span class="interior-sello">Mi álbum</span>
          <span class="interior-indice">${GRUPOS().map(g => `<i style="--c:${g.c}"></i>`).join('')}</span>
          <span class="interior-firma">Este álbum es de un inventor del barrio</span>
        </span>
        <span class="libro-hoja h1" aria-hidden="true"></span><span class="libro-hoja h2" aria-hidden="true"></span>
        <span class="libro-tapa" aria-hidden="true">
          <span class="tapa-frente">
            <span class="libro-lomo"></span>
            <span class="tapa-costura"></span>
            <span class="tapa-esquina arriba"></span><span class="tapa-esquina abajo"></span>
            <span class="libro-sello">Álbum de inventor</span>
            <span class="libro-titulo">Mi barrio<br>verde</span>
            <span class="libro-medalla">
              <span class="medalla-aro"></span>
              <span class="medalla-chispa c1">${I.estrella}</span><span class="medalla-chispa c2">${I.estrella}</span><span class="medalla-chispa c3">${I.estrella}</span>
              <span class="libro-coc">${CH.cocuyo('celebrando')}</span>
            </span>
            <span class="libro-pegado p1" style="--c:${CH.ZONAS[2].color}"></span><span class="libro-pegado p2" style="--c:${CH.ZONAS[5].color}"></span>
            <span class="libro-cuenta"><b>${n}</b> de ${todos.length} cromos</span>
            <span class="libro-barra"><i style="width:${Math.round(n / todos.length * 100)}%"></i></span>
          </span>
          <span class="tapa-dorso"></span>
        </span>
        <span class="libro-cinta" aria-hidden="true"></span>
      </button>
      ${nuevos ? `<p class="aviso-nuevo"><b>${nuevos}</b> cromo${nuevos > 1 ? 's' : ''} nuevo${nuevos > 1 ? 's' : ''} para pegar</p>` : ''}
      <button class="btn btn-primario" data-abrir>Abrir mi álbum</button>
    </div>${nav('album')}`, { voz: { t: `Tu álbum. Tienes ${n} de ${todos.length} cromos.` } });
    CH.on('[data-abrir]', 'click', () => {
      const libro = CH.$main.querySelector('.libro'); libro.classList.add('abierto'); CH.sonido('pasa');
      setTimeout(() => CH.ir('#album/indice'), CH.menosMovimiento() ? 0 : 950);
    });
  }
  function albumIndice(todos, grupos) {
    const nuevos = CH.E.nuevos;
    CH.pintar(`<div class="pantalla album-indice">
      <header class="barra"><a class="btn-redondo" href="#album" aria-label="Cerrar el álbum">${I.atras}</a>
        <div class="crece"><h1 class="t-titulo">Mi álbum</h1><span class="t-nota">${CH.E.cromos.length} de ${todos.length} cromos · elige una sección</span></div></header>
      <ul class="secciones">${grupos.map(g => {
        const lista = todos.filter(c => c.zona === g.id), ok = lista.filter(c => tiene(c.id)).length, hay = lista.some(c => nuevos.includes(c.id));
        const arte = g.id === 'reto' ? `<span class="seccion-reto">${frascoSVG(Object.keys(CH.E.reto).length, true)}</span>` : CH.vista(g.id, 'seccion-fondo');
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
      ${sellos ? '' : `<div class="album-banda" aria-hidden="true">${CH.vista(g.id, 'seccion-fondo')}</div>`}
      <div class="album-hoja ${sellos ? 'sellos' : ''}">
        <ul class="cromos">${lista.map(c => {
          const num = sellos ? 'Día ' + (lista.indexOf(c) + 1) : todos.indexOf(c) + 1;
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
  const LUGARES_F = [[70, 196], [118, 204], [150, 178], [92, 166], [52, 150], [130, 146], [100, 126], [146, 112], [62, 112], [84, 88], [120, 84], [150, 80], [56, 80], [74, 136]];
  // Cada cocuyo es un Cocuyo en miniatura: casco naranja, cara clara, alas de vidrio y la barriga encendida.
  const bichoSVG = (x, y, k, recien) => `<g class="cf ${k === recien ? 'recien' : ''}" style="--k:${k}" transform="translate(${x} ${y}) rotate(${(k * 37) % 50 - 25}) scale(1.3)">
      <circle r="17" fill="url(#f-luz)"/>
      <g class="cf-alas"><ellipse cx="-6" cy="-3" rx="6" ry="3.6" transform="rotate(-28 -6 -3)" fill="#FFFFFF" fill-opacity=".6" stroke="#FFFFFF" stroke-opacity=".8" stroke-width=".8"/><ellipse cx="6" cy="-3" rx="6" ry="3.6" transform="rotate(28 6 -3)" fill="#FFFFFF" fill-opacity=".6" stroke="#FFFFFF" stroke-opacity=".8" stroke-width=".8"/></g>
      <path d="M-1.6 -9.5 l-2 -3.6 M1.6 -9.5 l2 -3.6" stroke="#5A3526" stroke-width="1" stroke-linecap="round"/><circle cx="-3.7" cy="-13.2" r="1.1" fill="#8A4B2A"/><circle cx="3.7" cy="-13.2" r="1.1" fill="#8A4B2A"/>
      <ellipse cx="0" cy="2.5" rx="4.6" ry="6" fill="#6B3E2A"/>
      <ellipse cx="0" cy="3.6" rx="3.4" ry="4.2" fill="#FFE58A"/><ellipse cx="-.8" cy="2.6" rx="1.3" ry="1.7" fill="#FFFBE6"/>
      <circle cx="0" cy="-6" r="4.4" fill="#D9673E"/><circle cx="0" cy="-5.2" r="3.1" fill="#F6E3C8"/>
      <circle cx="-1.2" cy="-5.6" r=".7" fill="#2B211D"/><circle cx="1.2" cy="-5.6" r=".7" fill="#2B211D"/></g>`;
  function frascoSVG(n, mini, recien = -1) {
    const brillo = Math.min(1, n / 14);
    const bichos = LUGARES_F.map(([x, y], k) => k < n ? bichoSVG(x, y, k, recien)
      : `<circle cx="${x}" cy="${y}" r="4" fill="#F4EBDD" fill-opacity=".05" stroke="#F4EBDD" stroke-opacity=".3" stroke-width="1.6" stroke-dasharray="2.5 2.5"/>`).join('');
    const cuerpo = 'M60 50 H140 V60 C168 68 178 86 178 106 V206 C178 223 165 234 148 234 H52 C35 234 22 223 22 206 V106 C22 86 32 68 60 60 Z';
    return `<svg viewBox="0 0 200 252" class="frasco-svg" ${mini ? 'aria-hidden="true"' : `role="img" aria-label="Frasco con ${n} de 14 cocuyos encendidos"`}>
      <defs>
        <radialGradient id="f-luz"><stop offset="0" stop-color="#FFE58A" stop-opacity=".9"/><stop offset=".45" stop-color="#FFD34D" stop-opacity=".35"/><stop offset="1" stop-color="#FFD34D" stop-opacity="0"/></radialGradient>
        <radialGradient id="f-dentro" cx=".5" cy=".66" r=".62"><stop offset="0" stop-color="#FFD34D" stop-opacity="${(.12 + brillo * .55).toFixed(2)}"/><stop offset="1" stop-color="#FFD34D" stop-opacity="0"/></radialGradient>
        <linearGradient id="f-vidrio" x1="0" x2="1"><stop offset="0" stop-color="#CFE7F0" stop-opacity=".42"/><stop offset=".18" stop-color="#CFE7F0" stop-opacity=".1"/><stop offset=".75" stop-color="#CFE7F0" stop-opacity=".05"/><stop offset="1" stop-color="#9FC9DE" stop-opacity=".34"/></linearGradient>
        <linearGradient id="f-tapa" x1="0" x2="1"><stop offset="0" stop-color="#A9391A"/><stop offset=".3" stop-color="#F07A45"/><stop offset=".55" stop-color="#E85D2A"/><stop offset="1" stop-color="#9C3417"/></linearGradient>
        <radialGradient id="f-piso" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD34D" stop-opacity="${(.1 + brillo * .45).toFixed(2)}"/><stop offset="1" stop-color="#FFD34D" stop-opacity="0"/></radialGradient>
        <clipPath id="f-dentro-clip"><path d="${cuerpo}"/></clipPath>
      </defs>
      <ellipse cx="100" cy="240" rx="96" ry="14" fill="url(#f-piso)"/>
      <ellipse cx="100" cy="240" rx="74" ry="8" fill="#000" opacity=".3"/>
      <path d="${cuerpo}" fill="#1C2A33" fill-opacity=".35"/>
      <path d="${cuerpo}" fill="url(#f-dentro)"/>
      <g clip-path="url(#f-dentro-clip)">
        <path d="M20 222 C46 206 72 214 100 208 C128 202 154 212 180 204 V240 H20 Z" fill="#3E6B3A"/>
        <path d="M20 228 C50 216 80 222 104 216 C130 211 156 220 180 214 V240 H20 Z" fill="#2E5530"/>
        <path d="M30 214 c2 -8 4 -10 6 -14 M38 214 c0 -6 2 -9 4 -12 M150 212 c1 -7 3 -10 6 -13 M160 210 c0 -6 1 -8 3 -11" stroke="#6E9B4A" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M34 196 C70 178 108 186 160 154" stroke="#7A4A2E" stroke-width="5.5" stroke-linecap="round" fill="none"/>
        <path d="M96 182 c8 -10 18 -12 26 -10" stroke="#7A4A2E" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M122 172 c6 -8 16 -9 20 -4 c-6 7 -14 8 -20 4z" fill="#5FA052" stroke="#2E5530" stroke-width="1.2"/>
        <path d="M60 186 c-2 -10 4 -18 12 -18 c2 8 -4 16 -12 18z" fill="#6FB25E" stroke="#2E5530" stroke-width="1.2"/>
        <path d="M150 158 c8 -4 16 0 16 6 c-8 3 -14 0 -16 -6z" fill="#5FA052" stroke="#2E5530" stroke-width="1.2"/>
      </g>
      <path d="${cuerpo}" fill="url(#f-vidrio)"/>
      ${bichos}
      <path d="${cuerpo}" fill="none" stroke="#1B1420" stroke-opacity=".55" stroke-width="5"/>
      <path d="${cuerpo}" fill="none" stroke="#F4EBDD" stroke-width="2.6"/>
      <path d="M36 116 C36 98 42 88 54 82" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M36 132 V200" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/>
      <path d="M48 210 V216" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
      <path d="M164 104 C164 96 160 88 154 84" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M52 228 H148" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="2"/>
      <path d="M62 54 H138 M62 59 H138" stroke="#F4EBDD" stroke-opacity=".45" stroke-width="1.6"/>
      <path d="M56 61 C58 66 70 69 100 69 C130 69 142 66 144 61" fill="none" stroke="#C99B6A" stroke-width="3.5"/>
      <path d="M58 64 C70 70 130 70 142 64" fill="none" stroke="#A97A4A" stroke-width="1.5" stroke-dasharray="3 2.5"/>
      <path d="M134 67 c10 4 14 14 10 24 l-8 -4 z" fill="#E9D3A8" stroke="#8A6A44" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="141" cy="76" r="1.6" fill="#8A6A44"/>
      <path d="M128 66 c-6 -6 -12 -4 -10 2 c2 4 8 2 10 -2 c6 -6 12 -4 10 2 c-2 4 -8 2 -10 -2z" fill="#C99B6A" stroke="#8A6A44" stroke-width="1.3"/>
      <path d="M66 20 C62 0 138 0 134 20" fill="none" stroke="#2A2130" stroke-width="6" stroke-linecap="round"/>
      <path d="M66 20 C62 0 138 0 134 20" fill="none" stroke="#C8B79F" stroke-width="3" stroke-linecap="round"/>
      <circle cx="66" cy="22" r="4" fill="#C8B79F" stroke="#2A2130" stroke-width="2"/><circle cx="134" cy="22" r="4" fill="#C8B79F" stroke="#2A2130" stroke-width="2"/>
      <rect x="48" y="24" width="104" height="28" rx="8" fill="url(#f-tapa)" stroke="#2A2130" stroke-width="3"/>
      <path d="M58 28 V48 M68 28 V48 M78 28 V48 M88 28 V48 M98 28 V48 M108 28 V48 M118 28 V48 M128 28 V48 M138 28 V48" stroke="#000" stroke-opacity=".16" stroke-width="2"/>
      <path d="M54 31 H146" stroke="#FFB08A" stroke-opacity=".75" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="100" cy="24" rx="50" ry="5" fill="#F07A45" stroke="#2A2130" stroke-width="2.5"/>
      <circle cx="84" cy="24" r="1.6" fill="#2A2130"/><circle cx="100" cy="23" r="1.6" fill="#2A2130"/><circle cx="116" cy="24" r="1.6" fill="#2A2130"/></svg>`;
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
      <section class="casillero-yo">${CH.avatar(CH.E.avatar, 'av-grande')}<div><b>${nivelNombre()}</b><span class="pildora">${I.estrella}<b>${est}</b> chispas</span><button class="btn btn-borde btn-chico" data-cambiar aria-label="Cambiar inventor o edad">Cambiar</button></div></section>
      <section><h2 class="t-sub">Accesorios</h2><p class="t-nota">Se abren con chispas. No hay tienda ni monedas.</p>
        <ul class="accesorios">${CH.ACCESORIOS.map(a => { const ok = est >= a.estrellas; return `<li><button class="acc ${ok ? '' : 'cerrado'}" ${ok ? '' : 'disabled'} data-acc="${a.id}" aria-pressed="${CH.E.accesorio === a.id}">${CH.hayImagen('accesorio', a.id) ? CH.ilus('accesorio', a.id) : CH.ilus('objeto', a.o)}<span>${esc(a.n)}</span><small>${ok ? (CH.E.accesorio === a.id ? 'Puesto' : 'Ponerlo') : a.estrellas + ' chispas'}</small></button></li>`; }).join('')}</ul></section>
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
      <p class="cartel-autor">${CH.avatar(CH.E.avatar, 'mini-cara')} ${/^Inventora/.test((CH.AVATARES.find(a => a.id === CH.E.avatar) || {}).nombre || '') ? 'Inventora' : 'Inventor'} del barrio · chispa</p></article>`;
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
      <section id="s-progreso" class="tarjeta"><h2>Progreso</h2><div class="stats"><div><b>${P.zonasEncendidas()} de 8</b><span>zonas encendidas</span></div><div><b>${Object.keys(CH.E.eps).length} de 33</b><span>episodios</span></div><div><b>${CH.E.cromos.length}</b><span>cromos</span></div><div><b>${Object.keys(CH.E.reto).length} de 14</b><span>días del reto</span></div><div><b>${P.nivelesSuperados ? P.nivelesSuperados() : 0} de 56</b><span>niveles de minijuegos</span></div><div><b>${P.estrellas()}</b><span>chispas en total</span></div></div></section>
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
      <section><h2>Créditos</h2><p>Proyecto académico de Diseño Gráfico. Ilustración del barrio, sus vistas, los fondos de cada zona los personajes y los accesorios en 3D generados con IA en Adobe Firefly; demás ilustraciones generadas con la IA de Figma y editadas a mano; voces del sistema o de ElevenLabs; investigación, diseño y código con apoyo de Claude (IA). Tipografías Bricolage Grotesque y Lexend (licencia OFL).</p></section>
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
  // Precarga el mapa para que el barrio aparezca sin parpadeo.
  if (CH.hayImagen('mapa', '')) { const im = new Image(); im.src = 'img/fondos/barrio.webp'; }
})();
