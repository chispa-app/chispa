/* Minijuego 4 · Manglar vivo (Ciénaga).
   Un corte del manglar: se siembra cada mangle en su franja (rojo en la orilla, negro más adentro, blanco en lo alto)
   y cada animal vuelve a su lugar. Los lugares de un animal se abren cuando su árbol ya está sembrado.
   Desde el nivel 5 también hay basura que sacar. Toca una ficha y luego su lugar (arrastrar es opcional). */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const K = '#5A3526', W = `stroke="${K}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const v = c => `<svg viewBox="0 0 48 48" aria-hidden="true">${c}</svg>`;
  Object.assign(CH.ICO, {
    mangleRojo: v(`<path d="M24 22v8" stroke="#A0442A" stroke-width="4"/><path d="M24 28c-8 2-12 8-14 15M24 28c-3 5-5 10-6 15M24 28c3 5 5 10 6 15M24 28c8 2 12 8 14 15" fill="none" stroke="#A0442A" stroke-width="3" stroke-linecap="round"/><ellipse cx="24" cy="15" rx="17" ry="11" fill="#2E7D45" ${W}/><path d="M14 13c4-3 8-3 11 0M26 10c3-2 6-2 9 1" fill="none" stroke="#5DB075" stroke-width="2" stroke-linecap="round"/>`),
    mangleNegro: v(`<path d="M4 41h40" stroke="#6E4B2F" stroke-width="3" stroke-linecap="round"/><path d="M24 22v19" stroke="#5A3526" stroke-width="4"/><path d="M11 41v-6M15 41v-4M33 41v-4M37 41v-6M8 41v-3M40 41v-3" stroke="#6E4B2F" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="24" cy="15" rx="16" ry="11" fill="#22573A" ${W}/><path d="M15 13c3-2 7-2 10 0" fill="none" stroke="#3F8A5C" stroke-width="2" stroke-linecap="round"/>`),
    mangleBlanco: v(`<path d="M3 42c8-3 34-3 42 0" fill="#E7C89B" ${W}/><path d="M24 24v16" stroke="#8A6A4A" stroke-width="4"/><ellipse cx="24" cy="16" rx="15" ry="11" fill="#7DB868" ${W}/><path d="M16 14c3-2 6-2 9 0M26 11c2-1 5-1 7 1" fill="none" stroke="#A9D695" stroke-width="2" stroke-linecap="round"/>`)
  });

  const PIEZAS = {
    rojo: { o: 'mangleRojo', n: 'Mangle rojo', sub: 'raíces como patas', va: ['orilla'], e: 'Vive en la orilla, con los pies en el agua salada. Sus raíces como patas lo sostienen.', casi: 'Sus raíces como patas aguantan el agua. ¿Dónde hay más agua?' },
    negro: { o: 'mangleNegro', n: 'Mangle negro', sub: 'raíces como lápices', va: ['adentro'], e: 'Vive más adentro, en el barro. Saca raíces del suelo para respirar.', casi: 'Le gusta el barro, un poco más lejos del agua.' },
    blanco: { o: 'mangleBlanco', n: 'Mangle blanco', sub: 'suelo más seco', va: ['alto'], e: 'Prefiere la parte más alta, donde llega menos agua salada.', casi: 'Prefiere el suelo más alto y seco.' },
    ostra: { o: 'ostra', n: 'Ostra', va: ['raiz1', 'raiz2'], e: 'Se pega a las raíces que quedan bajo el agua.', casi: 'Necesita algo duro bajo el agua donde pegarse.' },
    pez: { o: 'pez', n: 'Pez pequeño', va: ['raiz1', 'raiz2'], e: 'Se esconde entre las raíces: son su guardería.', casi: 'Vive en el agua y se esconde de los peces grandes.' },
    cangrejo: { o: 'cangrejo', n: 'Cangrejo', va: ['barro'], e: 'Hace su cueva en el barro entre las raíces.', casi: 'Le gusta cavar cuevas en el barro.' },
    garza: { o: 'garza', n: 'Garza', va: ['bajito'], e: 'Camina despacio en el agua bajita y pesca.', casi: 'Tiene patas largas para caminar en el agua bajita.' },
    pajaro: { o: 'pajaro', n: 'Pájaro', va: ['rama1', 'rama2'], e: 'Muchas aves hacen su nido en las ramas del manglar.', casi: 'Busca un lugar alto para su nido.' },
    medusa: { o: 'medusa', n: 'Medusa', va: ['agua'], e: 'Volvieron a la ciénaga de Mallorquín cuando se recuperó (El Heraldo, 2023).', casi: 'Flota en el agua abierta.' }
  };
  // Lugares en el corte (porcentajes del dibujo de 400 × 440). dep: árbol que debe estar sembrado.
  const LUGARES = {
    orilla: { x: 44, y: 47.5, w: 26, h: 32, n: 'La orilla, en el agua', c: 'Orilla', arbol: true },
    adentro: { x: 69, y: 45.5, w: 20, h: 30, n: 'Más adentro, en el barro', c: 'Más adentro', arbol: true },
    alto: { x: 89, y: 35, w: 20, h: 30, n: 'Lo más alto y seco', c: 'Lo más alto', arbol: true },
    raiz1: { x: 32, y: 76, n: 'Entre raíces, bajo el agua', c: 'Raíces', dep: 'orilla' },
    raiz2: { x: 46, y: 72, n: 'Entre raíces, bajo el agua', c: 'Raíces', dep: 'orilla' },
    barro: { x: 66, y: 71, n: 'El barro', c: 'Barro', dep: 'adentro' },
    bajito: { x: 21, y: 58, n: 'Agua bajita de la orilla', c: 'Agua bajita' },
    rama1: { x: 33, y: 26, n: 'Las ramas', c: 'Ramas', dep: 'orilla' },
    rama2: { x: 89, y: 12, n: 'Las ramas', c: 'Ramas', dep: 'alto' },
    agua: { x: 10, y: 83, n: 'Agua abierta', c: 'Agua abierta' }
  };
  const BASURA = [{ o: 'bolsa', n: 'Bolsa', x: 7, y: 66 }, { o: 'botella', n: 'Botella', x: 60, y: 89 }, { o: 'lata', n: 'Lata', x: 88, y: 70 }, { o: 'icopor', n: 'Icopor', x: 82, y: 91 }];
  const NV = [
    { p: ['rojo', 'negro', 'blanco'], b: 0 },
    { p: ['rojo', 'negro', 'blanco', 'ostra', 'garza'], b: 0 },
    { p: ['rojo', 'negro', 'blanco', 'cangrejo', 'pez', 'pajaro'], b: 0 },
    { p: ['rojo', 'negro', 'blanco', 'ostra', 'pez', 'cangrejo', 'garza'], b: 0 },
    { p: ['rojo', 'negro', 'blanco', 'ostra', 'cangrejo', 'garza', 'pajaro'], b: 3 },
    { p: ['rojo', 'negro', 'blanco', 'ostra', 'pez', 'cangrejo', 'garza', 'medusa'], b: 3 },
    { p: ['rojo', 'negro', 'blanco', 'ostra', 'pez', 'cangrejo', 'garza', 'pajaro', 'pajaro', 'medusa'], b: 4 },
    { p: ['rojo', 'negro', 'blanco', 'ostra', 'pez', 'cangrejo', 'garza', 'pajaro', 'pajaro', 'medusa'], b: 4, sinPistas: true }
  ];
  const INTRO = [
    ['¡Buenas! Soy Tomás.', 'Cada mangle tiene su franja. Toca un mangle y luego su lugar.'],
    ['Llegan los animales.', 'Primero siembra los árboles: sus raíces y ramas son la casa de los animales.'],
    ['Más vecinos del manglar.', 'Cangrejo, pez y pájaro buscan su casa.'],
    ['Un manglar lleno de vida.', 'Siete fichas: árboles y animales.'],
    ['¡El arroyo trajo basura!', 'Toca la basura para sacarla y devuelve a cada uno a su lugar.'],
    ['Volvieron las medusas.', 'Cuando la ciénaga se limpia, regresan animales que se habían ido.'],
    ['Un manglar completo.', 'Diez fichas y cuatro basuras. ¡Tú puedes!'],
    ['¡Reto final, sin pistas!', 'Los lugares ya no tienen nombre. Recuerda dónde vive cada uno.']
  ];

  const escena = `<svg class="mg-escena" viewBox="0 0 400 440" aria-hidden="true" preserveAspectRatio="none">
    <rect width="400" height="440" fill="#DDEFE3"/><circle cx="318" cy="52" r="28" fill="#FFE58A"/>
    <path d="M150 440 L185 345 Q230 300 270 270 Q310 240 350 220 L400 205 V440 Z" fill="#B88A5A" stroke="${K}" stroke-width="3"/>
    <path d="M185 348 Q230 312 270 284 L278 312 Q238 340 204 372 Z" fill="#7B5A3C" opacity=".5"/>
    <path d="M0 232 H262 L268 266 Q228 300 185 345 L150 440 H0 Z" fill="#3F92C6" opacity=".84"/>
    <path d="M0 232 H262" stroke="#FFF" stroke-width="4" stroke-dasharray="18 12" opacity=".7"/>
    <path d="M18 300c14-6 28 6 42 0M60 370c14-6 28 6 42 0M10 420c14-6 28 6 42 0" fill="none" stroke="#FFF" stroke-width="3" opacity=".35" stroke-linecap="round"/>
  </svg>`;

  CH.registrarJuego({
    id: 'manglar', quien: 'tomas',
    como: { t: 'Siembra cada mangle en su franja y ayuda a los animales a volver a su casa en el manglar. Toca una ficha y después su lugar.' },
    consejo: 'Para tres estrellas: piensa dónde vive cada uno antes de tocar.',
    crear(api) {
      const cfg = NV[api.n - 1], sinPistas = cfg.sinPistas || (api.experto && api.n >= 6);
      const fichas = cfg.p.map((id, k) => ({ id, k, ...PIEZAS[id], puesta: false }));
      const cuenta = id => cfg.p.filter(x => x === id).length;
      const raices = cuenta('ostra') + cuenta('pez');
      const activos = ['orilla', 'adentro', 'alto'];
      if (raices >= 1) activos.push('raiz1');
      if (raices >= 2) activos.push('raiz2');
      if (cuenta('cangrejo')) activos.push('barro');
      if (cuenta('garza')) activos.push('bajito');
      if (cuenta('pajaro') >= 1) activos.push('rama1');
      if (cuenta('pajaro') >= 2) activos.push('rama2');
      if (cuenta('medusa')) activos.push('agua');
      const ARBOL = { orilla: 'el mangle rojo', adentro: 'el mangle negro', alto: 'el mangle blanco' };
      const ocupado = {};
      const basura = BASURA.slice(0, cfg.b).map(b => ({ ...b, fuera: false }));
      let sel = null;

      api.tablero.innerHTML = `<div class="mg" role="group" aria-label="Corte del manglar: agua a la izquierda, tierra alta a la derecha">${escena}
        ${activos.map(k => { const L = LUGARES[k]; return `<button class="mg-lugar ${L.arbol ? 'arbol' : 'animal'}" data-destino="${k}" style="left:${L.x}%;top:${L.y}%${L.w ? `;width:${L.w}%;height:${L.h}%` : ''}"><span class="mg-in"></span>${sinPistas ? '' : `<span class="mg-et" aria-hidden="true">${esc(L.c)}</span>`}</button>`; }).join('')}
        ${basura.map((b, i) => `<button class="mg-basura" data-basura="${i}" style="left:${b.x}%;top:${b.y}%" aria-label="Basura: ${esc(b.n)}. Toca para sacarla">${CH.objeto(b.o)}</button>`).join('')}</div>`;
      const muchas = fichas.length > 6, conSub = !sinPistas && api.n <= 4;
      api.ctrl.innerHTML = `<div class="mg-fichas ${muchas ? 'muchas' : ''}" role="group" aria-label="Fichas">${fichas.map(f => `<button class="ficha mg-ficha" data-f="${f.k}" aria-pressed="false" style="touch-action:none">${CH.ilus('objeto', f.o)}<span>${esc(f.n)}${f.sub && conSub ? `<small>${esc(f.sub)}</small>` : ''}</span></button>`).join('')}</div>`;

      const disponible = k => { const d = LUGARES[k].dep; return !d || ocupado[d]; };
      function pintarLugares() {
        api.tablero.querySelectorAll('.mg-lugar').forEach(b => {
          const k = b.dataset.destino, f = ocupado[k], abre = disponible(k);
          b.classList.toggle('lleno', !!f); b.classList.toggle('espera', !abre && !f);
          b.querySelector('.mg-in').innerHTML = f ? CH.ilus('objeto', f.o) : '';
          b.setAttribute('aria-label', `${LUGARES[k].n}: ${f ? f.n : abre ? 'vacío' : 'se abre cuando siembres su árbol'}`);
        });
        const faltan = fichas.filter(f => !f.puesta).length + basura.filter(b => !b.fuera).length;
        api.cuenta(faltan ? `Faltan ${faltan}` : '¡Listo!');
      }
      function elegirFicha(b) {
        if (api.terminado) return;
        api.ctrl.querySelectorAll('.mg-ficha').forEach(x => x.setAttribute('aria-pressed', x === b));
        sel = fichas[+b.dataset.f]; CH.sonido('toque');
        api.tablero.querySelectorAll('.mg-lugar').forEach(x => x.classList.remove('pista'));
      }
      function poner(f, lugar) {
        if (api.terminado || !f || f.puesta) return;
        const k = lugar.dataset.destino;
        if (ocupado[k]) { api.decir('Ese lugar ya tiene dueño.', 'Busca otro lugar.', 'info', false); return; }
        if (f.va.includes(k) && !disponible(k)) {
          api.decir('¡Bien pensado, pero falta algo!', `Primero siembra ${ARBOL[LUGARES[k].dep]}: ahí vive ${f.id === 'ostra' ? 'la ostra' : f.id === 'pez' ? 'el pez' : f.id === 'cangrejo' ? 'el cangrejo' : 'el pájaro'}.`, 'info');
          return;
        }
        if (f.va.includes(k)) {
          f.puesta = true; ocupado[k] = f; sel = null;
          const fb = api.ctrl.querySelector(`[data-f="${f.k}"]`); if (fb) fb.remove();
          pintarLugares(); api.acierto(lugar, 10);
          api.decir(`¡${f.n}${f.id === 'rojo' || f.id === 'negro' || f.id === 'blanco' ? ' sembrado' : ' en casa'}!`, f.e, 'bien');
          revisar();
        } else {
          const s = api.fallo();
          lugar.classList.add('casi'); setTimeout(() => lugar.classList.remove('casi'), 600);
          api.decir(CH.azar(CH.FRASES.casi), f.casi, 'casi');
          if (s >= 2) f.va.forEach(x => { const el = api.tablero.querySelector(`[data-destino="${x}"]`); if (el && !ocupado[x]) el.classList.add('pista'); });
        }
      }
      function revisar() {
        if (fichas.every(f => f.puesta) && basura.every(b => b.fuera)) {
          const animales = fichas.length - 3;
          setTimeout(() => api.ganar(api.porErrores(1, 3), api.n === 8 ? 'Sembraste el manglar completo y cada animal volvió a su casa. Un manglar sano protege la costa y guarda carbono.' : `Sembraste los 3 mangles${animales ? ` y ${animales} animal${animales > 1 ? 'es volvieron' : ' volvió'} a casa` : ''}${basura.length ? `. Sacaste ${basura.length} basuras` : ''}.`), api.quieto ? 0 : 500);
        } else if (fichas.every(f => f.puesta)) api.decir('¡Falta sacar basura!', 'Toca lo que trajo el arroyo.', 'info');
      }
      api.ctrl.querySelectorAll('.mg-ficha').forEach(b => {
        b.addEventListener('click', () => elegirFicha(b));
        CH.arrastrable(b, lugar => { if (lugar.classList.contains('mg-lugar')) poner(fichas[+b.dataset.f], lugar); });
      });
      api.tablero.querySelectorAll('.mg-lugar').forEach(l => l.addEventListener('click', () => {
        if (!sel) { const f = ocupado[l.dataset.destino]; api.decir(f ? f.n : 'Primero toca una ficha.', f ? f.e : 'Las fichas están abajo.', 'info', !!f); return; }
        poner(sel, l);
      }));
      api.tablero.querySelectorAll('.mg-basura').forEach(b => b.addEventListener('click', () => {
        if (api.terminado) return;
        const x = basura[+b.dataset.basura]; if (x.fuera) return;
        x.fuera = true; b.classList.add('fuera'); b.disabled = true; api.acierto(b, 6);
        setTimeout(() => b.remove(), 350);
        pintarLugares();
        api.decir('¡Fuera del manglar!', basura.every(z => z.fuera) ? 'Ya no queda basura.' : `Quedan ${basura.filter(z => !z.fuera).length}.`, 'bien', false);
        revisar();
      }));
      pintarLugares();
      api.decir(INTRO[api.n - 1][0], INTRO[api.n - 1][1]);
    }
  });
})();
