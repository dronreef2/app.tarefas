# app.tarefas — Arquitetura, Roadmap e Backlog

> Documento vivo. Última atualização: 2026-07-08.
> Mantido por: time de produto & engenharia.
> Stack atual frontend: React 19 + TypeScript + Vite + Tailwind v4 (deploy em GH Pages).

---

## 0. Resumo executivo

O **app.tarefas** é um gerenciador de tarefas moderno, rápido e escalável, voltado para usuários individuais e equipes pequenas. O produto prioriza **experiência do usuário**, **performance** e **segurança**, com **deploy contínuo** desde o primeiro commit.

| Fase | Janela | Entrega |
|------|--------|---------|
| **MVP** | 2 semanas | Auth, workspaces, projetos, tarefas (CRUD), board kanban básico. |
| **V1** | +6 semanas | Recorrência, etiquetas, checklist, comentários, atividade, notificações, compartilhamento. |
| **V2** | +3 meses | Colaboração em tempo real, PWA, integrações, IA opcional. |

A decisão central é **monorepo TypeScript end-to-end** com contrato único de tipos entre cliente e servidor, reduzindo erros de contrato em 50–80% em projetos de CRM/tarefas (experiência de mercado).

---

## 1. Decisões de arquitetura (com trade-offs)

### 1.1 Stack frontend

| Camada | Decisão | Alternativas | Por quê |
|--------|---------|--------------|---------|
| Framework | **React 19** | Vue 3, Svelte, Solid | Ecosistema maduro, time já domina. React 19 Server Components ainda opcionais. |
| Bundler | **Vite 6** | Turbopack, Rspack, Next.js | HMR instantâneo, builds rápidos, já em uso. |
| Linguagem | **TypeScript estrito** | JS, JSDoc | TS end-to-end é restrição do projeto. |
| Estilização | **Tailwind CSS v4** | Vanilla CSS, CSS Modules, styled-components | Velocidade de prototipação, design system coerente. v4 usa CSS-first (sem `tailwind.config.js`). |
| Roteamento | **TanStack Router** | React Router v7, Next.js | Type-safe por padrão, code splitting granular, file-based opcional. Suporta search params validados. |
| Server state | **TanStack Query** | SWR, RTK Query | Cache padronizado, retries, prefetch, invalidação por chave. |
| Client state | **Zustand** | Redux Toolkit, Jotai, Context | API mínima, sem boilerplate, fácil de testar. Para UI state local, use `useReducer`/`useState`. |
| Formulários | **React Hook Form + Zod** | Formik, conform | Tipos compartilhados com o backend (Zod inferre `z.infer`). |
| Componentes | **Radix UI primitives** + **shadcn-style** (copy-paste em `src/components/ui/`) | Headless UI, shadcn/ui CLI, Mantine | Acessibilidade WAI-ARIA nativa; estilo 100% nosso; componentes vivem no repo (Fast Refresh feliz). |
| i18n | **i18next + react-i18next** | Lingui, FormatJS | Suporte a namespaces, lazy-load por rota, ICU plurals. |
| Datas | **date-fns + @date-fns/locale pt-BR** | Luxon, Day.js | Tree-shakable, sem timezone frágil. Para UTC↔local, `date-fns-tz` ou Luxon. |
| Testes | **Vitest (unit) + Playwright (e2e) + Testing Library** | Jest, Cypress | Vitest é 10× mais rápido e zero-config com Vite; Playwright é multi-browser e estável. |
| Kanban / DnD | **dnd-kit** + **fractional-indexing** | Pragmatic DnD, react-beautiful-dnd (deprecado) | Padrão React 2026 (2.8M dl/sem, TS-first, acessível, usado por Linear/Vercel). Reordenação O(1) com fractional indexing (mesmo approach do Figma/Linear). |

**Trade-off escolhido — TanStack Router vs React Router:**
✅ TanStack Router força a tipagem de search params e path params, evitando `useParams<string>()` que retorna `string | undefined`. Custo: comunidade menor, docs menos maduras. Justificativa: o resto do stack já é type-first, vale manter o contrato.

### 1.2 Stack backend

| Camada | Decisão | Alternativas | Por quê |
|--------|---------|--------------|---------|
| Runtime | **Node 22 LTS** | Bun, Deno | APIs estáveis, ecossistema, suporte corporativo. Bun é alternativa para V2. |
| Framework | **Hono** | Fastify, Express, NestJS | Edge-ready (Cloudflare Workers, Vercel, Node), type-first, middleware moderno. Para Apps em Node, Fastify é o backup. |
| API | **tRPC v11** | REST + OpenAPI, GraphQL | Tipos compartilhados com o cliente, validação com Zod, refactor seguro. Para integrações externas, gerar REST por cima de procedures tRPC (REST opcional). |
| ORM | **Drizzle ORM** | Prisma, Kysely, raw SQL | Tipos inferidos do schema, migrations SQL puro, zero runtime, melhor performance que Prisma. |
| Validação | **Zod 4** | TypeBox, Valibot | Standard de facto, parsing síncrono disponível, inferência de tipos perfeita. |
| Auth | **Better Auth** (self-hosted, framework-agnostic) | Clerk, Auth0, Auth.js, Lucia | **NOTA 2025:** Lucia foi descontinuada em mar/2025 e virou recurso educacional. Better Auth é o padrão atual (27k⭐, 2.3M dl/sem, plugins para organization/RBAC, 2FA, passkey, magic link, OAuth, audit log). Adapters para Drizzle/Prisma. Sem vendor lock-in. |
| Background jobs | **BullMQ + Redis** | pg-boss, Temporal | BullMQ é o padrão da indústria. Para MVP, sem jobs assíncronos — só quando entrar recorrência e notificações. |
| Email | **Resend** | Postmark, SES | API simples, DX excelente, free tier robusto. |
| Push | **Web Push API + VAPID** | OneSignal, Pusher | Custo zero, nativo. Para V2. |

