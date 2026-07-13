# app.tarefas — Curadoria técnica

> Levanta para desenvolvimento rápido, sem reinventar a roda.
> Curadoria validada em 2026-07. Última revisão: quando uma decisão arquitetural mudar.

> 📚 **Para uma curadoria mais completa (4 relatórios), veja `docs/curadoria/`:**
> - [`frontend/`](./curadoria/frontend/) — boilerplates TS, UI kits, drag-and-drop
> - [`backend/`](./curadoria/backend/) — auth, ORM, DB, filas, notificações
> - [`quality/`](./curadoria/quality/) — testes, observabilidade, deploy, CI/CD
> - [`sintese/`](./curadoria/sintese/) — síntese arquitetural + 10 issues prontas

## TL;DR — O que muda em 2026 (vs treinamento antigo)

| Decisão | Onde eu recomendaria antes | Onde a indústria está agora |
|---------|------------------------------|--------------------------------|
| Auth | Lucia v3 | **Better Auth** (Lucia descontinuada em 2025 → vira recurso educacional) |
| UI | Radix + shadcn (com Radix) | **shadcn/ui com Base UI como default** (julho 2026), Radix ainda OK |
| Drag-drop | react-beautiful-dnd (deprecado) | **dnd-kit** (React geral) ou Pragmatic DnD (escala Jira) |
| ORM | Prisma (default) | **Drizzle** (cold start mais rápido, sem codegen, edge-friendly) |
| Jobs | BullMQ (default) | BullMQ ainda forte, mas **Inngest** para Vercel, **Trigger.dev v3** para AI/long-running |
| Boilerplate | create-t3-app (Next.js only) | **create-tanstack-app** + **Supastarter** + **Wasp** |

**Score geral de adequação por stack:** 8.5/10 para o app.tarefas (React + TS + Vite já em uso → encaixa em 90% das libs modernas).

---

## 1. Boilerplates fullstack TypeScript

### 🟢 create-tanstack-app

- **Link:** https://github.com/TanStack/create-tsrouter-app (ou `npm create @tanstack/app`)
- **Categoria:** Boilerplate fullstack
- **Prós:** TanStack Router + Query + Start framework, tRPC integrado, TypeScript-first, geração de rotas tipadas, suporte a SSR/SPA, escolha do framework de UI (shadcn, MUI, Chakra) na criação.
- **Contras:** Comunidade menor que Next.js; alguns starters não têm CI/migrations incluídos.
- **Maturidade:** Produção · 24k+ downloads/semana no `@tanstack/react-start`
- **Como usar no app.tarefas:** base ideal para reescrever o front com TanStack Router + tRPC server no mesmo pacote. Mantém TS end-to-end com Drizzle na mesma árvore.
- **Nota:** 9/10

### 🟢 T3 Stack / create-t3-app

- **Link:** https://create.t3.gg/ · https://github.com/t3-oss/create-t3-app
- **Categoria:** Boilerplate fullstack
- **Prós:** Next.js 15 + tRPC + Drizzle + Auth.js v5 + Tailwind. Documentação impecável, padrão comunitário.
- **Contras:** Acoplado a Next.js (você quer Hono/Node puro); Auth.js v5 ainda beta; padrão opinionado.
- **Maturidade:** Produção · 23k+ stars
- **Como usar no app.tarefas:** se o backend virar Next.js no futuro, ótimo caminho rápido. Como está em Hono, usar como **referência arquitetural** (estrutura de pastas, modelos Zod) em vez de copiar.
- **Nota:** 8/10 (referência); 6/10 (uso direto, dado que backend é Hono)

### 🟢 Supastarter

- **Link:** https://supastarter.dev/ · https://github.com/supastarter/supastarter
- **Categoria:** Boilerplate fullstack
- **Prós:** Next.js 15 + Better Auth + Drizzle + tRPC + Stripe + uploads R2 + i18n + testes Playwright. Mais completo que T3.
- **Contras:** Pago (€249 uma vez); ainda Next.js; documentação parcial em código fechado.
- **Maturidade:** Produção · mantido ativamente
- **Como usar no app.tarefas:** exemplo a copiar para Billing/LGPD/2FA quando chegar a V1+. Mesmo sem comprar, vale ler a estrutura.
- **Nota:** 7/10

### 🟢 Wasp (framework DSL)

- **Link:** https://wasp.sh/ · https://github.com/wasp-lang/wasp
- **Categoria:** Framework fullstack com DSL
- **Prós:** Você descreve app, rotas, queries em `.wasp` file e ele gera React + Node + Postgres. Auth, queries tipadas, deploy integrado.
- **Contras:** DSL proprietária (lock-in); curva de aprendizado; comunidade ainda pequena; reportar bugs é lento.
- **Maturidade:** Produção para MVPs · 13k+ stars
- **Como usar no app.tarefas:** só se virar **MVP solo**. Como tem equipe pequena e tipagem é prioridade, escolha Vite + Hono + Drizzle manual > Wasp.
- **Nota:** 5/10

### 🟢 create-tsi (CLI genérico)

- **Link:** https://github.com/tsi-cc/create-tsi
- **Categoria:** Templates fullstack
- **Prós:** Templates variados (Express, Fastify, Hono, NestJS, Next.js) com setup idêntico: TS + Zod + Drizzle + Docker. Útil para padronizar.
- **Contras:** Menos popular; comunidade pequena; alguns templates sem manutenção recente.
- **Maturidade:** Intermediário
- **Como usar no app.tarefas:** se quiser bootstrap do `apps/api` rápido com Hono + Drizzle + Zod + Docker pré-configurados.
- **Nota:** 7/10

---

## 2. UI kit e componentes acessíveis

### 🟢 shadcn/ui

