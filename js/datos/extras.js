/* chispa 2.0 · reto de 14 días, cromos, accesorios, modo aula e íconos de objetos.
   Los íconos son respaldos sencillos mientras llegan las ilustraciones finales. */
'use strict';

/* ---------- Reto de 14 días: una acción pequeña por día, en casa. Sin rachas que se pierden. ---------- */
CH.RETO = [
  'Encuentra tres cosas reciclables en tu casa.',
  'Enjuaga un envase antes de botarlo.',
  'Apaga una luz que nadie esté usando.',
  'Dibuja un animal del manglar.',
  'Cuenta las bolsas de basura de hoy en la bitácora.',
  'Busca el lugar con más sombra y más fresco de tu casa.',
  'Pregunta a un adulto qué hacen en casa con las pilas usadas.',
  'Dale un segundo uso a un frasco.',
  'Revisa tu medidor de lluvia, desde la casa.',
  'Desconecta con un adulto un cargador que no se esté usando.',
  'Cuéntale a alguien un dato que aprendiste.',
  'Mira desde la ventana un árbol cercano y ponle nombre.',
  'Compara tu bitácora del primer día con la de hoy.',
  'Presenta tu invento a tu familia.'
];

/* ---------- Cromos: 33 de episodios + 14 sellos + 7 de minijuegos + 6 sorpresas = 60 ---------- */
CH.JUEGOS_INFO = [
  { id: 'banda', nombre: 'Banda clasificadora', zona: 'casa', o: 'canecas' },
  { id: 'reciclador', nombre: 'Ruta del reciclador', zona: 'cuadra', o: 'reciclador' },
  { id: 'arroyo', nombre: 'Atrapa en el arroyo', zona: 'arroyo', o: 'trampa' },
  { id: 'manglar', nombre: 'Manglar vivo', zona: 'cienaga', o: 'mangle' },
  { id: 'red', nombre: 'Red del barrio', zona: 'techos', o: 'panel' },
  { id: 'sombra', nombre: 'Sombra para todos', zona: 'parque', o: 'arbol' },
  { id: 'detective', nombre: 'Detective de datos', zona: 'colegio', o: 'lupa' }
];
CH.SORPRESAS = [
  { id: 'sorpresa-cuadra', zona: 'cuadra', p: 'rosa', t: 'Rosa en tu cuadra', dato: 'Rosa ahora pasa por tu cuadra y te saluda.' },
  { id: 'sorpresa-arroyo', zona: 'arroyo', p: 'lina', t: 'Lina mide la lluvia', dato: 'Lina anota la lluvia de tu barrio cada día.' },
  { id: 'sorpresa-cienaga', zona: 'cienaga', p: 'tomas', t: 'Tomás en su canoa', dato: 'Tomás cuida la ciénaga que ayudaste a limpiar.' },
  { id: 'sorpresa-techos', zona: 'techos', p: 'vale', t: 'Vale en los techos', dato: 'Vale encendió los paneles de tu barrio.' },
  { id: 'sorpresa-parque', zona: 'parque', p: 'don-abel', t: 'Don Abel siembra', dato: 'Don Abel sembró un árbol con tu nombre de inventor.' },
  { id: 'sorpresa-colegio', zona: 'colegio', p: 'seno-ines', t: 'La seño Inés', dato: 'La seño Inés pegó tu infografía en el salón.' }
];
CH.cromos = () => {
  const L = [];
  // Orden del álbum: por zona (episodios, minijuego, sorpresa) y el reto al final. Así cada página va numerada en orden.
  CH.ZONAS.forEach(z => {
    (CH.RUTAS[z.id] || []).forEach(ep => L.push({ id: ep.id, zona: z.id, tipo: ep.dorado ? 'dorado' : 'episodio', ...ep.cromo }));
    CH.JUEGOS_INFO.filter(j => j.zona === z.id).forEach(j => L.push({ id: 'juego-' + j.id, zona: j.zona, tipo: 'juego', t: j.nombre, o: j.o, dato: 'Llegaste al nivel 8.', f: null }));
    CH.SORPRESAS.filter(s => s.zona === z.id).forEach(s => L.push({ ...s, tipo: 'sorpresa', f: null }));
  });
  CH.RETO.forEach((t, i) => L.push({ id: 'reto-' + (i + 1), zona: 'reto', tipo: 'sello', t: 'Día ' + (i + 1), o: 'estrella', dato: t, f: null }));
  return L;
};

