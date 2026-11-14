/* chispa 2.0 · rutas de la Casa y la Cuadra.
   Arco de cada ruta: descubrir, entender, practicar y actuar. Campos con «x» son para el nivel Experto. */
'use strict';
CH.RUTAS = CH.RUTAS || {};

CH.RUTAS.casa = [
  {
    id: 'casa-1', titulo: '¿Qué hay en mi caneca?',
    cromo: { t: 'La caneca de la cocina', o: 'bolsa', dato: 'En Colombia, de cada 10 kilos de basura solo 1 se aprovecha.', f: 'dane' },
    pasos: [
      { tipo: 'escena', quien: 'familia', lineas: [
        { t: 'Mira, mijo: esta es toda la basura que sale de la cocina en un día.', quien: 'familia' },
        { t: '¡Uy! Ahí hay cosas que pueden tener otra vida.', quien: 'cocuyo', exp: 'sorprendido' },
        { t: 'Vamos a buscarlas antes de que se pierdan.', quien: 'cocuyo', exp: 'senalando' }
      ] },
      { tipo: 'busca', pide: { t: 'Toca las 5 cosas que se pueden aprovechar.', x: 'Toca las 6 cosas que se pueden aprovechar. Ojo con las trampas.' },
        cosas: [
          { o: 'botella', n: 'Botella de plástico', x: 12, y: 22, si: 1, e: 'El plástico limpio se aprovecha.' },
          { o: 'lata', n: 'Lata', x: 62, y: 14, si: 1, e: 'El metal se recicla una y otra vez.' },
          { o: 'frasco', n: 'Frasco de vidrio', x: 40, y: 48, si: 1, e: 'El vidrio limpio se recicla.' },
          { o: 'periodico', n: 'Periódico seco', x: 76, y: 56, si: 1, e: 'El papel seco se recicla.' },
          { o: 'yogur', n: 'Vaso de yogur enjuagado', x: 18, y: 66, si: 1, e: 'Enjuagado y seco, sirve.' },
          { o: 'banano', n: 'Cáscara de banano', x: 50, y: 78, si: 0, e: 'Es orgánica: va a la verde, no se recicla.' },
          { o: 'servilleta', n: 'Servilleta usada', x: 84, y: 30, si: 0, e: 'Sucia ya no se aprovecha.' }
        ],
        xcosas: [
          { o: 'botella', n: 'Botella de plástico', x: 12, y: 22, si: 1, e: 'El plástico limpio se aprovecha.' },
          { o: 'lata', n: 'Lata', x: 62, y: 14, si: 1, e: 'El metal se recicla una y otra vez.' },
          { o: 'frasco', n: 'Frasco de vidrio', x: 40, y: 48, si: 1, e: 'El vidrio limpio se recicla.' },
          { o: 'periodico', n: 'Periódico seco', x: 76, y: 56, si: 1, e: 'El papel seco se recicla.' },
          { o: 'yogur', n: 'Vaso de yogur enjuagado', x: 18, y: 66, si: 1, e: 'Enjuagado y seco, sirve.' },
          { o: 'cuaderno', n: 'Cuaderno viejo', x: 86, y: 78, si: 1, e: 'El papel del cuaderno se recicla.' },
          { o: 'pizza', n: 'Caja de pizza con grasa', x: 50, y: 80, si: 0, e: 'La grasa daña el cartón: va a la negra.' },
          { o: 'paquete', n: 'Paquete de papas', x: 84, y: 30, si: 0, e: 'Los empaques metalizados no se aprovechan.' },
          { o: 'banano', n: 'Cáscara de banano', x: 30, y: 34, si: 0, e: 'Es orgánica: va a la verde.' }
        ],
        cierre: { t: '¡Las encontraste todas! Si se separan, pueden volver a usarse.' } },
      { tipo: 'estima', pide: { t: 'En Colombia, de cada 10 kilos de basura, ¿cuántos crees que se aprovechan?' },
        min: 0, max: 10, paso: 1, inicio: 5, unidad: 'kilos', r: 1, tol: 0.1,
        revela: { t: 'Solo 1 de cada 10. Los otros 9 se pierden. Separar en casa es el primer paso.' },
        picto: { o: 'bolsa', total: 10, on: 1, ley: 'Cada bolsa es 1 kilo de basura' }, fuente: 'dane' },
      { tipo: 'vm', solo: 'experto', cartas: [
        { t: 'Si todo va en la misma bolsa, igual se puede reciclar después.', v: false, e: 'Revuelto se ensucia y se pierde. Por eso se separa en casa.' },
        { t: 'La comida pegada puede dañar el papel y el cartón.', v: true, e: 'Los papeles y cartones con comida ya van a la negra.', f: 'res2184' }
      ] }
    ]
  },
  {
    id: 'casa-2', titulo: 'Tres colores, tres caminos',
    cromo: { t: 'Tres canecas', o: 'canecas', dato: 'Blanca, negra y verde: el código de todo el país desde 2021.', f: 'res2184' },
    pasos: [
      { tipo: 'escena', lineas: [
        { t: 'En Colombia usamos tres colores.', quien: 'cocuyo', exp: 'feliz', o: 'canecas' },
        { t: 'La blanca es para lo aprovechable: plástico, vidrio, metal, papel y cartón, limpios y secos.', quien: 'cocuyo', exp: 'senalando' },
        { t: 'La negra, para lo que no se aprovecha, como servilletas sucias.', quien: 'cocuyo', exp: 'curioso' },
        { t: 'Y la verde, para lo orgánico: cáscaras y restos de comida.', quien: 'cocuyo', exp: 'feliz' }
      ] },
      { tipo: 'arrastra', pide: { t: 'Lleva cada cosa a su caneca. También puedes tocar la caneca.' }, pregunta: '¿A qué caneca va?',
        cosas: [
          { o: 'botella', n: 'Botella de plástico', a: 'blanca', si: 'El plástico limpio se aprovecha.', casi: 'Es de plástico. ¿Dónde va lo que se aprovecha?' },
          { o: 'banano', n: 'Cáscara de banano', a: 'verde', si: 'Las cáscaras se vuelven abono.', casi: 'Viene de una fruta. ¿Qué caneca es para la comida?' },
          { o: 'servilleta', n: 'Servilleta usada', a: 'negra', si: 'Sucia ya no se aprovecha.', casi: 'Está sucia. ¿Se podrá usar otra vez?' },
          { o: 'lata', n: 'Lata de gaseosa', a: 'blanca', si: 'El metal se recicla.', casi: 'Es de metal. ¿Se puede reciclar?' },
          { o: 'arroz', n: 'Arroz que sobró', a: 'verde', si: 'Los restos de comida van a la verde.', casi: 'Es comida. ¿Qué color le toca a lo orgánico?' },
          { o: 'higienico', n: 'Papel higiénico usado', a: 'negra', si: 'Va a la negra.', casi: 'Es papel, pero está usado. ¿Se podrá reciclar?' }
        ],
        xdestinos: ['blanca', 'negra', 'verde', 'especial'],
        xcosas: [
          { o: 'pizza', n: 'Caja de pizza con grasa', a: 'negra', si: 'La grasa daña el cartón.', casi: 'Mira bien la caja: ¿tiene comida pegada?' },
          { o: 'periodico', n: 'Periódico seco', a: 'blanca', si: 'El papel limpio y seco se recicla.', casi: 'Está limpio y seco. ¿Se puede usar otra vez?' },
          { o: 'paquete', n: 'Paquete de papas metalizado', a: 'negra', si: 'Los empaques metalizados van a la negra.', casi: 'Brilla como metal, pero es un empaque. ¿Se recicla?' },
          { o: 'yogur', n: 'Vaso de yogur enjuagado', a: 'blanca', si: 'Enjuagado y seco, el plástico se aprovecha.', casi: 'Ya está limpio. ¿Qué pasa con el plástico limpio?' },
          { o: 'hojas', n: 'Hojas secas del patio', a: 'verde', si: 'Las hojas son orgánicas.', casi: 'Viene de una planta. ¿Es orgánico?' },
          { o: 'pila', n: 'Pila usada', a: 'especial', si: 'Las pilas van a un punto de recolección, no a la basura.', casi: 'Las pilas son peligrosas en la basura común. ¿Van en alguna caneca?' },
          { o: 'servigrasa', n: 'Servilleta con grasa', a: 'negra', si: 'Con grasa, el papel ya no se recicla.', casi: 'Tiene grasa. ¿Se podrá reciclar?' },
          { o: 'mango', n: 'Cáscara de mango', a: 'verde', si: 'Es orgánica.', casi: 'Es de una fruta. ¿Qué caneca le toca?' }
        ] },
      { tipo: 'vm', cartas: [
        { t: 'El vidrio se puede reciclar muchas veces sin perder calidad.', v: true, e: 'Se recicla sin fin y vuelve como un frasco nuevo.', f: 'vidrio' },
        { t: 'La caneca verde es para el plástico.', v: false, e: 'La verde es para lo orgánico, como cáscaras y comida.' },
        { t: 'El código de tres colores rige en todo el país desde 2021.', v: true, e: 'Así es: blanca, negra y verde en toda Colombia.', f: 'res2184' }
      ] }
    ]
  },
  {
    id: 'casa-3', titulo: 'Limpio y seco',
    cromo: { t: 'Limpio y seco', o: 'yogur', dato: 'La bolsa blanca es para lo aprovechable, limpio y seco.', f: 'limpioseco' },
    pasos: [
      { tipo: 'escena', lineas: [
        { t: 'Este frasco tiene salsa. ¿Lo echo así a la blanca?', quien: 'familia' },
        { t: 'Mejor no. Si va sucio, ensucia el papel y el cartón, y todo se puede perder.', quien: 'cocuyo', exp: 'pensando' },
        { t: 'Se enjuaga con poquita agua, se deja secar y listo.', quien: 'cocuyo', exp: 'feliz' }
      ] },
      { tipo: 'ad', pide: { t: 'Mueve la cortina y compara las dos bolsas blancas.' },
        antes: { r: 'Revuelta y sucia', img: 'ad-bolsa-antes', cielo: '#F3E1D3', esc: [{ o: 'bolsa', x: 30, y: 35, s: 40 }, { o: 'pizza', x: 12, y: 20, s: 22 }, { o: 'servigrasa', x: 62, y: 18, s: 20 }, { o: 'arroz', x: 64, y: 60, s: 20 }] },
        despues: { r: 'Limpia y seca', img: 'ad-bolsa-despues', cielo: '#E8F3EA', esc: [{ o: 'bolsa', x: 30, y: 35, s: 40 }, { o: 'botella', x: 12, y: 20, s: 20 }, { o: 'periodico', x: 64, y: 18, s: 22 }, { o: 'lata', x: 66, y: 60, s: 18 }] },
        pregunta: { t: '¿Cuál bolsa le sirve a quien recicla?', ops: ['La revuelta y sucia', 'La limpia y seca'], r: 1, e: 'Lo aprovechable va limpio y seco. Así se puede vender y volver a usar.', fuente: 'limpioseco', casi: 'Fíjate en la comida pegada.' } },
      { tipo: 'juego', juego: 'banda', nivel: 1 },
      { tipo: 'vm', solo: 'experto', cartas: [
        { t: 'Para enjuagar un envase hace falta mucha agua.', v: false, e: 'Basta un chorrito. Se puede usar el agua que sobró de lavar los platos.' }
      ] }
    ]
  },
  {
    id: 'casa-4', titulo: 'Mi casa separa', dorado: true,
    cromo: { t: 'Mi casa separa', p: 'familia', dato: 'Separar en casa es el primer paso para que algo tenga otra vida.', f: 'dane' },
    pasos: [
      { tipo: 'charla', quien: 'familia', pide: '¿Qué le dices a la abuela?', nodos: [
        { dice: { t: '¿Separar la basura? Uy, mijo, eso es mucho trabajo.' }, ops: [
          { t: 'Son solo tres bolsas, abuela. Yo te ayudo.', ok: 1, r: { t: 'Bueno, si tú me ayudas… ¿y para qué sirve?' } },
          { t: 'Porque sí y ya.', r: { t: 'Así no me convences. Explícame mejor.' } }
        ] },
        { dice: { t: '¿Y para qué sirve separar?' }, ops: [
          { t: 'Lo limpio y seco se vuelve a usar y no se entierra.', ok: 1, r: { t: '¡Ah! Entonces no es basura, es material.' } },
          { t: 'Para que la cocina se vea bonita.', r: { t: 'Mmm, ¿y qué más? Algo más importante.' } }
        ] },
        { dice: { t: '¿Y dónde ponemos tres canecas en esta cocina tan chiquita?' }, ops: [
          { t: 'Pueden ser tres bolsas o cajas marcadas con colores.', ok: 1, r: { t: '¡Eso sí cabe! Mañana mismo empezamos.' } },
          { t: 'Hay que comprar tres canecas grandes.', r: { t: 'Uy, eso cuesta. ¿No habrá algo más sencillo?' } }
        ] }
      ],
        xnodos: [
          { dice: { t: '¿Separar la basura? Uy, mijo, eso es mucho trabajo.' }, ops: [
            { t: 'Son solo tres bolsas y en una semana ya es costumbre.', ok: 1, r: { t: 'Bueno… ¿y de verdad sirve?' } },
            { t: 'Porque sí y ya.', r: { t: 'Así no me convences. Explícame mejor.' } }
          ] },
          { dice: { t: '¿De verdad sirve? Si al final todo se lo lleva el camión.' }, ops: [
            { t: 'Hoy solo se aprovecha 1 de cada 10 kilos. Si separamos, Rosa puede recoger lo de la blanca.', ok: 1, r: { t: '¡No sabía que era tan poquito! Entonces sí ayuda.' } },
            { t: 'El camión lo separa solito.', r: { t: '¿Seguro? Revuelto se ensucia todo. Piénsalo.' } }
          ] },
          { dice: { t: '¿Y las pilas viejas que tengo en el cajón?' }, ops: [
            { t: 'Esas no van a ninguna caneca: se llevan a un punto de recolección.', ok: 1, r: { t: 'Las guardo aparte y las llevamos juntos.' } },
            { t: 'A la bolsa negra.', r: { t: 'Mmm, las pilas son peligrosas en la basura común.' } }
          ] }
        ] },
      { tipo: 'mision', t: 'Armen con un adulto un punto de separación en la cocina: tres bolsas o cajas marcadas blanca, negra y verde.', x: 'Armen el punto de separación y úsenlo una semana. Cuenten cuántas bolsas blancas llenaron.' }
    ]
  }
];