**Trade-off escolhido — tRPC vs REST:**
✅ tRPC elimina o OpenAPI como única fonte de verdade (se virar problema, dá pra exportar via `trpc-openapi` na V1). Para integrações futuras com terceiros (ex: Zapier), gerar fachada REST thin que mapeia para procedures. Custo: taxa de transmissão maior em alguns cenários; mas para app de tarefas, tráfego é baixo.

### 1.3 Banco de dados e migrations

| Camada | Decisão | Alternativas | Por quê |
|--------|---------|--------------|---------|
| Banco principal | **PostgreSQL 16** | MySQL, SQLite, Mongo | Triggers, CTEs, FTS, JSONB, índices avançados. |
| Hosting DB | **Neon** (serverless Postgres) | Supabase, RDS, Railway | Cold start agressivo, branching por PR (excelente para preview environments). |
| Migrations | **drizzle-kit** | Prisma migrate, raw SQL | Migrations SQL transparente, versionadas em `db/migrations/`. |
| Cache | **Redis (Upstash)** | Memcached, Vercel KV | Rate-limit, sessões, hot keys. Upstash tem free tier e edge. |
| Search (V1) | **Postgres FTS** + índice GIN | Meilisearch, Algolia | Suficiente até 100k tarefas; migrar só se precisar. |
| Search (V2) | **Meilisearch** se > 100k tasks | — | Latência sub-50ms, typo-tolerance. |

**Política de migrations:**
- Toda migration é **forward + backward compatível** (sem `ALTER TABLE DROP COLUMN` sem expand-contract).
- Migrations passam por CI no Postgres de desenvolvimento; falha → bloqueia PR.
- Backfills via scripts SQL idempotentes em `db/backfills/`.

### 1.4 Autenticação e autorização

- **Auth:** email/senha + OAuth (Google, GitHub) + TOTP 2FA opcional.
- **Sessões:** cookie httpOnly + Secure + SameSite=Lax + signed (HMAC); rotação após login.
- **RBAC por workspace:** roles `owner`, `admin`, `member`, `guest` — escopo por workspace, não global.
- **Tenancy:** toda query de leitura/escrita é escopada por `workspaceId` derivado do token, nunca do body. Política em middleware do Hono.
- **Rate limit:** token bucket por IP (60 req/min) e por user (200 req/min) com Redis.

### 1.5 Observabilidade

| Camada | Decisão | Custo | Por quê |
|--------|---------|-------|---------|
| Logs estruturados | **Pino** → **Better Stack / Axiom** | Free tier | Latência sub-1ms, JSON nativo, query em tempo real. |
| APM | **Sentry** (frontend + backend) | Free tier até 5k eventos/mês | Errors, traces, releases, replay. Correlaciona commit ↔ issue. |
| Uptime | **Better Stack** | Free tier para 1 monitor | Status pública em `status.app.tarefas.com`. |
| Tracing | **OpenTelemetry** (V2) | — | Padrão da indústria, vendor-neutral. |

### 1.6 Hosting e CI/CD

| Componente | Decisão | Por quê |
|-----------|---------|---------|
| Frontend | **Cloudflare Pages** | CDN global, gratuita, suporta GH Pages-source. |
| Backend | **Fly.io** (Node 22) | Latência baixa, multi-região fácil. Alternativa: **Railway**. |
| DB | **Neon** | Serverless, branching por PR. |
| Workers | **Fly.io machines** (BullMQ) ou Cloudflare Queues (V2) | — |
| CI | **GitHub Actions** | Já em uso, integração nativa. |
| Versioning | **release-please** + Conventional Commits | Automação total de changelog e versionamento. |

**Trade-off escolhido — Cloudflare Pages vs GH Pages:**
Mantemos GH Pages para o staging (já em uso). Para produção, mover para Cloudflare Pages permite edge cache, custom domain e analytics. Migração trivial: troca de "Source" nas Settings → Pages.

### 1.7 Segurança

| Vetor | Mitigação |
|-------|-----------|
| XSS | Tailwind + React (escape por padrão). Sem `dangerouslySetInnerHTML` sem sanitização (DOMPurify). |
| CSRF | Token por sessão + SameSite=Strict/Lax. tRPC suporta CSRF token nativo. |
| SQLi | Drizzle ORM usa queries parametrizadas. Zero raw SQL sem revisar. |
| Auth bypass | Middleware em todas as rotas; verificação de `workspaceId` server-side em toda mutation. |
| Rate limit | Redis token bucket; limites específicos para endpoints sensíveis (login, export). |
| Secrets | `.env` local; secrets em GitHub Secrets + Doppler/Vault. Nunca commitar `.env`. |
| LGPD | Export de dados do usuário (LGPD art. 18), soft-delete 30 dias, logs anonimizados, DPIA em `docs/legal/`. |

