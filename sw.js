const CACHE_NAME = "velvet-hearts-v1";
const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./images/velvet-icon.svg",
  "./css/style.css",
  "./css/animations.css",
  "./css/anime-corner.css",
  "./css/memory-world.css",
  "./js/app.js",
  "./js/gallery.js",
  "./js/music.js",
  "./js/music-optin.js",
  "./js/motion.js",
  "./js/anime-corner.js",
  "./js/velvet-effects.js",
  "./js/velvet-mobile.js",
  "./js/memory-world.js",
  "./js/velvet-pwa.js"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      CORE_FILES.map(async path => {
        try {
          const response = await fetch(path, { cache: "reload" });
          if (response.ok) await cache.put(path, response);
        } catch {}
      })
    );
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(key => key.startsWith("velvet-hearts-") && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Stream large video and audio files directly instead of caching them.
  if (/\.(mp4|webm|mp3|m4a|wav|ogg)$/i.test(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) ||
          (await caches.match("./index.html")) ||
          Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});
