# chispa · ¿Y si lo inventas tú?

App web progresiva (PWA) para niños de 8 a 12 años sobre tecnología verde en su barrio.

## Versión 2
- **El barrio es el mundo:** 8 zonas (Casa, Cuadra, Arroyo, Ciénaga, Techos, Parque, Colegio y Plaza), cada una con su color, su vecino y su ruta.
- **33 episodios** armados con 11 tipos de actividad: escena, busca y toca, arrastra, ordena, verdad o mito, une, estima, antes y después, construye, conversación y dibuja.
- **Lo que hace volver:** álbum de 60 cromos, reto de 14 días sin rachas que se pierden, un manglar que crece con los días reales y un casillero con accesorios.
- **Dos niveles:** Explorador (8 a 10 años) y Experto (11 a 12).
- **Para adultos:** rincón de la familia, modo aula con 8 sesiones y vista horizontal para proyector, ajustes y fuentes.

## Minijuegos (2.1)
Siete juegos de 8 niveles con 3 estrellas. El nivel 1 se juega dentro de un episodio; desde ahí el juego se abre en su zona, y el nivel 8 da un cromo.

| Zona | Juego | Qué se hace | Las estrellas premian |
|---|---|---|---|
| Casa | Banda clasificadora | Clasificar lo que llega por una banda; enjuagar lo que se puede salvar; punto especial para pilas, medicinas y aceite | Equivocarse poco |
| Cuadra | Ruta del reciclador | Llevar a Rosa por la cuadra a recoger las bolsas blancas y descargarlas en la estación (desde el nivel 6, con carrito de capacidad limitada) | La ruta más corta |
| Arroyo | Atrapa en el arroyo | Sacar la basura que baja por el arroyo y dejar pasar hojas y semillas | Tocar solo la basura |
| Ciénaga | Manglar vivo | Sembrar cada mangle en su franja y devolver a cada animal a su lugar; sacar la basura | Equivocarse poco |
| Techos | Red del barrio | Girar cables para llevar la energía del panel (y del molino) a todas las casas | Girar poco |
| Parque | Sombra para todos | Sembrar árboles que den sombra a bancas, paradero, juegos y camino al colegio, lejos de los cables | Usar pocos árboles |
| Colegio | Detective de datos | Leer pictogramas, encontrar la gráfica tramposa, ver qué le falta a una gráfica y armar una | Equivocarse poco |

Ningún juego tiene tiempo límite. En el arroyo lo que se mueve se puede pausar, se detiene solo cuando una cosa tiene el foco del teclado y la basura que no se alcanza queda atascada en la reja. Con «Juegos sin tiempo» o «Menos movimiento», todo queda quieto. Cada juego se puede jugar con toques, con el teclado o arrastrando.

## Interfaz 2.2: un solo sistema de diseño
- **Tokens** en `css/chispa.css` (`:root`): espacios de 4 en 4 (`--e1` a `--e8`), radios (`--r-s` 12, `--r-m` 16, `--r-l` 24, `--r-xl` 32), bordes, sombras, alturas de control (56 y 48) y escala de letra (34, 28, 22, 18, 16, 15, 13).
- **Regla de la interfaz:** lo que se toca tiene borde oscuro y sombra dura (se «aprieta» al tocarlo); lo que solo informa tiene borde suave; lo bloqueado, borde punteado. Un solo botón primario (ámbar) por pantalla.
- **Inicio (2.4):** el mapa es una ilustración en maqueta isométrica generada con IA (Adobe Firefly) a partir de un prompt con la composición del barrio: glorieta con la estatua de Cocuyo, avenida y calles, y las 8 zonas en dos columnas. Se publica como `img/fondos/barrio.webp` (1400 px); el original queda en `herramientas/fuentes/barrio-maestra.jpg` para sacar más recortes. Cada manzana (`bloque` en `js/datos/base.js`) lleva encima un velo: apagada si está cerrada, tenue si no se ha empezado y a todo color al jugarla. `img/zonas/<zona>.webp` son recortes de la misma ilustración y se usan en la pantalla de cada zona y en el álbum. El mapa dibujado por código de la versión 2.3 quedó en `herramientas/maqueta.py` y `herramientas/fuentes/mapa-maqueta.svg`.
- **Fondos (2.4.1):** los fondos de las 8 zonas (`img/fondos/fondo-<zona>.webp`) también son ilustraciones generadas con IA en Adobe Firefly, con la imagen del barrio como referencia de estilo: vista a la altura de un niño, la escena arriba y el piso abajo, despejado para las tarjetas. Los fondos anteriores hechos en Figma quedaron en `herramientas/fuentes/fondos-figma/`.
- **Personajes (2.5):** los 7 personajes son ilustraciones 3D generadas con IA a partir de sus dibujos anteriores, sin fondo (`img/personajes/personaje-<id>.webp`) y con un recorte de cara (`-cara.webp`) para círculos y cromos. `CH.personaje` usa el WebP si existe y si no el SVG; `CH.cara` da la cara. En los episodios el personaje aparece en plano medio: llena el lienzo y sus piernas pasan detrás de la hoja. Cocuyo (2.5.1) también es 3D, con 11 poses en `img/cocuyo/cocuyo-<pose>.webp` (incluye `pulgar`, `explicando` y `contento`), todas mirando al niño; en los episodios se ve casi entero, a su escala. Los avatares (2.5.2) también son 3D: figura entera en `img/avatares/avatar-<id>.webp` y cara en `-cara.webp`, que es la que usa la app. Los recortes de Cocuyo y de los avatares se hicieron a mano; aquí solo se separan y se escalan.
- **Revisión en Figma, ronda 4 (2.7.3):** sin el aro punteado en la apertura (solo luz y luciérnagas); el inventor del escenario apoya los pies en el suelo; los vecinos del mapa llevan un contorno claro y un brillo suave, más leves que los de Cocuyo.
- **Revisión en Figma, ronda 3 (2.7.2):** el escenario de la elección ya no tiene globo: Cocuyo vuela a la izquierda con una estela de luz hacia el inventor, y la pregunta «¿Quién va a inventar hoy?» pasa a ser el título. El ícono del barrio recupera detalle (tejas, chimenea, ventana encendida, puerta, árbol, flores y camino) con contorno solo en las formas grandes.
- **Revisión en Figma, ronda 2 (2.7.1):** el punto de la «i» del logo ahora es la chispa de la app; el botón de la apertura va sin ícono; el escenario de la elección usa el fondo de la plaza a nivel de calle, con Cocuyo pequeño y el globo sin tapar al inventor; la edad lleva una planta pequeña (Explorador) y un árbol (Experto); el mapa de noche ya no ilumina el muro amarillo del colegio (solo ventanas); la abuela aparece junto a la casa al completarla; el ícono del casillero vuelve a ser el casillero, con la chispa adentro, y el del barrio se simplificó.
- **Revisión en Figma, ronda 1 (2.7):**
  - Apertura nueva: el barrio de noche con un paneo lento, luciérnagas que flotan, Cocuyo con halo, el eslogan «¿Y si lo inventas tú?» como titular, los siete vecinos que esperan y el botón «Encender mi barrio».
  - Elección de inventor: un escenario sobre la plaza con Cocuyo y el inventor elegido (cambia y salta al tocar otro), fichas de color por inventor y la pregunta de la edad con más peso, pegada a sus dos opciones, que llevan ícono.
  - Mapa: la base es una versión nocturna generada desde la maestra (`herramientas/noche.py`: oscurece y azula, conserva ventanas y faroles encendidos). Cada manzana tiene encima su versión de día con bordes difusos y se enciende de a poco con cada episodio; con el barrio completo amanece todo el mapa. Cocuyo lleva halo y contorno claro para no perderse. Las etiquetas quedan centradas por columna y fila, y la tarjeta «Seguir» dice «Casa · 1 de 4» completo.
  - Íconos de la barra en el mismo estilo del álbum: casita con árbol y farol, el frasco con cocuyos y la chispa.