---

## 2. Estrutura de pastas sugerida (monorepo)

```
app.tarefas/
├── apps/
│   ├── web/                         # React frontend
│   │   ├── src/
│   │   │   ├── components/         # Componentes reutilizáveis (shadcn/Radix)
│   │   │   ├── features/           # Features (tasks, projects, auth)
│   │   │   │   ├── tasks/
│   │   │   │   ├── projects/
│   │   │   │   └── auth/
│   │   │   ├── routes/             # TanStack Router
│   │   │   ├── lib/                # Clients, hooks, utils
│   │   │   ├── stores/             # Zustand stores
│   │   │   ├── i18n/               # pt-BR base + en (V2)
│   │   │   ├── styles/             # CSS, design tokens
│   │   │   ├── main.tsx
│   │   │   └── root.tsx
│   │   ├── public/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── e2e/                # Playwright
│   │   ├── vite.config.ts
│   │   ├── playwright.config.ts
│   │   └── package.json
│   │
│   └── api/                         # Backend Hono
│       ├── src/
│       │   ├── routes/             # tRPC routers (task, project, user...)
│       │   ├── services/           # Regras de negócio
│       │   ├── db/                 # Queries + drizzle client
│       │   ├── auth/               # Lucia + OAuth
│       │   ├── lib/                # logger, errors, rate-limit
│       │   ├── trpc/               # Procedimentos compartilhados
│       │   └── index.ts            # Hono app entry
│       ├── tests/
│       │   ├── unit/
│       │   └── integration/        # Testcontainers (Postgres real)
│       ├── drizzle.config.ts
│       └── package.json
│
├── workers/                         # Background jobs (V1)
│   └── src/
│       ├── recurrence.ts
│       └── notifications.ts
│
├── packages/
│   ├── shared/                      # Tipos/Zod schemas (compartilhados web+api)
│   │   ├── src/
│   │   │   ├── schemas/            # task.schema.ts, project.schema.ts
│   │   │   ├── types/
│   │   │   └── i18n/               # Mensagens base
│   ├── db/                          # Schema Drizzle
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── seed.ts
│   └── ui/                          # Design system compartilhado
│       └── src/                    # Button, Input, Card...
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # lint + type-check + test em PR
│   │   ├── deploy-web.yml          # Pages (já em uso)
│   │   ├── deploy-api.yml          # Fly.io (V1)
│   │   ├── release-please.yml      # versão automática
│   │   └── nightly.yml             # backups, smoke tests
│   └── ISSUE_TEMPLATE/
│
├── docker/
│   ├── Dockerfile.api
│   └── docker-compose.dev.yml      # Postgres + Redis local
│
├── infra/                           # Pulumi/Terraform (V2)
│   └── README.md
│
├── docs/
│   ├── ARCHITECTURE.md              # este documento
│   ├── ROADMAP.md                   # sprints detalhados
│   ├── BACKLOG.md                   # issues priorizadas
│   ├── ADR/                         # Architecture Decision Records
│   └── legal/
│       └── DPIA.md                  # DPIA / LGPD
│
├── .env.example
├── package.json                     # workspace root (pnpm)
├── pnpm-workspace.yaml
├── turbo.json                       # pipeline cache/build
└── README.md
```

**Notas:**
- **pnpm workspaces** com **Turborepo** para build cache e pipeline.
- `packages/shared` é a única fonte de verdade de tipos Zod.
- `apps/web` atual (Vite simples) é a raiz atual; quando virar monorepo, mover `src/`, `public/`, `index.html` para `apps/web/`.

---

## 3. Modelo de dados (Drizzle + Postgres)

### 3.1 Entidades principais

```
users (id, email, name, image, password_hash, totp_secret, locale, timezone, created_at)
   │
   ├── workspace_members (workspace_id, user_id, role, joined_at)  ← RBAC
   │
   └── sessions (id, user_id, expires_at, ip, user_agent)

workspaces (id, name, slug, plan, created_by, created_at)
   │
   ├── projects (id, workspace_id, name, color, icon, archived_at, created_at)
   │      │
   │      ├── tasks (id, project_id, parent_id, title, description, status, priority,
   │      │          due_at, started_at, completed_at, created_by, assigned_to,
   │      │          recurrence_id, position, created_at, updated_at)
   │      │      │
   │      │      ├── task_assignees (task_id, user_id)             ← N:N
   │      │      ├── task_labels (task_id, label_id)               ← N:N
   │      │      ├── checklist_items (id, task_id, text, done, position)
   │      │      ├── comments (id, task_id, author_id, body, edited_at)
   │      │      └── attachments (id, task_id, url, mime, size)   ← V1
   │      │
   │      └── labels (id, project_id, name, color)
   │
   ├── activities (id, workspace_id, actor_id, verb, target_type, target_id,
   │                metadata jsonb, created_at)                    ← trilha de auditoria
   │
   ├── recurrence_rules (id, task_id, freq, interval, count, until, byweekday)
   │
   └── notifications (id, user_id, type, payload jsonb, read_at, created_at)

audit_logs (id, actor_id, action, resource_type, resource_id, before jsonb, after jsonb, created_at)
   # log global, append-only, separado de activities (atividades = visíveis ao usuário;
   # audit_logs = trilha legal/forense)
```

