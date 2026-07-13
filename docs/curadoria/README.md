# Curadoria técnica + Plano arquitetônico — app.tarefas

Documentação de referência produzida em **julho de 2026** para o projeto `app.tarefas`. Cobre curadoria de ferramentas + plano arquitetônico unificado.

## Índice

| Documento | Caminho | Tamanho | Resumo |
|---|---|---|---|
| Curadoria Frontend | [`frontend/relatorio-frontend.md`](./frontend/relatorio-frontend.md) | 20 KB / 332 linhas | Boilerplates TS (T3), UI kit (shadcn/ui), drag-and-drop (dnd-kit) — 9 recursos avaliados |
| Curadoria Backend | [`backend/relatorio-backend.md`](./backend/relatorio-backend.md) | 24 KB / 453 linhas | Auth (Better Auth), ORM (Drizzle), DB host (Neon), filas (Inngest), notificações — 17 recursos |
| Curadoria Qualidade & Ops | [`quality/relatorio-quality.md`](./quality/relatorio-quality.md) | 28 KB / 592 linhas | Testes (Vitest, Playwright), observabilidade (Sentry, Pino, OTel), deploy (Vercel), CI/CD (release-please) — 21 recursos |
| **Síntese arquitetônica** | [`sintese/relatorio-sintese.md`](./sintese/relatorio-sintese.md) | **68 KB / 1465 linhas** | **Plano unificado: arquitetura, dados, API, roadmap, backlog MoSCoW, 10 issues GitHub prontas** |

## Decisão de stack (TL;DR)

- **Framework:** T3 Stack (Next.js 15 App Router + tRPC + Tailwind v4 + TypeScript strict)
- **ORM + DB:** Drizzle ORM + Neon Postgres (serverless, branching por PR)
- **UI:** shadcn/ui (copy-paste, Radix + Tailwind) + dnd-kit (Kanban)
- **Auth:** Better Auth com plugin organization (multi-tenant, RBAC, 2FA, passkeys)
- **Filas:** Inngest (event-driven, sem Redis/workers)
- **E-mail:** Resend + React Email
- **Observabilidade:** Pino + OpenTelemetry + Sentry
- **Testes:** Vitest + Playwright + MSW
- **Deploy:** Vercel + release-please (semver + conventional commits)

## Roadmap

- **MVP (2 semanas):** auth + workspace + projeto + tarefa (Kanban) + i18n pt-BR + observabilidade + CI/CD
- **V1 (+4 semanas):** multi-workspace, convites, login social, MFA, etiquetas, vencimento, recorrência, busca, dark mode
- **V2 (pós):** real-time, mobile, integrações, IA

## Como usar

1. Comece pela **Síntese** (relatorio-sintese.md) — é o documento que orienta as decisões.
2. Issues para abrir no GitHub estão prontas na seção 13 da síntese.
3. As curadorias detalham **por que** cada ferramenta foi escolhida (trade-offs, prós, contras, maturidade).

## Atualização

Esta documentação é **viva**. Quando ferramentas forem descontinuadas ou substituídas (ex: react-beautiful-dnd foi arquivado em ago/2025), atualize a curadoria correspondente.