CH.RUTAS.cuadra = [
  {
    id: 'cuadra-1', titulo: '¿A dónde va la bolsa?',
    cromo: { t: 'El camión de la basura', o: 'camion', dato: 'Lo que llega al relleno sanitario se entierra y ya no se recicla.', f: 'relleno' },
    pasos: [
      { tipo: 'escena', lineas: [
        { t: 'Cuando sacas la bolsa, ¿a dónde crees que va?', quien: 'cocuyo', exp: 'curioso' },
        { t: 'Si va todo revuelto, el camión se la lleva lejos, al relleno sanitario.', quien: 'cocuyo', exp: 'pensando', o: 'camion' },
        { t: 'Pero si va separada, puede tener otra vida. Mira el viaje.', quien: 'cocuyo', exp: 'senalando' }
      ] },
      { tipo: 'ordena', pide: { t: 'Ordena el viaje de una botella bien separada.' },
        pasos: [
          { o: 'casa', n: 'En casa va a la bolsa blanca', si: 'Todo empieza en tu casa.' },
          { o: 'reciclador', n: 'Una recicladora la recoge', si: 'Rosa pasa por la cuadra.' },
          { o: 'eca', n: 'En la estación la clasifican', si: 'Allí se junta con otras botellas.' },
          { o: 'fabrica', n: 'La fábrica la vuelve algo nuevo', si: '¡Otra vida para la botella!' }
        ],
        xpasos: [
          { o: 'casa', n: 'En casa la enjuagan y va a la blanca', si: 'Limpia y seca.' },
          { o: 'reciclador', n: 'Una recicladora la recoge', si: 'Rosa pasa por la cuadra.' },
          { o: 'eca', n: 'En la estación la separan y la pesan', si: 'Se clasifica por material.' },
          { o: 'saco', n: 'Se vende por kilos a quien la transforma', si: 'Así la recicladora gana su sustento.' },
          { o: 'fabrica', n: 'La fábrica la vuelve algo nuevo', si: '¡Otra vida!' }
        ],
        cierre: { t: 'Así viaja una botella cuando se separa bien.' } },
      { tipo: 'dato', pide: { t: '¿Qué es un relleno sanitario?' }, ops: ['Un lugar diseñado para enterrar la basura con cuidado', 'Una fábrica que recicla todo', 'Un parque con árboles'], r: 0,
        revela: { t: 'Es un lugar donde se entierra la basura controlando sus gases y líquidos. Lo que llega allí ya no se recicla.' }, fuente: 'relleno' }
    ]
  },
  {
    id: 'cuadra-2', titulo: 'Rosa, recicladora de oficio',
    cromo: { t: 'Rosa', p: 'rosa', dato: 'En Colombia hay casi 77.000 recicladores de oficio registrados.', f: 'superservicios' },
    pasos: [
      { tipo: 'escena', quien: 'rosa', lineas: [
        { t: '¡Hola! Soy Rosa. Recorro la cuadra recogiendo lo que se puede aprovechar.' },
        { t: 'Lo llevo a la estación, lo clasifico y lo vendo. Es mi trabajo.' },
        { t: 'Cuando las familias separan bien, mi trabajo rinde mucho más.' }
      ] },
      { tipo: 'charla', quien: 'rosa', pide: '¿Qué le dices a Rosa?', nodos: [
        { dice: { t: '¿Sabes qué es lo que más me ayuda?' }, ops: [
          { t: '¿Que la bolsa blanca vaya limpia y seca?', ok: 1, r: { t: '¡Exacto! Así el cartón no se moja y lo puedo vender.' } },
          { t: '¿Que lo metamos todo en una sola bolsa?', r: { t: 'Uy, no. Revuelto se ensucia y se pierde.' } }
        ] },
        { dice: { t: 'A veces la gente no me saluda, como si no me viera.' }, ops: [
          { t: 'Yo te saludo. Tu trabajo ayuda a todo el barrio.', ok: 1, r: { t: '¡Gracias! Eso me alegra el día.' } },
          { t: 'Es que tu trabajo es con basura.', r: { t: 'Es material que vale. Y cuidar el barrio es un trabajo importante.' } }
        ] }
      ] },
      { tipo: 'estima', pide: { t: '¿Cuántos recicladores de oficio crees que hay registrados en Colombia?' },
        min: 0, max: 100000, paso: 1000, inicio: 30000, unidad: 'personas', r: 77000, tol: 0.12,
        revela: { t: 'Casi 77.000. Cada bolsa bien separada les facilita el trabajo.' },
        picto: { o: 'persona', total: 8, on: 8, parcial: 0.7, ley: 'Cada figura son 10.000 recicladores' }, fuente: 'superservicios' }
    ]
  },
  {
    id: 'cuadra-3', titulo: 'La estación de clasificación',
    cromo: { t: 'La estación', o: 'eca', dato: 'Barranquilla tiene 82 estaciones de clasificación.', f: 'superservicios' },
    pasos: [
      { tipo: 'escena', quien: 'rosa', lineas: [
        { t: 'Esta es la estación de clasificación. Aquí separo por material.', o: 'eca' },
        { t: 'Cada material va a su saco. ¿Me ayudas?' }
      ] },
      { tipo: 'arrastra', etiqueta: 'Clasifica', pide: { t: 'Ayuda a Rosa: cada cosa a su saco.' }, pregunta: '¿A qué saco va?',
        destinos: [{ id: 'plastico', n: 'Plástico', o: 'botella' }, { id: 'papel', n: 'Papel y cartón', o: 'periodico' }, { id: 'vidrio', n: 'Vidrio', o: 'vidrio' }, { id: 'metal', n: 'Metal', o: 'lata' }],
        cosas: [
          { o: 'botella', n: 'Botella de gaseosa', a: 'plastico', si: 'Al saco del plástico.', casi: 'Es transparente, pero no es vidrio: se dobla.' },
          { o: 'cuaderno', n: 'Cuaderno viejo', a: 'papel', si: 'Al saco del papel.', casi: 'Es de hojas. ¿Qué material es?' },
          { o: 'frasco', n: 'Frasco de mermelada', a: 'vidrio', si: 'Al saco del vidrio.', casi: 'Es duro y no se dobla. ¿De qué es?' },
          { o: 'lata', n: 'Lata de atún', a: 'metal', si: 'Al saco del metal.', casi: 'Suena a metal cuando la golpeas.' },
          { o: 'yogur', n: 'Vaso de yogur', a: 'plastico', si: 'Al saco del plástico.', casi: 'Es liviano y se dobla.' }
        ] },
      { tipo: 'juego', juego: 'reciclador', nivel: 1 },
      { tipo: 'dato', pide: { t: '¿Cuántas estaciones de clasificación tiene Barranquilla?' }, ops: ['8', '82', '820'], r: 1,
        revela: { t: '82 estaciones. Allí llega lo que separan las familias y recogen los recicladores.' }, fuente: 'superservicios' }
    ]
  },
  {
    id: 'cuadra-4', titulo: 'Segunda vida', dorado: true,
    cromo: { t: 'Segunda vida', o: 'vidrio', dato: 'El vidrio se recicla sin fin y vuelve como frasco nuevo en unos 30 días.', f: 'vidrio' },
    pasos: [
      { tipo: 'une', pide: { t: 'Une cada material con lo que puede volver a ser.' },
        pares: [
          { a: { o: 'vidrio', n: 'Botella de vidrio' }, b: { o: 'frasco', n: 'Un frasco nuevo' }, e: 'El vidrio se recicla sin fin.' },
          { a: { o: 'periodico', n: 'Papel y cartón' }, b: { o: 'cuaderno', n: 'Papel reciclado' }, e: 'El papel vuelve a ser papel.' },
          { a: { o: 'lata', n: 'Lata' }, b: { o: 'lata', n: 'Una lata nueva' }, e: 'El metal se funde y se vuelve a usar.' },
          { a: { o: 'banano', n: 'Cáscaras' }, b: { o: 'abono', n: 'Abono para plantas' }, e: 'Lo orgánico se vuelve abono.' }
        ] },
      { tipo: 'vm', cartas: [
        { t: 'Una botella de vidrio reciclada puede volver como frasco nuevo en unos 30 días.', v: true, e: 'Así de rápido puede tener otra vida.', f: 'vidrio' },
        { t: 'Reciclar es lo único que podemos hacer con la basura.', v: false, e: 'Antes de reciclar está reducir, reutilizar y reparar.' }
      ],
        xcartas: [
          { t: 'Una botella de vidrio reciclada puede volver como frasco nuevo en unos 30 días.', v: true, e: 'Así de rápido puede tener otra vida.', f: 'vidrio' },
          { t: 'Reciclar es lo único que podemos hacer con la basura.', v: false, e: 'Antes de reciclar está reducir, reutilizar y reparar.' },
          { t: 'La mejor basura es la que no existe.', v: true, e: 'Reducir es lo primero: usar un termo en vez de comprar botellas.' }
        ] },
      { tipo: 'mision', t: 'Con un adulto, entreguen lo que separaron a un reciclador de oficio o averigüen qué día pasa por su cuadra.', x: 'Con un adulto, averigüen qué día pasa el reciclaje por su cuadra y entreguen la bolsa blanca ese día, limpia y seca.' }
    ]
  }
];
