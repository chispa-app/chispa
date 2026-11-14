/* chispa 2.0 · rutas del Arroyo y la Ciénaga.
   Regla de toda la ruta del Arroyo: con lluvia, lejos del arroyo y de la calle. Ninguna misión lleva al niño cerca del agua. */
'use strict';

CH.RUTAS.arroyo = [
  {
    id: 'arroyo-1', titulo: 'Cuando llueve fuerte',
    cromo: { t: 'Lina y su medidor', p: 'lina', dato: 'Con lluvia: lejos del arroyo y de la calle.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'lina', lineas: [
        { t: '¡Hola! Soy Lina. Mido cuánta lluvia cae en mi barrio con este medidor.' },
        { t: 'Cuando llueve fuerte en Barranquilla, el agua corre por las calles y se forman arroyos.' },
        { t: 'Los arroyos arrastran todo lo que encuentran. Son muy peligrosos.', exp: 'pensando' },
        { t: 'Mi regla de oro: con lluvia, lejos del arroyo y de la calle.' }
      ] },
      { tipo: 'vm', cartas: [
        { t: 'Si el arroyo se ve bajito, se puede cruzar.', v: false, e: 'Nunca. Aunque se vea bajito, la fuerza del agua puede tumbar a una persona.' },
        { t: 'Cuando llueve fuerte, lo más seguro es quedarse en un lugar alto y techado.', v: true, e: 'Así es. Se espera hasta que pase el agua.' },
        { t: 'Un arroyo puede arrastrar hasta un carro.', v: true, e: 'Por eso nadie debe acercarse, ni a pie ni en carro.' }
      ] },
      { tipo: 'construye', pide: { t: 'Arma el medidor de lluvia de Lina.' }, modo: 'medidor',
        ranuras: [{ n: 'Recipiente', acepta: 'botella' }, { n: 'Escala', acepta: 'regla' }, { n: 'Lugar', acepta: 'patio' }],
        piezas: [
          { id: 'botella', o: 'botella', n: 'Botella cortada' },
          { id: 'regla', o: 'regla', n: 'Regla pegada' },
          { id: 'patio', o: 'patio', n: 'Patio o ventana, a cielo abierto' },
          { id: 'arroyo', o: 'sumidero', n: 'Junto al arroyo', casi: '¡No! El medidor va en casa, nunca cerca del arroyo.' }
        ],
        listo: { t: '¡Medidor listo!' }, e: { t: 'Después de llover, mira hasta dónde llegó el agua. Siempre desde la casa.' } }
    ]
  },
  {
    id: 'arroyo-2', titulo: 'La bolsa que tapa',
    cromo: { t: 'El sumidero', o: 'sumidero', dato: 'Barranquilla ha canalizado unos 70 kilómetros de arroyos desde 2008.', f: 'arroyos70' },
    pasos: [
      { tipo: 'ad', pide: { t: 'Mueve la cortina: un sumidero tapado y uno limpio.' },
        antes: { r: 'Tapado', img: 'ad-sumidero-antes', cielo: '#D9E6EF', esc: [{ o: 'sumidero', x: 34, y: 40, s: 32 }, { o: 'bolsa', x: 36, y: 30, s: 22 }, { o: 'botella', x: 60, y: 46, s: 16 }, { o: 'icopor', x: 14, y: 52, s: 16 }, { o: 'gota', x: 70, y: 18, s: 12 }] },
        despues: { r: 'Limpio', img: 'ad-sumidero-despues', cielo: '#E6F1F7', esc: [{ o: 'sumidero', x: 34, y: 40, s: 32 }, { o: 'gota', x: 44, y: 22, s: 12 }, { o: 'gota', x: 56, y: 28, s: 10 }] },
        pregunta: { t: '¿Qué pasa cuando el sumidero está tapado?', ops: ['El agua se queda en la calle y el arroyo crece', 'El agua desaparece', 'No pasa nada'], r: 0, e: 'El agua no tiene por dónde irse. Una sola bolsa puede tapar la rejilla.' } },
      { tipo: 'busca', pide: { t: 'Toca lo que el agua arrastraría al arroyo si queda en la calle.' },
        cosas: [
          { o: 'bolsa', n: 'Bolsa plástica', x: 14, y: 24, si: 1, e: 'Las bolsas tapan los sumideros.' },
          { o: 'botella', n: 'Botella', x: 70, y: 18, si: 1, e: 'Flota y viaja lejos.' },
          { o: 'icopor', n: 'Icopor', x: 42, y: 50, si: 1, e: 'Se rompe en pedacitos.' },
          { o: 'pitillo', n: 'Pitillo', x: 80, y: 62, si: 1, e: 'Pequeño, pero llega al mar.' },
          { o: 'hoja', n: 'Hoja de árbol', x: 26, y: 70, si: 0, e: 'Las hojas son de la naturaleza.' },
          { o: 'semilla', n: 'Semilla', x: 56, y: 80, si: 0, e: 'Es parte de la naturaleza.' }
        ],
        cierre: { t: 'Si la basura no queda en la calle, el arroyo no la arrastra.' } },
      { tipo: 'estima', pide: { t: '¿Cuántos kilómetros de arroyos crees que ha canalizado Barranquilla desde 2008?' },
        min: 0, max: 150, paso: 5, inicio: 20, unidad: 'kilómetros', r: 70, tol: 0.08,
        revela: { t: 'Unos 70 kilómetros. Aun así, la basura en la calle sigue tapando el camino del agua.' }, fuente: 'arroyos70' }
    ]
  },
  {
    id: 'arroyo-3', titulo: 'La trampa del arroyo',
    cromo: { t: 'La trampa', o: 'trampa', dato: 'La trampa del arroyo León sacó cerca de 4.000 toneladas de basura.', f: 'trampa' },
    pasos: [
      { tipo: 'escena', quien: 'lina', lineas: [
        { t: 'El arroyo León lleva la basura hasta la ciénaga de Mallorquín, donde viven manglares y aves.' },
        { t: 'Por eso la ciudad puso una trampa: una reja que atrapa la basura antes de que llegue.', o: 'trampa' },
        { t: 'Ahora te toca a ti cuidar la trampa.', exp: 'feliz' }
      ] },
      { tipo: 'juego', juego: 'arroyo', nivel: 1 },
      { tipo: 'dato', pide: { t: '¿Cuánta basura había sacado la trampa del arroyo León hasta 2024?' }, ops: ['40 toneladas', '400 toneladas', '4.000 toneladas'], r: 2,
        revela: { t: 'Cerca de 4.000 toneladas. Todo eso no llegó a la ciénaga.' },
        picto: { o: 'bolsa', total: 8, on: 8, ley: 'Cada bolsa son 500 toneladas' }, fuente: 'trampa' }
    ]
  },
  {
    id: 'arroyo-4', titulo: 'El agua llega a la ciénaga', dorado: true,
    cromo: { t: 'Agua que vuelve a vivir', o: 'medusa', dato: 'Con el agua más limpia, en Mallorquín volvieron medusas y mantarrayas.', f: 'medusas' },
    pasos: [
      { tipo: 'escena', quien: 'lina', lineas: [
        { t: 'Cuando el agua llega más limpia a la ciénaga, la vida vuelve.' },
        { t: 'En Mallorquín se volvieron a ver medusas y mantarrayas.', o: 'medusa', exp: 'sorprendido' },
        { t: 'Cada bolsa que no llega a la calle ayuda a que pase.' }
      ] },
      { tipo: 'vm', cartas: [
        { t: 'Lo que botamos en la calle puede terminar en la ciénaga.', v: true, e: 'El agua de lluvia lo arrastra por los arroyos.' },
        { t: 'Con lluvia es buen momento para ir a ver el arroyo de cerca.', v: false, e: '¡Nunca! Con lluvia, lejos del arroyo y de la calle.' }
      ] },
      { tipo: 'mision', t: 'Con un adulto, pongan un medidor de lluvia en la ventana o el patio y anoten cuánto llovió. Siempre desde la casa.', x: 'Pongan el medidor con un adulto y anoten la lluvia de una semana. Comparen el día que más llovió con el que menos.' }
    ]
  }
];