- **Link:** https://ui.shadcn.com/ · https://github.com/shadcn-ui/ui
- **Categoria:** UI kit (copy-paste)
- **Prós:** 5M+ base installs, 80k+ stars. Componentes prontos via CLI (`npx shadcn@latest add button`). Tailwind + Radix **ou** Base UI desde julho/2026. Registry ecosystem (qualquer um publica componentes).
- **Contras:** Copy-paste não tem versionamento (mas updates são opcionais via CLI). Para usar com React Router / Vite puro, às vezes precisa de config manual.
- **Maturidade:** Produção · mantido ativamente
- **Como usar no app.tarefas:** rodar `npx shadcn@latest init` no projeto novo. Adicionar Button, Input, Dialog, Sheet, Tabs, DropdownMenu, Avatar, Badge, Tooltip. Para o board kanban, construir manualmente sobre `@dnd-kit` (shadcn não tem kanban pronto).
- **Nota:** 9/10

### 🟢 Radix UI Primitives

- **Link:** https://www.radix-ui.com/primitives · https://github.com/radix-ui/primitives
- **Categoria:** Primitivas acessíveis headless
- **Prós:** Combobox, Select, Dialog, etc. com WAI-ARIA completo. TypeScript-first. Padrão da indústria. 5M+ downloads/semana.
- **Contras:** Lançamentos desaceleraram depois da aquisição pela WorkOS. Componentes que o Base UI já tem (Combobox, Autocomplete) podem vir só em um dos lados.
- **Maturidade:** Produção · estável
- **Como usar no app.tarefas:** usar via shadcn/ui (camada de estilo). Para componentes custom (ex: KanbanCard), encapsular Radix primitives.
- **Nota:** 9/10 (via shadcn)

### 🟢 Base UI (default novo do shadcn)

- **Link:** https://base-ui.com/ · https://github.com/mui/base-ui
- **Categoria:** Primitivas acessíveis headless
- **Prós:** Sucessor moderno do Radix pelo time MUI. Tem Combobox, Autocomplete, Signature Pad que Radix não tem. 1.6.0 estável, 6M weekly downloads. API mais consistente.
- **Contras:** Ecossistema menor; algumas primitivas (Toast) ainda em alpha; menos exemplos prontos.
- **Maturidade:** Produção · adotado rápido pelo shadcn (2:1 vs Radix em new projects)
- **Como usar no app.tarefas:** já é o default do shadcn. Para dropdowns/form selects complexos, ter componente pronto é vantagem real.
- **Nota:** 8/10

### 🟢 Park UI

- **Link:** https://park-ui.com/ · https://github.com/ParkUI/park-ui
- **Categoria:** UI multi-framework
- **Prós:** Estende shadcn/ui para React + Vue + Solid. Componentes via Ark UI (XState para lógica). Panda CSS (CSS-in-JS moderno).
- **Contras:** Estilo Panda CSS é controverso (prefira Tailwind). Muito menor ecossistema.
- **Maturidade:** Intermediário
- **Como usar no app.tarefas:** **não usar agora**. Se um dia virar multi-frontend, reavaliar.
- **Nota:** 5/10

### 🟢 Ark UI

- **Link:** https://ark-ui.com/ · https://github.com/chakra-ui/ark
- **Categoria:** Primitivas stateful
- **Prós:** State machines via XState; 45+ componentes; suporta 3 frameworks; semanas de bugs corrigidos antes de chegar ao Park UI.
- **Contras:** Sem estilo (precisa de outro layer); boilerplate inicial maior.
- **Maturidade:** Produção · 5k+ stars
- **Como usar no app.tarefas:** só se quiser componentes com state machine explícita (ex: Wizard de criação de task multi-step).
- **Nota:** 7/10

### 🟢 Lucide React / Heroicons / Phosphor

- **Link:** https://lucide.dev/ · https://heroicons.com/ · https://phosphoricons.com/
- **Categoria:** Ícones SVG
- **Prós:** Lucide (fork do Feather, 5k+ icons), Heroicons (Tailwind team), Phosphor (6 weights). Tree-shakable, SVGs prontos.
- **Contras:** Misturar ícones em uma tela fica bagunçado.
- **Maturidade:** Produção · usado em todo lugar
- **Como usar no app.tarefas:** `lucide-react` é a escolha default — leve, consistente com Tailwind, suportado pelo shadcn.
- **Nota:** 9/10 (Lucide); 8/10 (Heroicons); 8/10 (Phosphor)

---

## 3. Drag-and-drop para quadro Kanban

### 🟢 @dnd-kit

- **Link:** https://docs.dndkit.com/ · https://github.com/clauderic/dnd-kit
- **Categoria:** DnD para React
- **Prós:** 2.8M weekly downloads, 6KB core, TypeScript-first, sortable preset pronto, accessible (keyboard + screen reader). Funciona em mobile com PointerSensor. Suporta kanban board com `DndContext` + `SortableContext`.
- **Contras:** Curva de aprendizado moderada; tem rebuild em andamento (v7) que pode ter breaking changes.
- **Maturidade:** Produção · usado por Linear, Vercel
- **Como usar no app.tarefas:** **escolha principal** para o board MVP. Recipe oficial: `DndContext` (columns horizontais) + `SortableContext` (cards em cada coluna) + `DragOverlay`. Persistir reorder com **fractional indexing** (lib `fractional-indexing`) em vez de float no banco.
- **Nota:** 9/10

### 🟢 @atlaskit/pragmatic-drag-and-drop

- **Link:** https://atlassian.design/components/pragmatic-drag-and-drop · https://github.com/atlassian/pragmatic-drag-and-drop
- **Categoria:** DnD framework-agnostic
- **Prós:** 4KB, usado em Jira/Confluence reescritos. Performance excelente a escala (milhares de items). Suporta drag de arquivos/texto externos. Zero opiniões — você constrói animações.
- **Contras:** Você constrói animações/collision detection/handles do zero; docs escassas; comunidade nova.
- **Maturidade:** Produção Atlassian (não é hobby project)
- **Como usar no app.tarefas:** overkill no MVP; reavaliar se virar >1000 tasks no board e a UX do dnd-kit mostrar limite.
- **Nota:** 8/10 (avançado); 6/10 (MVP)