### 3.2 Detalhes críticos

| Tabela | Decisão | Justificativa |
|--------|---------|---------------|
| `tasks.id` | **ULID** (`26 chars`) | Ordenável, sem sequência contígua (vazamento de uso). |
| `tasks.position` | float (BigInt em V2 para escala) | Reordenação com drag sem reescrever todas. |
| `tasks.due_at` | timestamptz **+** `timezone` do usuário | Datas seguras entre fusos. |
| `tasks.recurrence_id` | FK opcional | null = sem recorrência. |
| `workspaces.plan` | enum(`free`, `pro`) | Quotas por plano. |
| `activities.metadata` | jsonb | Flexível para diferentes tipos de eventos. |
| `audit_logs` | **append-only** sem UPDATE permission no role da app | Integridade forense. |
| `comments.edited_at` | nullable; **edits são imutáveis** com `body` original em tabela separada (`comment_revisions`) | LGPD: rastreio de edições. |

### 3.3 Índices essenciais

```sql
CREATE INDEX idx_tasks_project_status ON tasks (project_id, status, position);
CREATE INDEX idx_tasks_assigned_to_due ON tasks (assigned_to, due_at) WHERE status != 'done';
CREATE INDEX idx_activities_workspace_created ON activities (workspace_id, created_at DESC);
CREATE INDEX idx_tasks_fts ON tasks USING gin (to_tsvector('portuguese', title || ' ' || description));
CREATE INDEX idx_sessions_user ON sessions (user_id, expires_at);
```

---

## 4. Regras de negócio

### 4.1 Status e prioridade

| Status | Comportamento |
|--------|---------------|
| `todo` | Estado inicial. Editável livremente. |
| `doing` | Marca `started_at = now()` na primeira transição. Visível no board. |
| `done` | Marca `completed_at = now()`. Excluído do inbox "minhas tarefas". |
| `archived` | Soft-delete; fora de queries por padrão. |

> **Não usar** um status `blocked` separado no MVP — usar **etiqueta** ou comentário travado.

| Prioridade | Valor | Efeito |
|------------|-------|--------|
| `low` | 0 | Sem destaque. |
| `normal` | 1 | Padrão. |
| `high` | 2 | Borda amarela + ordem alfabética. |
| `urgent` | 3 | Borda vermelha, **opt-in** para notif push. |

### 4.2 Vencimento

- Datas armazenadas em UTC; renderizadas no fuso do usuário.
- Avisos: 24h antes, 1h antes, ao vencer (configurável em Settings).
- Tarefas atrasadas com `due_at < now() AND status != 'done'` exibem badge "Atrasada".
- Tasks sem `due_at` nunca disparam aviso.

### 4.3 Responsáveis

- N:N (`task_assignees`); uma task sem assignee é "qualquer um".
- Ao atribuir, gera notificação in-app + email (configurável pelo destinatário).
- Owner do workspace sempre pode reatribuir; member só nas próprias tasks ou onde ele é admin do projeto.

### 4.4 Recorrência (V1)

- Implementada como **RRULE simplificado** (`rrule.js` lib).
- Config: freq (daily/weekly/monthly/yearly), interval, count (max 365) ou until (data), byweekday (L,M,T...), bymonthday.
- Worker diário às 03:00 UTC materializa a próxima ocorrência e fecha a anterior; tolerância de drift com `dtstart`.
- Edge case: se task original for deletada, ocorrências futuras também são; se for completada manualmente fora do ciclo, mantém próxima ocorrência normalmente.
- **Não** usar `node-cron` direto no worker — usar BullMQ scheduled jobs.

### 4.5 Notificações (V1)

| Tipo | Canal | Default |
|------|-------|---------|
| Atribuição | in-app + email | ON |
| Comentário na sua task | in-app + email | ON |
| Menção (@) | in-app + email + push | ON |
| Tarefa próxima do vencimento | email | ON |
| Tarefa atrasada | email diário resumo | ON |
| Resumo semanal (Seg 08:00 local) | email | OFF por default |

Respeitar **quiet hours** do usuário (config global, default 22:00–07:00 local).

### 4.6 Trilha de auditoria

- **Atividades** (visível): toda mutation vira `activities row` com `verb` semântico (`task.created`, `task.status_changed`, `comment.added`, `task.assigned`).
- **Audit logs** (interno): toda mutation grava `before/after` jsonb; nunca exposto via UI normal.
- Retenção: 24 meses para audit logs; indefinido para activities.
- Export LGPD: `GET /api/v1/me/export` retorna JSON com tudo do usuário em até 7 dias.

---

## 5. API spec (tRPC + fachada REST opcional)

### 5.1 Padrão de naming

- **Routers tRPC** em `apps/api/src/routes/*.ts`.
- **Procedures** nomeadas no particípio passado: `task.create`, `task.update`, `task.delete`, `task.list`.
- **Inputs** validados com Zod em `packages/shared/schemas/`.
- **Outputs** com `z.object({ ... })`; nunca retorna entity cru sem seleção explícita.

### 5.2 Exemplo tRPC — `task.create`

