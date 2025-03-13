self.addEventListener("install", (event) => {
  console.log('Service Worker instalado!');
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll([
        "/manifest.json",  // Garantindo que o manifest.json seja cacheado
        "/poc-pdv-pwa/",
        "/poc-pdv-pwa/index.html",
        "/poc-pdv-pwa/styles.css",
        "/poc-pdv-pwa/app.js",
        "/poc-pdv-pwa/icons/icon-192x192.png",
        "/poc-pdv-pwa/icons/icon-512x512.png"
      ]);
    })
  );

  // Verifica se a versão mudou no manifest.json
  fetch('/manifest.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar o manifest.json: ${response.statusText}`);
      }
      return response.json();
    })
    .then(manifest => {
      const currentVersion = manifest.version;

      caches.open("app-cache").then((cache) => {
        // Armazenando a versão no cache
        cache.match('version').then((cachedVersion) => {
          if (!cachedVersion || cachedVersion !== currentVersion) {

            // Forçar a ativação imediata do novo Service Worker
            self.skipWaiting();


            // Se a versão for diferente ou não existir no cache, armazenamos
            cache.put('version', new Response(currentVersion));

            console.log("Nova versão detectada e armazenada no cache.");

            // Notificar os clientes sobre a nova versão
            self.clients.matchAll().then((clients) => {
              console.log("Clientes encontrados:", clients);
              clients.forEach((client) => {
                console.log("Enviando mensagem de nova versão para o cliente...");
                client.postMessage({ type: 'new-version', version: currentVersion });
              });
            });

            
          }
        });
      });
    })
    .catch((err) => console.error('Erro ao verificar manifest:', err));
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado!');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== "app-cache") {
            return caches.delete(cacheName); // Limpa caches antigos
          }
        })
      );
    })
  );

  // Forçar o controle imediato da página
  self.clients.claim().then(() => {
    // Enviar uma mensagem para os clientes indicando que a nova versão foi ativada
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'new-version-activated' });
      });
    });
  });
});

// Lida com a comunicação com o cliente (quando o cliente quer forçar a atualização)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'skip-waiting') {
    self.skipWaiting(); // Força a ativação imediata do novo Service Worker
  }
});

// Intercepta as requisições e responde com o cache, se disponível, ou faz a requisição normalmente
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