### 🟢 dnd-kit/extensions

- **Link:** https://github.com/Clauderic/react-beautiful-dnd (deprecated — predecessor) · https://github.com/sarahdayan/dnd-kit-sortable-tree
- **Categoria:** Extensões para dnd-kit
- **Prós:** Adiciona tree, sortable tree, drag-and-drop com virtual lists.
- **Contras:** Comunidade fragmentada; qualidade varia.
- **Maturidade:** Misto
- **Como usar no app.tarefas:** só se for usar subtasks em formato árvore. Não recomendado para MVP.
- **Nota:** 5/10

### 🟢 HTML5 Drag and Drop API

- **Link:** https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- **Categoria:** Nativa do browser
- **Prós:** Zero dependências.
- **Contras:** UX ruim (sem animações smooth), mobile quebrado, acessibilidade fraca, hacks por browser.
- **Maturidade:** Padrão web estável
- **Como usar no app.tarefas:** **evitar**. dnd-kit é 1 dia a mais de setup, semanas economizadas em suporte mobile + a11y.
- **Nota:** 2/10

### 🟢 fractional-indexing (lib)

- **Link:** https://github.com/rocicorp/fractional-indexing
- **Categoria:** Algoritmo de ordenação
- **Prós:** Reordenação O(1) sem reescrever posições, base do Figma/Linear para drag em listas enormes.
- **Contras:** Conceitualmente mais complexo que float; precisa de testes cuidadosos com tons de caracteres.
- **Maturidade:** Produção · Rocicorp/Zero
- **Como usar no app.tarefas:** armazenar `position` em `tasks` como `text` em vez de `float`. Migration simples. Permite drag sem `UPDATE` em massa.
- **Nota:** 9/10

---

## 4. Auth e gestão de usuários

### 🟢 Better Auth

- **Link:** https://www.better-auth.com/ · https://github.com/better-auth/better-auth
- **Categoria:** Auth library self-hosted
- **Prós:** 27k+ stars, v1.6.9, 2.3M weekly downloads. TypeScript-first, 30+ plugins (OAuth, 2FA TOTP, passkeys, magic link, organizations/RBAC, impersonation, rate limit, audit log). Adapters Drizzle/Prisma/MongoDB. Sem vendor lock-in.
- **Contras:** Requer você manter dados de auth; auth UI é por sua conta (mas shadcn tem template de forms).
- **Maturidade:** Produção · migrando para v1.7+
- **Como usar no app.tarefas:** **escolha principal**. Configurar com adapter Drizzle + Postgres. Ativar plugins: `emailPassword`, `social({ providers: [github, google] })`, `magicLink`, `twoFactor`, `organization` (multi-tenant!), `passkey`. Schemas viram migration Drizzle.
- **Nota:** 10/10

### 🟢 Auth.js v5 (ex-NextAuth)

- **Link:** https://authjs.dev/ · https://github.com/nextauthjs/next-auth
- **Categoria:** Auth library self-hosted
- **Prós:** Padrão de mercado há anos, 24k+ stars, 3.7M weekly downloads. 80+ providers OAuth prontos.
- **Contras:** v5 ainda beta (5.0.0-beta.31); majoritariamente Next.js (server components); sem multi-tenancy nativo; sem 2FA TOTP/Passkey robusto.
- **Maturidade:** Produção em v4, beta em v5
- **Como usar no app.tarefas:** se um dia migrar para Next.js, ótimo caminho. Em Hono + SPA, não é a escolha natural.
- **Nota:** 7/10 (v5); 8/10 (Next.js stack)

### 🟢 Clerk

- **Link:** https://clerk.com/ · https://github.com/clerk/clerk-sdk-js
- **Categoria:** Auth SaaS
- **Prós:** DX imbatível, UI components prontos, organizations/RBAC out of the box, webhooks, billing-friendly B2B. 1.1M downloads/semana, v7.2.5.
- **Contras:** Pago depois do free tier (custo escala com MAU). Vendor lock-in alto (dados dos users na Clerk).
- **Maturidade:** Produção · referência de mercado para SaaS rápido
- **Como usar no app.tarefas:** se quiser ignorar auth e focar no produto por 3 meses. Para o app.tarefas (produto consumidor com objetivo de longo prazo), Better Auth é mais sensato financeiramente.
- **Nota:** 7/10 (custo); 9/10 (DX)

### 🟢 Stack Auth

- **Link:** https://stack-auth.com/ · https://github.com/stack-auth/stack
- **Categoria:** Auth self-hostable open-source
- **Prós:** Managed dashboard gratuito, self-hostable, drop-in replacement do Clerk open-source. UI components prontos.
- **Contras:** Comunidade menor (~3k stars); versão 1 ainda finalizando.
- **Maturidade:** Produção em beta · mantido
- **Como usar no app.tarefas:** se quiser UX do Clerk sem pagar — bom meio termo. Compete diretamente com Better Auth + shadcn form customizado.
- **Nota:** 7/10

### 🟢 Supabase Auth

- **Link:** https://supabase.com/auth · https://github.com/supabase/supabase-js
- **Categoria:** Auth integrado ao BaaS
- **Prós:** Se já usa Supabase como DB, vem grátis. RLS nativo no Postgres. OAuth + magic link prontos.
- **Contras:** Vendor lock-in no DB (ir para Supabase inteiro ou sair de tudo). Para Neon/Postgres puro, é overhead.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** **não usar** — você escolheu Neon + Drizzle puro. Use Better Auth.
- **Nota:** 6/10 (genérico); 4/10 (na nossa stack)

