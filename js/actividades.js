/* chispa 2.0 · motor de episodios y biblioteca de actividades.
   Cada actividad se resuelve tocando; arrastrar es opcional (WCAG 2.2, 2.5.7). Nada tiene tiempo límite. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc, T = CH.texto;
  const ACT = CH.ACT = {};

  /* ---------- Piezas de interfaz ---------- */
  const caneca = (id, extra = '') => {
    const c = CH.CANECAS[id];
    const ic = id === 'especial'
      ? `<svg viewBox="0 0 36 44" aria-hidden="true"><rect x="7" y="9" width="22" height="31" rx="5" fill="#FFF0D6" stroke="#2B211D" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M14 4h8v6h-8z" fill="#FFB627" stroke="#2B211D" stroke-width="2"/></svg>`
      : `<svg viewBox="0 0 36 44" aria-hidden="true"><rect x="5" y="10" width="26" height="31" rx="4" fill="${c.color}" stroke="#2B211D" stroke-width="2.5"/><rect x="2" y="5" width="32" height="7" rx="3" fill="${c.color}" stroke="#2B211D" stroke-width="2.5"/><rect x="13" y="1.5" width="10" height="5" rx="2" fill="${c.color}" stroke="#2B211D" stroke-width="2"/></svg>`;
    return `<button class="destino caneca-t caneca-${id}" data-destino="${id}" style="--cc:${id === 'especial' ? '#FFB627' : c.color}" ${extra}>${ic}<b>${c.nombre}</b><span>${c.sub}</span></button>`;
  };
  const tarjetaObj = (o, n, cls = '') => `<div class="obj-t ${cls}">${CH.ilus('objeto', o, { alt: '' })}<span>${esc(n)}</span></div>`;
  const picto = P => {
    if (!P) return '';
    if (P.comparar) {
      const filas = P.comparar.map(c => {
        const n = c.valor / P.unidad, llenos = Math.floor(n), resto = n - llenos;
        let ics = ''; for (let i = 0; i < llenos; i++) ics += `<span>${CH.objeto(P.o)}</span>`;
        if (resto > 0.05) ics += `<span style="clip-path:inset(0 ${Math.round((1 - resto) * 100)}% 0 0)">${CH.objeto(P.o)}</span>`;
        return `<div class="fila-b"><span class="eti">${esc(c.etiqueta)}</span><span class="ics">${ics}</span></div>`;
      }).join('');
      return `<figure class="barras">${filas}<figcaption>${esc(P.ley)}</figcaption></figure>`;
    }
    let ics = '';
    for (let i = 0; i < P.total; i++) {
      const parcial = P.parcial && i === P.total - 1;
      ics += `<span class="ic ${i < P.on ? 'on' : ''}" style="animation-delay:${i * 60}ms${parcial ? `;clip-path:inset(0 ${Math.round((1 - P.parcial) * 100)}% 0 0)` : ''}">${CH.objeto(P.o)}</span>`;
    }
    return `<figure class="picto-f"><div class="picto" style="--cols:${P.cols || 5}">${ics}</div><figcaption>${esc(P.ley)}</figcaption></figure>`;
  };
  CH.picto = picto;
  const fuente = k => { const f = CH.F[k]; return f ? `<p class="fuente">Fuente: ${esc(f.nombre)}</p>` : ''; };
  CH.fuenteHTML = fuente;
  CH.canecaHTML = caneca;

  // Arrastre opcional con puntero: el toque siempre funciona aparte.
  function arrastrable(el, alSoltar) {
    let inicio = null, fantasma = null;
    el.addEventListener('pointerdown', ev => {
      if (ev.button > 0) return;
      inicio = { x: ev.clientX, y: ev.clientY, id: ev.pointerId };
    });
    el.addEventListener('pointermove', ev => {
      if (!inicio || ev.pointerId !== inicio.id) return;
      const dx = ev.clientX - inicio.x, dy = ev.clientY - inicio.y;
      if (!fantasma && Math.hypot(dx, dy) > 10) {
        try { el.setPointerCapture(ev.pointerId); } catch (e) { /* nada */ }
        const r = el.getBoundingClientRect();
        fantasma = el.cloneNode(true); fantasma.classList.add('fantasma'); fantasma.removeAttribute('id');
        fantasma.style.width = r.width + 'px'; fantasma.style.left = r.left + 'px'; fantasma.style.top = r.top + 'px';
        document.body.appendChild(fantasma); el.classList.add('levantado');
      }
      if (fantasma) { fantasma.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-8, Math.min(8, dx / 12))}deg)`; ev.preventDefault(); }
    });
    const fin = ev => {
      if (!inicio) return;
      if (fantasma) {
        fantasma.style.display = 'none';
        const bajo = document.elementFromPoint(ev.clientX, ev.clientY);
        fantasma.remove(); fantasma = null; el.classList.remove('levantado');
        const d = bajo && bajo.closest('[data-destino]');
        if (d && !d.disabled) alSoltar(d);
      }
      inicio = null;
    };
    el.addEventListener('pointerup', fin);
    el.addEventListener('pointercancel', () => { if (fantasma) { fantasma.remove(); fantasma = null; el.classList.remove('levantado'); } inicio = null; });
  }
  CH.arrastrable = arrastrable;

  /* =========================================================
     MOTOR DEL EPISODIO
     ========================================================= */
  CH.jugarEpisodio = (ep, zona) => {
    const Z = CH.zona(zona), E = CH.E, nivel = E.nivel;
    const pasos = ep.pasos.filter(p => !p.solo || p.solo === nivel);
    let i = (E.enCurso && E.enCurso.ep === ep.id) ? Math.min(E.enCurso.paso, pasos.length - 1) : 0;
    let errores = (E.enCurso && E.enCurso.ep === ep.id && E.enCurso.errores) || 0;
    let seguidos = 0, temporizador = null;

    function marco() {
      const dots = pasos.map((p, k) => `<li class="${k < i ? 'hecho' : k === i ? 'actual' : ''}"><span class="solo-lector">${k < i ? 'hecha' : k === i ? 'actual' : 'pendiente'}</span></li>`).join('');
      return `<div class="ep" style="--z:${Z.color};--zt:${Z.tinta}">
        <div class="ep-fondo" aria-hidden="true">${CH.fondo(zona)}</div>
        <div class="ep-barra">
          <button class="btn-redondo" data-pausa aria-label="Pausa">${CH.I.pausa}</button>
          <ol class="ep-progreso" aria-label="Actividad ${i + 1} de ${pasos.length}">${dots}</ol>
          <button class="btn-redondo" data-voz aria-label="Repetir la voz">${CH.I.voz}</button>
        </div>
        <h1 class="solo-lector">${esc(Z.nombre)} · ${esc(ep.titulo)}</h1>
        <div class="ep-lienzo" data-lienzo></div>
        <section class="ep-hoja" data-hoja></section>
      </div>`;
    }

    function mostrar() {
      clearTimeout(temporizador);
      E.enCurso = { ep: ep.id, paso: i, errores }; CH.guardar();
      const p = pasos[i];
      CH.pintar(marco(), { clase: 'modo-ep' });
      const ctx = crearCtx(p);
      CH.on('[data-pausa]', 'click', pausa);
      CH.on('[data-voz]', 'click', () => CH.repetir());
      (ACT[p.tipo] || ACT.desconocido)(p, ctx);
    }

    function crearCtx(p) {
      const lienzo = CH.$main.querySelector('[data-lienzo]'), hoja = CH.$main.querySelector('[data-hoja]');
      const ctx = {
        p, ep, zona, Z, lienzo, hoja, nivel,
        quien: p.quien || (Z.id === 'casa' || Z.id === 'plaza' ? 'cocuyo' : Z.quien),
        // Personaje con globo en el lienzo.
        actor(l, quien = ctx.quien, exp = 'feliz') {
          const fig = quien === 'cocuyo' ? CH.cocuyo(exp, 'actor-fig') : CH.personaje(quien, 'actor-fig');
          const nombre = quien === 'cocuyo' ? 'Cocuyo' : (CH.PERSONAJES[quien] || {}).nombre || '';
          lienzo.innerHTML = `<div class="actor"><div class="actor-cuerpo">${fig}</div>${l ? `<div class="globo-actor"><span class="quien" style="--c:${Z.color};--t:${Z.tinta}">${esc(nombre)}</span><p class="globo">${esc(T(l))}</p></div>` : ''}</div>`;
        },
        decir(l, quien, exp, fin) { ctx.actor(l, quien, exp); CH.hablar(l, fin); },
        acierto(el) { seguidos = 0; CH.sonido('bien'); if (el) CH.chispas(el, 10); },
        fallo() { errores++; seguidos++; CH.sonido('casi'); E.enCurso.errores = errores; CH.guardar(); return seguidos; },
        necesitaPista: () => seguidos >= 2,
        // Respuesta en la hoja, sin empujar el contenido.
        respuesta(bien, titulo, texto, extra = '') {
          let r = hoja.querySelector('.resp');
          if (!r) { r = document.createElement('div'); hoja.prepend(r); }
          r.className = 'resp ' + (bien ? 'bien' : 'casi');
          r.innerHTML = `${CH.cocuyo(bien ? 'feliz' : 'pensando', 'mini')}<div><p class="titulo">${esc(titulo)}</p>${texto ? `<p>${esc(texto)}</p>` : ''}${extra}</div>`;
          CH.anunciar(titulo + '. ' + (texto || ''));
          return r;
        },
        limpiarRespuesta() { const r = hoja.querySelector('.resp'); if (r) r.remove(); },
        // Botón para seguir; avanza solo cuando la voz termina.
        seguir(fn, { texto = 'Seguir', voz = null, auto = true } = {}) {
          const b = document.createElement('button'); b.className = 'btn btn-primario btn-seguir'; b.textContent = texto;
          let hecho = false; const ir = () => { if (hecho) return; hecho = true; clearTimeout(temporizador); fn(); };
          b.addEventListener('click', ir);
          const cont = hoja.querySelector('[data-acciones]') || hoja;
          cont.appendChild(b); b.focus({ preventScroll: true });
          if (voz) CH.hablar(voz, auto ? () => { temporizador = setTimeout(() => { if (document.body.contains(b)) ir(); }, 1100); } : null);
          return b;
        },
        terminar() { i++; if (i < pasos.length) mostrar(); else cerrar(); }
      };
      return ctx;
    }

    function pausa() {
      CH.callar();
      const d = CH.dialogo(`<h2 class="t-sub">Pausa</h2><p>Lo que ya hiciste queda guardado.</p>
        <div class="acciones-dlg"><button class="btn btn-primario" data-seguir>Seguir</button><button class="btn btn-borde" data-salir>Salir al barrio</button></div>`, 'Pausa');
      d.querySelector('[data-seguir]').addEventListener('click', () => CH.cerrarDialogo());
      d.querySelector('[data-salir]').addEventListener('click', () => { CH.cerrarDialogo(); CH.ir('#barrio'); });
    }

    function cerrar() {
      const estrellas = errores <= 1 ? 3 : errores <= 4 ? 2 : 1;
      const nuevo = !E.eps[ep.id];
      const antes = E.eps[ep.id] ? E.eps[ep.id].estrellas : 0;
      E.eps[ep.id] = { estrellas: Math.max(antes, estrellas), fecha: CH.hoy() };
      E.enCurso = null;
      if (nuevo) E.sesion.nuevos++;
      const cromoNuevo = CH.ganarCromo(ep.id);
      CH.guardar();
      CH.PANTALLAS.cierre({ ep, zona, estrellas, nuevo, cromoNuevo });
    }

    mostrar();
  };

  /* =========================================================
     ACTIVIDADES
     ========================================================= */

  /* 1. Escena: el personaje habla, con subtítulos. Avanza sola al terminar cada frase. */
  ACT.escena = (p, ctx) => {
    const lineas = (CH.E.nivel === 'experto' && p.xlineas) ? p.xlineas : p.lineas;
    let k = 0;
    function una() {
      const l = lineas[k], obj = typeof l === 'string' ? { t: l } : l;
      ctx.actor(obj, obj.quien || ctx.quien, obj.exp || 'feliz');
      if (obj.img || p.img) {
        const im = obj.img || p.img;
        const pieza = CH.hayImagen('escena', im) ? CH.ilus('escena', im, { cls: 'escena-img' }) : (p.objs ? `<div class="escena-objs">${p.objs.map(o => CH.ilus('objeto', o)).join('')}</div>` : '');
        if (pieza) ctx.lienzo.insertAdjacentHTML('afterbegin', `<div class="escena-cuadro">${pieza}</div>`);
      } else if (obj.o) ctx.lienzo.insertAdjacentHTML('afterbegin', `<div class="escena-cuadro solo-obj">${CH.ilus('objeto', obj.o)}</div>`);
      ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(p.titulo || ctx.ep.titulo)}</h2><div data-acciones class="acciones"></div>`;
      ctx.seguir(() => { k++; if (k < lineas.length) una(); else ctx.terminar(); }, { texto: k < lineas.length - 1 ? 'Seguir' : (p.fin || '¡Vamos!'), voz: obj });
    }
    una();
  };

  /* 2. Busca y toca: encontrar cosas en la escena. */
  ACT.busca = (p, ctx) => {
    const cosas = CH.nivel(p, 'cosas'), meta = cosas.filter(c => c.si).length;
    let halladas = 0;
    ctx.lienzo.innerHTML = `<div class="busca" role="group" aria-label="${esc(T(p.pide))}">${cosas.map((c, j) =>
      `<button class="busca-c" style="left:${c.x}%;top:${c.y}%" data-j="${j}" aria-label="${esc(c.n)}">${CH.ilus('objeto', c.o)}</button>`).join('')}</div>`;
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2><p class="contador" aria-live="polite"><b data-n>0</b> de ${meta}</p><div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    CH.on('.busca-c', 'click', ev => {
      const b = ev.currentTarget, c = cosas[+b.dataset.j];
      if (b.classList.contains('hallado')) return;
      if (c.si) {
        b.classList.add('hallado'); b.setAttribute('aria-label', c.n + ', encontrado'); halladas++;
        ctx.hoja.querySelector('[data-n]').textContent = halladas;
        ctx.acierto(b); ctx.respuesta(true, c.n, c.e || '');
        if (c.e) CH.hablar(c.e);
        if (halladas === meta) {
          ctx.lienzo.querySelectorAll('.busca-c:not(.hallado)').forEach(x => { x.disabled = true; });
          setTimeout(() => { ctx.respuesta(true, CH.azar(CH.FRASES.bien), T(p.cierre)); ctx.seguir(ctx.terminar, { voz: p.cierre }); }, 700);
        }
      } else {
        b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 600);
        const n = ctx.fallo(); ctx.respuesta(false, c.n, c.e || 'Ese no. Sigue buscando.');
        CH.hablar(c.e || 'Ese no. Sigue buscando.');
        if (n >= 2) ctx.lienzo.querySelectorAll('.busca-c').forEach(x => { const cc = cosas[+x.dataset.j]; if (cc.si && !x.classList.contains('hallado')) x.classList.add('pista'); });
      }
    });
  };

  /* 3. Arrastra: cada cosa a su lugar (canecas u otros destinos). Tocar el destino también sirve. */
  ACT.arrastra = (p, ctx) => {
    const cosas = CH.mezclar(CH.nivel(p, 'cosas')).slice(0, p.max || 99);
    const destinos = CH.nivel(p, 'destinos') || ['blanca', 'negra', 'verde'];
    let k = 0;
    function una() {
      const c = cosas[k];
      ctx.actor(null, ctx.quien, 'curioso');   // la instrucción va en la voz y en la bandeja: un solo mensaje en pantalla
      ctx.hoja.innerHTML = `<div class="arr-fila"><span class="chip-act">${esc(p.etiqueta || 'Clasifica')} · ${k + 1} de ${cosas.length}</span></div>
        <div class="bandeja"><div class="obj-t grande" id="obj-arr" tabindex="-1" style="touch-action:none" aria-label="${esc(c.n)}">${CH.ilus('objeto', c.o)}</div>
          <div class="bandeja-txt"><span class="bandeja-et">${esc(p.etiqueta === 'Elige' ? 'Piensa en esto' : 'Clasifica esto')}</span><b>${esc(c.n)}</b><span class="t-nota">Arrástralo o toca dónde va</span></div></div>
        <h2 class="hoja-titulo destinos-titulo">${esc(T(p.pregunta || '¿A dónde va?'))}</h2>
        <div class="destinos n${destinos.length}" role="group" aria-label="Opciones">${destinos.map(d => typeof d === 'string' ? caneca(d) : `<button class="destino" data-destino="${d.id}">${d.o ? CH.ilus('objeto', d.o) : ''}<b>${esc(d.n)}</b>${d.sub ? `<span>${esc(d.sub)}</span>` : ''}</button>`).join('')}</div>
        <div data-acciones class="acciones"></div>`;
      if (k === 0) CH.hablar(p.pide); else CH.hablar(c.n);
      const elegir = d => {
        if (d.disabled) return;
        const id = d.dataset.destino;
        if (id === c.a) {
          ctx.acierto(d); d.classList.add('bien');
          ctx.hoja.querySelectorAll('[data-destino]').forEach(x => { x.disabled = true; });
          ctx.respuesta(true, CH.azar(CH.FRASES.bien), c.si);
          ctx.seguir(() => { k++; if (k < cosas.length) una(); else ctx.terminar(); }, { voz: c.si, texto: k < cosas.length - 1 ? 'Siguiente' : 'Terminar' });
        } else {
          d.classList.add('casi'); d.disabled = true;
          const n = ctx.fallo(); ctx.respuesta(false, CH.azar(CH.FRASES.casi), c.casi);
          CH.hablar(c.casi);
          if (n >= 2) { const ok = ctx.hoja.querySelector(`[data-destino="${c.a}"]`); if (ok) ok.classList.add('pista'); }
        }
      };
      CH.on('[data-destino]', 'click', ev => elegir(ev.currentTarget), ctx.hoja);
      arrastrable(ctx.hoja.querySelector('#obj-arr'), elegir);
    }
    una();
  };

  /* 4. Ordena: poner pasos en secuencia tocándolos en orden. */
  ACT.ordena = (p, ctx) => {
    const pasos = CH.nivel(p, 'pasos'), des = CH.mezclar(pasos);
    let n = 0;
    ctx.actor(null, ctx.quien, 'pensando');
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2>
      <ol class="secuencia">${pasos.map((_, j) => `<li data-hueco="${j}"><span class="num">${j + 1}</span><span class="txt">…</span></li>`).join('')}</ol>
      <div class="fichas">${des.map(x => `<button class="ficha" data-p="${pasos.indexOf(x)}">${x.o ? CH.ilus('objeto', x.o) : ''}<span>${esc(x.n)}</span></button>`).join('')}</div>
      <div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    CH.on('.ficha', 'click', ev => {
      const b = ev.currentTarget, j = +b.dataset.p;
      if (j === n) {
        const h = ctx.hoja.querySelector(`[data-hueco="${n}"]`);
        h.classList.add('lleno'); h.querySelector('.txt').textContent = pasos[j].n;
        b.remove(); ctx.acierto(h); ctx.limpiarRespuesta(); n++;
        if (pasos[j].si) CH.hablar(pasos[j].si);
        if (n === pasos.length) { ctx.respuesta(true, '¡En orden!', T(p.cierre)); ctx.seguir(ctx.terminar, { voz: p.cierre }); }
      } else {
        b.classList.add('casi'); setTimeout(() => b.classList.remove('casi'), 600);
        const f = ctx.fallo(); ctx.respuesta(false, CH.azar(CH.FRASES.casi), f >= 2 ? `Pista: el paso ${n + 1} es «${pasos[n].n}».` : '¿Qué pasa justo después? Piensa en el orden.');
        if (f >= 2) { const ok = ctx.hoja.querySelector(`.ficha[data-p="${n}"]`); if (ok) ok.classList.add('pista'); }
      }
    });
  };

  /* 5. ¿Verdad o mito?: desliza la tarjeta o toca un botón. */
  ACT.vm = (p, ctx) => {
    const cartas = CH.nivel(p, 'cartas');
    let k = 0;
    function una() {
      const c = cartas[k];
      ctx.lienzo.innerHTML = `<div class="vm-zona"><div class="vm-carta" tabindex="0" role="group" aria-label="Afirmación ${k + 1} de ${cartas.length}"><span class="vm-n">${k + 1} / ${cartas.length}</span><p>${esc(T(c))}</p></div><p class="vm-guia" aria-hidden="true"><span>← Mito</span><span>Verdad →</span></p></div>`;
      ctx.hoja.innerHTML = `<h2 class="hoja-titulo">¿Verdad o mito?</h2><div class="vm-botones"><button class="btn vm-mito" data-v="0">Mito</button><button class="btn vm-verdad" data-v="1">Verdad</button></div><div data-acciones class="acciones"></div>`;
      CH.hablar({ t: '¿Verdad o mito? ' + T(c) });
      const carta = ctx.lienzo.querySelector('.vm-carta');
      let x0 = null;
      carta.addEventListener('pointerdown', ev => { x0 = ev.clientX; carta.setPointerCapture(ev.pointerId); });
      carta.addEventListener('pointermove', ev => { if (x0 === null) return; const dx = ev.clientX - x0; carta.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; });
      carta.addEventListener('pointerup', ev => { if (x0 === null) return; const dx = ev.clientX - x0; x0 = null; carta.style.transform = ''; if (Math.abs(dx) > 90) responder(dx > 0); });
      carta.addEventListener('keydown', ev => { if (ev.key === 'ArrowRight') responder(true); if (ev.key === 'ArrowLeft') responder(false); });
      CH.on('[data-v]', 'click', ev => responder(ev.currentTarget.dataset.v === '1'), ctx.hoja);
      function responder(v) {
        if (carta.dataset.listo) return; carta.dataset.listo = '1';
        const ok = v === !!c.v;
        carta.classList.add(v ? 'sale-der' : 'sale-izq');
        ctx.hoja.querySelectorAll('[data-v]').forEach(b => { b.disabled = true; });
        if (ok) ctx.acierto(ctx.hoja.querySelector(`[data-v="${v ? 1 : 0}"]`)); else ctx.fallo();
        const tit = (ok ? CH.azar(CH.FRASES.bien) + ' ' : 'Mmm, no. ') + (c.v ? 'Es verdad.' : 'Es un mito.');
        ctx.respuesta(ok, tit, T(c.e));
        ctx.seguir(() => { k++; if (k < cartas.length) una(); else ctx.terminar(); }, { voz: { t: tit + ' ' + T(c.e) } });
      }
    }
    una();
  };

  /* 6. Une parejas: toca uno de cada columna. */
  ACT.une = (p, ctx) => {
    const pares = CH.nivel(p, 'pares');
    const der = CH.mezclar(pares.map((x, j) => ({ ...x.b, j })));
    let sel = null, hechos = 0;
    ctx.actor(null, ctx.quien, 'curioso');
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2>
      <div class="une"><div class="col" role="group" aria-label="Columna 1">${pares.map((x, j) => `<button class="une-i" data-a="${j}">${x.a.o ? CH.ilus('objeto', x.a.o) : ''}<span>${esc(x.a.n)}</span></button>`).join('')}</div>
      <div class="col" role="group" aria-label="Columna 2">${der.map(x => `<button class="une-i" data-b="${x.j}">${x.o ? CH.ilus('objeto', x.o) : ''}<span>${esc(x.n)}</span></button>`).join('')}</div></div>
      <div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    CH.on('[data-a]', 'click', ev => {
      const b = ev.currentTarget; if (b.classList.contains('unido')) return;
      ctx.hoja.querySelectorAll('[data-a]').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true'); sel = +b.dataset.a; CH.sonido('toque');
    }, ctx.hoja);
    CH.on('[data-b]', 'click', ev => {
      const b = ev.currentTarget; if (b.classList.contains('unido')) return;
      if (sel === null) { ctx.respuesta(false, 'Primero elige uno de la izquierda.', ''); return; }
      const a = ctx.hoja.querySelector(`[data-a="${sel}"]`);
      if (+b.dataset.b === sel) {
        hechos++; const color = ['#FFB627', '#1F7A5C', '#1F6FA8', '#D9667B', '#5B4BD6', '#E85D2A'][hechos % 6];
        [a, b].forEach(x => { x.classList.add('unido'); x.style.setProperty('--u', color); x.setAttribute('aria-pressed', 'false'); x.setAttribute('aria-label', x.textContent.trim() + ', unido'); });
        ctx.acierto(b); const e = pares[sel].e; ctx.respuesta(true, CH.azar(CH.FRASES.bien), T(e)); if (e) CH.hablar(e); sel = null;
        if (hechos === pares.length) ctx.seguir(ctx.terminar, { voz: p.cierre || null, texto: 'Seguir' });
      } else {
        b.classList.add('casi'); setTimeout(() => b.classList.remove('casi'), 600);
        const f = ctx.fallo(); ctx.respuesta(false, CH.azar(CH.FRASES.casi), f >= 2 ? `Pista: «${pares[sel].a.n}» va con «${pares[sel].b.n}».` : 'Esa pareja no va. Prueba otra.');
      }
    }, ctx.hoja);
  };

  /* 7. Estima: adivina con un deslizador y mira la respuesta. Estimar nunca es un error. */
  ACT.estima = (p, ctx) => {
    let v = p.inicio != null ? p.inicio : Math.round((p.min + p.max) / 2 / p.paso) * p.paso;
    const fmt = n => n.toLocaleString('es-CO');
    ctx.actor(null, ctx.quien, 'pensando');
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2>
      <div class="estima"><output class="estima-v" for="rango"><b data-v>${fmt(v)}</b> ${esc(p.unidad)}</output>
      <input id="rango" type="range" min="${p.min}" max="${p.max}" step="${p.paso}" value="${v}" aria-label="Tu cálculo en ${esc(p.unidad)}">
      <div class="estima-ext" aria-hidden="true"><span>${fmt(p.min)}</span><span>${fmt(p.max)}</span></div></div>
      <div data-acciones class="acciones"><button class="btn btn-primario" data-ok>Esa es mi respuesta</button></div>`;
    CH.hablar(p.pide);
    const r = ctx.hoja.querySelector('#rango');
    r.addEventListener('input', () => { v = +r.value; ctx.hoja.querySelector('[data-v]').textContent = fmt(v); });
    ctx.hoja.querySelector('[data-ok]').addEventListener('click', () => {
      const dist = Math.abs(v - p.r) / Math.max(1, p.max - p.min);
      const tit = dist <= (p.tol || 0.08) ? '¡Muy cerca!' : `Era ${fmt(p.r)} ${p.unidad}.`;
      CH.sonido(dist <= (p.tol || 0.08) ? 'bien' : 'toque');
      ctx.lienzo.innerHTML = `<div class="revela">${picto(p.picto)}</div>`;
      ctx.hoja.innerHTML = `<div data-acciones class="acciones"></div>`;
      ctx.respuesta(true, tit, T(p.revela), fuente(p.fuente));
      ctx.seguir(ctx.terminar, { voz: { t: tit + ' ' + T(p.revela) } });
    });
  };

  /* Dato: pregunta de tres opciones y el dato con su fuente. */
  ACT.dato = (p, ctx) => {
    ctx.actor(null, ctx.quien, 'curioso');
    ctx.hoja.innerHTML = `<p class="chip-act">Antes de ver el dato, ¿qué crees?</p><h2 class="hoja-titulo">${esc(T(p.pide))}</h2>
      <div class="opciones-col">${p.ops.map((o, j) => `<button class="opcion" data-i="${j}">${esc(o)}</button>`).join('')}</div><div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    CH.on('[data-i]', 'click', ev => {
      const ok = +ev.currentTarget.dataset.i === p.r;
      CH.sonido(ok ? 'bien' : 'toque');
      ctx.lienzo.innerHTML = `<div class="revela">${picto(p.picto)}</div>`;
      ctx.hoja.innerHTML = `<div data-acciones class="acciones"></div>`;
      const tit = ok ? '¡Le atinaste!' : 'Respuesta: ' + p.ops[p.r];
      ctx.respuesta(true, tit, T(p.revela), fuente(p.fuente));
      ctx.seguir(ctx.terminar, { voz: { t: tit + '. ' + T(p.revela) } });
    }, ctx.hoja);
  };

  /* 8. Antes y después: una cortina entre dos escenas. */
  const escenaRespaldo = s => `<div class="ad-respaldo" style="background:${s.cielo || '#FFF0D6'}">${(s.esc || []).map(e => `<span style="left:${e.x}%;top:${e.y}%;width:${e.s || 18}%">${CH.objeto(e.o)}</span>`).join('')}</div>`;
  const escenaAD = s => CH.hayImagen('escena', s.img) ? CH.ilus('escena', s.img, { cls: 'ad-img' }) : escenaRespaldo(s);
  ACT.ad = (p, ctx) => {
    ctx.lienzo.innerHTML = `<div class="ad" style="--pos:50%">
      <div class="ad-capa ad-antes">${escenaAD(p.antes)}<span class="ad-rot">${esc(p.antes.r || 'Antes')}</span></div>
      <div class="ad-capa ad-despues">${escenaAD(p.despues)}<span class="ad-rot">${esc(p.despues.r || 'Después')}</span></div>
      <div class="ad-manija" aria-hidden="true"><i></i></div></div>`;
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2><label class="ad-control"><span>Mueve la cortina</span><input type="range" min="0" max="100" value="50" data-cortina aria-label="Cortina entre antes y después"></label><div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    const ad = ctx.lienzo.querySelector('.ad'), rango = ctx.hoja.querySelector('[data-cortina]');
    let movido = false;
    const poner = pct => { ad.style.setProperty('--pos', pct + '%'); rango.value = pct; if (!movido && Math.abs(pct - 50) > 20) { movido = true; despues(); } };
    rango.addEventListener('input', () => poner(+rango.value));
    let arr = false;
    ad.addEventListener('pointerdown', ev => { arr = true; ad.setPointerCapture(ev.pointerId); mover(ev); });
    ad.addEventListener('pointermove', ev => { if (arr) mover(ev); });
    ad.addEventListener('pointerup', () => { arr = false; });
    function mover(ev) { const r = ad.getBoundingClientRect(); poner(Math.round(Math.max(0, Math.min(100, (ev.clientX - r.left) / r.width * 100)))); }
    function despues() {
      const q = p.pregunta;
      if (!q) { ctx.seguir(ctx.terminar, { voz: p.cierre || null, auto: false }); return; }
      const cont = document.createElement('div'); cont.className = 'opciones-col';
      cont.innerHTML = `<h2 class="hoja-titulo">${esc(T(q))}</h2>${q.ops.map((o, j) => `<button class="opcion" data-i="${j}">${esc(o)}</button>`).join('')}`;
      ctx.hoja.querySelector('[data-acciones]').before(cont);
      CH.hablar(q);
      CH.on('[data-i]', 'click', ev => {
        const b = ev.currentTarget;
        if (+b.dataset.i === q.r) { ctx.acierto(b); b.classList.add('bien'); cont.querySelectorAll('[data-i]').forEach(x => { x.disabled = true; }); ctx.respuesta(true, CH.azar(CH.FRASES.bien), T(q.e), fuente(q.fuente)); ctx.seguir(ctx.terminar, { voz: q.e }); }
        else { b.classList.add('casi'); b.disabled = true; ctx.fallo(); ctx.respuesta(false, CH.azar(CH.FRASES.casi), T(q.casi) || 'Mira otra vez las dos escenas.'); }
      }, cont);
    }
  };

  /* 9. Construye: poner piezas en sus ranuras (circuito, invento). */
  ACT.construye = (p, ctx) => {
    const ranuras = p.ranuras, piezas = CH.mezclar(p.piezas);
    let sel = null, llenas = 0;
    ctx.lienzo.innerHTML = `<div class="tablero ${p.modo || ''}"><div class="ranuras">${ranuras.map((r, j) => `<button class="ranura" data-destino="${j}" aria-label="${esc(r.n)}: vacío"><span class="ranura-n">${esc(r.n)}</span><span class="ranura-in"></span></button>`).join('<span class="cable" aria-hidden="true"></span>')}</div>${p.modo === 'circuito' ? '<div class="bombillo-fx" aria-hidden="true"></div>' : ''}</div>`;
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2><p class="t-nota">Toca una pieza y luego su lugar.</p><div class="fichas piezas">${piezas.map(x => `<button class="ficha pieza" data-pieza="${x.id}" style="touch-action:none">${CH.ilus('objeto', x.o)}<span>${esc(x.n)}</span></button>`).join('')}</div><div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    const poner = (pid, slot) => {
      const j = +slot.dataset.destino, r = ranuras[j], pz = p.piezas.find(x => x.id === pid);
      if (slot.classList.contains('lleno')) return;
      if (r.acepta === pid) {
        slot.classList.add('lleno'); slot.querySelector('.ranura-in').innerHTML = CH.ilus('objeto', pz.o); slot.setAttribute('aria-label', r.n + ': ' + pz.n);
        const b = ctx.hoja.querySelector(`[data-pieza="${pid}"]`); if (b) b.remove();
        ctx.acierto(slot); llenas++; sel = null; ctx.limpiarRespuesta();
        if (llenas === ranuras.length) {
          ctx.lienzo.querySelector('.tablero').classList.add('vivo'); CH.sonido('enciende');
          ctx.respuesta(true, T(p.listo) || '¡Funciona!', T(p.e)); ctx.seguir(ctx.terminar, { voz: { t: (T(p.listo) || '¡Funciona!') + ' ' + T(p.e) } });
        }
      } else {
        const f = ctx.fallo(); ctx.respuesta(false, CH.azar(CH.FRASES.casi), (pz && pz.casi) || (f >= 2 ? `Pista: aquí va «${p.piezas.find(x => x.id === r.acepta).n}».` : 'Esa pieza no va ahí.'));
        slot.classList.add('casi'); setTimeout(() => slot.classList.remove('casi'), 600);
      }
    };
    CH.on('.pieza', 'click', ev => { ctx.hoja.querySelectorAll('.pieza').forEach(x => x.setAttribute('aria-pressed', 'false')); ev.currentTarget.setAttribute('aria-pressed', 'true'); sel = ev.currentTarget.dataset.pieza; CH.sonido('toque'); }, ctx.hoja);
    CH.on('.ranura', 'click', ev => { if (!sel) { ctx.respuesta(false, 'Primero toca una pieza.', ''); return; } poner(sel, ev.currentTarget); }, ctx.lienzo);
    ctx.hoja.querySelectorAll('.pieza').forEach(b => arrastrable(b, slot => poner(b.dataset.pieza, slot)));
  };

  /* 10. Conversación: elige qué decirle al personaje. */
  ACT.charla = (p, ctx) => {
    const nodos = CH.nivel(p, 'nodos');
    let k = 0;
    function uno() {
      const nd = nodos[k];
      ctx.decir(nd.dice, nd.quien || ctx.quien, nd.exp || 'feliz');
      ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide || '¿Qué le dices?'))}</h2><div class="opciones-col">${nd.ops.map((o, j) => `<button class="opcion dialogo-op" data-i="${j}">${esc(T(o))}</button>`).join('')}</div><div data-acciones class="acciones"></div>`;
      CH.on('[data-i]', 'click', ev => {
        const b = ev.currentTarget, o = nd.ops[+b.dataset.i];
        if (o.ok) {
          ctx.acierto(b); b.classList.add('bien'); ctx.hoja.querySelectorAll('[data-i]').forEach(x => { x.disabled = true; });
          ctx.actor(o.r, nd.quien || ctx.quien, 'feliz');
          ctx.seguir(() => { k++; if (k < nodos.length) uno(); else ctx.terminar(); }, { voz: o.r });
        } else {
          b.classList.add('casi'); b.disabled = true; ctx.fallo();
          ctx.actor(o.r, nd.quien || ctx.quien, 'pensando'); CH.hablar(o.r);
        }
      }, ctx.hoja);
    }
    uno();
  };

  /* 11. Dibuja: lienzo libre o sobre plantilla. Se guarda solo en este aparato. */
  ACT.dibuja = (p, ctx) => {
    const colores = ['#2B211D', '#E85D2A', '#FFB627', '#1F7A5C', '#1F6FA8', '#D9667B', '#5B4BD6'];
    ctx.lienzo.innerHTML = `<div class="dibujo"><canvas width="720" height="720" aria-label="Lienzo de dibujo"></canvas>${p.plantilla ? `<div class="plantilla" aria-hidden="true">${CH.objeto(p.plantilla)}</div>` : ''}</div>`;
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2>
      <div class="herramientas" role="toolbar" aria-label="Herramientas de dibujo">${colores.map((c, j) => `<button class="color" style="--c:${c}" data-c="${c}" aria-label="Color ${j + 1}" aria-pressed="${j === 0}"></button>`).join('')}
      <button class="btn-redondo" data-grosor aria-label="Cambiar grosor" aria-pressed="false">${CH.I.lapiz}</button><button class="btn-redondo" data-deshacer aria-label="Deshacer">${CH.I.deshacer}</button></div>
      <div data-acciones class="acciones"><button class="btn btn-primario" data-guardar>Guardar en mi galería</button><button class="btn-texto" data-saltar>Prefiero dibujar en papel</button></div>`;
    CH.hablar(p.pide);
    const cv = ctx.lienzo.querySelector('canvas'), g = cv.getContext('2d');
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, cv.width, cv.height); g.lineCap = 'round'; g.lineJoin = 'round';
    let color = colores[0], grosor = 10, trazo = null; const trazos = [];
    const punto = ev => { const r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * cv.width / r.width, (ev.clientY - r.top) * cv.height / r.height]; };
    const redibujar = () => { g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, cv.width, cv.height); trazos.forEach(t => { g.strokeStyle = t.c; g.lineWidth = t.g; g.beginPath(); t.p.forEach(([x, y], j) => j ? g.lineTo(x, y) : g.moveTo(x, y)); if (t.p.length === 1) g.lineTo(t.p[0][0] + 0.1, t.p[0][1]); g.stroke(); }); };
    cv.addEventListener('pointerdown', ev => { cv.setPointerCapture(ev.pointerId); trazo = { c: color, g: grosor, p: [punto(ev)] }; trazos.push(trazo); redibujar(); });
    cv.addEventListener('pointermove', ev => { if (!trazo) return; trazo.p.push(punto(ev)); redibujar(); });
    cv.addEventListener('pointerup', () => { trazo = null; });
    CH.on('[data-c]', 'click', ev => { color = ev.currentTarget.dataset.c; ctx.hoja.querySelectorAll('[data-c]').forEach(b => b.setAttribute('aria-pressed', b === ev.currentTarget)); }, ctx.hoja);
    CH.on('[data-grosor]', 'click', ev => { grosor = grosor === 10 ? 24 : 10; ev.currentTarget.setAttribute('aria-pressed', grosor === 24); }, ctx.hoja);
    CH.on('[data-deshacer]', 'click', () => { trazos.pop(); redibujar(); }, ctx.hoja);
    CH.on('[data-saltar]', 'click', () => ctx.terminar(), ctx.hoja);
    CH.on('[data-guardar]', 'click', () => {
      if (trazos.length) {
        const peq = document.createElement('canvas'); peq.width = 360; peq.height = 360; peq.getContext('2d').drawImage(cv, 0, 0, 360, 360);
        CH.E.dibujos.push({ fecha: CH.hoy(), tema: T(p.pide), img: peq.toDataURL('image/jpeg', 0.72), ep: ctx.ep.id });
        while (CH.E.dibujos.length > 12) CH.E.dibujos.shift();
        CH.guardar(); CH.sonido('cromo');
      }
      ctx.terminar();
    }, ctx.hoja);
  };

  /* Elige: una decisión sin respuestas malas (se guarda). */
  ACT.elige = (p, ctx) => {
    ctx.actor(null, ctx.quien, 'curioso');
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2><div class="elige">${p.ops.map((o, j) => `<button class="opcion elige-op" data-i="${j}">${o.o ? CH.ilus('objeto', o.o) : ''}<span>${esc(T(o))}</span></button>`).join('')}</div><div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    CH.on('[data-i]', 'click', ev => {
      const o = p.ops[+ev.currentTarget.dataset.i];
      if (p.guarda) { CH.E[p.guarda] = { t: T(o), o: o.o || null, id: o.id || null }; CH.guardar(); }
      ctx.hoja.querySelectorAll('[data-i]').forEach(b => b.setAttribute('aria-pressed', b === ev.currentTarget));
      CH.sonido('toque');
      ctx.hoja.querySelectorAll('.btn-seguir').forEach(b => b.remove());
      ctx.seguir(ctx.terminar, { voz: o.r || null, auto: false });
      if (o.r) ctx.actor(o.r, ctx.quien, 'feliz');
    }, ctx.hoja);
  };

  /* Misión para hacer en casa con un adulto. */
  ACT.mision = (p, ctx) => {
    const t = T(CH.E.nivel === 'experto' && p.x ? { t: p.x } : { t: p.t });
    ctx.lienzo.innerHTML = `<div class="mision-c"><span class="chip-act">Misión en casa · con un adulto</span><p class="mision-t">${esc(t)}</p></div>`;
    ctx.hoja.innerHTML = `<p class="t-nota">La marcas como cumplida en «Casillero» cuando la hagan.</p><div data-acciones class="acciones"><button class="btn btn-primario" data-ok>¡Acepto la misión!</button></div>`;
    CH.hablar({ t: 'Tu misión en casa: ' + t });
    CH.on('[data-ok]', 'click', () => { if (!(ctx.ep.id in CH.E.misiones)) CH.E.misiones[ctx.ep.id] = false; CH.guardar(); CH.sonido('estrella'); ctx.terminar(); }, ctx.hoja);
  };

  /* Bitácora: anotar lo de hoy (solo en este aparato). */
  ACT.bitacora = (p, ctx) => {
    const hoy = CH.hoy();
    const reg = CH.E.bitacora.find(r => r.fecha === hoy) || { fecha: hoy, bolsas: 0, botellas: 0, luces: 0 };
    const campos = [['bolsas', 'Bolsas de basura que salieron hoy', 'bolsa'], ['botellas', 'Botellas o envases que se botaron', 'botella'], ['luces', 'Luces prendidas en cuartos vacíos', 'bombillo']];
    ctx.actor(p.pide, ctx.quien, 'feliz');
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2><div class="contadores">${campos.map(([k, n, o]) => `<div class="contador-f"><span class="ci">${CH.ilus('objeto', o)}</span><span class="cn">${n}</span><div class="paso-c"><button class="btn-redondo" data-menos="${k}" aria-label="Menos ${n}">−</button><output data-out="${k}" aria-live="polite">${reg[k]}</output><button class="btn-redondo" data-mas="${k}" aria-label="Más ${n}">+</button></div></div>`).join('')}</div>
      <div data-acciones class="acciones"><button class="btn btn-primario" data-ok>Guardar el día</button></div>`;
    CH.hablar(p.pide);
    const cambia = (k, d) => { reg[k] = Math.max(0, Math.min(30, reg[k] + d)); ctx.hoja.querySelector(`[data-out="${k}"]`).textContent = reg[k]; CH.sonido('toque'); };
    CH.on('[data-menos]', 'click', ev => cambia(ev.currentTarget.dataset.menos, -1), ctx.hoja);
    CH.on('[data-mas]', 'click', ev => cambia(ev.currentTarget.dataset.mas, 1), ctx.hoja);
    CH.on('[data-ok]', 'click', () => {
      CH.E.bitacora = CH.E.bitacora.filter(r => r.fecha !== hoy).concat([reg]).slice(-14); CH.guardar();
      ctx.respuesta(true, 'Día guardado', 'Anota un poco cada día. Con varios días, tu infografía se arma sola.');
      ctx.hoja.querySelector('[data-ok]').remove();
      ctx.seguir(ctx.terminar, { voz: { t: 'Día guardado. Anota un poco cada día en la bitácora.' } });
    }, ctx.hoja);
  };

  /* Infografía: se arma con la bitácora del niño. */
  CH.infografiaHTML = (color = '#5B4BD6', icono = 'bolsa') => {
    let datos = CH.E.bitacora.slice(-7), ejemplo = false;
    if (datos.length < 2) { ejemplo = true; datos = [{ fecha: 'Lun', bolsas: 2, botellas: 5, luces: 3 }, { fecha: 'Mar', bolsas: 1, botellas: 4, luces: 2 }, { fecha: 'Mié', bolsas: 2, botellas: 2, luces: 1 }]; }
    const campo = { bolsa: 'bolsas', botella: 'botellas', bombillo: 'luces' }[icono];
    const nombre = { bolsas: 'bolsas de basura', botellas: 'botellas botadas', luces: 'luces prendidas sin uso' }[campo];
    const filas = datos.map(r => `<div class="fila-b"><span class="eti">${esc(r.fecha.length > 5 ? r.fecha.slice(5).split('-').reverse().join('/') : r.fecha)}</span><span class="ics">${Array.from({ length: Math.min(r[campo], 12) }, () => `<span>${CH.objeto(icono)}</span>`).join('') || '<em>0</em>'}</span></div>`).join('');
    return `<figure class="infografia" style="--c:${color}"><figcaption><b>Mi casa en números</b><span>${esc(nombre)} por día</span></figcaption><div class="barras sin-borde">${filas}</div>${ejemplo ? '<p class="t-nota">Ejemplo: aún no hay días suficientes en tu bitácora.</p>' : '<p class="t-nota">Datos de mi bitácora, guardados solo en este aparato.</p>'}</figure>`;
  };
  ACT.infografia = (p, ctx) => {
    let color = '#5B4BD6', icono = 'bolsa';
    const pintar = () => { ctx.lienzo.innerHTML = `<div class="revela">${CH.infografiaHTML(color, icono)}</div>`; };
    pintar();
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2>
      <div class="herramientas" role="group" aria-label="Color">${['#5B4BD6', '#1F7A5C', '#E85D2A', '#1F6FA8'].map((c, j) => `<button class="color" style="--c:${c}" data-c="${c}" aria-label="Color ${j + 1}" aria-pressed="${j === 0}"></button>`).join('')}</div>
      <div class="herramientas" role="group" aria-label="Qué mostrar">${[['bolsa', 'Bolsas'], ['botella', 'Botellas'], ['bombillo', 'Luces']].map(([o, n], j) => `<button class="chip" data-o="${o}" aria-pressed="${j === 0}">${n}</button>`).join('')}</div>
      <div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    CH.on('[data-c]', 'click', ev => { color = ev.currentTarget.dataset.c; ctx.hoja.querySelectorAll('[data-c]').forEach(b => b.setAttribute('aria-pressed', b === ev.currentTarget)); pintar(); }, ctx.hoja);
    CH.on('[data-o]', 'click', ev => { icono = ev.currentTarget.dataset.o; ctx.hoja.querySelectorAll('[data-o]').forEach(b => b.setAttribute('aria-pressed', b === ev.currentTarget)); pintar(); }, ctx.hoja);
    ctx.seguir(() => { CH.E.infografia = { color, icono }; CH.guardar(); ctx.terminar(); }, { texto: 'Esta es mi infografía', auto: false });
  };

  /* Minijuego dentro del episodio. */
  ACT.juego = (p, ctx) => {
    const J = CH.JUEGOS && CH.JUEGOS[p.juego];
    if (J) { J.jugar({ nivel: p.nivel || 1, dentro: ctx }); return; }
    ctx.actor({ t: 'Aquí va el minijuego. ¡Lo estamos terminando!' }, 'cocuyo', 'pensando');
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">Minijuego en construcción</h2><div data-acciones class="acciones"></div>`;
    ctx.seguir(ctx.terminar, { auto: false });
  };

  /* Cartel del invento (Plaza). */
  ACT.cartel = (p, ctx) => {
    ctx.lienzo.innerHTML = `<div class="revela">${CH.cartelHTML()}</div>`;
    ctx.hoja.innerHTML = `<h2 class="hoja-titulo">${esc(T(p.pide))}</h2><div data-acciones class="acciones"></div>`;
    CH.hablar(p.pide);
    ctx.seguir(ctx.terminar, { texto: '¡A la feria!', auto: false });
  };

  ACT.desconocido = (p, ctx) => { ctx.hoja.innerHTML = '<div data-acciones class="acciones"></div>'; ctx.seguir(ctx.terminar); };
})();
