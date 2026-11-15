/* Minijuego 3 · Atrapa en el arroyo (Arroyo).
   La basura baja por el arroyo hacia la trampa. Se toca para sacarla; las hojas y semillas se dejan pasar.
   Sin tiempo límite: lo que no alcanzas queda atascado en la reja y lo puedes sacar después. El río se puede pausar,
   y se detiene solo si una cosa tiene el foco del teclado. Con «Juegos sin tiempo» todo queda quieto. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const K = '#5A3526', W = `stroke="${K}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  Object.assign(CH.ICO, {
    ramita: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40 40 10M22 27l-6-12M30 19l10 2" fill="none" stroke="#8A4B2A" stroke-width="4" stroke-linecap="round"/><path d="M16 15c-6-2-8 3-6 6 4 0 6-2 6-6zM40 21c2 5-2 8-6 6 0-4 2-6 6-6z" fill="#6E8B3D" ${W}/></svg>`
  });
  const BASURA = [
    { o: 'botella', n: 'Botella plástica' }, { o: 'bolsa', n: 'Bolsa plástica' }, { o: 'lata', n: 'Lata' }, { o: 'icopor', n: 'Icopor' },
    { o: 'tapa', n: 'Tapa plástica' }, { o: 'pitillo', n: 'Pitillo' }, { o: 'vaso', n: 'Vaso desechable' }, { o: 'paquete', n: 'Paquete de papas' }
  ];
  const NATURAL = [{ o: 'hoja', n: 'Hoja de árbol' }, { o: 'hojas', n: 'Hojas secas' }, { o: 'semilla', n: 'Semilla' }, { o: 'ramita', n: 'Ramita' }];
  // basura, naturales, velocidad (alto del agua por segundo), máximo a la vez, segundos entre una y otra
  const NV = [[5, 2, 0.085, 2, 2.6], [6, 3, 0.1, 3, 2.3], [7, 4, 0.115, 3, 2.1], [8, 4, 0.13, 3, 1.9],
    [8, 6, 0.145, 4, 1.7], [9, 6, 0.16, 4, 1.5], [10, 7, 0.175, 4, 1.35], [12, 8, 0.19, 5, 1.2]];
  const BIEN = ['¡A la canasta!', '¡Fuera del agua!', '¡Atrapada!', '¡Bien visto!'];
  const DATOS = ['El plástico no se deshace en el agua: viaja hasta la ciénaga.', 'Una bolsa puede tapar un sumidero y empeorar el arroyo.',
    'Lo que cae a la calle, con la lluvia llega al arroyo.', 'La basura que no llega al arroyo no hay que sacarla después.'];
  const CARRILES = [12, 31, 50, 69, 88];

  CH.registrarJuego({
    id: 'arroyo', quien: 'lina',
    como: { t: 'Eres guardián de la trampa del arroyo. Toca la basura para sacarla del agua antes de que llegue a la ciénaga. Las hojas y semillas son de la naturaleza: déjalas pasar.' },
    consejo: 'Para tres estrellas, toca solo la basura: deja pasar lo natural.',
    crear(api) {
      const [nb, nn, vel0, maxA, cada] = NV[api.n - 1];
      const vel = vel0 * (api.experto ? 1.1 : 1);
      const R = Math.random;
      const cola = CH.mezclarCon([
        ...Array.from({ length: nb }, (_, i) => ({ ...BASURA[i % BASURA.length], basura: true })),
        ...Array.from({ length: nn }, (_, i) => ({ ...NATURAL[i % NATURAL.length], basura: false }))
      ], R);
      if (cola[0] && !cola[0].basura) { const i = cola.findIndex(c => c.basura); [cola[0], cola[i]] = [cola[i], cola[0]]; } // empieza con basura
      let atrapadas = 0, idSig = 0, desde = 99, datoK = 0;
      const vivas = [];   // { el, c, x, y, fase, estado: 'baja'|'atascada'|'pasa' }

      api.tablero.innerHTML = `<div class="arr ${api.quieto ? 'quieto' : ''}" data-arr>
        <div class="arr-orilla izq" aria-hidden="true"></div><div class="arr-orilla der" aria-hidden="true"></div>
        <div class="arr-agua" aria-hidden="true"></div>
        <div class="arr-reja" aria-hidden="true"><span>Trampa</span></div>
        <div class="arr-cienaga" aria-hidden="true">${CH.objeto('garza')}<span>Ciénaga</span></div>
        <div class="arr-canasta" aria-hidden="true">${CH.objeto('trampa')}<b data-canasta>0</b><span>/${nb}</span></div>
        <div class="arr-flotan" data-flotan role="group" aria-label="Cosas en el arroyo"></div></div>`;
      api.ctrl.innerHTML = api.quieto ? '' : `<button class="btn btn-borde btn-chico arr-pausa" data-pausa-rio aria-pressed="false">${CH.I.pausa}<span>Pausar el río</span></button>`;
      const arr = api.tablero.querySelector('[data-arr]'), flotan = arr.querySelector('[data-flotan]');
      const bPausa = api.ctrl.querySelector('[data-pausa-rio]');
      if (bPausa) bPausa.addEventListener('click', () => {
        api.pausado = !api.pausado;
        bPausa.setAttribute('aria-pressed', api.pausado); arr.classList.toggle('parado', api.pausado);
        bPausa.querySelector('span').textContent = api.pausado ? 'Seguir el río' : 'Pausar el río';
      });

      const tam = () => ({ w: flotan.clientWidth, h: flotan.clientHeight });
      const S = 56;
      function crear(c, x, y) {
        const el = document.createElement('button');
        el.className = 'flota'; el.type = 'button';
        el.setAttribute('aria-label', c.n); el.innerHTML = CH.objeto(c.o);
        const it = { el, c, x, y, fase: R() * 6, estado: 'baja', id: idSig++ };
        el.addEventListener('click', () => tocar(it));
        flotan.appendChild(el); vivas.push(it); poner(it);
        return it;
      }
      function poner(it) {
        const { w } = tam();
        const dx = it.estado === 'baja' && !api.quieto ? Math.sin(it.fase) * 6 : 0;
        it.el.style.transform = `translate(${(it.x / 100) * w - S / 2 + dx}px, ${it.y - S / 2}px)`;
      }
      function quitar(it) { const i = vivas.indexOf(it); if (i >= 0) vivas.splice(i, 1); }
      function tocar(it) {
        if (api.terminado || it.estado === 'fuera' || it.estado === 'pasa') return;
        if (it.c.basura) {
          it.estado = 'fuera'; quitar(it);
          it.el.classList.add('atrapada'); it.el.disabled = true;
          atrapadas++; arr.querySelector('[data-canasta]').textContent = atrapadas;
          api.acierto(it.el, 8); api.cuenta(`${atrapadas} de ${nb}`);
          setTimeout(() => it.el.remove(), 400);
          if (atrapadas === nb) return fin();
          const dato = atrapadas % 3 === 0 ? DATOS[datoK++ % DATOS.length] : '';
          api.decir(CH.azar(BIEN), dato, 'bien', !!dato);
          reacomodar();
        } else {
          const s = api.fallo();
          it.el.classList.add('no'); setTimeout(() => it.el.classList.remove('no'), 500);
          api.decir('¡Eso es natural!', `${it.c.n}: es de la naturaleza y no hace daño. Déjala pasar.`, 'casi');
          if (s >= 2) vivas.filter(v => v.c.basura).forEach(v => v.el.classList.add('pista'));
        }
      }
      function fin() {
        const extra = api.n === 8 ? ' La trampa del arroyo León sacó cerca de 4.000 toneladas de basura (El Heraldo, 2024).' : '';
        api.ganar(api.porErrores(1, 3), `Sacaste ${nb} basuras del arroyo${api.errores ? ` y tocaste ${api.errores} cosa${api.errores > 1 ? 's' : ''} natural${api.errores > 1 ? 'es' : ''}` : ' sin tocar nada natural'}.${extra}`);
      }
      // Las basuras atascadas en la reja se ordenan en filas, sin taparse.
      function reacomodar() {
        const { h } = tam(), fondo = h - S / 2 - 4;
        const at = vivas.filter(v => v.estado === 'atascada');
        at.forEach((v, i) => { v.x = CARRILES[i % 5]; v.y = fondo - Math.floor(i / 5) * (S - 6); poner(v); });
      }

      if (api.quieto) {
        // Todo a la vista y quieto: se reparte en una cuadrícula.
        const { w, h } = tam(), cols = 4, filas = Math.ceil(cola.length / cols);
        const huecos = CH.mezclarCon([...Array(cols * filas).keys()], R);
        cola.forEach((c, i) => { const k = huecos[i], col = k % cols, fil = Math.floor(k / cols);
          crear(c, 14 + col * (72 / (cols - 1)), S / 2 + 50 + fil * ((h - S - 56) / Math.max(1, filas - 1))); });
        void w;
      } else {
        api.bucle(dt => {
          const { h } = tam(), s = dt / 1000;
          if (flotan.contains(document.activeElement) && document.activeElement.classList.contains('flota')) return; // con foco, espera
          desde += s;
          const bajando = vivas.filter(v => v.estado === 'baja').length;
          if (cola.length && desde >= cada && bajando < maxA) {
            desde = 0;
            const ocupados = vivas.filter(v => v.estado === 'baja' && v.y < S * 1.6).map(v => v.x);
            const libres = CARRILES.filter(x => !ocupados.includes(x));
            crear(cola.shift(), CH.azar(libres.length ? libres : CARRILES), -S / 2);
          }
          const tope = h - S * 0.9;
          vivas.slice().forEach(v => {
            if (v.estado !== 'baja') return;
            v.y += vel * h * s; v.fase += s * 2.2;
            if (v.y >= tope) {
              if (v.c.basura) { v.estado = 'atascada'; v.el.classList.add('atascada'); reacomodar(); if (!arr.dataset.avisado) { arr.dataset.avisado = '1'; api.decir('Se atascó en la reja.', 'Tranquilo: la puedes sacar desde ahí.', 'info'); } }
              else { v.estado = 'pasa'; quitar(v); v.el.classList.add('pasa'); v.el.disabled = true; setTimeout(() => v.el.remove(), 500); }
            } else poner(v);
          });
        });
      }
      api.cuenta(`0 de ${nb}`);
      const intro = api.n === 1 ? ['¡Hola! Soy Lina.', 'Toca la basura que baja por el arroyo. Las hojas y semillas déjalas pasar.']
        : api.n === 2 ? ['Más basura bajando.', 'Si algo se atasca en la reja, también lo puedes sacar.']
        : api.n < 5 ? ['El agua va más rápido.', 'Mira bien: ¿es basura o es naturaleza?']
        : api.n < 8 ? ['¡Llovió duro!', 'Baja mucha basura. Puedes pausar el río cuando quieras.']
        : ['¡Nivel final!', 'Doce basuras. La ciénaga cuenta contigo.'];
      api.decir(intro[0], api.quieto ? 'Toca toda la basura. Las hojas y semillas déjalas quietas.' : intro[1]);
    }
  });
})();
