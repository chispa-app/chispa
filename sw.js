/* chispa · service worker: guarda la app y sus ilustraciones para que abra sin internet. No envía nada a ningún lado. */
'use strict';
const VERSION = 'chispa-v2.4.1';
const VOZ = 'chispa-voz-1';
importScripts('js/imagenes.js', 'js/audios.js');
const NUCLEO = ['./', './index.html', './manifest.webmanifest', './css/chispa.css',
  './fonts/bricolage.woff2', './fonts/lexend-400.woff2', './fonts/lexend-500.woff2', './fonts/lexend-600.woff2',
  './js/imagenes.js', './js/audios.js', './js/arte.js', './js/datos/base.js', './js/datos/rutas-1.js', './js/datos/rutas-2.js',
  './js/datos/rutas-3.js', './js/datos/rutas-4.js', './js/datos/extras.js', './js/nucleo.js', './js/actividades.js', './js/pantallas.js',
  './js/juegos/motor.js', './js/juegos/banda.js', './js/juegos/reciclador.js', './js/juegos/arroyo.js', './js/juegos/manglar.js',
  './js/juegos/red.js', './js/juegos/sombra.js', './js/juegos/detective.js',
  './icons/icono.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];
const ARCHIVOS = NUCLEO.concat((self.IMAGENES || []).map(u => './' + u));
self.addEventListener('install', ev => { ev.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', ev => { ev.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== VOZ).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname.includes('/audio/')) {
    ev.respondWith(caches.open(VOZ).then(c => c.match(req, { ignoreSearch: true }).then(g => g || fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  ev.respondWith(caches.match(req, { ignoreSearch: true }).then(g => {
    const red = fetch(req).then(r => { if (r && r.ok) caches.open(VERSION).then(c => c.put(req, r.clone())); return r; }).catch(() => g);
    return g || red;
  }));
});