### 🟢 oslo (auth utilities) + Arctic (OAuth providers)

- **Link:** https://oslojs.dev/ · https://arcticjs.dev/
- **Categoria:** Auth utilities low-level
- **Prós:** Sucessores educacionais da Lucia. TypeScript-only, sem dependências. Arctic: 50+ OAuth providers prontos.
- **Contras:** Você implementa quase tudo do zero (sessions, hashing, 2FA).
- **Maturidade:** Estável (já que Lucia é "estável" como recurso educacional)
- **Como usar no app.tarefas:** se quiser entender auth profundamente ou se Better Auth não couber. ~3-5x mais código.
- **Nota:** 6/10 (didático); 4/10 (produtividade)

---

## 5. ORM e banco de dados

### 🟢 Drizzle ORM

- **Link:** https://orm.drizzle.team/ · https://github.com/drizzle-team/drizzle-orm
- **Categoria:** ORM TypeScript
- **Prós:** SQL-first (você sabe SQL, sabe Drizzle). Sem codegen (tipos inferem do schema TS). Bundle pequeno, cold start instantâneo em edge. Migrations SQL transparentes. Suporte a Postgres/MySQL/SQLite.
- **Contras:** Comunidade ainda crescendo vs Prisma. Algumas agregações complexas você escreve SQL puro.
- **Maturidade:** Produção · Drizzle Kit + drizzle-orm 0.30+
- **Como usar no app.tarefas:** **escolha padrão**. Schema em `packages/db/schema/`, migrations via `drizzle-kit generate` + `drizzle-kit migrate`. Relacionamentos via `relations()` API.
- **Nota:** 10/10

### 🟢 Prisma 7

- **Link:** https://www.prisma.io/ · https://github.com/prisma/prisma
- **Categoria:** ORM TypeScript
- **Prós:** Schema declarativo em `.prisma` (lê como documento), 50k+ stars, máximo de abstração, melhor DX para quem não conhece SQL.
- **Contras:** Requer `prisma generate` antes do build; historicamente pesado em serverless (mitigado em v7 com rewrite para TS puro). Vendor forte de SQL.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** se a equipe for 100% TypeScript-first e quiser migrations geradas automaticamente. Para app.tarefas, Drizzle é a escolha mais leve.
- **Nota:** 8/10 (geral); 7/10 (para nossa stack)

### 🟢 Kysely

- **Link:** https://kysely.dev/ · https://github.com/kysely-org/kysely
- **Categoria:** Query builder TypeScript
- **Prós:** SQL builder puro (zero mágica), 6k+ stars, type-safe sem runtime, perfeito para equipes SQL-fluent.
- **Contras:** Sem migrations embutidas (precisa de par adicional). Sem relations API (precisa escrever joins manuais).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** se você abandonar Drizzle em algum momento e quiser SQL puro. Alternativa sólida.
- **Nota:** 7/10

### 🟢 Drizzle Kit

- **Link:** https://orm.drizzle.team/docs/kit-overview
- **Categoria:** Migrations CLI
- **Prós:** Gera SQL das mudanças no schema Drizzle. `drizzle-kit generate` → `drizzle-kit migrate`. Suporta introspecção de DB existente.
- **Contras:** Algumas mudanças complexas (renomear coluna) você escreve SQL manual.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** toda migration vai em `packages/db/migrations/0001_init.sql`. CI roda `migrate` em DB test para validar.
- **Nota:** 10/10

### 🟢 Neon (hosting)

- **Link:** https://neon.tech/ · https://github.com/neondatabase/neon
- **Categoria:** Postgres serverless
- **Prós:** Separates compute e storage, branching por PR (excelente para previews), free tier robusto, cold start < 1s.
- **Contras:** Latência inicial de conexão (connection pooling é essencial); alguns extensions Postgres faltando.
- **Maturidade:** Produção · mantido por Microsoft (adquirida 2024)
- **Como usar no app.tarefas:** **escolha padrão**. Usar `@neondatabase/serverless` driver + `neon-pool` para queries com pouca latência.
- **Nota:** 9/10

### 🟢 Supabase (alternativa ao Neon)

- **Link:** https://supabase.com/ · https://github.com/supabase/supabase
- **Categoria:** Postgres + storage + auth + realtime
- **Prós:** Tudo-em-um (DB, auth, storage, realtime, edge functions). RLS nativo. Self-hostable.
- **Contras:** Acopla-se bastante (RLS policy vira parte do app). Para app.tarefas, separação de camadas é preferível.
- **Maturidade:** Produção · referência de mercado
- **Como usar no app.tarefas:** como **comparador**. Se preferir gerenciar tudo num lugar, ótimo. Aqui, separar Neon + Better Auth + R2 dá mais flexibilidade.
- **Nota:** 7/10

### 🟢 Upstash Redis

- **Link:** https://upstash.com/ · https://github.com/upstash/upstash-redis
- **Categoria:** Redis serverless
- **Prós:** Pay-per-request, edge replication, drivers TS oficiais. Free tier generoso.
- **Contras:** Latência variável; alguns comandos Redis não suportados (TLS-only).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** rate-limit, cache de queries quentes, BullMQ backend.
- **Nota:** 9/10

### 🟢 Meilisearch / Postgres FTS

- **Link:** https://www.meilisearch.com/ · https://www.postgresql.org/docs/current/textsearch.html
- **Categoria:** Full-text search
- **Prós:** Postgres FTS sem custo extra (GIN index + `to_tsvector`). Meilisearch quando precisar de typo-tolerance e latência <50ms.
- **Contras:** Postgres FTS com pt-BR precisa de dicionário custom ou extensão `pg_trgm`.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Sprint 6 do V1, Postgres FTS com tokenização pt-BR (`tsvector` + `'portuguese'`). Escalar para Meilisearch só se >100k tasks.
- **Nota:** 8/10 (Postgres FTS MVP); 9/10 (Meilisearch escala)

