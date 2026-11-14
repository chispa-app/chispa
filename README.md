# chispa · ¿Y si lo inventas tú?

App web progresiva (PWA) para niños de 8 a 12 años sobre tecnología verde en su barrio.

## Versión 2.0
- **El barrio es el mundo:** 8 zonas (Casa, Cuadra, Arroyo, Ciénaga, Techos, Parque, Colegio y Plaza), cada una con su color, su vecino y su ruta.
- **33 episodios** armados con 11 tipos de actividad: escena, busca y toca, arrastra, ordena, verdad o mito, une, estima, antes y después, construye, conversación y dibuja.
- **Lo que hace volver:** álbum de 60 cromos, reto de 14 días sin rachas que se pierden, un manglar que crece con los días reales y un casillero con accesorios.
- **Dos niveles:** Explorador (8 a 10 años) y Experto (11 a 12).
- **Para adultos:** rincón de la familia, modo aula con 8 sesiones y vista horizontal para proyector, ajustes y fuentes.

## Principios
- Sin cuentas, sin datos personales, sin publicidad ni notificaciones (Ley 1581 de 2012): todo se guarda solo en el aparato.
- Funciona sin conexión después de la primera visita.
- Accesible (WCAG 2.2 AA): todo se resuelve tocando, sin límites de tiempo, botones de 48 px o más, voz y texto en cada pantalla, menos movimiento y letra grande.
- Cada dato muestra su fuente; ninguna misión lleva a los niños a la calle ni cerca de un arroyo.

## Estructura
- `js/datos/`: zonas, fuentes, rutas y extras (reto, cromos, aula).
- `js/nucleo.js`: estado, voz, sonidos, imágenes y progreso. `js/actividades.js`: motor de episodios. `js/pantallas.js`: pantallas.
- `img/`: ilustraciones SVG. Después de agregar imágenes o voces, ejecutar `node herramientas/inventario.js`.

Tipografías: Bricolage Grotesque y Lexend (SIL Open Font License). Ilustraciones generadas con la IA de Figma y editadas a mano.
