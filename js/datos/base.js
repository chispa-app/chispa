/* chispa 2.0 · datos base: zonas, fuentes y frases que se repiten.
   Ningún dato entra sin fuente. Las fuentes se citan por clave (F.clave). */
'use strict';
window.CH = window.CH || {};

CH.ZONAS = [
  { id: 'casa', nombre: 'Casa', tema: 'Separar en la fuente', color: '#D9667B', tinta: '#2B211D', quien: 'familia', quienNombre: 'Tu familia', juego: 'banda', mapa: { x: 19.5, y: 21 }, bloque: [0, 0, 38.5, 20.4] },
  { id: 'cuadra', nombre: 'Cuadra', tema: 'El viaje de la basura', color: '#E85D2A', tinta: '#2B211D', quien: 'rosa', quienNombre: 'Rosa, recicladora de oficio', juego: 'reciclador', mapa: { x: 80.5, y: 21 }, bloque: [61, 0, 100, 20.4] },
  { id: 'arroyo', nombre: 'Arroyo', tema: 'Agua de lluvia y basura que tapa', color: '#1F6FA8', tinta: '#FFFFFF', quien: 'lina', quienNombre: 'Lina, que mide la lluvia', juego: 'arroyo', mapa: { x: 19.5, y: 36.3 }, bloque: [0, 23.5, 38.5, 36.8] },
  { id: 'cienaga', nombre: 'Ciénaga', tema: 'Manglar y biodiversidad', color: '#0F7B70', tinta: '#FFFFFF', quien: 'tomas', quienNombre: 'Tomás, pescador', juego: 'manglar', mapa: { x: 80.5, y: 36.3 }, bloque: [61, 23.5, 100, 36.8] },
  { id: 'techos', nombre: 'Techos', tema: 'Energía del sol y del viento', color: '#FFB627', tinta: '#2B211D', quien: 'vale', quienNombre: 'Vale, técnica solar', juego: 'red', mapa: { x: 19.5, y: 54.7 }, bloque: [0, 40.4, 38.5, 54.9] },
  { id: 'parque', nombre: 'Parque', tema: 'Calor, sombra y árboles', color: '#1F7A5C', tinta: '#FFFFFF', quien: 'don-abel', quienNombre: 'Don Abel, jardinero', juego: 'sombra', mapa: { x: 80.5, y: 54.7 }, bloque: [61, 40.4, 100, 54.9] },
  { id: 'colegio', nombre: 'Colegio', tema: 'Detectives de datos', color: '#5B4BD6', tinta: '#FFFFFF', quien: 'seno-ines', quienNombre: 'La seño Inés', juego: 'detective', mapa: { x: 19.5, y: 72.6 }, bloque: [0, 57.6, 38.5, 73] },
  { id: 'plaza', nombre: 'Plaza', tema: 'Taller de inventores', color: '#3A2E3F', tinta: '#FFFFFF', quien: 'julian', quienNombre: 'Julián, inventor', juego: 'taller', mapa: { x: 80.5, y: 72.6 }, bloque: [61, 57.6, 100, 73] }
];

CH.PERSONAJES = {
  cocuyo: { nombre: 'Cocuyo', oficio: 'Luciérnaga inventora' },
  familia: { nombre: 'La abuela', oficio: 'Tu familia' },
  rosa: { nombre: 'Rosa', oficio: 'Recicladora de oficio' },
  lina: { nombre: 'Lina', oficio: 'Mide la lluvia' },
  tomas: { nombre: 'Tomás', oficio: 'Pescador' },
  vale: { nombre: 'Vale', oficio: 'Técnica solar' },
  'don-abel': { nombre: 'Don Abel', oficio: 'Jardinero' },
  'seno-ines': { nombre: 'Seño Inés', oficio: 'Profesora' },
  julian: { nombre: 'Julián', oficio: 'Inventor de la plaza' }
};

CH.AVATARES = [
  { id: 'trenzas', nombre: 'Inventora de trenzas' },
  { id: 'gafas', nombre: 'Inventor de gafas' },
  { id: 'mochila', nombre: 'Inventora con mochila wayuu' },
  { id: 'silla', nombre: 'Inventor en silla de ruedas' },
  { id: 'audifono', nombre: 'Inventora con audífono' },
  { id: 'sonrisa', nombre: 'Inventor sonriente' }
];

