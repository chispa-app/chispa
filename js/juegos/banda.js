/* Minijuego 1 · Banda clasificadora (Casa).
   Las cosas llegan por una banda y se tocan las canecas (o se arrastra la cosa). Desde el nivel 3 hay envases
   sucios que se salvan enjuagándolos; desde el 4 aparece el punto especial. La banda espera: no hay prisa. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const K = '#5A3526', W = `stroke="${K}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const v = c => `<svg viewBox="0 0 48 48" aria-hidden="true">${c}</svg>`;
  Object.assign(CH.ICO, {
    medicina: v(`<rect x="10" y="16" width="28" height="26" rx="4" fill="#FFF" ${W}/><rect x="13" y="6" width="22" height="10" rx="2" fill="#E85D2A" ${W}/><path d="M24 22v14M17 29h14" stroke="#1F7A5C" stroke-width="4" stroke-linecap="round"/>`),
    aceite: v(`<path d="M18 6h12v6l4 6v22a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V18l4-6z" fill="#FFD34D" ${W}/><path d="M14 26h20" ${W}/><rect x="19" y="3" width="10" height="5" rx="1.5" fill="#E85D2A" ${W}/>`),
    ahorrador: v(`<path d="M20 34h8v6a4 4 0 0 1-8 0z" fill="#B9A88F" ${W}/><path d="M17 31c0-3 14-3 14 0M16 26c0-3 16-3 16 0M17 21c0-3 14-3 14 0M18 16c0-3 12-3 12 0M20 12c0-2 8-2 8 0" fill="none" ${W}/><path d="M17 31v-15M31 31v-15" ${W}/>`),
    sucio: v(`<path d="M10 30c-4-6 2-12 8-10 2-6 12-8 15-1 6-1 9 6 5 10 2 5-5 9-9 6-3 4-11 3-12-1-5 1-9-1-7-4z" fill="#8A5A2B" ${W}/>`)
  });

  // a: caneca correcta · d: dificultad (1 fácil, 2 media, 3 difícil) · sucio: se salva enjuagándolo.
  const COSAS = [
    { o: 'botella', n: 'Botella de plástico', a: 'blanca', d: 1, si: 'El plástico limpio se aprovecha.', casi: 'Es de plástico y está limpia. ¿Se puede volver a usar?' },
    { o: 'lata', n: 'Lata de gaseosa', a: 'blanca', d: 1, si: 'El metal se recicla.', casi: 'Es de metal y está vacía.' },
    { o: 'periodico', n: 'Periódico seco', a: 'blanca', d: 1, si: 'El papel limpio y seco se recicla.', casi: 'Está limpio y seco.' },
    { o: 'banano', n: 'Cáscara de banano', a: 'verde', d: 1, si: 'Las cáscaras se vuelven abono.', casi: 'Viene de una fruta.' },
    { o: 'arroz', n: 'Arroz que sobró', a: 'verde', d: 1, si: 'La comida que sobra es orgánica.', casi: 'Es comida.' },
    { o: 'mango', n: 'Cáscara de mango', a: 'verde', d: 1, si: 'Es orgánica: se vuelve abono.', casi: 'Viene de una fruta.' },
    { o: 'servilleta', n: 'Servilleta usada', a: 'negra', d: 1, si: 'Usada ya no se aprovecha.', casi: 'Está sucia. ¿Se podrá usar otra vez?' },
    { o: 'higienico', n: 'Papel higiénico usado', a: 'negra', d: 1, si: 'Va a la negra.', casi: 'Es papel, pero está usado.' },
    { o: 'cuaderno', n: 'Hojas de cuaderno', a: 'blanca', d: 2, si: 'El papel seco se recicla.', casi: 'Es papel limpio y seco.' },
    { o: 'vidrio', n: 'Botella de vidrio limpia', a: 'blanca', d: 2, si: 'El vidrio se recicla muchas veces.', casi: 'Es vidrio y está limpio.' },
    { o: 'huevo', n: 'Cáscaras de huevo', a: 'verde', d: 2, si: 'También son orgánicas.', casi: 'Vienen de la cocina, de un alimento.' },
    { o: 'hojas', n: 'Hojas secas del patio', a: 'verde', d: 2, si: 'Las hojas son orgánicas.', casi: 'Vienen de una planta.' },
    { o: 'tapa', n: 'Tapa plástica', a: 'blanca', d: 2, si: 'Las tapas también se aprovechan.', casi: 'Es plástico limpio.' },
    { o: 'yogur', n: 'Vaso de yogur enjuagado', a: 'blanca', d: 2, si: 'Enjuagado y seco, se aprovecha.', casi: 'Ya está limpio.' },
    { o: 'pizza', n: 'Caja de pizza con grasa', a: 'negra', d: 3, si: 'La grasa daña el cartón: ya no se recicla.', casi: 'Mira la grasa pegada. El cartón no se puede lavar.' },
    { o: 'servigrasa', n: 'Servilleta con grasa', a: 'negra', d: 3, si: 'Con grasa, el papel ya no se recicla.', casi: 'Tiene grasa.' },
    { o: 'paquete', n: 'Paquete de papas metalizado', a: 'negra', d: 3, si: 'Los empaques metalizados van a la negra.', casi: 'Brilla como metal, pero es un empaque.' },
    { o: 'frasco', n: 'Frasco con salsa', a: 'blanca', d: 3, sucio: true, limpio: 'Frasco enjuagado', si: 'Enjuagado, el vidrio se aprovecha.' },
    { o: 'yogur', n: 'Vaso de yogur con restos', a: 'blanca', d: 3, sucio: true, limpio: 'Vaso de yogur enjuagado', si: 'Limpio y seco, va a la blanca.' },
    { o: 'botella', n: 'Botella con jugo', a: 'blanca', d: 3, sucio: true, limpio: 'Botella vacía y enjuagada', si: 'Vacía y enjuagada, se aprovecha.' },
    { o: 'lata', n: 'Lata de atún', a: 'blanca', d: 3, sucio: true, limpio: 'Lata de atún enjuagada', si: 'Enjuagada, la lata se recicla.' },
    { o: 'pila', n: 'Pila usada', a: 'especial', d: 4, si: 'Las pilas van a un punto de recolección, no a la basura.', casi: 'Las pilas son peligrosas en la basura común.' },
    { o: 'medicina', n: 'Pastillas vencidas', a: 'especial', d: 4, si: 'Un adulto las lleva a un punto de recolección; hay en algunas droguerías.', casi: 'Las medicinas vencidas no van a ninguna caneca.' },
    { o: 'ahorrador', n: 'Bombillo ahorrador dañado', a: 'especial', d: 4, si: 'Tiene materiales peligrosos: va a un punto de recolección.', casi: 'Este bombillo tiene materiales peligrosos.' },
    { o: 'aceite', n: 'Aceite de cocina usado', a: 'especial', d: 4, si: 'En una botella cerrada, a un punto de recolección. Nunca por el lavaplatos.', casi: 'El aceite tapa tuberías. ¿Va en una caneca?' }
  ];
  // Por nivel: total, dificultades permitidas, cuántos sucios y cuántos especiales.
  const NV = [
    { total: 5, d: [1], sucios: 0, esp: 0 },
    { total: 6, d: [1, 2], sucios: 0, esp: 0 },
    { total: 6, d: [1, 2], sucios: 2, esp: 0 },
    { total: 7, d: [1, 2], sucios: 1, esp: 2 },
    { total: 8, d: [2, 3], sucios: 2, esp: 1 },
    { total: 8, d: [2, 3], sucios: 2, esp: 2 },
    { total: 9, d: [2, 3], sucios: 3, esp: 2 },
    { total: 10, d: [1, 2, 3], sucios: 3, esp: 3 }
  ];
  const INTRO = [
    ['¡Llegan cosas por la banda!', 'Toca la caneca correcta para cada una. También puedes arrastrarla.'],
    ['Más cosas en la banda.', 'Piensa de qué está hecha cada una.'],
    ['Ojo: algunas vienen sucias.', 'Lo sucio se puede salvar: toca «Enjuagar» y después llévalo a la blanca.'],
    ['Nuevo: el punto especial.', 'Pilas, medicinas y aceite no van en ninguna caneca: van a un punto de recolección.'],
    ['Cosas más difíciles.', 'Mira bien: ¿tiene grasa? ¿se puede lavar?'],
    ['¡Banda rápida de ideas!', 'Enjuaga lo que se pueda salvar.'],
    ['Casi eres experto.', 'Nueve cosas, de todo un poco.'],
    ['¡Nivel final!', 'Diez cosas. Usa todo lo que aprendiste.']
  ];

  CH.registrarJuego({
    id: 'banda', quien: 'cocuyo',
    como: { t: 'Las cosas de la casa llegan por una banda. Toca la caneca correcta: blanca, negra o verde. Lo sucio se enjuaga y lo peligroso va al punto especial.' },
    consejo: 'Para tres chispas: equivócate máximo una vez.',
    crear(api) {
      const cfg = NV[api.n - 1], total = cfg.total + (api.experto && api.n > 1 ? 1 : 0);
      const R = Math.random;
      const toma = (lista, k) => CH.mezclarCon(lista, R).slice(0, k);
      const especiales = toma(COSAS.filter(c => c.d === 4), cfg.esp);
      const sucios = toma(COSAS.filter(c => c.sucio), cfg.sucios);
      const normales = toma(COSAS.filter(c => !c.sucio && cfg.d.includes(c.d)), total - especiales.length - sucios.length);
      const cosas = CH.mezclarCon([...normales, ...sucios, ...especiales], R).map(c => ({ ...c, lavado: false }));
      const destinos = cfg.esp ? ['blanca', 'negra', 'verde', 'especial'] : ['blanca', 'negra', 'verde'];
      let k = 0, salvados = 0, ocupado = false;

      api.tablero.innerHTML = `<div class="banda">
        <div class="banda-cola" aria-hidden="true"><span>Vienen</span><div data-cola></div></div>
        <div class="banda-zona"><div class="banda-cinta" data-cinta aria-hidden="true"></div>
          <div class="banda-rodillos" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
          <div class="banda-sitio" data-sitio></div></div></div>`;
      api.ctrl.innerHTML = `${cfg.sucios ? `<button class="btn btn-borde btn-chico jg-enjuagar" data-enjuagar>${CH.objeto('gota')}<span>Enjuagar</span></button>` : ''}
        <div class="destinos n${destinos.length}" role="group" aria-label="Canecas">${destinos.map(d => CH.canecaHTML(d)).join('')}</div>`;
      const sitio = api.tablero.querySelector('[data-sitio]'), cola = api.tablero.querySelector('[data-cola]');
      const btnLavar = api.ctrl.querySelector('[data-enjuagar]');

      function tarjeta(c) {
        const nombre = c.sucio && c.lavado ? c.limpio : c.n;
        return `<div class="banda-obj ${c.sucio && !c.lavado ? 'es-sucio' : ''}" id="banda-obj" role="img" aria-label="${esc(nombre)}${c.sucio && !c.lavado ? ', sucio' : ''}" style="touch-action:none">
          <span class="banda-ico">${CH.ilus('objeto', c.o)}${c.sucio && !c.lavado ? `<span class="mancha">${CH.objeto('sucio')}</span>` : ''}</span><span class="banda-n">${esc(nombre)}</span></div>`;
      }
      function mostrar(entrada = true) {
        const c = cosas[k];
        sitio.innerHTML = tarjeta(c);
        const el = sitio.firstElementChild;
        if (entrada && !api.quieto) {
          el.classList.add('entra');
          const ci = api.tablero.querySelector('[data-cinta]'); ci.classList.remove('mueve'); void ci.offsetWidth; ci.classList.add('mueve');
        }
        CH.arrastrable(el, d => elegir(d));
        cola.innerHTML = cosas.slice(k + 1, k + 4).map(x => `<i>${CH.objeto(x.o)}</i>`).join('') || '<em>¡Última!</em>';
        api.cuenta(`${k + 1} de ${cosas.length}`);
        api.ctrl.querySelectorAll('[data-destino]').forEach(b => { b.disabled = false; b.classList.remove('casi', 'bien', 'pista'); });
        if (btnLavar) btnLavar.classList.remove('pista');
      }
      function siguiente() {
        k++;
        if (k >= cosas.length) {
          const est = api.porErrores(1, 3);
          return api.ganar(est, `Clasificaste ${cosas.length} cosas${salvados ? ` y salvaste ${salvados} envase${salvados > 1 ? 's' : ''} enjuagándolo${salvados > 1 ? 's' : ''}` : ''}.`);
        }
        mostrar(true);
        CH.anunciar('Ahora: ' + cosas[k].n);
      }
      function pista(c) {
        if (api.seguidos < 2) return;
        if (c.sucio && !c.lavado && btnLavar) btnLavar.classList.add('pista');
        else { const ok = api.ctrl.querySelector(`[data-destino="${c.a}"]`); if (ok) ok.classList.add('pista'); }
      }
      function elegir(d) {
        if (ocupado || api.terminado || d.disabled) return;
        const c = cosas[k], id = d.dataset.destino;
        if (c.sucio && !c.lavado) {
          api.fallo();
          if (id === 'blanca') api.decir('¡Espera! Está sucio.', 'Si va sucio, ensucia lo demás. Primero toca «Enjuagar».', 'casi');
          else if (id === 'negra') api.decir('¡Se puede salvar!', 'Enjuágalo con poquita agua y va a la blanca.', 'casi');
          else api.decir('Mmm, no.', 'Es un envase sucio. ¿Cómo lo salvamos?', 'casi');
          pista(c); return;
        }
        if (id === c.a) {
          ocupado = true; d.classList.add('bien'); api.acierto(d);
          api.ctrl.querySelectorAll('[data-destino]').forEach(b => { b.disabled = true; });
          api.decir(CH.azar(CH.FRASES.bien), c.si, 'bien', false);
          CH.hablar({ t: c.si });
          const el = sitio.firstElementChild;
          if (el && !api.quieto) el.classList.add('sale');
          setTimeout(() => { ocupado = false; if (!api.terminado && document.body.contains(sitio)) siguiente(); }, api.quieto ? 250 : 650);
        } else {
          d.classList.add('casi'); d.disabled = true;
          api.fallo();
          api.decir(CH.azar(CH.FRASES.casi), c.casi || 'Esa no es. Mira otra vez.', 'casi');
          pista(c);
        }
      }
      if (btnLavar) btnLavar.addEventListener('click', () => {
        if (ocupado || api.terminado) return;
        const c = cosas[k];
        if (c.sucio && !c.lavado) {
          c.lavado = true; salvados++;
          CH.sonido('pop'); btnLavar.classList.remove('pista');
          mostrar(false);
          const el = sitio.firstElementChild; if (el) { el.classList.add('lavado'); CH.chispas(el, 8); }
          api.decir('¡Limpio!', 'Ahora sí: ¿a qué caneca va?', 'bien');
        } else if (c.o === 'pizza' || c.o === 'servigrasa') api.decir('Eso no se puede lavar.', 'El papel y el cartón con grasa no se salvan con agua.', 'info');
        else if (c.a === 'verde') api.decir('No hace falta lavarlo.', 'Lo orgánico va tal cual a la verde.', 'info');
        else if (c.a === 'especial') api.decir('¡No se lava!', 'Esto va directo a un punto de recolección.', 'info');
        else api.decir('Ya está limpio.', '¿A qué caneca va?', 'info');
      });
      api.ctrl.querySelectorAll('[data-destino]').forEach(b => b.addEventListener('click', () => elegir(b)));
      mostrar(true);
      api.decir(INTRO[api.n - 1][0], INTRO[api.n - 1][1]);
    }
  });
})();