/* ---------- Casillero: accesorios que se abren con chispas (sin tienda ni monedas) ---------- */
CH.ACCESORIOS = [
  { id: 'gafas', n: 'Gafas de soldar', estrellas: 10, o: 'gafas' },
  { id: 'casco', n: 'Casco solar', estrellas: 25, o: 'casco' },
  { id: 'botas', n: 'Botas de manglar', estrellas: 40, o: 'botas' },
  { id: 'guantes', n: 'Guantes de recicladora', estrellas: 55, o: 'guantes' },
  { id: 'regadera', n: 'Regadera de jardinero', estrellas: 70, o: 'regadera' },
  { id: 'farol', n: 'Farol de luciérnaga', estrellas: 90, o: 'bombillo' }
];

/* ---------- Modo aula: 8 sesiones de 45 minutos ---------- */
CH.AULA = [
  { z: 'casa', t: 'Separar en la fuente', g: 'En grupos, clasifiquen en tres cajas (blanca, negra y verde) un kit de empaques limpios traídos de casa.' },
  { z: 'cuadra', t: 'El viaje de la basura', g: 'Dramaticen el viaje de una botella: casa, recicladora, estación y fábrica. Inviten a hablar del trabajo de los recicladores con respeto.' },
  { z: 'arroyo', t: 'Agua de lluvia', g: 'Construyan un medidor de lluvia con una botella para el patio del colegio. Repasen la regla: con lluvia, lejos del arroyo.' },
  { z: 'cienaga', t: 'El manglar', g: 'Dibujen en un mural la franja del manglar: mangle rojo en la orilla, negro más adentro y blanco en lo alto, con sus animales.' },
  { z: 'techos', t: 'Energía limpia', g: 'Hagan un recorrido por el colegio contando luces y aparatos prendidos sin uso. Propongan tres acciones.' },
  { z: 'parque', t: 'Calor y sombra', g: 'Con permiso, comparen al tacto (sin quemarse) una banca al sol y otra a la sombra. Marquen en un plano del colegio dónde falta sombra.' },
  { z: 'colegio', t: 'Detectives de datos', g: 'Cada grupo convierte un dato de la app en un pictograma honesto, con eje en cero y fuente.' },
  { z: 'plaza', t: 'Feria de inventos', g: 'Cada grupo presenta un invento: problema, tecnología verde, para quién y cómo lo probaron.' }
];

