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

**Já em produção:** https://itagame.itatecnologiaeducacional.tech

Container isolado, rede Docker própria (`itagame_network`), nunca compartilha
instância de banco com o CEITEC ID System. Roda em `/root/itagame` no VPS
(`2.24.73.137`), publicado na porta `3010` do host. Repositório:
https://github.com/itagamificaedu-cpu/itagame (público, igual ao ceitec-id-sistem
— sem isso o `git pull` no VPS exigiria credencial, já que não há nenhuma
configurada lá).

```bash
# 1. Commit e push local
git add .
git commit -m "descrição"
git push origin main

# 2. No VPS via SSH
ssh root@2.24.73.137 "cd /root/itagame && git pull origin main && docker compose build itagame_app && docker compose up -d"
```

> `.env` no VPS **não pode usar aspas** nos valores — o `env_file` do Docker
> Compose não remove aspas como um shell faria (isso já causou o erro P1013
> "scheme is not recognized" na primeira tentativa de deploy).

O Nginx compartilhado (`app-nginx-1`, definido em `/app/nginx.conf` no VPS) tem
dois blocos para `itagame.itatecnologiaeducacional.tech`: um redirecionando
HTTP→HTTPS e outro fazendo `proxy_pass` para `http://172.17.0.1:3010` — o mesmo
padrão usado para n8n/crm/evolution. O certificado SSL foi emitido com
`certbot certonly --standalone` (exige parar o Nginx compartilhado por alguns
segundos) depois de confirmar que o DNS do subdomínio (registrado no **Hostinger**,
não Cloudflare) já apontava para o IP do VPS.