---

## 6. Filas/jobs e notificações

### 🟢 BullMQ

- **Link:** https://docs.bullmq.io/ · https://github.com/taskforcesh/bullmq
- **Categoria:** Queue/Workers
- **Prós:** 1M+ weekly downloads, padrão de mercado desde 2019, Redis-native, prioridades, rate-limit, repeat jobs, cron, flow (DAG). Self-hosted, full control.
- **Contras:** Precisa de Redis (Upstash/ElastiCache); workers são processos separados (não rola bem em serverless puro).
- **Maturidade:** Produção · mantido ativamente (v5.70+)
- **Como usar no app.tarefas:** **escolha padrão**. `recurrence-engine` worker materializa próximas ocorrências. `notifications` worker envia emails (Resend) e push (Web Push API). `cleanup` worker remove audit logs antigos.
- **Nota:** 10/10 (com Redis disponível); 7/10 (em serverless)

### 🟢 Inngest

- **Link:** https://www.inngest.com/ · https://github.com/inngest/inngest
- **Categoria:** Durable functions as a Service
- **Prós:** Event-driven, roda dentro da Next.js function (sem worker separado), `step.sleep` para multi-step, fan-out nativo, retries automáticos, self-hostable.
- **Contras:** Vendor cloud primeiro; custo escala com steps; free tier 5K steps/mês.
- **Maturidade:** Produção · YC-backed
- **Como usar no app.tarefas:** **alternativa ao BullMQ** se ficar em Vercel/Cloudflare. Em Fly.io/Railway, BullMQ é melhor.
- **Nota:** 8/10 (Vercel); 6/10 (Fly.io)

### 🟢 Trigger.dev v3

- **Link:** https://trigger.dev/ · https://github.com/triggerdotdev/trigger.dev
- **Categoria:** Background jobs framework
- **Prós:** TypeScript-first, jobs como código normal, v3 remove timeout serverless (workers longos de horas), Apache 2.0 (open source + self-host), integrations built-in (OpenAI, Resend, Slack). Free 5K runs/mês.
- **Contras:** Mais opinionated que BullMQ; comunidade menor.
- **Maturidade:** Produção · v3 estável
- **Como usar no app.tarefas:** se for fazer upload de anexos grandes ou processar PDFs (anexos V1), Trigger.dev v3 evita timeout da Vercel.
- **Nota:** 8/10

### 🟢 Hatchet

- **Link:** https://hatchet.run/ · https://github.com/hatchet-dev/hatchet
- **Categoria:** Workflow orchestrator
- **Prós:** DAG-based, streaming step outputs, priority lanes, self-hostable, sem vendor lock-in.
- **Contras:** Comunidade menor; docs menos maduras.
- **Maturidade:** Produção · mantido
- **Como usar no app.tarefas:** se virar AI pipelines complexos (sugestões de tasks, resumos), Hatchet é a escolha. Para MVP, overkill.
- **Nota:** 6/10 (MVP); 8/10 (AI workloads)

### 🟢 Resend

- **Link:** https://resend.com/ · https://github.com/resend/resend-nodejs
- **Categoria:** Email API
- **Prós:** API simples (TypeScript-first), React Email components, free tier 3K/mês, deliverability boa.
- **Contras:** Vendor cloud; preços sobem com volume.
- **Maturidade:** Produção · YC-backed
- **Como usar no app.tarefas:** emails transacionais: signup, reset senha, atribuição de task, resumo diário.
- **Nota:** 9/10

### 🟢 React Email

- **Link:** https://react.email/ · https://github.com/resend/react-email
- **Categoria:** Templates de email em React
- **Prós:** Componentes React para emails (Button, Container, Section). Render para HTML client-side. Tem preview in-dev.
- **Contras:** Limitações de estilização de email (client CSS ruim); algumas plataformas de email quebram.
- **Maturidade:** Produção · mantido
- **Como usar no app.tarefas:** templates de email transacional no app.tarefas (signup, atribuição, vencimento).
- **Nota:** 9/10

### 🟢 Web Push API + web-push lib

- **Link:** https://github.com/web-push-libs/web-push
- **Categoria:** Browser push
- **Prós:** Gratuito, sem vendor, supporta Chrome + Firefox + Edge + Safari (16+). VAPID auth.
- **Contras:** Setup chato (chaves VAPID, service worker); iOS Safari só push desde 16.4.
- **Maturidade:** Padrão web estável
- **Como usar no app.tarefas:** V2 (mobile + notificações push). Sprint 4 do V1 já prepara (subscription store).
- **Nota:** 8/10

---

## 7. Testes (unit/integration/e2e)

### 🟢 Vitest

- **Link:** https://vitest.dev/ · https://github.com/vitest-dev/vitest
- **Categoria:** Unit/Integration test runner
- **Prós:** 10x mais rápido que Jest, mesmo DX, watch mode nativo com Vite, ESM nativo, cobertura Istanbul/V8, suporte a TypeScript out-of-box, API compatível com Jest.
- **Contras:** Algumas libs assumem Jest (raro).
- **Maturidade:** Produção · mantido
- **Como usar no app.tarefas:** **escolha padrão**. `pnpm test` roda unit + integration. Setup trivial com Vite.
- **Nota:** 10/10

### 🟢 Playwright

- **Link:** https://playwright.dev/ · https://github.com/microsoft/playwright
- **Categoria:** E2E test runner
- **Prós:** Multi-browser (Chromium, Firefox, WebKit), paralelo por padrão, locators resilientes, trace viewer excelente, suporta mobile emulation.
- **Contras:** Setup de browsers via `npx playwright install` (~300MB); testes mais lentos que unit.
- **Maturidade:** Produção · Microsoft-maintained
- **Como usar no app.tarefas:** **escolha padrão** para E2E. Smoke tests no CI + nightly full run.
- **Nota:** 10/10