```ts
// packages/shared/src/schemas/task.schema.ts
export const TaskCreateInput = z.object({
  projectId: z.string().ulid(),
  title: z.string().min(1).max(200),
  description: z.string().max(10_000).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  assigneeIds: z.array(z.string()).max(20).default([]),
  labelIds: z.array(z.string()).max(50).default([]),
  dueAt: z.coerce.date().optional(),
});

export type TaskCreateInput = z.infer<typeof TaskCreateInput>;

// apps/api/src/routes/task.ts
export const taskRouter = router({
  create: workspaceProcedure
    .input(TaskCreateInput)
    .mutation(async ({ ctx, input }) => {
      // ctx.workspaceId, ctx.userId garantidos pelo middleware
      const task = await ctx.db.transaction(async (tx) => {
        const t = await tx.insert(tasks).values({
          ...input,
          createdBy: ctx.userId,
          workspaceId: ctx.workspaceId,
          status: 'todo',
        }).returning();

        if (input.assigneeIds.length) {
          await tx.insert(taskAssignees).values(
            input.assigneeIds.map(uid => ({ taskId: t[0].id, userId: uid }))
          );
        }

        await tx.insert(activities).values({
          workspaceId: ctx.workspaceId,
          actorId: ctx.userId,
          verb: 'task.created',
          targetType: 'task',
          targetId: t[0].id,
        });

        return t[0];
      });

      // side-effect: notificar (assíncrono via worker)
      await ctx.notifications.taskCreated(task.id);

      return task;
    }),
});
```

### 5.3 Fachada REST (para integrações externas)

Para Zapier/Make/etc., expor via `trpc-openapi` (plugin tRPC):

```http
POST /api/v1/tasks
Authorization: Bearer tsk_xxx
Content-Type: application/json

{
  "projectId": "01JABCDEF...",
  "title": "Implementar login com Google",
  "priority": "high",
  "assigneeIds": ["usr_01JABC..."],
  "dueAt": "2026-07-15T17:00:00Z"
}

→ 201 Created

{
  "id": "tsk_01JABCD...",
  "url": "https://app.tarefas.com/t/tsk_01JABCD...",
  "createdAt": "2026-07-08T21:30:00Z"
}
```

**Schemas:**
- POST `/api/v1/tasks` — criar
- GET `/api/v1/projects/{projectId}/tasks?status=todo&assignee=me` — listar
- PATCH `/api/v1/tasks/{id}` — atualizar parcial
- DELETE `/api/v1/tasks/{id}` — soft-delete (status=archived)
- POST `/api/v1/tasks/{id}/comments` — comentar

### 5.4 Versionamento

- Versão na URL (`/api/v1/`) → ciclo de deprecation de 12 meses.
- Versão no header de resposta `X-API-Version: 1.0.0`.
- Changelog público em `/docs/changelog`.

---

## 6. Estratégia de testes

### 6.1 Pirâmide

```
              ▲
             ╱ ╲
            ╱   ╲          E2E (Playwright)      ~30 cenários críticos
           ╱─────╲         - login, criar task, board, mobile
          ╱       ╲        - smoke pós-deploy
         ╱─────────╲       Integração (Vitest + Testcontainers)  ~100 casos
        ╱           ╲      - routers tRPC com Postgres real
       ╱─────────────╲     - migrations, índices, FTS
      ╱               ╲    Unit (Vitest)                          ~500+ testes
     ╱─────────────────╲   - serviços, schemas Zod, lib utils
```

### 6.2 Metas de cobertura

| Camada | Meta linhas | Meta branches |
|--------|-------------|---------------|
| `packages/shared` (Zod) | 100% | 100% |
| `apps/api/services` | 90% | 85% |
| `apps/api/routes` | 85% | 80% |
| `apps/web/features` | 75% | 70% |
| Global | 80% | 75% |

### 6.3 Critérios de aceite (template)

**Dado/Quando/Então** — obrigatório em toda issue:

```markdown
**Cenário:** [nome descritivo]

Dado que [contexto inicial]
E [contexto adicional se necessário]
Quando [ação do usuário]
Então [resultado esperado]

E [resultado secundário]
Mas [resultado que NÃO deve acontecer]
```

**Exemplo real:**

```markdown
**Cenário:** Criar task atribuída dispara notificação

Dado que sou membro do workspace "Engenharia"
E existe um projeto "Sprint 12"
E existe um usuário "alice@example.com"
Quando eu envio:
  mutation task.create({
    projectId: "...",
    title: "Deploy v1.0",
    priority: "high",
    assigneeIds: ["usr_alice"]
  })
Então a task é criada com status "todo"
E uma notification row é inserida para alice (type=task_assigned)
E alice recebe um email de atribuição
E activities registra verb="task.created", verb="task.assigned"
E nada é exposto a workspaces onde eu não sou membro
```

### 6.4 Definition of Done (DoD)

- [ ] Branch atualizada com `main`
- [ ] Lint (ESLint) sem warnings
- [ ] Type-check (`tsc -b --noEmit`) sem erros
- [ ] Testes unitários passam; coverage não cai
- [ ] Testes E2E passam (se impacta UI)
- [ ] Migration testada em DB local (se aplicável)
- [ ] Docs/README atualizados
- [ ] PR com pelo menos 1 aprovação
- [ ] CI verde (todas as verificações)
- [ ] Crachá de accessibility: axe-core sem violações `serious/critical` (para mudanças de UI)

