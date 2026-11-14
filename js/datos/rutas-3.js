/* chispa 2.0 · rutas de los Techos y el Parque. */
'use strict';

CH.RUTAS.techos = [
  {
    id: 'techos-1', titulo: '¿De dónde viene la luz?',
    cromo: { t: 'La represa', o: 'represa', dato: 'En Colombia, 62,8 % de la capacidad eléctrica es hidráulica.', f: 'matriz' },
    pasos: [
      { tipo: 'escena', quien: 'vale', lineas: [
        { t: '¡Hola! Soy Vale. Instalo paneles solares en los techos del barrio.' },
        { t: 'Cuando prendes un bombillo, la energía viene de lejos. Mira el camino.', o: 'bombillo' }
      ] },
      { tipo: 'ordena', pide: { t: 'Ordena el camino de la energía hasta tu bombillo.' },
        pasos: [
          { o: 'represa', n: 'El agua de un río mueve una turbina', si: 'Así se hace mucha de la energía en Colombia.' },
          { o: 'cable', n: 'Los cables la llevan muy lejos', si: 'Viaja por torres y cables.' },
          { o: 'casa', n: 'Llega a tu casa', si: 'Entra por el contador.' },
          { o: 'bombillo', n: 'Se prende el bombillo', si: '¡Luz!' }
        ],
        cierre: { t: 'La luz recorre un camino larguísimo hasta tu casa.' } },
      { tipo: 'dato', pide: { t: '¿De dónde sale la mayor parte de la electricidad que Colombia puede producir?' }, ops: ['Del agua de los ríos', 'Del viento', 'Del sol'], r: 0,
        revela: { t: 'Del agua: 62,8 %. Le siguen las térmicas, que queman combustible, con 29,6 %, y el sol con 7,6 %.' },
        picto: { o: 'gota', comparar: [{ etiqueta: 'Agua', valor: 62.8 }, { etiqueta: 'Térmica', valor: 29.6 }, { etiqueta: 'Sol', valor: 7.6 }], unidad: 10, ley: 'Cada ícono es 10 % de la capacidad (2025)' }, fuente: 'matriz' },
      { tipo: 'vm', cartas: [
        { t: 'La energía del sol y del viento no se acaba.', v: true, e: 'Por eso se llaman renovables.' },
        { t: 'Las térmicas producen energía sin ensuciar el aire.', v: false, e: 'Queman combustibles, y eso ensucia el aire.' }
      ] }
    ]
  },
  {
    id: 'techos-2', titulo: 'El sol en el techo',
    cromo: { t: 'Vale', p: 'vale', dato: 'Colombia superó los 4.600 megavatios de energía solar y eólica en 2026.', f: 'minenergia' },
    pasos: [
      { tipo: 'escena', quien: 'vale', lineas: [
        { t: 'El panel solar convierte la luz del sol en electricidad.', o: 'panel' },
        { t: 'La batería la guarda para la noche. Y el bombillo la usa.', o: 'bateria' },
        { t: '¿Armamos un circuito?', exp: 'feliz' }
      ] },
      { tipo: 'construye', modo: 'circuito', pide: { t: 'Arma el circuito: del sol al bombillo.' },
        ranuras: [{ n: 'Capta la luz', acepta: 'panel' }, { n: 'Guarda la energía', acepta: 'bateria' }, { n: 'Da luz', acepta: 'bombillo' }],
        piezas: [{ id: 'panel', o: 'panel', n: 'Panel solar' }, { id: 'bateria', o: 'bateria', n: 'Batería' }, { id: 'bombillo', o: 'bombillo', n: 'Bombillo' }, { id: 'botella', o: 'botella', n: 'Botella', casi: 'Una botella no conduce la electricidad.' }],
        listo: { t: '¡Se prendió!' }, e: { t: 'El panel capta el sol, la batería guarda y el bombillo alumbra.' } },
      { tipo: 'estima', pide: { t: 'En 2022, Colombia tenía unos 200 megavatios de energía solar y eólica. ¿Cuántos crees que tenía en 2026?' },
        min: 0, max: 6000, paso: 100, inicio: 600, unidad: 'megavatios', r: 4626, tol: 0.08,
        revela: { t: 'Más de 4.600. ¡En cuatro años se multiplicó más de veinte veces!' },
        picto: { o: 'sol', comparar: [{ etiqueta: '2022', valor: 200 }, { etiqueta: '2026', valor: 4626 }], unidad: 500, ley: 'Cada sol son 500 megavatios' }, fuente: 'minenergia' }
    ]
  },
  {
    id: 'techos-3', titulo: 'Día y noche',
    cromo: { t: 'Día y noche', o: 'bateria', dato: 'Casi 1 de cada 5 partes de la capacidad eléctrica ya viene del sol y del viento.', f: 'minenergia' },
    pasos: [
      { tipo: 'arrastra', etiqueta: 'Elige', pide: { t: '¿Qué energía usamos en cada momento?' }, pregunta: '¿Qué la aprovecha mejor?',
        destinos: [{ id: 'panel', n: 'Panel solar', o: 'panel' }, { id: 'molino', n: 'Molino de viento', o: 'molino' }, { id: 'bateria', n: 'Batería', o: 'bateria' }],
        cosas: [
          { o: 'sol', n: 'Mediodía con mucho sol', a: 'panel', si: 'Con sol, el panel produce electricidad.', casi: '¿Qué aprovecha la luz del sol?' },
          { o: 'luna', n: 'De noche, sin sol', a: 'bateria', si: 'La batería guardó la energía del día.', casi: 'De noche no hay sol. ¿Qué guardó energía?' },
          { o: 'molino', n: 'Tarde con mucha brisa', a: 'molino', si: 'El viento mueve las aspas.', casi: '¿Qué gira con el viento?' }
        ],
        xcosas: [
          { o: 'sol', n: 'Mediodía con mucho sol', a: 'panel', si: 'Con sol, el panel produce electricidad.', casi: '¿Qué aprovecha la luz del sol?' },
          { o: 'luna', n: 'Noche sin viento', a: 'bateria', si: 'Sin sol ni viento, usamos lo que guardó la batería.', casi: 'No hay sol ni brisa. ¿Qué guardó energía?' },
          { o: 'molino', n: 'Noche con brisa fuerte', a: 'molino', si: 'El viento sopla también de noche.', casi: 'No hay sol, pero sí viento. ¿Qué lo aprovecha?' },
          { o: 'nube', n: 'Día nublado, sin brisa, después de una tarde de sol', a: 'bateria', si: 'La batería guardó la tarde soleada.', casi: 'Ayer hubo mucho sol. ¿Dónde quedó esa energía?' }
        ] },
      { tipo: 'juego', juego: 'red', nivel: 1 },
      { tipo: 'dato', pide: { t: '¿Qué parte de la capacidad eléctrica de Colombia viene ya del sol y del viento?' }, ops: ['1 de cada 50', 'Casi 1 de cada 5', 'La mitad'], r: 1,
        revela: { t: 'Casi 1 de cada 5 partes. Y sigue creciendo.' },
        picto: { o: 'sol', total: 5, on: 1, ley: 'De cada 5 partes de la capacidad eléctrica' }, fuente: 'minenergia' }
    ]
  },
  {
    id: 'techos-4', titulo: 'Cazadores de energía', dorado: true,
    cromo: { t: 'Cazador de energía', o: 'cargador', dato: 'La energía más limpia es la que no se gasta.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'vale', lineas: [
        { t: 'Hay energía que se gasta sin que nadie la use: luces en cuartos vacíos, cargadores conectados sin nada.' },
        { t: 'Vamos a cazarla. ¡Mira bien!', exp: 'feliz' }
      ] },
      { tipo: 'busca', pide: { t: 'Toca lo que gasta energía sin que nadie lo use.' },
        cosas: [
          { o: 'bombillo', n: 'Luz prendida en un cuarto vacío', x: 18, y: 18, si: 1, e: 'Se apaga al salir.' },
          { o: 'cargador', n: 'Cargador conectado sin celular', x: 70, y: 30, si: 1, e: 'Se desconecta con un adulto.' },
          { o: 'tele', n: 'Televisor prendido sin nadie', x: 40, y: 56, si: 1, e: 'Si nadie lo ve, se apaga.' },
          { o: 'ventilador', n: 'Ventilador en un cuarto vacío', x: 80, y: 70, si: 1, e: 'Solo cuando hay alguien.' },
          { o: 'nevera', n: 'Nevera funcionando', x: 20, y: 66, si: 0, e: 'La nevera sí debe estar prendida, guarda la comida.' }
        ],
        cierre: { t: '¡Eres un cazador de energía!' } },
      { tipo: 'mision', t: 'Con un adulto, recorran la casa una noche y anoten en la bitácora cuántas luces y aparatos estaban prendidos sin uso.', x: 'Con un adulto, cuenten los cargadores conectados sin nada, desconéctenlos y anótenlo en la bitácora tres días seguidos.' }
    ]
  }
];

