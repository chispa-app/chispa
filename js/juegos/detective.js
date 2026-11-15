/* Minijuego 7 · Detective de datos (Colegio).
   Preguntas sobre gráficas: contar en un pictograma, leer la leyenda, comparar, encontrar la gráfica tramposa,
   descubrir qué le falta a una gráfica y armar una gráfica con una tabla. Todos los datos son ejemplos
   inventados y así lo dice cada gráfica. Sin tiempo: se piensa con calma. */
'use strict';
(() => {
  const CH = window.CH, esc = CH.esc;
  const R = () => Math.random();
  const ent = (a, b) => a + Math.floor(R() * (b - a + 1));
  const TEMAS = [
    { t: 'Botellas recogidas por salón', o: 'botella', cosa: 'botellas', et: ['3A', '3B', '4A', '4B', '5A'], quien: 'el salón' },
    { t: 'Bolsas separadas por día', o: 'bolsaBlanca', cosa: 'bolsas', et: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], quien: 'el día' },
    { t: 'Árboles sembrados por cuadra', o: 'arbol', cosa: 'árboles', et: ['Cuadra 1', 'Cuadra 2', 'Cuadra 3', 'Cuadra 4'], quien: 'la' },
    { t: 'Latas recogidas por grupo', o: 'lata', cosa: 'latas', et: ['Grupo A', 'Grupo B', 'Grupo C', 'Grupo D'], quien: 'el' }
  ];
  const tema = () => TEMAS[ent(0, TEMAS.length - 1)];
  const datos = (T, n, unidad, maxIcos, medio = false) => {
    const et = CH.mezclarCon(T.et, R).slice(0, n);
    const usados = new Set();
    return et.map(e => { let v; do { v = ent(1, maxIcos) * unidad + (medio && R() < 0.4 ? unidad / 2 : 0); } while (usados.has(v)); usados.add(v); return { et: e, v }; });
  };
  const opcionesNum = (r, paso) => {
    const s = new Set([r]); const d = [paso, -paso, 2 * paso, -2 * paso, paso * 3];
    for (const x of CH.mezclarCon(d, R)) { if (s.size >= 3) break; if (r + x > 0) s.add(r + x); }
    return CH.mezclarCon([...s], R).map(String);
  };

  /* ---------- Dibujos ---------- */
  function picto(T, D, unidad, falta = '') {
    const filas = D.map(d => {
      const n = d.v / unidad, llenos = Math.floor(n), resto = n - llenos;
      let ics = ''; for (let i = 0; i < llenos; i++) ics += `<span>${CH.objeto(T.o)}</span>`;
      if (resto > 0.05) ics += `<span style="clip-path:inset(0 ${Math.round((1 - resto) * 100)}% 0 0)">${CH.objeto(T.o)}</span>`;
      return `<div class="dt-fila"><span class="dt-et">${esc(d.et)}</span><span class="dt-ics">${ics}</span></div>`;
    }).join('');
    return `<figure class="dt-graf">${falta === 'titulo' ? '' : `<figcaption class="dt-tit">${esc(T.t)}</figcaption>`}<div class="dt-filas">${filas}</div>
      <p class="dt-ley"><span class="dt-ley-ico">${CH.objeto(T.o)}</span> = ${unidad} ${falta === 'unidades' ? '' : esc(T.cosa)}</p>${falta === 'fuente' ? '' : '<p class="dt-fuente">Fuente: datos de ejemplo, inventados para practicar</p>'}</figure>`;
  }
  // Gráfica de barras pequeña (dos barras), con números grandes y el inicio del eje resaltado.
  function barras(D, desde) {
    const max = Math.max(...D.map(d => d.v)), w = 170, h = 196, x0 = 40, y0 = 160, alto = 118;
    const ancho = (w - x0 - 6) / D.length;
    const y = v => y0 - Math.max(4, ((v - desde) / (max - desde)) * alto);
    return `<svg class="dt-barras" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="M${x0} 18V${y0}H${w - 4}" fill="none" stroke="#2B211D" stroke-width="2.5"/>
      <rect x="2" y="${y0 - 13}" width="${x0 - 8}" height="26" rx="8" fill="#FFF0D6" stroke="#2B211D" stroke-width="1.5"/><text x="${(x0 - 6) / 2 + 1}" y="${y0 + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="#2B211D">${desde}</text>
      ${D.map((d, i) => { const cx = x0 + ancho * i + ancho / 2, yy = y(d.v); return `<rect x="${cx - ancho * 0.3}" y="${yy}" width="${ancho * 0.6}" height="${y0 - yy}" rx="4" fill="${['#5B4BD6', '#E85D2A'][i % 2]}"/><text x="${cx}" y="${yy - 6}" text-anchor="middle" font-size="17" font-weight="700" fill="#2B211D">${d.v}</text><text x="${cx}" y="${y0 + 22}" text-anchor="middle" font-size="14" fill="#2B211D">${esc(d.et)}</text>`; }).join('')}</svg>`;
  }

  /* ---------- Preguntas ---------- */
  // Cada una devuelve { graf, pide, ops, r, bien, casi } o { construir: true, ... }.
  const Q = {
    contar(n = 3, unidad = 1, maxI = 6) {
      const T = tema(), D = datos(T, n, unidad, maxI), d = D[ent(0, n - 1)];
      return { graf: picto(T, D, unidad), pide: `¿Cuántos ${T.cosa} hay en ${d.et}?`.replace('¿Cuántos bolsas', '¿Cuántas bolsas').replace('¿Cuántos botellas', '¿Cuántas botellas').replace('¿Cuántos latas', '¿Cuántas latas'),
        ops: opcionesNum(d.v, unidad), r: String(d.v), bien: `Son ${d.v}${unidad > 1 ? `: ${d.v / unidad} dibujitos de ${unidad}` : ''}.`, casi: unidad > 1 ? `Mira la leyenda: cada dibujito vale ${unidad}.` : 'Cuenta los dibujitos de esa fila, uno por uno.' };
    },
    leyenda(unidad, medio = false) { const q = Q.contar(3, unidad, 5); if (!medio) return q; const T = tema(), D = datos(T, 3, unidad, 4, true); if (!D.some(x => x.v % unidad)) D[0].v += unidad / 2; const d = D.find(x => x.v % unidad); return { graf: picto(T, D, unidad), pide: `¿Cuántos ${T.cosa} hay en ${d.et}? Ojo con el medio dibujito.`.replace(/¿Cuántos (bolsas|botellas|latas)/, '¿Cuántas $1'), ops: opcionesNum(d.v, unidad / 2), r: String(d.v), bien: `Son ${d.v}: medio dibujito vale ${unidad / 2}.`, casi: `Cada dibujito entero vale ${unidad}; la mitad vale ${unidad / 2}.` }; },
    mas(n = 3, unidad = 1) {
      const T = tema(), D = datos(T, n, unidad, 7), mayor = D.reduce((a, b) => b.v > a.v ? b : a), menor = R() < 0.5;
      const obj = menor ? D.reduce((a, b) => b.v < a.v ? b : a) : mayor;
      return { graf: picto(T, D, unidad), pide: `¿Cuál tiene ${menor ? 'menos' : 'más'} ${T.cosa}?`, ops: CH.mezclarCon(D.map(d => d.et), R), r: obj.et, bien: `${obj.et}: su fila es la ${menor ? 'más corta' : 'más larga'}.`, casi: `Compara el largo de las filas.` };
    },
    diferencia(unidad = 1) {
      const T = tema(), D = datos(T, 3, unidad, 6), [a, b] = CH.mezclarCon(D, R).slice(0, 2).sort((x, y) => y.v - x.v);
      const r = a.v - b.v;
      return { graf: picto(T, D, unidad), pide: `¿Cuántos ${T.cosa} más tiene ${a.et} que ${b.et}?`.replace(/¿Cuántos (bolsas|botellas|latas) más/, '¿Cuántas $1 más'), ops: opcionesNum(r, unidad), r: String(r), bien: `${a.v} − ${b.v} = ${r}.`, casi: `Primero cuenta cada fila; luego resta la más pequeña a la más grande.` };
    },
    total(unidad = 1) {
      const T = tema(), D = datos(T, 3, unidad, 4), r = D.reduce((x, d) => x + d.v, 0);
      return { graf: picto(T, D, unidad), pide: `¿Cuántos ${T.cosa} hay entre todos?`.replace(/¿Cuántos (bolsas|botellas|latas)/, '¿Cuántas $1'), ops: opcionesNum(r, unidad), r: String(r), bien: `${D.map(d => d.v).join(' + ')} = ${r}.`, casi: 'Cuenta cada fila y súmalas todas.' };
    },
    trampa() {
      const T = tema(), base = ent(40, 60), D = [{ et: T.et[0], v: base }, { et: T.et[1], v: base + ent(2, 5) }];
      const corte = Math.floor(base * 0.9), honestaA = R() < 0.5;
      const g = (cero, l) => `<div class="dt-op-graf"><b>${l}</b>${barras(D, cero ? 0 : corte)}</div>`;
      return { graf: `<figure class="dt-graf dt-dos"><figcaption class="dt-tit">${esc(T.t)} (ejemplo)</figcaption><div class="dt-par">${g(honestaA, 'A')}${g(!honestaA, 'B')}</div></figure>`,
        pide: '¿Cuál gráfica dice la verdad?', ops: ['Gráfica A', 'Gráfica B'], r: honestaA ? 'Gráfica A' : 'Gráfica B',
        bien: `La honesta empieza en cero: ${D[0].v} y ${D[1].v} son casi iguales.`, casi: 'Mira el número de abajo del eje: la tramposa no empieza en cero.' };
    },
    falta(cual) {
      cual = cual || CH.azar(['fuente', 'titulo', 'unidades']);
      const T = tema(), D = datos(T, 3, 2, 5);
      const ops = ['La fuente: de dónde salen los datos', 'El título: qué muestra', 'Qué se cuenta: botellas, bolsas…'];
      const r = { fuente: ops[0], titulo: ops[1], unidades: ops[2] }[cual];
      return { graf: picto(T, D, 2, cual), pide: '¿Qué le falta a esta gráfica?', ops: CH.mezclarCon(ops, R), r,
        bien: { fuente: 'Sin fuente no sabemos si creerle.', titulo: 'Sin título no sabemos qué estamos mirando.', unidades: 'La leyenda dice «= 2», pero ¿2 qué?' }[cual],
        casi: 'Revisa: ¿tiene título?, ¿dice qué cuenta?, ¿dice de dónde salieron los datos?' };
    },
    construir(n = 3) {
      const T = tema(), D = datos(T, n, 1, 6);
      return { construir: true, T, D };
    }
  };
  const PLAN = [
    () => [Q.contar(), Q.contar(), Q.mas(), Q.contar()],
    () => [Q.mas(), Q.contar(4), Q.diferencia(), Q.mas(4)],
    () => [Q.leyenda(2), Q.leyenda(2), Q.mas(3, 2), Q.leyenda(2, true)],
    () => [Q.leyenda(5), Q.diferencia(5), Q.total(2), Q.leyenda(5)],
    () => [Q.trampa(), Q.falta('fuente'), Q.trampa(), Q.falta('titulo')],
    () => [Q.construir(3), Q.leyenda(10), Q.construir(4), Q.falta('unidades')],
    () => [Q.diferencia(10), Q.trampa(), Q.total(5), Q.falta()],
    () => [Q.construir(4), Q.trampa(), Q.leyenda(10, true), Q.diferencia(5), Q.falta()]
  ];
  const INTRO = [
    ['¡Hola, detective! Soy la seño Inés.', 'Cada dibujito es una cosa. Cuenta con calma.'],
    ['Ahora a comparar.', '¿Quién tiene más? ¿Cuántos más?'],
    ['¡Ojo con la leyenda!', 'Aquí cada dibujito vale 2.'],
    ['Leyendas más grandes.', 'Cada dibujito puede valer 5. Multiplica o cuenta de 5 en 5.'],
    ['Gráficas tramposas.', 'Busca la que engaña y lo que le falta a una gráfica para creerle.'],
    ['¡Hoy tú haces la gráfica!', 'Usa los botones + y − hasta que cada barra diga lo mismo que la tabla.'],
    ['Detective experto.', 'De todo un poco: lee, compara y desconfía de las trampas.'],
    ['¡El caso final!', 'Cinco pistas. Usa todo lo que aprendiste.']
  ];

  CH.registrarJuego({
    id: 'detective', quien: 'seno-ines',
    como: { t: 'Lee pictogramas y gráficas, encuentra la gráfica tramposa, descubre qué le falta a una gráfica y arma la tuya. Todos los datos son ejemplos para practicar.' },
    consejo: 'Para tres chispas: lee la leyenda y el eje antes de responder.',
    crear(api) {
      const preguntas = PLAN[api.n - 1]();
      if (api.experto && api.n < 8) preguntas.push(api.n < 5 ? Q.diferencia(api.n > 2 ? 2 : 1) : Q.trampa());
      let k = 0;
      function una() {
        const q = preguntas[k];
        api.cuenta(`Pista ${k + 1} de ${preguntas.length}`);
        if (q.construir) return construir(q);
        api.tablero.innerHTML = `<div class="dt">${q.graf}</div>`;
        api.ctrl.innerHTML = `<div class="dt-ops ${q.ops.length === 2 ? 'dos' : q.ops.every(o => o.length < 9) ? 'tres' : ''}" role="group" aria-label="Respuestas">${q.ops.map((o, i) => `<button class="opcion dt-op" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
        api.decir(k === 0 ? INTRO[api.n - 1][0] : `Pista ${k + 1}.`, (k === 0 ? INTRO[api.n - 1][1] + ' ' : '') + q.pide);
        api.ctrl.querySelectorAll('.dt-op').forEach(b => b.addEventListener('click', () => {
          if (api.terminado || b.disabled) return;
          if (q.ops[+b.dataset.i] === q.r) {
            b.classList.add('bien'); api.acierto(b);
            api.ctrl.querySelectorAll('.dt-op').forEach(x => { x.disabled = true; });
            api.decir(CH.azar(CH.FRASES.bien), q.bien, 'bien');
            siguienteBoton();
          } else {
            b.classList.add('casi'); b.disabled = true; api.fallo();
            api.decir(CH.azar(CH.FRASES.casi), q.casi, 'casi');
            if (api.seguidos >= 2) { const ok = [...api.ctrl.querySelectorAll('.dt-op')].find(x => q.ops[+x.dataset.i] === q.r); if (ok) ok.classList.add('pista'); }
          }
        }));
      }
      function siguienteBoton() {
        const b = document.createElement('button'); b.className = 'btn btn-primario btn-seguir'; b.textContent = k < preguntas.length - 1 ? 'Siguiente pista' : 'Cerrar el caso';
        b.addEventListener('click', () => { k++; if (k < preguntas.length) una(); else api.ganar(api.porErrores(1, 3), `Resolviste ${preguntas.length} pistas${api.errores ? ` con ${api.errores} intento${api.errores > 1 ? 's' : ''} de más` : ' sin un solo error'}. Un buen detective lee el título, la leyenda, el eje y la fuente.`); });
        api.ctrl.appendChild(b); b.focus({ preventScroll: true });
      }
      function construir(q) {
        const { T, D } = q, max = 8, val = D.map(() => 0);
        api.tablero.innerHTML = `<div class="dt"><figure class="dt-graf dt-arma"><figcaption class="dt-tit">${esc(T.t)}</figcaption>
          <table class="dt-tabla"><caption class="solo-lector">Tabla de datos</caption><tbody>${D.map(d => `<tr><th scope="row">${esc(d.et)}</th><td>${d.v} ${esc(T.cosa)}</td></tr>`).join('')}</tbody></table>
          <div class="dt-cols" style="--n:${D.length}">${D.map((d, i) => `<div class="dt-col"><b class="dt-num" data-v="${i}">0</b><div class="dt-pista"><span class="dt-barra" data-b="${i}" style="height:0%"></span></div><span class="dt-et">${esc(d.et)}</span>
            <div class="dt-mm"><button class="btn-redondo suave" data-menos="${i}" aria-label="Bajar ${esc(d.et)}">−</button><button class="btn-redondo suave" data-mas="${i}" aria-label="Subir ${esc(d.et)}">+</button></div></div>`).join('')}</div>
          <p class="dt-fuente">Fuente: datos de ejemplo, inventados para practicar</p></figure></div>`;
        api.ctrl.innerHTML = `<button class="btn btn-primario" data-revisar>Revisar mi gráfica</button>`;
        api.decir(k === 0 ? INTRO[api.n - 1][0] : `Pista ${k + 1}: arma la gráfica.`, 'Sube cada barra hasta el número de la tabla.');
        const poner = (i, d) => {
          val[i] = Math.max(0, Math.min(max, val[i] + d));
          api.tablero.querySelector(`[data-b="${i}"]`).style.height = (val[i] / max * 100) + '%';
          api.tablero.querySelector(`[data-v="${i}"]`).textContent = val[i];
          CH.sonido('toque'); CH.anunciar(`${D[i].et}: ${val[i]}`);
          api.tablero.querySelectorAll('.dt-col').forEach(c => c.classList.remove('mal'));
        };
        api.tablero.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => poner(+b.dataset.mas, 1)));
        api.tablero.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => poner(+b.dataset.menos, -1)));
        api.ctrl.querySelector('[data-revisar]').addEventListener('click', ev => {
          if (api.terminado) return;
          const malas = D.map((d, i) => val[i] !== d.v ? i : -1).filter(i => i >= 0);
          if (!malas.length) {
            api.acierto(ev.currentTarget, 12); ev.currentTarget.remove();
            api.tablero.querySelectorAll('.dt-mm button').forEach(b => { b.disabled = true; });
            api.decir('¡Gráfica perfecta!', 'Cada barra dice lo mismo que la tabla, y tiene título y fuente.', 'bien');
            siguienteBoton();
          } else {
            api.fallo();
            malas.forEach(i => api.tablero.querySelectorAll('.dt-col')[i].classList.add('mal'));
            api.decir('Casi.', `Revisa ${malas.map(i => D[i].et).join(' y ')}: no coincide con la tabla.`, 'casi');
          }
        });
      }
      una();
    }
  });
})();