---

## 7. CI/CD no GitHub Actions

### 7.1 Workflows

| Arquivo | Trigger | Função |
|---------|---------|--------|
| `ci.yml` | PR + push em `main` | lint + type-check + unit + integration + e2e + coverage |
| `deploy-web.yml` | push em `main` | build → Pages (já em uso) |
| `deploy-api.yml` | push em `main` (V1) | build Docker → push GHCR → deploy Fly.io |
| `release-please.yml` | push em `main` | SemVer + changelog + tag + release |
| `nightly.yml` | cron `0 3 * * *` | testes E2E full + snapshot visual + backup DB dump |

### 7.2 Stages do CI

```yaml
jobs:
  lint:
    steps: [setup-node, npm ci, npm run lint]

  type-check:
    steps: [setup-node, npm ci, npm run type-check]

  unit-test:
    steps: [setup-node, npm ci, npm run test:unit -- --coverage]

  integration-test:
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: test }
        options: --health-cmd pg_isready
    steps: [setup-node, npm ci, npm run test:integration]

  e2e-test:
    steps: [setup-node, npm ci, npx playwright install, npm run test:e2e]

  build:
    needs: [lint, type-check, unit-test, integration-test]
    steps: [setup-node, npm ci, npm run build]
```

### 7.3 Versionamento

- **Conventional Commits** obrigatório (validação via `commitlint` em husky pre-commit).
- **release-please** monitora `main`; a cada push com mensagens convencionais, abre/fecha release PR com versão bumpada e changelog.
- Tags geradas automaticamente; **SemVer** (`MAJOR.MINOR.PATCH`).
- Branch protection: `main` exige 1 aprovação, CI verde, conventional commit.

---

## 8. Métricas e KPIs

### 8.1 Performance (frontend)

| Métrica | Alvo | Ferramenta |
|---------|------|------------|
| **LCP** (Largest Contentful Paint) | < 1.5s (75p) | Lighthouse CI, Sentry Performance |
| **INP** (Interaction to Next Paint) | < 200ms (75p) | Web Vitals |
| **CLS** | < 0.05 (75p) | Web Vitals |
| **TTFB** | < 400ms (75p) | Sentry |
| **Bundle size** (JS gzip) | < 80 KB por rota | `size-limit` no CI |
| **API P95** | < 250ms | Sentry |

### 8.2 Negócio

| Métrica | Definição | Meta pós-V1 |
|---------|-----------|------|
| **Task completion rate** | tarefas concluídas / criadas na semana | > 60% |
| **WAU** (Weekly Active Users) | usuários únicos com 1+ ação na semana | > 1.000 |
| **D7 retention** | % usuários que voltam após 7 dias | > 25% |
| **Time-to-first-task** | tempo entre signup e primeira task criada | < 2 min (mediano) |
| **Adesão à recorrência** | % de tasks recorrentes completadas no prazo | > 70% |
| **NPS** | survey in-app | > 40 |

### 8.3 Confiabilidade

| Métrica | Meta |
|---------|------|
| Uptime | 99.9% (< 9h/ano) |
| Erro rate (5xx) | < 0.1% |
| MTTR (Mean Time To Recover) | < 30 min |
| MTTD (Mean Time To Detect) | < 5 min (via Sentry alert) |

---

## 9. Riscos técnicos e mitigação

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|---------------|---------|-----------|
| 1 | **Exposição acidental de dados cross-tenant** (bug de autorização) | Média | Crítico | Middleware de tenancy em todas as procedures + **testes de property** (fast-check) que tentam cross-tenant em todos os endpoints. Code review focado. |
| 2 | **Falha de migration em produção** | Baixa | Alto | Migrations forward+backward compat; CI roda migrations em DB efêmero; flag de feature para mudanças grandes. |
| 3 | **Vendor lock-in** (Cloudflare, Neon, etc.) | Baixa | Médio | Camada de abstração fina (DB client via Drizzle, file storage via interface); repositórios de adapters. |
| 4 | **Cost overrun** (Neon/Redis/Sentry escalam) | Média | Médio | Alertas de billing em 50%/80%/100%; cache agressivo; rate-limit por user/id. |
| 5 | **Colisão em colaboração simultânea** | Alta | Médio | MVP usa last-write-wins com `updated_at`; V2 migra para **Yjs/CRDT** para tasks e checklists. |
| 6 | **Fuso horário errado** em due dates | Alta | Alto | Sempre UTC; test com `vitest-timezones` cobrindo Austrália, Brasil, Japão. |
| 7 | **Spam de notificações** | Média | Médio | Quiet hours + grouping + opt-out granular; rate-limit por (user, type) no worker. |
| 8 | **LGPD: export/delete do usuário** incompleto | Média | Alto | Cron semanal verifica contas em `scheduledDeletion`; testes E2E garantem export contém todas as tabelas relevantes. |
| 9 | **Ataque de força bruta no login** | Alta | Alto | Rate-limit por IP+email no endpoint de login; lockout progressivo após 5 falhas; alerta de anomalia via Sentry. |
| 10 | **Bundle JS cresce sem controle** | Alta | Médio | `size-limit` no CI falha PR que aumentar +5% do budget; alerta visual no PR comment. |

---

## 10. Roadmap