CH.RUTAS.cienaga = [
  {
    id: 'cienaga-1', titulo: 'Un bosque con los pies en el agua',
    cromo: { t: 'El manglar', o: 'mangle', dato: 'Colombia tiene unas 290.700 hectáreas de manglar.', f: 'manglar' },
    pasos: [
      { tipo: 'escena', quien: 'tomas', lineas: [
        { t: 'Buenas. Soy Tomás, pescador. Esta es mi ciénaga.' },
        { t: 'Esos árboles con raíces como patas son mangles. Viven con los pies en el agua.', o: 'mangle' },
        { t: 'Entre sus raíces nacen peces, cangrejos y muchas aves. Búscalos.', exp: 'feliz' }
      ] },
      { tipo: 'busca', pide: { t: 'Toca los 4 animales que viven en el manglar.' },
        cosas: [
          { o: 'garza', n: 'Garza', x: 20, y: 18, si: 1, e: 'Pesca en la orilla.' },
          { o: 'cangrejo', n: 'Cangrejo', x: 70, y: 62, si: 1, e: 'Vive en el barro, entre las raíces.' },
          { o: 'pez', n: 'Pez', x: 44, y: 46, si: 1, e: 'Las raíces son su guardería.' },
          { o: 'ostra', n: 'Ostra', x: 84, y: 30, si: 1, e: 'Se pega a las raíces.' },
          { o: 'botella', n: 'Botella', x: 30, y: 72, si: 0, e: 'Esa no es un animal. Esa la trajo el arroyo.' },
          { o: 'bolsa', n: 'Bolsa', x: 58, y: 20, si: 0, e: 'Basura que llegó con el agua.' }
        ],
        cierre: { t: 'El manglar es la casa de muchísimos animales.' } },
      { tipo: 'estima', pide: { t: '¿Cuántas hectáreas de manglar crees que tiene Colombia? Una hectárea es como una cancha de fútbol.' },
        min: 0, max: 500000, paso: 10000, inicio: 50000, unidad: 'hectáreas', r: 290000, tol: 0.1,
        revela: { t: 'Unas 290.700 hectáreas. ¡Como 290.000 canchas de fútbol!' }, fuente: 'manglar' }
    ]
  },
  {
    id: 'cienaga-2', titulo: 'Raíces que protegen',
    cromo: { t: 'Raíces que protegen', o: 'raices', dato: 'En el huracán Iota, las casas detrás del manglar sufrieron menos daño.', f: 'manglar' },
    pasos: [
      { tipo: 'ad', pide: { t: 'Mueve la cortina: una costa sin manglar y una con manglar.' },
        antes: { r: 'Sin manglar', img: 'ad-costa-antes', cielo: '#D7E9EC', esc: [{ o: 'ola', x: 6, y: 46, s: 34 }, { o: 'ola', x: 30, y: 52, s: 30 }, { o: 'casa', x: 64, y: 24, s: 28 }] },
        despues: { r: 'Con manglar', img: 'ad-costa-despues', cielo: '#DDEFE3', esc: [{ o: 'ola', x: 4, y: 56, s: 20 }, { o: 'mangle', x: 28, y: 22, s: 30 }, { o: 'mangle', x: 44, y: 30, s: 24 }, { o: 'casa', x: 70, y: 26, s: 24 }] },
        pregunta: { t: '¿Qué hicieron los manglares cuando pasó el huracán Iota?', ops: ['Las casas detrás del manglar sufrieron menos daño', 'El manglar atrajo el huracán', 'No hicieron nada'], r: 0, e: 'Las raíces frenan el agua y protegen la costa.', fuente: 'manglar' } },
      { tipo: 'une', pide: { t: 'Une cada animal con su lugar en el manglar.' },
        pares: [
          { a: { o: 'cangrejo', n: 'Cangrejo' }, b: { o: 'barro', n: 'El barro entre raíces' }, e: 'Hace cuevas en el barro.' },
          { a: { o: 'garza', n: 'Garza' }, b: { o: 'ola', n: 'La orilla, pescando' }, e: 'Camina despacio y pesca.' },
          { a: { o: 'pez', n: 'Pez pequeño' }, b: { o: 'raices', n: 'El agua entre raíces' }, e: 'Se esconde de los peces grandes.' },
          { a: { o: 'ostra', n: 'Ostra' }, b: { o: 'mangle', n: 'Pegada a las raíces' }, e: 'Las raíces son su roca.' }
        ] }
    ]
  },
  {
    id: 'cienaga-3', titulo: 'Guardián del carbono',
    cromo: { t: 'Carbono azul', o: 'mangle', dato: 'Manglares, pastos marinos y marismas guardan la mitad del carbono enterrado en el fondo del mar.', f: 'manglar' },
    pasos: [
      { tipo: 'escena', quien: 'tomas', lineas: [
        { t: 'Las plantas toman del aire un gas llamado dióxido de carbono y lo guardan en su madera y en el suelo.' },
        { t: 'Si ese gas se queda en el aire, el planeta se calienta más.', exp: 'pensando' },
        { t: 'Y el manglar es un guardián muy bueno de ese carbono.' }
      ] },
      { tipo: 'dato', pide: { t: 'Manglares, pastos marinos y marismas: ¿cuánto del carbono enterrado en el fondo del mar guardan?' }, ops: ['Casi nada', 'La mitad', 'Todo'], r: 1,
        revela: { t: 'La mitad, aunque ocupan muy poquito espacio. Por eso cuidarlos ayuda al clima.' },
        picto: { o: 'mangle', total: 2, on: 1, cols: 2, ley: 'Del carbono enterrado en el fondo del mar' }, fuente: 'manglar' },
      { tipo: 'ordena', pide: { t: 'Ordena los mangles desde el agua hacia la tierra.' },
        pasos: [
          { o: 'mangle', n: 'Mangle rojo, en la orilla', si: 'Sus raíces aguantan el agua salada.' },
          { o: 'raices', n: 'Mangle negro, más adentro', si: 'Saca raíces del barro para respirar.' },
          { o: 'arbol', n: 'Mangle blanco, en lo más alto', si: 'Prefiere suelo arenoso y menos salado.' }
        ],
        cierre: { t: 'Cada mangle tiene su lugar. Por eso se siembra en la franja correcta.' } }
    ]
  },
  {
    id: 'cienaga-4', titulo: 'Siembra un manglar', dorado: true,
    cromo: { t: 'Mi manglar', o: 'propagulo', dato: 'El mangle rojo vive en la orilla y protege la costa.', f: 'zonas' },
    pasos: [
      { tipo: 'escena', quien: 'tomas', lineas: [
        { t: 'Esto es un propágulo: la semilla larga del mangle rojo.', o: 'propagulo' },
        { t: 'Hoy vas a sembrar tu propio manglar en chispa. Crecerá un poquito cada día que vuelvas.', exp: 'feliz' }
      ] },
      { tipo: 'juego', juego: 'manglar', nivel: 1 },
      { tipo: 'siembra' },
      { tipo: 'dibuja', pide: { t: 'Dibuja un animal del manglar.' }, plantilla: null },
      { tipo: 'mision', t: 'Cuéntale a tu familia por qué el manglar protege la costa. Pueden ver juntos fotos de manglares.', x: 'Explícale a tu familia qué es el carbono azul y por qué el manglar es su guardián.' }
    ]
  }
];
