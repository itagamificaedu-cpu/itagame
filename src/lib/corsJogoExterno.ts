// CORS restrito só pras rotas de jogos externos (/api/jogos-externos/*), porque são
// as únicas chamadas de fora do domínio do painel — o jogo Construct 2 fica hospedado
// em itatecnologiaeducacional.tech/jogos/<slug>, servido pelo Nginx da plataforma ITA,
// origem diferente do domínio deste app. Todo o resto do ItaGame é same-origin e não
// precisa disso.

const ORIGENS_PERMITIDAS = [
  "https://itatecnologiaeducacional.tech",
  "https://www.itatecnologiaeducacional.tech",
  // dev local do jogo (ex: servidor estático testando o export do Construct)
  "http://localhost:8080",
];

export function cabecalhosCorsJogoExterno(origem: string | null) {
  const origemPermitida = origem && ORIGENS_PERMITIDAS.includes(origem) ? origem : ORIGENS_PERMITIDAS[0];

  return {
    "Access-Control-Allow-Origin": origemPermitida,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function respostaPreflight(req: Request) {
  return new Response(null, { status: 204, headers: cabecalhosCorsJogoExterno(req.headers.get("origin")) });
}
