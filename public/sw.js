// Service worker do ItaGameficaEdu — existe só pra deixar o site instalável
// como app (ícone na tela, abre em tela cheia) e acelerar visitas repetidas.
//
// IMPORTANTE: não guarda em cache nenhuma página nem dado dinâmico (turma,
// XP, prova, ranking etc.) — só os arquivos estáticos do build (JS/CSS, que
// mudam de nome a cada deploy e por isso são seguros de guardar "pra
// sempre"). Tudo o mais sempre busca direto do servidor.
const CACHE = "itagame-estaticos-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((chave) => chave !== CACHE).map((chave) => caches.delete(chave))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !request.url.includes("/_next/static/")) {
    return; // deixa o navegador tratar normalmente (sempre busca no servidor)
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const emCache = await cache.match(request);
      if (emCache) return emCache;

      const resposta = await fetch(request);
      cache.put(request, resposta.clone());
      return resposta;
    })
  );
});