/* Fuentes revisadas. Cada dato de la app apunta a una de estas. */
CH.F = {
  dane: { nombre: 'DANE, cuenta de residuos sólidos 2023 (10,51 %)', url: 'https://www.dane.gov.co/files/operaciones/CAEFM-RS/bol-CAEFMRS-2023pr.pdf' },
  res2184: { nombre: 'Minambiente, Resolución 2184 de 2019 (código de colores)', url: 'https://www.minambiente.gov.co/gobierno-unifica-el-codigo-de-colores-para-la-separacion-de-residuos-en-la-fuente-a-nivel-nacional/' },
  limpioseco: { nombre: 'Minvivienda, 7 de diciembre de 2020 (código de colores)', url: 'https://minvivienda.gov.co/sala-de-prensa/desde-el-primero-de-enero-del-2021-empezara-regir-el-nuevo-codigo-de-colores-para-la-separacion-de-residuos' },
  relleno: { nombre: 'Decreto 838 de 2005, definición de relleno sanitario', url: 'https://normas.cra.gov.co/gestor/docs/decreto_0838_2005.htm' },
  superservicios: { nombre: 'Superservicios, informe de aprovechamiento 2024', url: 'https://superservicios.gov.co/sites/default/files/2025-12/Informe-sectorial-de-la-actividad-de-aprovechamiento-2024.pdf' },
  vidrio: { nombre: 'Glass Packaging Institute, «Facts About Glass Recycling»', url: 'https://gpi.org/glass-recycling-facts' },
  arroyos70: { nombre: 'El Heraldo, 30 de junio de 2024 (cifra del Distrito)', url: 'https://www.elheraldo.co/barranquilla/arroyos-mas-de-70-kilometros-lineales-han-sido-canalizados-en-barranquilla-1106255' },
  trampa: { nombre: 'El Heraldo, 26 de mayo de 2024', url: 'https://www.elheraldo.co/barranquilla/2024/05/26/cerca-de-4-mil-toneladas-de-basura-han-sido-retiradas-en-trampa-de-arroyo-leon-1097323/' },
  medusas: { nombre: 'El Heraldo, 29 de agosto de 2023', url: 'https://www.elheraldo.co/barranquilla/2023/08/29/recuperacion-ambiental-de-mallorquin-dejo-ver-medusas-mantarrayas-y-otras-especies-1028375/' },
  manglar: { nombre: 'Minambiente, Día de la Defensa del Manglar, 26 de julio de 2022', url: 'https://www.minambiente.gov.co/asuntos-marinos-costeros-y-recursos-acuaticos/hoy-es-el-dia-de-la-defensa-del-manglar-ecosistema-clave-contra-el-cambio-climatico/' },
  zonas: { nombre: 'EPA Cartagena, «Ecosistema de manglar» (2016)', url: 'https://observatorio.epacartagena.gov.co/wp-content/uploads/2016/09/ECOSISTEMA-DE-MANGLAR-septiembre-1-de-2016-2-.pdf' },
  matriz: { nombre: 'La República con datos de XM, 28 de mayo de 2026', url: 'https://www.larepublica.co/especiales/el-camino-hacia-una-economia-mas-verde/generacion-de-energia-hidraulica-pesa-62-8-en-la-matriz-energetica-la-solar-7-6-4402044' },
  minenergia: { nombre: 'MinEnergía, 2026 (4.626 MW, 19,23 % de la capacidad)', url: 'https://minenergia.gov.co/es/sala-de-prensa/noticias-index/colombia-supera-los-4626-mw-de-energias-limpias-y-marca-un-nuevo-hito-en-la-transicion-energetica/' },
  sombra: { nombre: 'EPA (EE. UU.), «Using Trees and Vegetation to Reduce Heat Islands»', url: 'https://19january2021snapshot.epa.gov/heatislands/using-trees-and-vegetation-reduce-heat-islands_.html' },
  copas: { nombre: 'BLU Radio, 6 de febrero de 2020 (medición i-Tree Canopy)', url: 'https://www.bluradio.com/medio-ambiente/barranquilla-una-de-las-ciudades-mas-arborizadas-del-mundo-fao' },
  arboles: { nombre: 'Portafolio, 8 de septiembre de 2026', url: 'https://www.portafolio.co/economia/regiones/nuevos-puntos-de-fuentes-arboles-y-refugios-climaticos-la-apuesta-de-barranquilla-para-hacerle-frente-al-calor-502037' },
  luciernaga: { nombre: 'Scientific American, «How and why do fireflies light up?»', url: 'https://www.scientificamerican.com/article/how-and-why-do-fireflies/' },
  biomimetica: { nombre: 'BBC Mundo en Prensa Libre, 17 de marzo de 2019', url: 'https://www.prensalibre.com/?p=2302844' }
};

/* Frases que se repiten. */
CH.FRASES = {
  bien: ['¡Bien pensado!', '¡Eso es!', '¡Lo tienes!', '¡Exacto!', '¡Muy bien!'],
  casi: ['¡Casi!', 'Uy, casi. Mira otra vez.', 'Mmm, piénsalo de nuevo.'],
  pista: 'Te doy una pista:',
  descanso: 'Hoy ya encendiste mucho barrio. ¿Descansamos? Tus juegos siguen abiertos y mañana hay más.',
  misionHecha: '¡Misión cumplida! Cuéntale a alguien lo que hicieron.'
};

/* Etiquetas de las canecas (código nacional, Resolución 2184 de 2019). */
CH.CANECAS = {
  blanca: { nombre: 'Blanca', sub: 'Aprovechables', color: '#FFFFFF' },
  negra: { nombre: 'Negra', sub: 'No aprovechables', color: '#1A1A1A' },
  verde: { nombre: 'Verde', sub: 'Orgánicos', color: '#2E7D45' },
  especial: { nombre: 'Punto especial', sub: 'Ninguna caneca', color: '#FFF0D6' }
};
