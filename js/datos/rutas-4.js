/* chispa 2.0 · rutas del Colegio (datos e infografía) y la Plaza (taller de inventores). */
'use strict';

CH.RUTAS.colegio = [
  {
    id: 'colegio-1', titulo: 'Contar para entender',
    cromo: { t: 'Seño Inés', p: 'seno-ines', dato: 'Un dato sirve si dice de dónde salió: siempre con su fuente.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'seno-ines', lineas: [
        { t: '¡Hola! Soy la seño Inés. Hoy seremos detectives de datos.' },
        { t: 'Un dato es un número que cuenta algo real. Por ejemplo: 82 estaciones de reciclaje en Barranquilla.' },
        { t: 'Y un buen dato siempre dice de dónde salió: su fuente.', exp: 'feliz' }
      ] },
      { tipo: 'ordena', pide: { t: 'Ordena estos datos del barrio, del más pequeño al más grande.' },
        pasos: [
          { o: 'eca', n: '82 estaciones de reciclaje', si: 'El más pequeño.' },
          { o: 'trampa', n: '4.000 toneladas en la trampa del arroyo', si: 'Miles.' },
          { o: 'persona', n: '77.000 recicladores en Colombia', si: 'Decenas de miles.' },
          { o: 'arbol', n: '200.000 árboles sembrados', si: '¡El más grande!' }
        ],
        cierre: { t: 'Ordenar números ayuda a compararlos.' } },
      { tipo: 'vm', cartas: [
        { t: 'Un pictograma usa dibujitos para mostrar cantidades.', v: true, e: 'Cada dibujito vale una cantidad que se dice en la leyenda.' },
        { t: 'Si un dato no tiene fuente, igual podemos creerle.', v: false, e: 'Primero hay que saber de dónde salió.' }
      ] }
    ]
  },
  {
    id: 'colegio-2', titulo: 'La gráfica tramposa',
    cromo: { t: 'Lupa de detective', o: 'lupa', dato: 'Una gráfica honesta empieza su eje en cero y dice su fuente.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'seno-ines', lineas: [
        { t: 'Algunas gráficas engañan, aunque los números sean ciertos.', exp: 'pensando' },
        { t: 'Un truco es cortar el eje: así una diferencia chiquita parece enorme.' },
        { t: 'Estas gráficas son ejemplos inventados para practicar. ¡A buscar la trampa!' }
      ] },
      { tipo: 'trampa', pide: { t: '¿Cuál de las dos gráficas dice la verdad?' },
        casos: [
          { titulo: 'Botellas recogidas (ejemplo)', a: 48, b: 52, ok: 'cero', e: 'La de la izquierda empieza en cero: la diferencia es pequeña de verdad.' },
          { titulo: 'Bolsas separadas (ejemplo)', a: 30, b: 60, ok: 'cero', e: 'En la honesta, 60 se ve el doble de 30. Y así es.' }
        ] },
      { tipo: 'juego', juego: 'detective', nivel: 1 }
    ]
  },
  {
    id: 'colegio-3', titulo: 'Mi casa en números',
    cromo: { t: 'Mi bitácora', o: 'libreta', dato: 'Tus datos se guardan solo en este aparato.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'seno-ines', lineas: [
        { t: 'Ahora tú vas a recoger datos de tu casa durante 7 días.' },
        { t: 'Cuenta bolsas, botellas y luces prendidas sin uso. Con eso armaremos tu infografía.', exp: 'feliz' }
      ] },
      { tipo: 'bitacora', pide: { t: 'Anota lo de hoy en tu bitácora.' } },
      { tipo: 'mision', t: 'Anota en la bitácora de chispa lo de tu casa un poquito cada día, durante una semana.', x: 'Anota la bitácora 7 días y descubre qué día se botó más. ¿Por qué crees que pasó?' }
    ]
  },
  {
    id: 'colegio-4', titulo: 'Mi infografía', dorado: true,
    cromo: { t: 'Mi infografía', o: 'grafica', dato: 'Una infografía cuenta una historia con datos y dibujos.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'seno-ines', lineas: [
        { t: '¡Llegó el momento! Con tu bitácora vamos a armar una infografía.' },
        { t: 'Elige colores y qué quieres mostrar. Luego preséntala en casa.' }
      ] },
      { tipo: 'infografia', pide: { t: 'Elige el color y qué mostrar.' } },
      { tipo: 'mision', t: 'Muéstrale tu infografía a tu familia y explícales qué descubriste.', x: 'Presenta tu infografía en casa y propón una meta: ¿qué número quieren bajar la próxima semana?' }
    ]
  }
];

