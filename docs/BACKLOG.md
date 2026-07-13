# Backlog do app.tarefas

> Issues priorizadas (MoSCoW) e prontas para serem criadas no GitHub.
> Stack de saída: Sprint 0 (Fundação) → Sprint 1 (MVP público) → V1 completa.

Legenda: **[M]** Must · **[S]** Should · **[C]** Could · **[W]** Won't.

---

## Sprint 0 — Fundação (Semana 1)

### [#1 · infra/infra] Converter projeto em monorepo (pnpm + Turborepo) · [M]

**Descrição**

Hoje o repositório contém apenas o frontend (Vite + React). Para suportar backend
Hono + workers BullMQ com tipos compartilhados, precisamos de monorepo.

**Abordagem**
- Mover código atual para `apps/web/`.
- Adicionar `apps/api/` (Hono + Drizzle + tRPC).
- Adicionar `packages/shared/` (Zod schemas + tipos compartilhados).
- Adicionar `packages/db/` (schema Drizzle + migrations).
- Configurar `pnpm-workspace.yaml` + `turbo.json`.
- Garantir que o CI (lint/type/test/build) rode em pipeline do Turborepo.

**Critérios de aceite**

```
Cenário: import cruzado entre packages
Dado que packages/shared/src/schemas/task.ts define TaskCreateInput
Quando apps/web/src/features/tasks/CreateTask.tsx o importa via 'app.tarefas/shared/schemas/task'
Então o tipo é inferido e o bundler não emite warning de "suboptimal imports"

Cenário: CI do Turborepo
Dado um PR que altera apps/web/src/components/TodoApp.tsx
Quando o CI roda
Então jobs de test+lint só rodam para apps/web e packages que ele depende (não em apps/api)
E o tempo total de CI cai em relação ao monorepo ingênuo

Cenário: build de produção
Dado que o CI dispara npm run build na raiz
Quando termina
Então apps/web/dist é gerado e apps/api/dist/index.js existe (cjs bundle, target node22)
```

**Definition of Done**
- [ ] Estrutura `apps/` e `packages/` criada
- [ ] `pnpm install` na raiz funciona
- [ ] `turbo run build` gera artefatos
- [ ] CI atualizado para pipeline do Turborepo
- [ ] README atualizado com a nova estrutura

**Estimativa:** M (4–8h)

---

### [#2 · db/foundation] Schema Postgres + Drizzle + migrations iniciais · [M]

**Descrição**

Provisionar Postgres (Neon em produção, docker-compose em dev) e criar o schema
inicial cobrindo usuários, workspaces, projetos, tasks, assignees e labels.

**Schema inicial:**

```ts
// packages/db/schema/index.ts
export const users = pgTable('users', {
  id: text('id').primaryKey(),   // ulid
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'), // null se OAuth-only
  totpSecret: text('totp_secret'),
  locale: text('locale').notNull().default('pt-BR'),
  timezone: text('timezone').notNull().default('America/Sao_Paulo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: text('plan').notNull().default('free'),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceMembers = pgTable('workspace_members', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  primaryKey({ columns: [workspaceId, userId] })
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull().default('#3b82f6'),
  icon: text('icon'),
  archivedAt: timestamp('archived_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo'),
  priority: text('priority').notNull().default('normal'),
  dueAt: timestamp('due_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdBy: text('created_by').notNull().references(() => users.id),
  assignedTo: text('assigned_to').references(() => users.id),
  position: doublePrecision('position').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Critérios de aceite**

```
Cenário: migration roda em DB limpo
Dado um Postgres vazio
Quando drizzle-kit migrate é executado
Então todas as tabelas acima existem com índices apropriados
E a função migrate é idempotente (rodar 2x não duplica)

Cenário: integridade referencial
Dado que tento inserir um task com projectId inexistente
Quando envio o insert
Então falha com FK violation

Cenário: cascade delete
Dado um projeto com 50 tasks
Quando o projeto é deletado
Então todas as 50 tasks são removidas (cascade)
```

**Definition of Done**
- [ ] docker-compose.dev.yml roda Postgres 16
- [ ] drizzle.config.ts configurado
- [ ] Migration inicial gerada e versionada
- [ ] Helper `getTestDb()` para Testcontainers
- [ ] Teste de FK violation
- [ ] Teste de cascade delete

**Estimativa:** M (6–10h)

---

### [#3 · auth] Implementar auth com Lucia (signup, login, logout, /me) · [M]

**Descrição**

Sistema de autenticação self-hosted usando Lucia v3, sessões httpOnly no Postgres,
hash de senha com Argon2id, middleware que injeta `user` e `workspaceId` no
contexto de cada request.

**Critérios de aceite**

```
Cenário: signup com email + senha
Dado que POST /api/v1/auth/signup recebe { email, password, name }
Quando todos os campos são válidos (Zod schema)
Então cria user com password_hash = argon2id(password)
E cria sessão, retorna sessionId em cookie httpOnly Secure SameSite=Lax
E resposta 201 com { user: { id, email, name } }