CH.RUTAS.parque = [
  {
    id: 'parque-1', titulo: 'La calle más caliente',
    cromo: { t: 'Bajo la sombra', o: 'arbol', dato: 'Una superficie a la sombra puede estar de 11 a 25 °C más fresca.', f: 'sombra' },
    pasos: [
      { tipo: 'escena', quien: 'don-abel', lineas: [
        { t: 'Buenas, buenas. Soy Don Abel, el jardinero del parque.' },
        { t: '¿Has sentido cómo quema el piso al mediodía? Pero debajo de un árbol se está fresquito.', o: 'termometro' }
      ] },
      { tipo: 'ad', pide: { t: 'Mueve la cortina: la misma calle sin árboles y con árboles.' },
        antes: { r: 'Sin árboles', img: 'ad-calle-antes', cielo: '#FBE3C4', esc: [{ o: 'sol', x: 66, y: 6, s: 24 }, { o: 'termometro', x: 20, y: 30, s: 18 }, { o: 'banca', x: 44, y: 60, s: 26 }] },
        despues: { r: 'Con árboles', img: 'ad-calle-despues', cielo: '#E3F0DA', esc: [{ o: 'arbol', x: 8, y: 10, s: 34 }, { o: 'arbol', x: 58, y: 8, s: 34 }, { o: 'banca', x: 40, y: 62, s: 26 }] },
        pregunta: { t: '¿En cuál calle esperarías el bus?', ops: ['En la que no tiene árboles', 'En la que tiene árboles'], r: 1, e: 'La sombra de los árboles refresca el piso y el aire.' } },
      { tipo: 'estima', pide: { t: 'Al mediodía, ¿cuántos grados más fresca puede estar una superficie a la sombra que una al sol?' },
        min: 0, max: 40, paso: 1, inicio: 3, unidad: 'grados', r: 25, tol: 0.1,
        revela: { t: 'Entre 11 y 25 grados más fresca. ¡Esa es la magia de la sombra!' }, fuente: 'sombra' }
    ]
  },
  {
    id: 'parque-2', titulo: 'Los árboles del barrio',
    cromo: { t: 'Don Abel', p: 'don-abel', dato: 'El 22 % de Barranquilla está cubierto por copas de árboles.', f: 'copas' },
    pasos: [
      { tipo: 'une', quien: 'don-abel', pide: { t: 'Une cada parte del árbol con lo que le da al barrio.' },
        pares: [
          { a: { o: 'arbol', n: 'La copa' }, b: { o: 'banca', n: 'Sombra fresca' }, e: 'La copa tapa el sol.' },
          { a: { o: 'mangoFruta', n: 'Las ramas del mango' }, b: { o: 'mangoFruta', n: 'Fruta' }, e: '¡Mangos para el barrio!' },
          { a: { o: 'nido', n: 'Las ramas' }, b: { o: 'pajaro', n: 'Casa para las aves' }, e: 'Allí hacen sus nidos.' },
          { a: { o: 'raices', n: 'Las raíces' }, b: { o: 'gota', n: 'Agua que entra al suelo' }, e: 'Ayudan a que la lluvia entre a la tierra.' }
        ] },
      { tipo: 'dato', pide: { t: '¿Qué parte de Barranquilla está cubierta por copas de árboles?' }, ops: ['2 %', '22 %', '72 %'], r: 1,
        revela: { t: 'El 22 %, casi una quinta parte de la ciudad, según una medición de 2020.' },
        picto: { o: 'arbol', total: 10, on: 2, parcial: 0.2, ley: 'Cada árbol es 10 % de la ciudad' }, fuente: 'copas' }
    ]
  },
  {
    id: 'parque-3', titulo: 'Sombra para todos',
    cromo: { t: 'Sembradores', o: 'arbol', dato: 'Barranquilla ha sembrado más de 200.000 árboles.', f: 'arboles' },
    pasos: [
      { tipo: 'escena', quien: 'don-abel', lineas: [
        { t: 'Sembrar un árbol es pensar en el futuro. Crece despacio, pero da sombra por muchos años.' },
        { t: 'Hay que sembrarlo donde más se necesite la sombra, lejos de los cables.' }
      ] },
      { tipo: 'juego', juego: 'sombra', nivel: 1 },
      { tipo: 'estima', pide: { t: '¿Cuántos árboles crees que ha sembrado Barranquilla en los últimos años?' },
        min: 0, max: 400000, paso: 10000, inicio: 20000, unidad: 'árboles', r: 200000, tol: 0.1,
        revela: { t: 'Más de 200.000. ¡Cada uno será sombra para alguien!' }, fuente: 'arboles' }
    ]
  },
  {
    id: 'parque-4', titulo: 'Refugios del calor', dorado: true,
    cromo: { t: 'Refugio del calor', o: 'fuente', dato: 'La ciudad diseña refugios climáticos con agua, árboles y sombra.', f: 'arboles' },
    pasos: [
      { tipo: 'charla', quien: 'don-abel', pide: '¿Qué le dices a Don Abel?', nodos: [
        { dice: { t: 'La ciudad está armando refugios del calor. ¿Qué crees que tiene uno?' }, ops: [
          { t: 'Árboles, sombra y agua.', ok: 1, r: { t: '¡Eso! Con fuentes, árboles y sombra.' } },
          { t: 'Mucho cemento al sol.', r: { t: 'Uy, eso calienta más. Piensa en lo que refresca.' } }
        ] },
        { dice: { t: 'Y en tu casa, ¿dónde te refugias cuando hace mucho calor?' }, ops: [
          { t: 'En el lugar con más sombra y donde corre la brisa.', ok: 1, r: { t: '¡Muy bien! Y toma agua seguido.' } },
          { t: 'En el techo al mediodía.', r: { t: '¡No! Al mediodía el techo es el lugar más caliente.' } }
        ] }
      ] },
      { tipo: 'dibuja', pide: { t: 'Dibuja el lugar más fresco de tu casa.' } },
      { tipo: 'mision', t: 'Con tu familia, busquen el lugar con más sombra y más fresco de la casa a distintas horas. Ese es su mapa de sombras.', x: 'Hagan un mapa de sombras de la casa a las 8, a las 12 y a las 4. ¿Dónde sembrarían una mata para dar más sombra?' }
    ]
  }
];