/* ---------- Íconos de objetos (respaldo). Trazo café de Cocuyo. ---------- */
(() => {
  const K = '#5A3526', W = 'stroke="#5A3526" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const v = c => `<svg viewBox="0 0 48 48" aria-hidden="true">${c}</svg>`;
  CH.ICO = {
    canecas: v(`<rect x="3" y="18" width="13" height="24" rx="3" fill="#FFF" ${W}/><rect x="17.5" y="18" width="13" height="24" rx="3" fill="#2B2B2B" ${W}/><rect x="32" y="18" width="13" height="24" rx="3" fill="#2E7D45" ${W}/><path d="M2 15h15M16.5 15h15M31 15h15" ${W}/>`),
    camion: v(`<rect x="3" y="14" width="26" height="20" rx="3" fill="#2E7D45" ${W}/><path d="M29 20h9l6 7v7H29z" fill="#FFF0D6" ${W}/><circle cx="12" cy="36" r="5" fill="#5A3526"/><circle cx="36" cy="36" r="5" fill="#5A3526"/>`),
    saco: v(`<path d="M14 12c4 3 16 3 20 0l3 26c0 4-26 4-26 0z" fill="#E7C89B" ${W}/><path d="M17 10h14" ${W}/>`),
    sumidero: v(`<rect x="6" y="16" width="36" height="20" rx="4" fill="#8C8C8C" ${W}/><path d="M13 20v12M19 20v12M25 20v12M31 20v12M37 20v12" stroke="#3A3A3A" stroke-width="3" stroke-linecap="round"/>`),
    gota: v(`<path d="M24 6C18 16 12 22 12 29a12 12 0 0 0 24 0c0-7-6-13-12-23z" fill="#7CC4E8" ${W}/><path d="M19 30a5 5 0 0 0 5 5" stroke="#FFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),
    trampa: v(`<path d="M4 34h40" stroke="#1F6FA8" stroke-width="5" stroke-linecap="round"/><rect x="8" y="10" width="32" height="26" rx="2" fill="none" ${W}/><path d="M14 10v26M20 10v26M26 10v26M32 10v26" ${W}/><circle cx="17" cy="28" r="3" fill="#E85D2A"/>`),
    regla: v(`<rect x="18" y="4" width="12" height="40" rx="2" fill="#FFD34D" ${W}/><path d="M18 11h5M18 18h7M18 25h5M18 32h7M18 39h5" ${W}/>`),
    patio: v(`<rect x="6" y="20" width="36" height="22" fill="#F8E6CB" ${W}/><path d="M4 21 24 7l20 14" fill="#D9667B" ${W}/><rect x="19" y="28" width="10" height="14" fill="#7CC4E8" ${W}/>`),
    medusa: v(`<path d="M10 24a14 12 0 0 1 28 0z" fill="#E7B6E0" ${W}/><path d="M15 25c0 6 3 8 0 14M22 25c0 7 3 9 0 15M29 25c0 6 3 8 0 14M35 25c0 5 2 7 0 11" fill="none" ${W}/>`),
    mangle: v(`<circle cx="24" cy="15" r="11" fill="#2E8B57" ${W}/><path d="M24 24v8M24 28c-6 2-9 8-12 14M24 28c6 2 9 8 12 14M24 30c-2 4-3 8-3 12M24 30c2 4 3 8 3 12" fill="none" stroke="#8A4B2A" stroke-width="2.5" stroke-linecap="round"/><path d="M4 42h40" stroke="#1F6FA8" stroke-width="3" stroke-linecap="round"/>`),
    ostra: v(`<path d="M8 28c4-12 28-12 32 0-4 8-28 8-32 0z" fill="#CFC6B8" ${W}/><path d="M14 26c6-4 14-4 20 0" fill="none" ${W}/>`),
    cangrejo: v(`<ellipse cx="24" cy="28" rx="13" ry="9" fill="#E85D2A" ${W}/><circle cx="19" cy="18" r="2.5" fill="#2B211D"/><circle cx="29" cy="18" r="2.5" fill="#2B211D"/><path d="M11 26 5 20M37 26l6-6M13 33l-6 5M35 33l6 5" ${W}/>`),
    garza: v(`<path d="M28 8c4 0 5 3 3 6-3 4-6 6-6 12 4 0 10 2 10 8s-6 8-12 6l-6-4" fill="#FFF" ${W}/><path d="M31 10l9 2" stroke="#FFB627" stroke-width="3" stroke-linecap="round"/><path d="M22 38v8M26 38v8" ${W}/>`),
    barro: v(`<path d="M4 30c6-4 12 2 20-2s14 2 20-2v14H4z" fill="#8A6A4A" ${W}/><circle cx="16" cy="34" r="2" fill="#5A3526"/><circle cx="30" cy="37" r="2" fill="#5A3526"/>`),
    raices: v(`<path d="M24 4v14M24 18c-8 4-12 12-16 22M24 18c8 4 12 12 16 22M24 20c-3 6-4 12-4 20M24 20c3 6 4 12 4 20" fill="none" stroke="#8A4B2A" stroke-width="3" stroke-linecap="round"/><path d="M4 38c6-2 10 2 20 0s14 2 20 0" stroke="#1F6FA8" stroke-width="3" fill="none" stroke-linecap="round"/>`),
    ola: v(`<path d="M2 30c6-10 14-10 18 0 4-10 12-10 16 0 4-6 8-6 10-2v12H2z" fill="#4BA3D3" ${W}/><path d="M8 26c4-4 8-4 10 0" stroke="#FFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),
    propagulo: v(`<path d="M24 6c3 8 3 22 0 36-3-14-3-28 0-36z" fill="#6E8B3D" ${W}/><path d="M24 6c-3-2-6-2-8 0M24 6c3-2 6-2 8 0" fill="none" ${W}/>`),
    arbol: v(`<circle cx="24" cy="18" r="14" fill="#3E9B5E" ${W}/><rect x="21" y="28" width="6" height="16" fill="#8A4B2A" ${W}/>`),
    represa: v(`<path d="M6 12h36l-6 30H12z" fill="#CFC6B8" ${W}/><path d="M16 42c2-6 6-10 8-14 2 4 6 8 8 14" fill="#7CC4E8" ${W}/>`),
    cable: v(`<path d="M10 42 16 8h2l6 34M30 42l6-34h2l6 34" fill="none" ${W}/><path d="M17 12c6 6 14 6 20 0" fill="none" stroke="#2B211D" stroke-width="2"/>`),
    bombillo: v(`<path d="M24 5a13 13 0 0 0-7 24c2 2 2 4 2 6h10c0-2 0-4 2-6A13 13 0 0 0 24 5z" fill="#FFE58A" ${W}/><rect x="19" y="35" width="10" height="7" rx="2" fill="#CFC6B8" ${W}/>`),
    luna: v(`<path d="M30 6a16 16 0 1 0 12 26A14 14 0 0 1 30 6z" fill="#FFE58A" ${W}/>`),
    nube: v(`<path d="M12 36a8 8 0 0 1 0-16 10 10 0 0 1 19-3 9 9 0 0 1 5 19z" fill="#E6EDF2" ${W}/>`),
    lluvia: v(`<path d="M12 26a8 8 0 0 1 0-16 10 10 0 0 1 19-3 9 9 0 0 1 5 19z" fill="#C9D6DF" ${W}/><path d="M14 32l-2 6M24 32l-2 6M34 32l-2 6" stroke="#1F6FA8" stroke-width="3" stroke-linecap="round"/>`),
    cargador: v(`<rect x="10" y="8" width="16" height="22" rx="3" fill="#FFF" ${W}/><path d="M14 4v4M22 4v4M18 30c0 8 6 10 14 10h8" fill="none" ${W}/>`),
    tele: v(`<rect x="5" y="9" width="38" height="25" rx="3" fill="#4BA3D3" ${W}/><path d="M18 42h12M24 34v8" ${W}/>`),
    ventilador: v(`<circle cx="24" cy="20" r="14" fill="#FFF" ${W}/><path d="M24 20c0-8 6-10 6-4s-6 4-6 4 8 0 6 6-6-2-6-6c0 6-8 6-6 0s6-6 6-6" fill="#7CC4E8" ${W}/><path d="M24 34v8M16 44h16" ${W}/>`),
    nevera: v(`<rect x="12" y="4" width="24" height="40" rx="3" fill="#F2F2F2" ${W}/><path d="M12 18h24M16 10v4M16 22v6" ${W}/>`),
    termometro: v(`<path d="M20 30V9a4 4 0 0 1 8 0v21a8 8 0 1 1-8 0z" fill="#FFF" ${W}/><circle cx="24" cy="36" r="5" fill="#E85D2A"/><path d="M24 34V14" stroke="#E85D2A" stroke-width="3" stroke-linecap="round"/>`),
    banca: v(`<path d="M6 22h36M6 28h36" stroke="#B5763F" stroke-width="5" stroke-linecap="round"/><path d="M10 28v12M38 28v12M6 34h36" ${W}/>`),
    mangoFruta: v(`<path d="M14 18c8-10 24-4 22 10s-18 16-24 8 0-12 2-18z" fill="#FFB627" ${W}/><path d="M28 12c2-4 6-6 10-5-1 4-5 6-10 5z" fill="#3E9B5E" ${W}/>`),
    nido: v(`<path d="M8 26c0 10 32 10 32 0z" fill="#B5763F" ${W}/><ellipse cx="18" cy="24" rx="4" ry="5" fill="#E7F0F6" ${W}/><ellipse cx="28" cy="24" rx="4" ry="5" fill="#E7F0F6" ${W}/>`),
    pajaro: v(`<path d="M10 26c0-8 8-12 16-10l8-4-2 8c4 6-2 14-10 14-6 0-12-2-12-8z" fill="#1F6FA8" ${W}/><circle cx="28" cy="20" r="2" fill="#FFF"/><path d="M36 22l6 1" stroke="#FFB627" stroke-width="3" stroke-linecap="round"/>`),
    fuente: v(`<path d="M8 36h32l-4 8H12z" fill="#CFC6B8" ${W}/><path d="M24 36V16M24 16c-6 0-10 6-10 12M24 16c6 0 10 6 10 12" fill="none" stroke="#4BA3D3" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="12" r="3" fill="#7CC4E8"/>`),
    lupa: v(`<circle cx="20" cy="20" r="12" fill="#DDEFF7" ${W}/><path d="M29 29l12 12" stroke="#5A3526" stroke-width="5" stroke-linecap="round"/>`),
    libreta: v(`<rect x="10" y="5" width="28" height="38" rx="3" fill="#FFF0D6" ${W}/><path d="M16 14h16M16 21h16M16 28h10" ${W}/>`),
    grafica: v(`<path d="M8 6v34h34" fill="none" ${W}/><rect x="13" y="24" width="6" height="16" fill="#5B4BD6"/><rect x="22" y="14" width="6" height="26" fill="#1F7A5C"/><rect x="31" y="20" width="6" height="20" fill="#E85D2A"/>`),
    velcro: v(`<rect x="6" y="14" width="36" height="9" rx="2" fill="#5B4BD6" ${W}/><rect x="6" y="25" width="36" height="9" rx="2" fill="#E85D2A" ${W}/>`),
    cadillo: v(`<circle cx="24" cy="24" r="9" fill="#8A6A4A" ${W}/><path d="M24 9v6M24 33v6M9 24h6M33 24h6M13 13l4 4M31 31l4 4M13 35l4-4M31 17l4-4" ${W}/>`),
    tren: v(`<path d="M4 34h28c10 0 14-6 12-10-2-6-14-10-26-10H4z" fill="#FFF" ${W}/><path d="M10 20h20" stroke="#1F6FA8" stroke-width="4"/><path d="M4 40h40" ${W}/>`),
    martin: v(`<path d="M8 28c0-8 6-12 14-12l20-4-16 10c4 6 0 12-8 12-6 0-10-2-10-6z" fill="#1F6FA8" ${W}/><path d="M12 30c4 2 8 2 12 0" fill="#E85D2A" ${W}/><circle cx="20" cy="22" r="2" fill="#FFF"/>`),
    edificio: v(`<rect x="12" y="6" width="24" height="38" fill="#CFC6B8" ${W}/><path d="M18 12h4M26 12h4M18 20h4M26 20h4M18 28h4M26 28h4" ${W}/><path d="M24 6V2" ${W}/>`),
    termitero: v(`<path d="M10 44c2-14 6-34 14-40 8 6 12 26 14 40z" fill="#C98B52" ${W}/><path d="M24 14v26M18 24c4 2 8 2 12 0" fill="none" ${W}/>`),
    ventana: v(`<rect x="8" y="6" width="32" height="36" fill="#BFE3F2" ${W}/><path d="M24 6v36M8 24h32" ${W}/>`),
    arana: v(`<circle cx="24" cy="24" r="16" fill="none" ${W}/><circle cx="24" cy="24" r="9" fill="none" ${W}/><path d="M24 8v32M8 24h32M13 13l22 22M35 13 13 35" ${W}/>`),
    sensor: v(`<rect x="14" y="16" width="20" height="24" rx="4" fill="#FFF" ${W}/><circle cx="24" cy="28" r="4" fill="#E85D2A"/><path d="M16 10c5-4 11-4 16 0M19 6c3-2 7-2 10 0" fill="none" ${W}/>`),
    escuela: v(`<rect x="8" y="18" width="32" height="24" fill="#F8E6CB" ${W}/><path d="M5 19 24 6l19 13" fill="#5B4BD6" ${W}/><rect x="20" y="30" width="8" height="12" fill="#5B4BD6" ${W}/>`),
    lapiz: v(`<path d="M8 40l3-10L32 9l7 7-21 21z" fill="#FFB627" ${W}/><path d="M8 40l3-10 7 7z" fill="#F8E6CB" ${W}/>`),
    abono: v(`<path d="M10 20h28l-3 22H13z" fill="#8A6A4A" ${W}/><path d="M18 18c0-6 6-10 6-10s6 4 6 10" fill="#3E9B5E" ${W}/>`),
    gafas: v(`<circle cx="15" cy="24" r="8" fill="#7CC4E8" ${W}/><circle cx="33" cy="24" r="8" fill="#7CC4E8" ${W}/><path d="M23 24h2M4 22h3M41 22h3" ${W}/>`),
    casco: v(`<path d="M8 32a16 16 0 0 1 32 0z" fill="#FFB627" ${W}/><path d="M4 32h40M24 16v6" ${W}/>`),
    botas: v(`<path d="M10 8h10v26h10v8H10z" fill="#FFD34D" ${W}/><path d="M28 8h8v34" fill="none" ${W}/>`),
    guantes: v(`<path d="M14 42V20c0-3 4-3 4 0V10c0-3 4-3 4 0v8-10c0-3 4-3 4 0v12-6c0-3 4-3 4 0v16c0 6-4 12-10 12z" fill="#F8E6CB" ${W}/>`),
    regadera: v(`<path d="M10 20h22v18H10z" fill="#3E9B5E" ${W}/><path d="M32 24l10-8M10 24c-6 0-6 10 0 10" fill="none" ${W}/>`),
    cocuyo: (window.ARTE && ARTE.cocuyo.bien) || ''
  };
})();