- **Páginas del álbum (2.6.2):** la ilustración de la zona va en formato 3:2 (16:10 en pantallas bajitas), casi entera, y los cromos de la página se achican a 84 px de ancho para convivir con ella. El ícono del álbum en la barra inferior es una versión simple del libro de la portada: tapa ciruela con costura dorada, esquina de metal, Cocuyo encendido y cinta.
- **Accesorios (2.6.1):** los 6 accesorios del casillero son objetos 3D generados con IA en el mismo estilo de los personajes, recortados a mano (`img/accesorios/acc-<id>.webp`). Los que aún no se abren se ven en gris.
- **Mapa a todo lo ancho (2.6):** la ilustración del barrio se extendió hacia abajo con relleno generativo (3392 × 6450) para que el mapa ocupe todo el ancho y todo el alto libre, sin franjas de pasto a los lados. La tarjeta «Seguir» flota sobre el borde de abajo (árboles y casas de relleno); en pantallas bajitas el mapa se desliza. Las etiquetas de las zonas son letreros pequeños y translúcidos sobre la acera de cada manzana, y la manzana entera es la zona de toque.
- **Álbum:** libro con portada, índice de 9 secciones y una página por sección (`#album`, `#album/indice`, `#album/<zona>`). Desde 2.6 la portada es de tela con trama, costura dorada, lomo con nervios, esquinas de metal, título en lámina dorada, medallón con Cocuyo, cromos pegados y cinta separadora; al abrir, la tapa gira y muestra su guarda, dos hojas la siguen y aparece la primera página con un adelanto del índice.
- **Reto:** frasco de cocuyos; cada día hecho enciende uno. Desde 2.6 el frasco tiene vidrio con volumen y reflejos, musgo, una rama con hojas, tapa de lata con agujeros, cordel con moño y etiqueta, y cada cocuyo es un Cocuyo en miniatura (casco, cara, alas que aletean y barriga encendida).
- **Chispas:** la recompensa es una chispa (antes estrella) en toda la app.
- **Barra inferior:** íconos a color; la pestaña activa sube en una burbuja de luz con chispitas.
- **Cierre:** rayos, confeti, estrellas una por una, cromo que entra volteándose y avance de la zona, con concordancia («el parque brilla», «los techos brillan»).
- **Clasificar:** el objeto va en una bandeja aparte; las canecas llevan su color.

## Principios
- Sin cuentas, sin datos personales, sin publicidad ni notificaciones (Ley 1581 de 2012): todo se guarda solo en el aparato.
- Funciona sin conexión después de la primera visita.
- Accesible (WCAG 2.2 AA): todo se resuelve tocando, sin límites de tiempo, botones de 48 px o más, voz y texto en cada pantalla, menos movimiento y letra grande.
- Cada dato muestra su fuente; ninguna misión lleva a los niños a la calle ni cerca de un arroyo.

## Estructura
- `js/datos/`: zonas, fuentes, rutas y extras (reto, cromos, aula).
- `js/nucleo.js`: estado, voz, sonidos, imágenes y progreso. `js/actividades.js`: motor de episodios. `js/pantallas.js`: pantallas.
- `js/juegos/`: `motor.js` (niveles, estrellas, pausa y pantalla de niveles) y un archivo por juego.
- `img/`: ilustraciones SVG. Después de agregar imágenes o voces, ejecutar `node herramientas/inventario.js`.

Tipografías: Bricolage Grotesque y Lexend (SIL Open Font License). Ilustraciones generadas con la IA de Figma y editadas a mano.