CH.RUTAS.plaza = [
  {
    id: 'plaza-1', titulo: 'Copiar a la naturaleza',
    cromo: { t: 'Luz fría', o: 'luciernaga', dato: 'La luz de la luciérnaga casi no produce calor.', f: 'luciernaga' },
    pasos: [
      { tipo: 'escena', quien: 'cocuyo', lineas: [
        { t: '¡Bienvenido al taller de inventores!', exp: 'celebrando' },
        { t: 'Muchos inventos copian ideas de la naturaleza. Se llama biomimética.', exp: 'curioso' }
      ] },
      { tipo: 'une', quien: 'cocuyo', pide: { t: 'Une cada invento con lo que lo inspiró.' },
        pares: [
          { a: { o: 'velcro', n: 'El velcro' }, b: { o: 'cadillo', n: 'Semillas que se pegan a la ropa' }, e: 'Tienen ganchitos que se enganchan.' },
          { a: { o: 'tren', n: 'La nariz del tren bala' }, b: { o: 'martin', n: 'El pico del martín pescador' }, e: 'Entra al agua sin salpicar.' },
          { a: { o: 'edificio', n: 'Un edificio que se refresca solo' }, b: { o: 'termitero', n: 'Los montículos de las termitas' }, e: 'Por dentro circula el aire.' },
          { a: { o: 'ventana', n: 'Vidrio que las aves ven' }, b: { o: 'arana', n: 'La tela de araña' }, e: 'Refleja una luz que las aves sí ven.' }
        ], fuente: 'biomimetica' },
      { tipo: 'dato', pide: { t: '¿Cuánto calor produce la luz de una luciérnaga como yo?' }, ops: ['Mucho, como un bombillo viejo', 'Casi nada', 'Tanto como una vela'], r: 1,
        revela: { t: 'Casi nada: es luz fría. Los inventores la estudian para hacer luces que gasten menos.' }, fuente: 'luciernaga' }
    ]
  },
  {
    id: 'plaza-2', titulo: 'Un problema del barrio',
    cromo: { t: 'El problema', o: 'lupa', dato: 'Los inventores empiezan con un problema, no con una máquina.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'cocuyo', lineas: [
        { t: 'Los inventores no empiezan con una máquina. Empiezan con un problema.', exp: 'pensando' },
        { t: 'Ya recorriste el barrio. ¿Qué problema quieres resolver?', exp: 'curioso' }
      ] },
      { tipo: 'elige', guarda: 'problema', pide: { t: 'Elige el problema de tu invento.' }, ops: [
        { t: 'Basura que tapa los arroyos', o: 'sumidero', r: { t: '¡Buen problema! Así cuidamos la ciénaga.' } },
        { t: 'Mucho calor en la calle', o: 'termometro', r: { t: '¡Buen problema! La sombra es salud.' } },
        { t: 'Luz que se gasta sin uso', o: 'bombillo', r: { t: '¡Buen problema! Cada vatio cuenta.' } },
        { t: 'Comida que se bota en casa', o: 'banano', r: { t: '¡Buen problema! Lo orgánico puede ser abono.' } },
        { t: 'Bolsas revueltas en la cuadra', o: 'bolsa', r: { t: '¡Buen problema! Rosa te lo va a agradecer.' } }
      ] }
    ]
  },
  {
    id: 'plaza-3', titulo: 'Boceto',
    cromo: { t: 'Mi boceto', o: 'lapiz', dato: 'Dibujar una idea ayuda a mejorarla.', f: null },
    pasos: [
      { tipo: 'elige', guarda: 'tecno', pide: { t: '¿Con qué tecnología verde lo resuelves?' }, ops: [
        { t: 'Una trampa de basura', o: 'trampa' }, { t: 'Paneles solares', o: 'panel' }, { t: 'Una compostera', o: 'abono' },
        { t: 'Un molino de viento', o: 'molino' }, { t: 'Un sensor que avisa', o: 'sensor' }, { t: 'Plantas y árboles', o: 'arbol' }
      ] },
      { tipo: 'elige', guarda: 'para', pide: { t: '¿Para quién es tu invento?' }, ops: [
        { t: 'Mi familia', o: 'casa' }, { t: 'Mi salón', o: 'escuela' }, { t: 'Mi cuadra', o: 'reciclador' }, { t: 'Los animales del manglar', o: 'garza' }
      ] },
      { tipo: 'dibuja', pide: { t: 'Dibuja el boceto de tu invento.' } }
    ]
  },
  {
    id: 'plaza-4', titulo: 'A prueba',
    cromo: { t: 'A prueba', o: 'lluvia', dato: 'Probar y mejorar es parte de inventar.', f: null },
    pasos: [
      { tipo: 'escena', quien: 'cocuyo', lineas: [
        { t: 'Ningún invento sale perfecto a la primera. Hay que probarlo.', exp: 'pensando' },
        { t: 'Vamos a probar el tuyo con lluvia, con sol y de noche.', exp: 'senalando' }
      ] },
      { tipo: 'charla', quien: 'cocuyo', pide: '¿Cómo lo mejoras?', nodos: [
        { dice: { t: '¡Llueve fuerte! ¿Qué le pasa a tu invento?' }, exp: 'sorprendido', ops: [
          { t: 'Le pongo un techito para que no se moje.', ok: 1, r: { t: '¡Buena mejora! Resiste la lluvia.' } },
          { t: 'Lo pongo al lado del arroyo para probarlo.', r: { t: '¡No! Con lluvia, lejos del arroyo. Busca otra idea.' } }
        ] },
        { dice: { t: 'Ahora hace un sol durísimo. ¿Aguanta?' }, ops: [
          { t: 'Uso materiales que no se derritan y le doy sombra.', ok: 1, r: { t: '¡Muy bien pensado!' } },
          { t: 'Que se derrita, no importa.', r: { t: 'Mmm, entonces no duraría. ¿Cómo lo proteges?' } }
        ] },
        { dice: { t: 'Llegó la noche. ¿Funciona sin sol?' }, exp: 'dormido', ops: [
          { t: 'Le pongo una batería que se carga de día.', ok: 1, r: { t: '¡Exacto! Como en los techos de Vale.' } },
          { t: 'De noche lo apago y ya.', ok: 1, r: { t: 'También vale: no todo invento tiene que funcionar de noche.' } }
        ] }
      ] }
    ]
  },
  {
    id: 'plaza-5', titulo: 'La feria del barrio', dorado: true,
    cromo: { t: 'Inventor del barrio', o: 'cocuyo', dato: '¡Encendiste el barrio entero!', f: null },
    pasos: [
      { tipo: 'escena', quien: 'cocuyo', lineas: [
        { t: '¡Hoy es la feria del barrio! Todos vienen a ver los inventos.', exp: 'celebrando' },
        { t: 'Este es el cartel de tu invento.', exp: 'senalando' }
      ] },
      { tipo: 'cartel', pide: { t: 'Tu cartel para la feria.' } },
      { tipo: 'escena', quien: 'cocuyo', lineas: [
        { t: 'Rosa, Lina, Tomás, Vale, Don Abel y la seño Inés vinieron a verte.', exp: 'feliz' },
        { t: 'Eres un inventor de verdad. ¡El barrio entero brilla gracias a ti!', exp: 'celebrando' }
      ], fin: '¡Encender el barrio!' }
    ]
  }
];