### 10.1 MVP (Semanas 1–2)

**Objetivo:** usuário consegue criar conta, workspace, projeto e tarefas; tasks persistem e renderizam em board kanban.

#### Sprint 0 (Semana 1) — Fundação

- [ ] Setup monorepo (pnpm + Turborepo)
- [ ] Postgres + migrations iniciais (users, workspaces, projects, tasks)
- [ ] Backend Hono + Drizzle + Lucia (auth)
- [ ] Endpoints: signup, login, logout, /me
- [ ] Frontend: TanStack Router, TanStack Query, layout base
- [ ] i18n com pt-BR (100% de cobertura nos textos visíveis)
- [ ] Tailwind theme com tokens semânticos
- [ ] CI: lint + type-check + unit + smoke E2E
- [ ] Deploy: web em Pages, API em Fly.io (staging)
- [ ] Sentry + Better Stack integrados

#### Sprint 1 (Semana 2) — Tasks & Projects

- [ ] CRUD de workspaces + projects (settings page)
- [ ] CRUD de tasks (criar, editar, deletar soft)
- [ ] Lista + Board Kanban com drag-drop
- [ ] Status (todo/doing/done), prioridade, due_at
- [ ] Filtros: status, prioridade, due_date, assignee
- [ ] Atividades básicas (audit trail visível)
- [ ] Smoke E2E: signup → criar projeto → criar task → mover status
- [ ] Launch interno (alpha privado com 10 usuários)

**Saída do MVP:** sistema funcional para uso individual e times pequenos. Nada de recorrência, etiquetas, notificações além de email de boas-vindas.

### 10.2 V1 (Semanas 3–8)

| Sprint | Foco | Entregáveis chave |
|--------|------|-------------------|
| **Sprint 2** | Recorrência + etiquetas | RRULE engine, worker BullMQ, labels CRUD, filtros por label |
| **Sprint 3** | Checklists + comentários + anexos | Checklist (CRUD + posição), comentários (markdown + menções), upload S3/R2 para anexos |
| **Sprint 4** | Atividade + notificações | Feed de atividade por workspace, sistema de notificações in-app + email (Resend), quiet hours |
| **Sprint 5** | Compartilhamento + RBAC | Convite por email, roles (admin, member, guest), audit log interno, LGPD export |
| **Sprint 6** | Polish + search | Busca full-text em pt-BR, atalhos de teclado (`?` mostra help), mobile responsive, dark mode, accessibility (axe-core) |

**Saída da V1:** produto lançável em beta público. SLA 99.9%, paginação em todas as listas, mais de 100 tarefas por workspace testado.

### 10.3 V2 (Mês 3+)

| Tema | Descrição |
|------|-----------|
| Real-time | Yjs/CRDT para edição de tasks; presença online; notificações WebSocket |
| Offline | PWA com Service Worker; conflitos resolvidos com vector clocks simples |
| Mobile | App nativo React Native ou wrapper Capacitor |
| Integrações | Google Calendar, Slack, GitHub Issues, Linear, Zapier |
| IA | Sugerir prioridade, auto-categorizar, resumir backlog, "what should I do now?" |
| Marketplace | Templates de projetos (Sprint, OKR, GTD) compartilháveis |
| Plano Pro | Relatórios avançados, automações (ex: "quando assign → mover para doing"), API rate-limit maior |

---

## 11. Backlog priorizado (MoSCoW)

### MUST (MVP + V1) — sem isso não lança

#### MVP (Sprint 0–1)
1. **[AUTH-001] Signup/Login com email + senha**
2. **[AUTH-002] OAuth Google**
3. **[AUTH-003] Sessões httpOnly + rotação + logout**
4. **[DB-001] Schema inicial Drizzle + migrations**
4b. **[AUTH-001b] **Adotar Better Auth** (substitui Lucia — descontinuada em mar/2025). Plugins: `organization` (multi-tenant), `twoFactor` (TOTP), `magicLink`, OAuth Google/GitHub. Adapter Drizzle. Schemas viram migration Drizzle.**
5. **[WS-001] CRUD de workspace (criar, renomear, deletar)**
6. **[PROJ-001] CRUD de projeto (criar, arquivar, deletar)**
7. **[TASK-001] CRUD de task (criar, editar, deletar soft)**
8. **[TASK-002] Status kanban (todo/doing/done) com drag-drop**
9. **[TASK-003] Prioridade + due_at**
10. **[TASK-004] Assignee único**
11. **[OBS-001] Sentry + logs estruturados Pino**
12. **[CI-001] Pipeline PR (lint+type+test+build)**
13. **[DEPLOY-001] Web em Pages + API em Fly.io**
14. **[I18N-001] pt-BR 100% no MVP**

#### V1 (Sprint 2–6)
15. **[TASK-005] Recorrência (RRULE)**
16. **[LABEL-001] CRUD de etiquetas + filtros**
17. **[CHECK-001] Checklist (CRUD + position + done)**
18. **[CMT-001] Comentários com markdown + menções**
19. **[ATTACH-001] Upload de anexos**
20. **[ACT-001] Feed de atividades**
21. **[NOTIF-001] Notificações in-app + email**
22. **[NOTIF-002] Quiet hours + preferences**
23. **[AUTH-004] Convite por email + RBAC workspace**
24. **[AUTH-005] Roles (admin/member/guest) + testes de tenancy**
25. **[AUDIT-001] Log interno append-only**
26. **[LGPD-001] Export + delete de dados do usuário**
27. **[SEARCH-001] Full-text pt-BR**
28. **[A11Y-001] Lighthouse 95+ em todas as páginas**
29. **[SEC-001] Rate-limit + WAF rules**