### 🟢 Testing Library / @testing-library/react

- **Link:** https://testing-library.com/ · https://github.com/testing-library/react-testing-library
- **Categoria:** Component tests
- **Prós:** Testa comportamento do usuário, não implementação. Funciona com Vitest. Padrão comunitário.
- **Contras:** Requer browser env (happy-dom ou jsdom); alguns bugs com React 19 (mitigação recente).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** testes de componentes individuais. Para UI complexa (KanbanBoard), combina com Playwright.
- **Nota:** 9/10

### 🟢 MSW (Mock Service Worker)

- **Link:** https://mswjs.io/ · https://github.com/mswjs/msw
- **Categoria:** API mocking
- **Prós:** Intercepta `fetch` no browser e `node` no server. Mesma fixture pros dois. Standard de fato.
- **Contras:** Setup de handlers boilerplate-y.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** tests de componentes que dependem de TanStack Query. Para testes E2E, mock mínimo (real network).
- **Nota:** 9/10

### 🟢 Testcontainers (Node)

- **Link:** https://testcontainers.com/ · https://github.com/testcontainers/testcontainers-node
- **Categoria:** Integration test infra
- **Prós:** Sobe Postgres/Redis/etc em Docker real durante tests. Sem mocks frágeis. CI-friendly (precisa de Docker).
- **Contras:** Requer Docker; testes mais lentos (~10s setup); custo de execução.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** tests de routers tRPC, migrations, FTS, índices. CI service com Docker.
- **Nota:** 9/10

### 🟢 happy-dom

- **Link:** https://github.com/capricorn86/happy-dom
- **Categoria:** DOM emulation para tests
- **Prós:** Bem mais rápido que jsdom, suficiente para React/Vue tests. 
- **Contras:** Compatibilidade limitada com APIs que só browser suporta.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** `environment: 'happy-dom'` no vitest.config.ts para tests de componentes.
- **Nota:** 9/10 (alternativa ao jsdom)

### 🟢 axe-core / Playwright accessibility

- **Link:** https://github.com/dequelabs/axe-core
- **Categoria:** Accessibility testing
- **Prós:** Verifica WCAG 2.1 AA automaticamente. Integra com Playwright/Testing Library.
- **Contras:** Não detecta todos os bugs a11y (só 30-40%); precisa auditoria humana também.
- **Maturidade:** Produção · mantido
- **Como usar no app.tarefas:** DoD para mudanças de UI. PR comment com violações `serious/critical` falha o check.
- **Nota:** 8/10

---

## 8. Observabilidade e logging

### 🟢 Sentry

- **Link:** https://sentry.io/ · https://github.com/getsentry/sentry-javascript
- **Categoria:** APM / Error monitoring
- **Prós:** Errors + Performance + Releases + Replay. Free tier 5K eventos/mês. Source maps automáticos via `@sentry/vite-plugin`. Correlação por `release` (commit SHA).
- **Contras:** Vendor; preço escala com volume; dados vão para servidor deles (LGPD: verificar DPA).
- **Maturidade:** Produção · referência de mercado
- **Como usar no app.tarefas:** capturar erros backend (Hono middleware) e frontend (React ErrorBoundary). Configurar `release: COMMIT_SHA`. Alertar no Slack quando erro 5xx > 1% em 5min.
- **Nota:** 9/10

### 🟢 Pino

- **Link:** https://github.com/pinojs/pino
- **Categoria:** Logger estruturado
- **Prós:** Mais rápido logger Node (50k logs/s). JSON nativo, child loggers, pluggable transport.
- **Contras:** Configuração inicial maior; logs "feios" sem `pino-pretty`.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** logger default do backend (Hono + pino-http middleware). Formato JSON para prod, pretty para dev.
- **Nota:** 9/10

### 🟢 Better Stack (Logs + Status Page)

- **Link:** https://betterstack.com/
- **Categoria:** Log management + Uptime
- **Prós:** Ingest de logs estruturados, query em tempo real, alertas, status page pública. Free tier generoso.
- **Contras:** Vendor; free tier tem limite de retenção.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** enviar logs Pino via `@logtail/pino`. Status page em `status.app.tarefas.com.br`.
- **Nota:** 8/10

### 🟢 Axiom (alternativa ao Better Stack)

- **Link:** https://axiom.co/ · https://github.com/axiomhq/axiom-js
- **Categoria:** Log analytics
- **Prós:** Queries com SQL-like (Axiom Processing Language), ingest rápido, integração nativa com Vercel/Cloudflare.
- **Contras:** Vendor; comunidade menor; pricing opaco.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** se estiver em Cloudflare Workers, melhor escolha; se Node puro, Better Stack.
- **Nota:** 7/10

### 🟢 OpenTelemetry

- **Link:** https://opentelemetry.io/ · https://github.com/open-telemetry/opentelemetry-js
- **Categoria:** Standard de tracing
- **Prós:** Vendor-neutral. Tracing distribuído (frontend → backend → DB). Suporte oficial de todos os vendors.
- **Contras:** Setup inicial verboso. Curva de aprendizado.
- **Maturidade:** Produção · CNCF graduated
- **Como usar no app.tarefas:** V2 — instrumentar Hono + tRPC + TanStack Query com `OTel`. Exportar para Sentry ou Honeycomb.
- **Nota:** 8/10 (longo prazo); 5/10 (MVP)

### 🟢 HyperDX (alternativa open source ao Sentry + Datadog)

- **Link:** https://github.com/hyperdxio/hyperdx
- **Categoria:** Observability all-in-one (open source)
- **Prós:** Logs + Metrics + Traces + Session Replay. Compatível com ClickHouse (own-data). Open source.
- **Contras:** UI menos polida; precisa de infra própria.
- **Maturidade:** Beta em produção
- **Como usar no app.tarefas:** se quiser evitar vendor lock-in em escala.
- **Nota:** 7/10

