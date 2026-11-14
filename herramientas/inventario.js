/* Genera js/imagenes.js y js/audios.js con los archivos que existen.
   Uso: node herramientas/inventario.js  (desde la raíz del proyecto) */
'use strict';
const fs = require('fs'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const lista = (dir, ext) => { const d = path.join(raiz, dir); if (!fs.existsSync(d)) return []; return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? lista(path.join(dir, e.name), ext) : (e.name.endsWith(ext) ? [path.join(dir, e.name).split(path.sep).join('/')] : [])); };
const imgs = lista('img', '.svg').sort();
const auds = lista('audio', '.mp3').map(a => path.basename(a, '.mp3')).sort();
fs.writeFileSync(path.join(raiz, 'js/imagenes.js'), `/* Generado por herramientas/inventario.js: ilustraciones disponibles. */\nself.IMAGENES = ${JSON.stringify(imgs, null, 0)};\n`);
fs.writeFileSync(path.join(raiz, 'js/audios.js'), `/* Generado por herramientas/inventario.js: voces grabadas disponibles. */\nself.AUDIOS = ${JSON.stringify(auds, null, 0)};\n`);
console.log(imgs.length + ' imágenes, ' + auds.length + ' audios');
