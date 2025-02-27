self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll([
        "/poc-pdv-pwa/",
        "/poc-pdv-pwa/index.html",
        "/poc-pdv-pwa/styles.css",
        "/poc-pdv-pwa/app.js",
        "/poc-pdv-pwa/manifest.json",
        "/poc-pdv-pwa/icons/icon-192x192.png",
        "/poc-pdv-pwa/icons/icon-512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