---

## 9. Deploy (Vercel/Render/Fly/Railway)

### 🟢 Cloudflare Pages

- **Link:** https://pages.cloudflare.com/
- **Categoria:** Frontend hosting
- **Prós:** Edge global, gratuita, HTTPS automático, custom domain grátis, suporta GH Pages-source já em uso no projeto.
- **Contras:** Build time-limit 20min em free; sem SSR/ISR nativo (Vite é SPA).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** **alternativa ao GH Pages** quando quiser CDN melhor e analytics. Migração trivial (mudar source nas Settings).
- **Nota:** 9/10

### 🟢 Fly.io (Apps + Postgres se quiser)

- **Link:** https://fly.io/ · https://github.com/superfly/flyctl
- **Categoria:** Backend hosting
- **Prós:** Multi-região fácil (deploy em FRA, GRU, NRT), app machines, free tier até 3 shared-cpu-1x, Postgres opcional (`fly postgres`).
- **Contras:** Precisa Dockerfile; free tier limitado; complexo para apps simples.
- **Maturidade:** Produção · referência para Node + Postgres
- **Como usar no app.tarefas:** **escolha padrão** para a API Hono. `fly launch` gera Dockerfile, `fly deploy` publica.
- **Nota:** 9/10

### 🟢 Railway

- **Link:** https://railway.com/ · https://github.com/railwayapp/cli
- **Categoria:** Backend hosting
- **Prós:** DX excelente (1-click deploy from GitHub), Postgres disponível, secrets management, volumes.
- **Contras:** Pago desde 2024 (free tier reduzido); lock-in em Postgres provider.
- **Maturidade:** Produção · boa escolha para MVPs
- **Como usar no app.tarefas:** **alternativa ao Fly.io** se preferir UX. Integração com GitHub em segundos.
- **Nota:** 8/10 (DX); 7/10 (custo)

### 🟢 Render

- **Link:** https://render.com/
- **Categoria:** Backend hosting
- **Prós:** Free tier para web services (com spin-down após inatividade), Postgres disponível, integra com GitHub.
- **Contras:** Free tier com cold start de 15min+ (inviável para produção real); performance mediana.
- **Maturidade:** Produção · boa escolha para apps internos
- **Como usar no app.tarefas:** só se budget for zero. Para produto, Fly/Railway > Render.
- **Nota:** 7/10 (geral); 5/10 (produção real)

### 🟢 Vercel

- **Link:** https://vercel.com/
- **Categoria:** Frontend hosting
- **Prós:** Padrão para Next.js. Edge cache global, deployment via GitHub, preview URLs por PR.
- **Contras:** Vendor; custo escala com bandwidth; suporte Node completo mas tudo via serverless (timeout 10s hobby).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** se um dia migrar para Next.js. Em Vite puro, Cloudflare Pages é mais simples.
- **Nota:** 8/10 (Next.js); 7/10 (Vite puro)

### 🟢 Hetzner / Coolify / Dokku (self-hosted)

- **Link:** https://www.hetzner.com/ · https://coolify.io/ · https://dokku.com/
- **Categoria:** Self-hosted
- **Prós:** Custo previsível (Hetzner VPS), controle total, sem vendor lock.
- **Contras:** Você opera tudo (updates, security patches, backups).
- **Maturidade:** Produção · requer mais conhecimento
- **Como usar no app.tarefas:** quando >10k MAU e custo Fly+Neon começar a doer. Coolify é o "Heroku self-hosted" ideal.
- **Nota:** 7/10 (operacional)

### 🟢 Neon (DB hosting) — já em uso parcial na curadoria

- **Link:** https://neon.tech/
- **Categoria:** Postgres serverless
- (Veja seção 5 acima)
- **Para o app.tarefas:** usar `@neondatabase/serverless` driver + `neon-http` para queries rápidas.

### 🟢 GH Pages — já em uso

- **Link:** https://pages.github.com/
- **Categoria:** Frontend hosting
- **Status:** Já deployado.
- **Limitação:** falta edge cache e analytics avançados. Migrar para Cloudflare Pages em V2.
- **Nota:** 7/10 (atual); 10/10 (como base inicial gratuita)

---

## 10. Templates de GitHub Actions para CI/CD

### 🟢 actions/checkout

- **Link:** https://github.com/actions/checkout
- **Categoria:** Checkout action (oficial)
- **Prós:** Mantida por GitHub, padrão da indústria. `actions/checkout@v4` com `fetch-depth: 0` para changelog.
- **Contras:** Nenhum.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** primeiro step de todo workflow.
- **Nota:** 10/10

### 🟢 actions/setup-node

- **Link:** https://github.com/actions/setup-node
- **Categoria:** Setup Node (oficial)
- **Prós:** cache de `node_modules`/`~/.npm` automático. `node-version-file: .nvmrc` para versionar.
- **Contras:** Sem matrizes complexas (use estratégia).
- **Maturidade:** Production
- **Como usar no app.tarefas:** já em uso no `deploy.yml`. Adicionar a `ci.yml` também.
- **Nota:** 10/10

### 🟢 pnpm/action-setup

- **Link:** https://github.com/pnpm/action-setup
- **Categoria:** Setup pnpm (oficial)
- **Prós:** Resolve versão do pnpm por `package.json` ou `packageManager` field. Configura registry e store.
- **Maturidade:** Produção · oficial pnpm
- **Como usar no app.tarefas:** quando virar monorepo com pnpm, adicionar a todos os jobs.
- **Nota:** 10/10

### 🟢 arduino/setup-task

- **Link:** https://github.com/arduino/setup-task
- **Categoria:** Setup Task runner
- **Prós:** alternativa ao `npm-run-all`. Não relevante aqui.
- **Nota:** 5/10

### 🟢 docker/build-push-action