Cenário: signup com email já existente
Dado que já existe user com o email
Quando tento signup novamente
Então resposta 409 Conflict com mensagem genérica "Não foi possível criar a conta"

Cenário: login com credenciais erradas
Dado que a senha está incorreta
Quando POST /api/v1/auth/login
Então resposta 401 Unauthorized (sem indicar se email existe ou não)

Cenário: rate limit
Dado 6 tentativas de login inválidas do mesmo IP em 60s
Quando a 7a tentativa
Então resposta 429 Too Many Requests
```

**Definition of Done**
- [ ] Lucia v3 configurado com adapter Drizzle/Postgres
- [ ] Hash Argon2id (parâmetros: memory=64MB, time=3, parallelism=1)
- [ ] Middleware `authMiddleware` em `apps/api/src/auth/middleware.ts`
- [ ] Endpoint `/me` retorna user atual
- [ ] Rate-limit por IP (60/min) no login
- [ ] Testes E2E: signup, login, logout, refresh de sessão
- [ ] Documentação em `apps/api/src/auth/README.md`

**Estimativa:** M (8–12h)

---

### [#4 · obs] Observabilidade: Sentry + Pino + Better Stack · [M]

**Descrição**

Stack de observabilidade completa: logs estruturados JSON via Pino enviados para
Better Stack; erros frontend e backend capturados pelo Sentry; correlação por
`requestId` e `release` (commit SHA).

**Critérios de aceite**

```
Cenário: log estruturado em uma mutation
Dado um request POST /api/v1/tasks
Quando o handler completa
Então um log JSON é emitido com: requestId, userId, workspaceId, route, status, latencyMs

Cenário: erro 5xx capturado pelo Sentry
Dado que /api/v1/tasks throw um erro inesperado
Quando o middleware global captura
Então Sentry recebe evento com stack trace, request context e tags { workspaceId, route }
E o response ao cliente é 500 com requestId (não detalhes internos)

Cenário: erro no frontend
Dado um erro em React (render ou effect)
Quando ErrorBoundary captura
Então Sentry recebe evento com breadcrumbs e user context (se autenticado)
```

**Definition of Done**
- [ ] Sentry DSN configurado em backend e frontend (via env)
- [ ] Pino logger com `pino-pretty` em dev e JSON em prod
- [ ] Middleware `requestContextMiddleware` que injeta requestId (uuid v7)
- [ ] Frontend ErrorBoundary reportando ao Sentry
- [ ] Source maps enviados no build (Sentry CLI ou Vite plugin)
- [ ] Alertas: erro 5xx > 1% em 5min no Slack (via Sentry → Webhook)

**Estimativa:** S (4–6h)

---

### [#5 · i18n] i18next com pt-BR como default · [M]

**Descrição**

Setup de internacionalização com i18next, namespaces (`common`, `tasks`, `projects`,
`auth`, `errors`), pt-BR como idioma base (chave de fallback é o inglês, opcional).

**Critérios de aceite**

```
Cenário: todas as strings visíveis estão externalizadas
Dado que o app está em pt-BR
Quando audito o código
Então nenhum texto visível está hard-coded em JSX/TSX (fora de testes)
E cada string vem de t('namespace.key')

Cenário: troca de idioma em runtime
Dado que o usuário muda locale para en-US
Então o app re-renderiza com strings em inglês
E a escolha persiste em localStorage
```

**Definition of Done**
- [ ] i18next + react-i18next instalados
- [ ] Idiomes: pt-BR (default) + en-US
- [ ] Namespaces definidos
- [ ] Locale detectado do user profile → fallback `pt-BR`
- [ ] Teste: ausência de chaves em testes E2E

**Estimativa:** S (3–5h)

---

## Sprint 1 — Tasks e Projects (Semana 2)

### [#6 · core] CRUD de workspaces e projects · [M]

**Descrição**

Endpoints tRPC para gerenciar workspaces e projects dentro deles, com tenancy
estrita (workspaceId vem do contexto, nunca do body).

**Critérios de aceite**

```
Cenário: criar workspace
Dado que sou autenticado
Quando eu chamo trpc.workspace.create({ name: "Engenharia" })
Então o workspace é criado com createdBy = eu e slug único
E eu sou adicionado como member com role = "owner"

Cenário: workspace inválido
Dado que tento workspace.create({ name: "" })
Quando envio
Então erro Zod com mensagem em pt-BR

Cenário: listar projetos só do meu workspace
Dado que sou membro de WS-A e WS-B
Quando workspace.listProjects({ workspaceId: WS-A })
Então recebo projetos só de WS-A (não cruzando tenancy)
```

**Estimativa:** M (6–8h)

---

### [#7 · core] CRUD de tasks com soft delete · [M]

**Descrição**

Endpoints tRPC para tasks: criar, listar (com filtros), update parcial, soft delete
(status = archived). Posição float para permitir reorder barato.

**Critérios de aceite**

```
Cenário: criar task
Dado projeto existente
Quando task.create({ projectId, title, priority: "high", assigneeIds: [] })
Então task é criada com status="todo", position=última+1024
E activities row com verb="task.created" é inserida