### SHOULD — entram se o tempo permitir
30. **[TASK-006] Múltiplos assignees (N:N)**
31. **[TASK-007] Subtarefas (parent_id) + visualização**
32. **[CMT-002] Reactions em comentários (👍, 🎉, ⚠)**
33. **[OBS-002] OpenTelemetry tracing**
34. **[INTEGRATION-001] Webhook genérico por workspace**
35. **[KB-001] Atalhos de teclado completos**
36. **[DARK-001] Dark mode com toggle**

### COULD — V2
37. **[TASK-008] Real-time (Yjs/CRDT)**
38. **[TASK-009] Sugestão de prioridade por IA**
39. **[CAL-001] Integração Google Calendar (two-way)**
40. **[MOB-001] PWA offline-first**
41. **[CHAT-001] Comentários em tempo real com presença**

### WON'T (por enquanto) — documentado para futuro
- Comentários em threads aninhadas
- Dependência entre tasks (bloqueia/conclui)
- Time tracking / Pomodoro
- Captura por email (`task+xyz@app.tarefas.com`)
- Export PDF
- Boards com templates visuais customizados

---

## 12. Primeiras issues para GitHub

Abaixo, 12 issues propostas para criar no `dronreef2/app.tarefas` com título, descrição e critério de aceite. (Estão listadas com conteúdo completo no arquivo [`BACKLOG.md`](./BACKLOG.md) anexo.)

| # | Título | Sprint | Esforço | Label |
|---|--------|--------|---------|-------|
| 1 | Converter projeto em monorepo (pnpm + Turborepo) | S0 | M | `infra`,`foundation` |
| 2 | Adicionar Postgres + Drizzle ao backend | S0 | M | `db`,`foundation` |
| 3 | Implementar auth com Lucia (signup/login/logout) | S0 | M | `auth`,`backend` |
| 4 | Setup de observabilidade (Sentry + Pino + Better Stack) | S0 | S | `obs` |
| 5 | i18n com i18next (pt-BR como default) | S0 | S | `i18n`,`frontend` |
| 6 | CRUD de workspaces e projects | S1 | M | `core`,`backend` |
| 7 | CRUD de tasks com soft delete | S1 | M | `core`,`backend` |
| 8 | Board Kanban (drag-drop + status) | S1 | L | `feature`,`frontend` |
| 9 | Filtros por status/prioridade/due/assignee | S1 | M | `feature`,`frontend` |
| 10 | CI pipeline (lint + type + test) com cobertura | S0 | S | `ci`,`quality` |
| 11 | Deploy: API em Fly.io + DB em Neon | S0 | M | `deploy`,`infra` |
| 12 | Smoke E2E: signup → projeto → task | S1 | S | `e2e`,`quality` |

Cada issue inclui:
- **Título** + **Descrição** (contexto, abordagem, links)
- **Critério de aceite** (formato Dado/Quando/Então com 3-5 cenários)
- **Definition of Done** (checklist)
- **Estimativa** (S/M/L)

> Os arquivos com payload completo para criar via API estão em `docs/issues/json/*.json`. Se quiser que eu já crie via API, é só falar — leva <30s.

---

## 13. Decisões-chave em uma página (TL;DR)

| Pergunta | Resposta |
|----------|---------|
| Monorepo ou separado? | **Monorepo** (pnpm + Turborepo) |
| Frontend framework | **React 19 + TanStack Router + TanStack Query** |
| Backend framework | **Hono + Node 22 LTS** |
| API style | **tRPC** com fachada REST thin |
| ORM | **Drizzle** |
| DB | **Postgres 16** (Neon em produção) |
| Auth | **Lucia v3** self-hosted |
| Hosting | **Cloudflare Pages** (web), **Fly.io** (api), **Neon** (db) |
| CI/CD | **GitHub Actions** com release-please |
| Testes | **Vitest + Testcontainers + Playwright** |
| Observability | **Pino + Sentry + Better Stack** |
| i18n | **i18next + pt-BR base** |
| Recorrência | **rrule.js** + BullMQ worker |
| Estado do projeto | **Frontend Vite + TS + Kanban (dnd-kit) + shadcn-style UI** em GH Pages; backend é o próximo milestone |

---

## 14. Próximos passos concretos

1. **Revisão desta arquitetura** — devs full-stack + tech lead validam trade-offs.
2. **Decisão sobre monorepo** — mover código atual para `apps/web/` ou começar projeto novo? (Mais simples começar novo e importar.)
3. **Provisionar Neon + Fly.io** — testes de staging antes do Sprint 0.
4. **Criar issues no GitHub** — 12 issues prontas em `docs/issues/`. Posso criar via API em <30s.
5. **Stakeholder review do ROADMAP** — ajustar prazos e cortar SHOULD se a V1 apertar.

---

> _Mantido como living document. Toda ADR nova vira `docs/ADR/NNNN-titulo.md` linkada daqui._
