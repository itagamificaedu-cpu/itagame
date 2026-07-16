# ItaGame

Plataforma comercial (SaaS) de gamificação educacional e correção inteligente de
atividades — produto da ITA Tecnologia Educacional, **separado** do CEITEC ID System
(código, banco de dados e autenticação próprios).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma 7 + PostgreSQL (banco isolado)
- Autenticação própria: Server Actions + sessão em cookie httpOnly (JWT via `jose`) + `bcryptjs`
- `proxy.ts` protege as rotas `/painel/*`

## Rodando localmente

1. Suba um Postgres local (só o banco, não a app):
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```
2. Copie `.env.example` para `.env` e ajuste `SESSION_SECRET` (gere com `openssl rand -base64 32`).
3. Rode as migrations e gere o client do Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Suba o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse http://localhost:3000 — landing page, `/cadastro` e `/login` já funcionam
   fim a fim contra o Postgres local.

> Sem Docker instalado localmente, dá pra validar a landing page e o layout das
> telas (o que foi feito nesta sessão), mas cadastro/login só fecham o ciclo com
> um Postgres real rodando.

## O que já existe

- Landing page completa (10 seções, copy original) em `src/app/page.tsx` +
  `src/components/landing/`
- Schema Prisma inicial (`prisma/schema.prisma`) com Escola, Usuario, Turma,
  Atividade, SalaAoVivo, XP, Loja, Assinatura etc.
- Cadastro/login/logout de professor com sessão própria (`src/app/actions/autenticacao.ts`,
  `src/lib/sessao.ts`, `src/lib/acessoDados.ts`)
- `/painel` protegido por `proxy.ts` (placeholder — próximo passo é o gerador de
  atividades)

## Próximos passos (ainda não implementados)

- Geração de atividades e correção de redação via API da Anthropic
- Sala ao vivo (WebSockets/SSE) com ranking em tempo real
- Exportação em Word/PDF/PowerPoint
- Integração com Mercado Pago (preço do plano Pro ainda **não definido** — confirmar
  antes de conectar)
- Painel do coordenador/escola

## Deploy no VPS

Container isolado, rede Docker própria (`itagame_network`), nunca compartilha
instância de banco com o CEITEC ID System.

```bash
# No VPS, dentro da pasta do projeto (após git pull):
docker compose build itagame_app
docker compose up -d
```

Depois, configurar o Nginx (`itagame.itatecnologiaeducacional.tech` → proxy para a
porta interna do `itagame_app`) e emitir o certificado SSL com Certbot, confirmando
antes que o DNS do subdomínio já aponta para o IP do VPS.