Cenário: listar com filtros
Dado 100 tasks (30 todo, 50 doing, 20 done)
Quando task.list({ projectId, filters: { status: ["todo"], priority: ["high"] } })
Então recebo só as tarefas matching, ordenadas por position asc
E response inclui total e nextPage se paginação

Cenário: soft delete
Dado task T
Quando task.delete({ id: T })
Então T.status = "archived", T não aparece em listas padrão
E activities verb="task.archived" + LGPD-style retention é respeitada

Cenário: atualização otimista
Dado o cliente envia PATCH com updatedAt antigo
Quando o servidor detecta conflito (updatedAt mudou)
Então resposta 409 com current state para merge
```

**Estimativa:** M (8–12h)

---

### [#8 · feature] Board Kanban com drag-drop · [M]

**Descrição**

Visualização board com colunas por status (todo/doing/done), drag-drop entre
colunas, atualização otimista com rollback em erro.

**Critérios de aceite**

```
Cenário: drag entre colunas
Dado uma task em "todo"
Quando arrasto para coluna "doing"
Então UI atualiza imediatamente (otimista)
E mutation é enviada em background
E em sucesso, activities verb="task.status_changed" é registrada
E em erro, UI faz rollback e mostra toast de erro

Cenário: atalho de teclado
Dado tecla "1", "2", "3"
Quando pressionada com task selecionada
Então task muda para status correspondente
```

**Estimativa:** L (10–16h)

---

### [#9 · feature] Filtros por status/prioridade/due/assignee · [M]

**Descrição**

Painel de filtros persistente em URL (search params tipados via TanStack Router),
combináveis (AND).

**Critérios de aceite**

```
Cenário: filtro por vencimento
Dado 10 tasks atrasadas e 5 futuras
Quando filtro "atrasadas"
Então lista mostra só as 10 atrasadas com badge em vermelho

Cenário: URL compartilhável
Dado que aplico filtros status=todo&priority=high&assignee=me
Quando copio a URL e abro em outra aba
Então mesmos filtros aparecem e mesma lista
```

**Estimativa:** M (4–8h)

---

### [#10 · ci] Pipeline CI: lint + type + test com cobertura · [M]

**Descrição**

GitHub Actions com jobs paralelos: lint, type-check, unit, integration (com
Postgres em serviço), coverage report. Bloqueia merge se coverage cair.

**Critérios de aceite**

```
Cenário: PR abre com checks
Dado um PR aberto
Quando push acontece
Então 4 checks rodam em paralelo (lint/type/unit/integration)
E uma badge de coverage aparece no PR

Cenário: merge bloqueado
Dado um teste falhando
Quando CI termina
Então checks ficam vermelhos e merge fica bloqueado
```

**Estimativa:** S (3–5h)

---

### [#11 · deploy] Deploy: API em Fly.io + DB em Neon + Pages já em uso · [M]

**Descrição**

Provisionar Fly.io app para API (Node 22 LTS, Hono), Neon Postgres para DB,
manter Pages para web. GitHub Actions: build Docker, push GHCR, deploy via
`flyctl deploy`.

**Critérios de aceite**

```
Cenário: deploy só em main
Dado um PR mergeado em main
Quando workflow dispara
Então API em Fly.io é atualizada (zero-downtime)
E Sentry release é criada (commit SHA + version)

Cenário: rollback
Dado um deploy com bug crítico
Quando flyctl releases rollback é chamado
Então app volta para versão anterior sem downtime
```

**Estimativa:** M (6–10h)

---

### [#12 · e2e] Smoke E2E: signup → projeto → task → board · [M]

**Descrição**

Suite Playwright que cobre o caminho crítico do MVP (eyebrow test do produto).

**Critérios de aceite**

```
Cenário: usuário novo cria primeira task
Dado usuário não autenticado
Quando faz signup, cria projeto "Pessoal", cria task "Comprar leite"
Então board mostra a task em coluna "todo"
E toda a ação leva < 60 segundos (mediano)

Cenário: mobile
Dado viewport 375x812 (iPhone)
Quando repete o fluxo acima
Então UI é totalmente usável (sem scroll horizontal, tap targets >= 44px)
```

**Estimativa:** S (3–5h)

---

## Próximos passos

- Criar essas issues no GitHub via API (vou pedir autorização)
- Configurar labels: `infra`, `foundation`, `core`, `feature`, `auth`, `db`, `obs`, `i18n`, `ci`, `deploy`, `e2e`, `quality`, `MVP`, `V1`
- Configurar milestone: **MVP (sem 1–2)**, **V1 (sem 3–8)**
- Project board (Kanban): Todo / In progress / Review / Done