- **Link:** https://github.com/docker/build-push-action
- **Categoria:** Docker build+push
- **Prós:** Build multi-platform, cache via BuildKit/GHA, push para GHCR/ECR/Docker Hub.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Sprint 0 (deploy-api.yml) — build da imagem Docker do backend.
- **Nota:** 9/10

### 🟢 superfly/flyctl-actions

- **Link:** https://github.com/superfly/flyctl-actions
- **Categoria:** Deploy Fly.io action
- **Prós:** Action oficial do Fly.io para deploy em CI. Login via `FLY_API_TOKEN`.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Sprint 0 (deploy-api.yml).
- **Nota:** 9/10

### 🟢 aws-actions/configure-aws-credentials

- **Link:** https://github.com/aws-actions/configure-aws-credentials
- **Categoria:** AWS auth action
- **Prós:** Padrão para deploy em AWS (ECR, ECS, Lambda).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** **só se** migrar para AWS (não no MVP).
- **Nota:** 8/10 (genérico)

### 🟢 release-please-action

- **Link:** https://github.com/googleapis/release-please-action
- **Categoria:** Release automation
- **Prós:** Mantida pelo Google, Conventional Commits nativo, gera changelog, abre PR de release. Funciona com múltiplos pacotes (monorepo).
- **Contras:** Curva de aprendizado para configs de monorepo.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** a partir da V1, automatizar releases. Configurar `release-please-config.json` em `apps/api` e `apps/web`.
- **Nota:** 9/10

### 🟢 octokit/request-action

- **Link:** https://github.com/octokit/request-action
- **Categoria:** Generic GitHub API action
- **Prós:** Permite chamar qualquer API GitHub em workflow (criar issues, labels, comentários).
- **Maturidade:** Produção
- **Como usar no app.tarefas:** automações (auto-label, stale issues, sync com projetos).
- **Nota:** 8/10

### 🟢 github/codeql-action

- **Link:** https://github.com/github/codeql-action
- **Categoria:** Security scanning (oficial GitHub)
- **Prós:** SAST oficial do GitHub, detecta vulns em JS/TS. Free para repos públicos.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** `.github/workflows/codeql.yml` no MVP. Bloqueia merge se encontrar `critical`.
- **Nota:** 9/10

### 🟢 anchorcms/dependabot-action ou dependabot.yml

- **Link:** https://docs.github.com/en/code-security/dependabot
- **Categoria:** Dependabot config (oficial)
- **Prós:** Update automático de deps + alertas CVE, integra com code scanning.
- **Maturidade:** Produção
- **Como usar no app.tarefas:** `.github/dependabot.yml` desde o dia 0. Auto-merge para patch (com CI verde).
- **Nota:** 10/10

---

## Matriz final — Top picks por categoria

| Categoria | Escolha primária | Nota | Quando reconsiderar |
|-----------|-------------------|------|---------------------|
| **Boilerplate** | TanStack Start + tRPC + Drizzle | 9 | Se virar Next.js → T3 Stack |
| **UI kit** | shadcn/ui (Base UI default) | 9 | Equipe prefere component library pronta → Mantine |
| **Drag-drop** | dnd-kit + fractional-indexing | 9 | >1000 tasks/board → Pragmatic DnD |
| **Auth** | Better Auth | 10 | Foco total em produto até virar scale → Clerk |
| **ORM** | Drizzle | 10 | Equipe SQL-fluent + query builder → Kysely |
| **Jobs** | BullMQ + Upstash | 10 | Vercel-only → Inngest · AI → Trigger.dev v3 |
| **Tests** | Vitest + Playwright + MSW + Testcontainers | 10 | — |
| **Obs** | Sentry + Pino + Better Stack | 9 | Vendor-sensitive → HyperDX self-hosted |
| **Deploy Front** | Cloudflare Pages (HOJE: GH Pages) | 9 | Next.js → Vercel |
| **Deploy Back** | Fly.io | 9 | UX-first → Railway · Vercel-only → Inngest |
| **CI/CD** | GitHub Actions + release-please + dependabot | 10 | Monorepo → Turbo remote cache |

---

## Recomendações específicas para app.tarefas

Se tivesse que escolher **uma stack pronta para o MVP funcional em 1 semana**, seria:

```typescript
// Frontend
React 19 + TypeScript + Vite 6 + Tailwind v4
+ TanStack Router + TanStack Query
+ shadcn/ui (Base UI) + Lucide React
+ dnd-kit + fractional-indexing
+ Vitest + Testing Library + Playwright

// Backend
Hono + Node 22 LTS + tRPC + Drizzle ORM
+ Better Auth (plugins: organization, twoFactor, magicLink)
+ Postgres 16 on Neon
+ BullMQ + Upstash Redis
+ Resend + React Email
+ Pino + Sentry + Better Stack

// Infra
GitHub Actions + Dependabot + CodeQL
+ release-please
+ GH Pages (front MVP) → Cloudflare Pages (V1)
+ Fly.io (API MVP)
+ Docker + testcontainers (CI)
```

Tudo open-source exceto alguns SaaS gerenciados (Resend, Better Stack, Sentry free tier, Upstash free tier, Neon free tier). Custo mensal estimado para **MVP com 1k usuários ativos**: **~$0–50** até 5k MAU, escala.

---

## Próximos passos práticos

1. **Sprint 0 — Fundação:** adicionar Better Auth + Drizzle + Postgres (Neon) ao projeto atual; manter frontend Vite.
2. **Validar carry-over:** rodar `npm i drizzle-orm better-auth bullmq` num branch experimental; ver se o bundle size do front ainda cabe (<80 KB gzip).
3. **Atualizar docs/CURATION.md** quando uma decisão arquitetural mudar (especialmente porque shadcn e Better Auth evoluem rápido).
4. **Marcar recursos que não usaremos** com `not-applicable` e mover pra seção "Arquivados" para evitar ruído.
