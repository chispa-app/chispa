/* chispa · contenido de los cinco módulos.
   Cada texto que suena tiene un id de voz (archivo audio/<id>.mp3).
   Los datos llevan su fuente; nada se inventa. */
'use strict';

window.CONTENIDO = {
  bienvenida: [
    { voz: 'b-1', texto: '¡Hola! Soy Cocuyo, una luciérnaga.' },
    { voz: 'b-2', texto: 'Mi luz no gasta electricidad ni calienta: es luz fría.' },
    { voz: 'b-3', texto: 'Tu barrio está de noche. Con cada invento lo vamos a encender.' },
    { voz: 'b-4', texto: '¿Cómo te llamo?' }
  ],
  nivel: { voz: 'b-nivel', texto: 'Elige tu reto. Puedes cambiarlo cuando quieras.' },

  modulos: [
    /* ───────────── 1 ───────────── */
    {
      id: 1, slug: 'separa', titulo: 'Separa en casa', parte: 'La casa y sus canecas',
      historia: [
        { voz: 'm1-h1', texto: 'Cada día, en tu casa se bota mucha basura.' },
        { voz: 'm1-h2', texto: 'Si todo va a la misma bolsa, lo que servía otra vez termina enterrado.' },
        { voz: 'm1-h3', texto: 'Por eso en Colombia usamos tres canecas.' },
        { voz: 'm1-h4', texto: 'La blanca es para lo reciclable: plástico, vidrio, metal, papel y cartón, limpios y secos.' },
        { voz: 'm1-h5', texto: 'La negra es para lo que no se puede reciclar, como servilletas sucias o papel higiénico.' },
        { voz: 'm1-h6', texto: 'Y la verde es para lo orgánico: cáscaras y restos de comida.' },
        { voz: 'm1-h7', texto: '¿Listo? ¡A separar!' }
      ],
      juego: {
        tipo: 'clasificar',
        instruccion: { voz: 'm1-j', texto: '¿A qué caneca va?' },
        explorador: [
          { id: 'botella', nombre: 'Botella de plástico', caneca: 'blanca', si: 'El plástico limpio se recicla.', casi: 'Es de plástico. ¿Dónde va lo que se recicla?' },
          { id: 'banano', nombre: 'Cáscara de banano', caneca: 'verde', si: 'Las cáscaras son orgánicas: se vuelven abono.', casi: 'Viene de una fruta. ¿Qué caneca es para la comida?' },
          { id: 'servilleta', nombre: 'Servilleta usada', caneca: 'negra', si: 'Una servilleta sucia ya no se puede reciclar.', casi: 'Está sucia. ¿Se podrá usar otra vez?' },
          { id: 'lata', nombre: 'Lata de gaseosa', caneca: 'blanca', si: 'El metal se recicla una y otra vez.', casi: 'Es de metal. ¿Se puede reciclar?' },
          { id: 'arroz', nombre: 'Arroz que sobró', caneca: 'verde', si: 'Los restos de comida van a la verde.', casi: 'Es comida. ¿Qué color le toca a lo orgánico?' },
          { id: 'higienico', nombre: 'Papel higiénico usado', caneca: 'negra', si: 'El papel higiénico usado va a la negra.', casi: 'Es papel, pero está usado. ¿Se podrá reciclar?' },
          { id: 'frasco', nombre: 'Frasco de vidrio limpio', caneca: 'blanca', si: 'El vidrio limpio se recicla.', casi: 'Es vidrio y está limpio. ¿Dónde va?' },
          { id: 'huevo', nombre: 'Cáscaras de huevo', caneca: 'verde', si: 'Las cáscaras de huevo son orgánicas.', casi: 'Viene de la cocina. ¿Es orgánico?' }
        ],
        experto: [
          { id: 'pizza', nombre: 'Caja de pizza con grasa', caneca: 'negra', si: 'La grasa daña el cartón y ya no se puede reciclar.', casi: 'Mira bien la caja: ¿tiene comida pegada?' },
          { id: 'periodico', nombre: 'Periódico seco', caneca: 'blanca', si: 'El papel limpio y seco se recicla.', casi: 'Está limpio y seco. ¿Se puede usar otra vez?' },
          { id: 'paquete', nombre: 'Paquete de papas metalizado', caneca: 'negra', si: 'Los empaques metalizados van a la negra.', casi: 'Brilla como metal, pero es un empaque metalizado. ¿Se recicla?' },
          { id: 'yogur', nombre: 'Vaso de yogur enjuagado', caneca: 'blanca', si: 'Enjuagado y seco, el plástico se recicla.', casi: 'Ya está limpio. ¿Qué pasa con el plástico limpio?' },
          { id: 'hojas', nombre: 'Hojas secas del patio', caneca: 'verde', si: 'Las hojas y restos de plantas son orgánicos.', casi: 'Viene de una planta. ¿Es orgánico?' },
          { id: 'pila', nombre: 'Pila usada', caneca: 'especial', si: 'Las pilas no van a ninguna caneca: se llevan a un punto de recolección de pilas.', casi: 'Las pilas son peligrosas para la basura común. ¿Va en alguna de las tres?' },
          { id: 'cuaderno', nombre: 'Cuaderno viejo', caneca: 'blanca', si: 'El papel del cuaderno se recicla.', casi: 'Es papel y está seco. ¿Dónde va?' },
          { id: 'servigrasa', nombre: 'Servilleta con grasa', caneca: 'negra', si: 'Con grasa, el papel ya no se recicla.', casi: 'Tiene grasa. ¿Se podrá reciclar?' },
          { id: 'mango', nombre: 'Cáscara de mango', caneca: 'verde', si: 'La cáscara de mango es orgánica.', casi: 'Es de una fruta. ¿Qué caneca le toca?' },
          { id: 'vidrio', nombre: 'Botella de vidrio', caneca: 'blanca', si: 'El vidrio se recicla.', casi: 'Es vidrio. ¿Se recicla?' }
        ]
      },
      dato: {
        pregunta: { voz: 'm1-dp', texto: 'En Colombia, de cada 10 kilos de basura, ¿cuántos se reciclan o se vuelven a usar?' },
        opciones: ['1 kilo', '5 kilos', '9 kilos'], correcta: 0,
        revela: { voz: 'm1-dr', texto: 'Solo 1 de cada 10. Los otros 9 se pierden. Separar en casa es el primer paso para cambiarlo.' },
        picto: { icono: 'bolsa', total: 10, resaltados: 1, leyenda: 'Cada bolsa es 1 kilo de basura' },
        fuente: { nombre: 'DANE, cuenta de residuos sólidos 2023 (10,51 %)', url: 'https://www.dane.gov.co/files/operaciones/CAEFM-RS/bol-CAEFMRS-2023pr.pdf' }
      },
      curioso: { voz: 'm1-c', texto: 'El código de tres colores rige en todo el país desde 2021.', fuente: { nombre: 'Minambiente, Resolución 2184 de 2019', url: 'https://www.minambiente.gov.co/gobierno-unifica-el-codigo-de-colores-para-la-separacion-de-residuos-en-la-fuente-a-nivel-nacional/' } },
      mision: {
        explorador: { voz: 'm1-me', texto: 'Esta semana, separen en familia la basura de la cocina en tres: blanca, negra y verde.' },
        experto: { voz: 'm1-mx', texto: 'Separen la basura de la cocina toda la semana y cuenten cuántas bolsas blancas llenaron.' }
      }
    },

    /* ───────────── 2 ───────────── */
    {
      id: 2, slug: 'viaje', titulo: 'El viaje de la basura', parte: 'La estación de reciclaje',
      historia: [
        { voz: 'm2-h1', texto: '¿Qué pasa cuando sacas la bolsa?' },
        { voz: 'm2-h2', texto: 'Si va bien separada, la recoge un reciclador de oficio.' },
        { voz: 'm2-h3', texto: 'Los recicladores trabajan recorriendo el barrio y llevan lo reciclable a una estación de clasificación.' },
        { voz: 'm2-h4', texto: 'Allí separan el plástico, el cartón y el vidrio, y lo pesan.' },
        { voz: 'm2-h5', texto: 'Después, las fábricas lo convierten en cosas nuevas.' },
        { voz: 'm2-h6', texto: 'Pero si todo va revuelto, termina enterrado en el relleno sanitario.' },
        { voz: 'm2-h7', texto: 'En Barranquilla, de cada ocho bolsas, solo una se aprovecha. ¡Tú puedes cambiar eso!' }
      ],
      juego: {
        tipo: 'ordenar',
        instruccion: { voz: 'm2-j', texto: 'Ordena el viaje de la botella.' },
        explorador: [
          { id: 'casa', nombre: 'En casa la pones en la caneca blanca', si: 'Todo empieza en tu casa.' },
          { id: 'reciclador', nombre: 'Un reciclador de oficio la recoge', si: 'Los recicladores la llevan a clasificar.' },
          { id: 'eca', nombre: 'En la estación la clasifican y la pesan', si: 'Allí se junta con otras botellas.' },
          { id: 'fabrica', nombre: 'La fábrica la convierte en algo nuevo', si: '¡La botella tiene una nueva vida!' }
        ],
        experto: {
          tipo: 'elegir',
          instruccion: { voz: 'm2-jx', texto: '¿Qué es lo mejor que puedes hacer?' },
          opciones: ['Reducir', 'Reutilizar', 'Reparar', 'Reciclar'],
          casos: [
            { id: 'agua', nombre: 'En casa compran agua en botella todos los días', correcta: 'Reducir', si: 'Con un termo se bota menos: la mejor basura es la que no existe.', casi: '¿Y si no hiciera falta la botella?' },
            { id: 'frasco', nombre: 'Un frasco de vidrio vacío', correcta: 'Reutilizar', si: 'Sirve para guardar lápices o semillas.', casi: 'Está entero. ¿Le puedes dar otro uso?' },
            { id: 'carro', nombre: 'Tu carrito perdió una rueda', correcta: 'Reparar', si: 'Arreglarlo es mejor que comprar otro.', casi: 'Solo le falta una pieza. ¿Tiene arreglo?' },
            { id: 'caja', nombre: 'Una caja de cartón rota y seca', correcta: 'Reciclar', si: 'Ya no sirve como caja, pero el cartón se recicla.', casi: 'Está rota, pero el cartón está seco. ¿Qué le queda?' },
            { id: 'camiseta', nombre: 'Una camiseta que ya no te queda', correcta: 'Reutilizar', si: 'Otra persona la puede usar.', casi: 'Está buena. ¿Alguien más la podría usar?' }
          ]
        }
      },
      dato: {
        pregunta: { voz: 'm2-dp', texto: '¿Cuántos recicladores de oficio hay registrados en Colombia?' },
        opciones: ['Unos 700', 'Unos 7.000', 'Unos 77.000'], correcta: 2,
        revela: { voz: 'm2-dr', texto: '¡Casi 77.000! Unos 6.000 trabajan en el Atlántico. Separar bien les facilita el trabajo.' },
        picto: { icono: 'persona', total: 8, resaltados: 8, parcial: 0.7, leyenda: 'Cada figura son 10.000 recicladores' },
        fuente: { nombre: 'Superservicios, informe de aprovechamiento 2024 (76.707)', url: 'https://superservicios.gov.co/sites/default/files/2025-12/Informe-sectorial-de-la-actividad-de-aprovechamiento-2024.pdf' }
      },
      curioso: { voz: 'm2-c', texto: 'Barranquilla tiene 82 estaciones de clasificación de reciclaje.', fuente: { nombre: 'Superservicios, 2024', url: 'https://superservicios.gov.co/sites/default/files/2025-12/Informe-sectorial-de-la-actividad-de-aprovechamiento-2024.pdf' } },
      mision: {
        explorador: { voz: 'm2-me', texto: 'Busca en tu casa tres cosas que se puedan reutilizar o reparar antes de botarlas.' },
        experto: { voz: 'm2-mx', texto: 'Con un adulto, averigüen qué día pasa el reciclaje por su cuadra y dejen lista la bolsa blanca.' }
      }
    },

    /* ───────────── 3 ───────────── */
    {
      id: 3, slug: 'arroyo', titulo: 'Del arroyo al manglar', parte: 'El arroyo y el manglar',
      historia: [
        { voz: 'm3-h1', texto: 'Cuando llueve en Barranquilla, el agua corre por las calles y forma los arroyos.' },
        { voz: 'm3-h2', texto: 'Ojo: los arroyos son peligrosos. Nunca te acerques cuando llueve.' },
        { voz: 'm3-h3', texto: 'El agua arrastra lo que encuentra en la calle: bolsas, botellas, icopor.' },
        { voz: 'm3-h4', texto: 'El arroyo León lleva esa basura hasta la Ciénaga de Mallorquín, donde viven manglares y muchas aves.' },
        { voz: 'm3-h5', texto: 'Para frenarla, la ciudad puso una trampa que atrapa la basura antes de que llegue a la ciénaga.' },
        { voz: 'm3-h6', texto: 'Y en el agua, unas plantas diminutas, las microalgas, ayudan a limpiarla.' },
        { voz: 'm3-h7', texto: 'Ahora te toca a ti.' }
      ],
      juego: {
        tipo: 'atrapar',
        instruccion: { voz: 'm3-j', texto: 'Toca la basura antes de que llegue al manglar. ¡Las hojas y los peces déjalos pasar!' },
        explorador: { basura: ['bolsa', 'botella', 'lata', 'icopor', 'tapa', 'pitillo'], natural: ['hoja', 'pez'], cantidad: 10, velocidad: 1 },
        experto: {
          basura: ['bolsa', 'botella', 'lata', 'icopor', 'tapa', 'pitillo', 'vaso'], natural: ['hoja', 'pez', 'semilla'], cantidad: 12, velocidad: 1.25,
          preguntas: [
            { id: 'trampa', voz: 'm3-q1', texto: '¿Dónde pondrías la trampa?', opciones: ['Dentro de la ciénaga', 'En el arroyo, antes de la ciénaga', 'En la playa'], correcta: 1, si: 'Así la basura no alcanza a entrar al manglar.', casi: 'Piensa: ¿dónde se frena antes de hacer daño?' },
            { id: 'algas', voz: 'm3-q2', texto: '¿Qué hacen las microalgas?', opciones: ['Usan lo que ensucia el agua para crecer', 'Se comen las bolsas', 'Calientan el agua'], correcta: 0, si: 'Convierten lo que ensucia en alimento para crecer.', casi: 'Son plantas muy pequeñas. ¿Qué necesita una planta para crecer?' }
          ]
        }
      },
      dato: {
        pregunta: { voz: 'm3-dp', texto: '¿Cuánta basura había sacado la trampa del arroyo León hasta 2024?' },
        opciones: ['40 toneladas', '400 toneladas', '4.000 toneladas'], correcta: 2,
        revela: { voz: 'm3-dr', texto: 'Cerca de 4.000 toneladas. Todo eso no llegó a la ciénaga.' },
        picto: { icono: 'bolsa', total: 8, resaltados: 8, leyenda: 'Cada bolsa son 500 toneladas' },
        fuente: { nombre: 'El Heraldo, 26 de mayo de 2024', url: 'https://www.elheraldo.co/barranquilla/2024/05/26/cerca-de-4-mil-toneladas-de-basura-han-sido-retiradas-en-trampa-de-arroyo-leon-1097323/' }
      },
      curioso: { voz: 'm3-c', texto: 'Con el agua más limpia, en Mallorquín se volvieron a ver medusas y mantarrayas.', fuente: { nombre: 'El Heraldo, 29 de agosto de 2023', url: 'https://www.elheraldo.co/barranquilla/2023/08/29/recuperacion-ambiental-de-mallorquin-dejo-ver-medusas-mantarrayas-y-otras-especies-1028375/' } },
      mision: {
        explorador: { voz: 'm3-me', texto: 'Revisa con tu familia que la bolsa de basura salga bien cerrada y solo el día que pasa el camión.' },
        experto: { voz: 'm3-mx', texto: 'Hagan una lista de lo que más se bota en casa que podría terminar en un arroyo, y elijan uno para usar menos.' }
      }
    },

    /* ───────────── 4 ───────────── */
    {
      id: 4, slug: 'energia', titulo: 'Energía que no se acaba', parte: 'Los techos solares y el molino',
      historia: [
        { voz: 'm4-h1', texto: 'Cuando enciendes un bombillo, la energía viene de lejos.' },
        { voz: 'm4-h2', texto: 'Una parte se hace con el agua de los ríos y otra quemando combustibles que ensucian el aire.' },
        { voz: 'm4-h3', texto: 'Pero hay energías que no se acaban: la del sol y la del viento.' },
        { voz: 'm4-h4', texto: 'Un panel solar convierte la luz del sol en electricidad.' },
        { voz: 'm4-h5', texto: 'Un aerogenerador, como un molino gigante, usa la fuerza del viento.' },
        { voz: 'm4-h6', texto: 'Y como el sol se va de noche, las baterías guardan energía para después.' },
        { voz: 'm4-h7', texto: '¡Vamos a encender el barrio!' }
      ],
      juego: {
        tipo: 'energia',
        instruccion: { voz: 'm4-j', texto: 'Elige la mejor energía para cada momento.' },
        explorador: [
          { id: 'mediodia', nombre: 'Mediodía con mucho sol', correcta: 'panel', si: 'Con sol, el panel produce electricidad.', casi: '¿Qué aprovecha la luz del sol?' },
          { id: 'noche', nombre: 'De noche, sin sol', correcta: 'bateria', si: 'La batería guardó la energía del día.', casi: 'De noche no hay sol. ¿Qué guardó energía?' },
          { id: 'brisa', nombre: 'Tarde con mucha brisa', correcta: 'molino', si: 'El viento mueve las aspas del molino.', casi: '¿Qué gira con el viento?' }
        ],
        experto: [
          { id: 'mediodia', nombre: 'Mediodía con mucho sol', correcta: 'panel', si: 'Con sol, el panel produce electricidad.', casi: '¿Qué aprovecha la luz del sol?' },
          { id: 'nochecalma', nombre: 'Noche sin viento', correcta: 'bateria', si: 'Sin sol ni viento, usamos lo que guardó la batería.', casi: 'No hay sol ni brisa. ¿Qué guardó energía?' },
          { id: 'nochebrisa', nombre: 'Noche con brisa fuerte', correcta: 'molino', si: 'El viento sopla también de noche.', casi: 'No hay sol, pero sí viento. ¿Qué lo aprovecha?' },
          { id: 'nublado', nombre: 'Día nublado y sin brisa, después de una tarde de sol', correcta: 'bateria', si: 'La batería guardó la energía de la tarde soleada.', casi: 'Ayer hubo mucho sol. ¿Dónde quedó esa energía?' }
        ],
        fuentes: { panel: 'Panel solar', molino: 'Molino de viento', bateria: 'Batería' }
      },
      dato: {
        pregunta: { voz: 'm4-dp', texto: 'En 2022, Colombia tenía unos 200 megavatios de energía solar y eólica. ¿Cuántos tenía en julio de 2026?' },
        opciones: ['Unos 400', 'Unos 1.000', 'Unos 4.600'], correcta: 2,
        revela: { voz: 'm4-dr', texto: '¡Más de 4.600! En cuatro años se multiplicó más de veinte veces.' },
        picto: { icono: 'sol', comparar: [{ etiqueta: '2022', valor: 200 }, { etiqueta: 'julio 2026', valor: 4626 }], unidad: 500, leyenda: 'Cada sol son 500 megavatios' },
        fuente: { nombre: 'MinEnergía, 2026 (4.626 MW, 19,23 % de la capacidad)', url: 'https://minenergia.gov.co/es/sala-de-prensa/noticias-index/colombia-supera-los-4626-mw-de-energias-limpias-y-marca-un-nuevo-hito-en-la-transicion-energetica/' }
      },
      curioso: { voz: 'm4-c', texto: 'Hoy, casi una de cada cinco partes de la electricidad que Colombia puede producir viene del sol y del viento.', fuente: { nombre: 'MinEnergía, 2026', url: 'https://minenergia.gov.co/es/sala-de-prensa/noticias-index/colombia-supera-los-4626-mw-de-energias-limpias-y-marca-un-nuevo-hito-en-la-transicion-energetica/' } },
      mision: {
        explorador: { voz: 'm4-me', texto: 'Sé el detective de energía: busca luces prendidas en cuartos vacíos y apágalas con permiso de un adulto.' },
        experto: { voz: 'm4-mx', texto: 'Cuenten en casa los cargadores conectados sin nada y desconéctenlos con un adulto.' }
      }
    },

    /* ───────────── 5 ───────────── */
    {
      id: 5, slug: 'taller', titulo: 'Taller de inventores', parte: 'La plaza del barrio',
      historia: [
        { voz: 'm5-h1', texto: '¡Lo lograste! Ya sabes separar, reciclar, cuidar el agua y usar energía limpia.' },
        { voz: 'm5-h2', texto: 'Ahora viene lo mejor: inventar.' },
        { voz: 'm5-h3', texto: 'Los inventores no empiezan con una máquina. Empiezan con un problema.' },
        { voz: 'm5-h4', texto: 'Escoge un problema del barrio, una tecnología verde y para quién será.' },
        { voz: 'm5-h5', texto: 'Tu invento encenderá la plaza.' }
      ],
      juego: {
        tipo: 'inventar',
        pasos: [
          { id: 'problema', voz: 'm5-p1', texto: '¿Qué problema quieres resolver?', opciones: [
            { id: 'calle', nombre: 'Basura en la calle cuando llueve' },
            { id: 'calor', nombre: 'Mucho calor en el salón' },
            { id: 'comida', nombre: 'Comida que se bota en casa' },
            { id: 'luz', nombre: 'Luz que se gasta de noche' }
          ] },
          { id: 'tecno', voz: 'm5-p2', texto: '¿Con qué tecnología verde?', opciones: [
            { id: 'trampa', nombre: 'Una trampa de basura' },
            { id: 'panel', nombre: 'Paneles solares' },
            { id: 'compost', nombre: 'Una compostera' },
            { id: 'molino', nombre: 'Un molino de viento' },
            { id: 'sensor', nombre: 'Un sensor que avisa' },
            { id: 'plantas', nombre: 'Plantas y árboles' }
          ] },
          { id: 'quien', voz: 'm5-p3', texto: '¿Para quién es tu invento?', opciones: [
            { id: 'familia', nombre: 'Mi familia' },
            { id: 'salon', nombre: 'Mi salón' },
            { id: 'cuadra', nombre: 'Mi cuadra' },
            { id: 'manglar', nombre: 'Los animales del manglar' }
          ] }
        ],
        experto: { id: 'medir', voz: 'm5-p4', texto: '¿Cómo sabrás que funciona?', opciones: [
          { id: 'bolsas', nombre: 'Contando bolsas de basura' },
          { id: 'temp', nombre: 'Midiendo la temperatura' },
          { id: 'pesar', nombre: 'Pesando la comida que se bota' },
          { id: 'recibo', nombre: 'Mirando el recibo de la luz' }
        ] },
        cierre: { voz: 'm5-fin', texto: '¡Qué invento! Mira cómo se enciende la plaza.' }
      },
      dato: {
        pregunta: { voz: 'm5-dp', texto: '¿Cuánto calor produce la luz de una luciérnaga?' },
        opciones: ['Mucho, como un bombillo viejo', 'Casi nada', 'Tanto como una vela'], correcta: 1,
        revela: { voz: 'm5-dr', texto: 'Casi nada: es luz fría. Los inventores estudian a las luciérnagas para hacer luces que gasten menos.' },
        picto: { icono: 'luciernaga' },
        fuente: { nombre: 'Scientific American, «How and why do fireflies light up?»', url: 'https://www.scientificamerican.com/article/how-and-why-do-fireflies/' }
      },
      curioso: null,
      mision: {
        explorador: { voz: 'm5-me', texto: 'Dibuja tu invento en un papel y muéstraselo a tu familia.' },
        experto: { voz: 'm5-mx', texto: 'Presenta tu invento a tu familia o a tu salón y pregunta cómo lo mejorarían.' }
      }
    }
  ],

  /* Frases que se repiten en toda la app */
  comunes: {
    bien: [
      { voz: 'c-bien1', texto: '¡Bien pensado!' },
      { voz: 'c-bien2', texto: '¡Eso es!' },
      { voz: 'c-bien3', texto: '¡Lo tienes!' }
    ],
    casi: [
      { voz: 'c-casi1', texto: '¡Casi!' },
      { voz: 'c-casi2', texto: 'Uy, casi. Mira otra vez.' }
    ],
    pista: { voz: 'c-pista', texto: 'Te doy una pista.' },
    datoTitulo: { voz: 'c-dato', texto: 'Antes de ver el dato, ¿qué crees?' },
    mision: { voz: 'c-mision', texto: 'Tu misión en casa:' },
    misionHecha: { voz: 'c-mhecha', texto: '¡Misión cumplida! Cuéntale a alguien lo que hicieron.' },
    enciende: { voz: 'c-enciende', texto: '¡Mira! Una parte nueva de tu barrio se encendió.' },
    descanso: { voz: 'c-descanso', texto: 'Ya hiciste dos inventos seguidos. ¿Descansamos? Tu barrio te espera mañana.' },
    completo: { voz: 'c-completo', texto: '¡Tu barrio entero brilla! Eres un inventor de verdad.' },
    puerta: { texto: 'Esta parte es para adultos.' }
  }
};
