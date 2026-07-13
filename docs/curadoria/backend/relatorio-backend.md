# Curadoria Backend — Auth, ORM/DB, Filas/Notificações

> **Curado em:** 2026-07-10  
> **Contexto do projeto:** app.tarefas — aplicação Kanban multi-tenant (workspace → projeto → tarefa), TypeScript end-to-end, prioridades segurança > performance > UX, UI pt-BR.  
> **Estado atual:** sem backend (apenas SPA com `localStorage`).  
> **Método:** pesquisa web 2024-2026 + critérios objetivos (lock-in, custo em escala, maturidade, multi-tenant).

---

## 1. TL;DR — Top picks para app.tarefas

| # | Categoria | Pick | Nota |
|---|-----------|------|------|
| 🏆 1 | Auth | **Better Auth** | **9.5/10** — TS-first, multi-tenant nativo, RBAC + 2FA + passkeys, sem lock-in, dados no seu Postgres |
| 🥈 2 | Auth alternativo | **Auth.js v5 (NextAuth)** | 7/10 — Maduro mas sem 2FA/RBAC nativo, legado |
| 🥈 3 | Auth BaaS | **Clerk** | 7.5/10 — Excelente DX, caro em escala (~$1.025/mo a 100k MAU) e lock-in alto |
| 🏆 1 | ORM | **Drizzle ORM** | **9/10** — SQL-first, type-safety instant, 12 KB gzipped, edge-native, Drizzle Kit para migrations |
| 🥈 2 | ORM alternativo | **Prisma 7** | 8/10 — DX madura, Prisma Studio, mas bundle maior; Rust removido em 2025 |
| 🏆 1 | DB Host | **Neon Postgres** | **9/10** — Serverless Postgres, branching por PR, free tier generoso, autoscale |
| 🥈 2 | DB Host alternativo | **Supabase Postgres** | 8.5/10 — Postgres + Auth + Storage + Realtime, RLS nativo, melhor se for usar todo o stack |
| 🏆 1 | Filas / Background jobs | **Inngest** | **9/10** — Serverless-native, step.sleep, event-driven, free tier 25k runs/mês, sem Redis |
| 🥈 2 | Filas alternativo | **Trigger.dev v3** | 8/10 — Containers para jobs longos (AI, video), self-hostable |
| 🥈 3 | Filas self-hosted | **BullMQ** | 7.5/10 — Maduro, Redis-backed, controle total, mas precisa infra |
| 🏆 1 | E-mail transacional | **Resend** | **9/10** — DX moderna, React Email templates, free tier 3k/mês |
| 🥈 2 | E-mail alternativo | **Postmark** | 8/10 — Confiável, mas mais caro |
| 🏆 1 | Notificações multi-canal | **Novu** | 8.5/10 — In-app + e-mail + push, open-source, self-hostable |
| 🥈 2 | Notificações BaaS | **Knock** | 8/10 — API elegante, multi-canal, mas SaaS-only |

---

## 2. Tabela comparativa completa

| Recurso | Categoria | Link | Stars / Clientes | Custo base | Lock-in | Multi-tenant | Nota |
|---|---|---|---|---|---|---|---|
| Better Auth | Auth lib | https://www.better-auth.com | ~10k | Grátis (self-host) | Nenhum | First-class plugin | 9.5/10 |
| Auth.js v5 | Auth lib | https://authjs.dev | ~25k | Grátis | Nenhum | Não nativo | 7/10 |
| Clerk | Auth BaaS | https://clerk.com | usado por Linear, Vercel | Free 50k MAU; $0.02/MAU depois | Alto | Sim (pago) | 7.5/10 |
| Supabase Auth | Auth BaaS | https://supabase.com | ~80k | Grátis até 50k MAU | Médio | RLS nativo | 8/10 |
| Drizzle ORM | ORM | https://orm.drizzle.team | ~25k | Grátis (MIT) | Nenhum | Você implementa | 9/10 |
| Prisma 7 | ORM | https://prisma.io | ~42k | Grátis (MIT) | Nenhum | Você implementa | 8/10 |
| Kysely | Query builder | https://kysely.dev | ~12k | Grátis (MIT) | Nenhum | Você implementa | 7.5/10 |
| Neon | Postgres host | https://neon.tech | Vercel partner | Free 0.5 GB | Baixo | Branching | 9/10 |
| Supabase DB | Postgres host | https://supabase.com | ~80k | Free 500 MB | Médio | RLS | 8.5/10 |
| Railway Postgres | Postgres host | https://railway.app | — | $5/mês + uso | Baixo | — | 7.5/10 |
| Inngest | Filas | https://www.inngest.com | — | Free 25k runs/mês | Médio | — | 9/10 |
| Trigger.dev v3 | Filas | https://trigger.dev | ~13k | Free 50k tasks/mês | Médio | — | 8/10 |
| BullMQ | Filas | https://bullmq.io | ~7.4k | Grátis (MIT) | Nenhum | Você implementa | 7.5/10 |
| Resend | E-mail | https://resend.com | — | Free 3k/mês; $20/mês 50k | Baixo | — | 9/10 |
| Postmark | E-mail | https://postmarkapp.com | — | $15/mês 10k | Baixo | — | 8/10 |
| Novu | Notificações | https://novu.co | ~35k | Free 30k events/mês | Baixo | — | 8.5/10 |
| Knock | Notificações | https://knock.app | — | $0.01/notification | Médio | — | 8/10 |

---

## 3. Categoria 4 — Auth e Gestão de Usuários

### 3.1 [Better Auth](https://www.better-auth.com) — ⭐ 9.5/10

- **Prós:**
  - **TypeScript-first**, integra com qualquer framework (Next.js, Nuxt, SvelteKit, etc.)
  - **Multi-tenant first-class** via plugin (`organization`, `team`)
  - **RBAC nativo** (roles + permissions por organização)
  - **2FA (TOTP)**, **Passkeys**, **Magic Links**, **Social Login** (Google, GitHub, Microsoft, Apple) — tudo built-in
  - Email/password com hash seguro (Argon2 ou scrypt)
  - Schema 100% seu, dados ficam no **seu Postgres** (zero lock-in)
  - Email verification, password reset, account linking
  - Plugins oficiais: `admin`, `magic-link`, `organization`, `two-factor`, `passkey`, `oauth-proxy`
- **Contras:**
  - Projeto mais novo que Auth.js/Clerk (mas com adoção rápida)
  - Documentação ainda em crescimento (alguns edge cases precisam de leitura de source)
  - Plugin de SSO (SAML) é da comunidade, não oficial
- **Maturidade:** Produção (com ressalva para SSO enterprise)
- **Como usar no app.tarefas:**
  ```bash
  npm install better-auth
  # app/lib/auth.ts
  import { betterAuth } from "better-auth";
  import { organization, twoFactor, passkey } from "better-auth/plugins";
  export const auth = betterAuth({
    database: db, // Drizzle adapter
    plugins: [organization(), twoFactor(), passkey()],
  });
  ```
  Workspaces vira `organization`. Tarefas/projetos têm `organizationId`. Roles: `owner`, `admin`, `member`, `guest`. Convite por e-mail via Resend. Login social via Google no V1, Apple/Microsoft no V2.
- **Nota:** **9.5/10** — Pick #1 absoluto para multi-tenant TS. Comparado ao Clerk, custa zero em escala. Comparado ao Auth.js, tem 2FA e RBAC que faltavam.

### 3.2 [Auth.js v5 (NextAuth)](https://authjs.dev) — ⭐ 7/10

- **Prós:**
  - Maduro, ~25k stars, mantido ativamente
  - Amplamente documentado, várias integrações
  - OAuth provider list enorme
  - Suporte a Drizzle, Prisma, Mongo, etc.
- **Contras:**
  - **Sem 2FA nativo** (precisa de plugin da comunidade)
  - **Sem RBAC nativo** (você implementa)
  - **Sem multi-tenant** (você implementa via JWT claims)
  - Schema do user é fixo, custom fields exigem callbacks
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Funciona, mas você vai escrever 2-3x mais código que com Better Auth para chegar no mesmo resultado (RBAC, 2FA, multi-tenant).
- **Nota:** **7/10** — Legado que muita gente usa por familiaridade. Para projeto novo, Better Auth é a escolha óbvia.

### 3.3 [Clerk](https://clerk.com) — ⭐ 7.5/10

- **Prós:**
  - **Melhor DX do mercado** — componentes prontos (`<SignIn />`, `<UserButton />`)
  - User management dashboard
  - **Organizations** built-in (multi-tenant)
  - Webhooks para sincronizar com seu DB
  - Pre-built UI linda, mobile-friendly
- **Contras:**
  - **Vendor lock-in alto** — user data fica no Clerk
  - **Custo cresce rápido** — $0.02/MAU acima de 50k (~$1.025/mo a 100k MAU)
  - Reside em US (problema para LGPD/GDPR)
  - Organizations é feature paga em planos antigos
  - Você precisa de webhook → seu DB para manter user data
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Ótimo para prototipar em 1 dia. Caro e lock-in para escalar. **Não recomendado** dado que o app é multi-tenant desde o dia 1 e precisa de LGPD.
- **Nota:** **7.5/10** — DX nota 10, mas o resto não compensa para app.tarefas.

### 3.4 [Supabase Auth](https://supabase.com/auth) — ⭐ 8/10

- **Prós:**
  - **RLS nativo** — `auth.uid()` em policies, authz no DB
  - Email/password, OAuth, magic link, phone
  - Integra com Supabase Postgres (mesma instância)
- **Contras:**
  - **Lock-in parcial** — se mudar do Supabase, migração é trabalhosa
  - Limitações em personalização de UI
  - Hosted na EU? Sim, mas opções de região são menores
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se escolher Supabase como DB host, é a escolha natural. Caso contrário, Better Auth é melhor.
- **Nota:** **8/10** — Só faz sentido se for usar Supabase inteiro. Não misture com Neon.

### 3.5 [Lucia](https://lucia-auth.com) — ⭐ 7/10

- **Prós:**
  - Open-source, TS-first
  - Sem dependência de provider
  - Flexibilidade total
- **Contras:**
  - **Descontinuado em 2025** — o autor migrou para [Lucia v3 só para DB] e recomenda Better Auth
  - Comunidade menor
- **Maturidade:** Legado
- **Como usar no app.tarefas:** Não usar. Better Auth é o sucessor espiritual.
- **Nota:** **7/10** — Histórico, mas não para projeto novo.

---

## 4. Categoria 5 — ORM e Banco de Dados

### 4.1 [Drizzle ORM](https://orm.drizzle.team) — ⭐ 9/10

- **Prós:**
  - **SQL-first** — schemas em TS, queries SQL-like (`db.select().from(users).where(eq(users.id, 1))`)
  - **Type-safety instantânea** — sem step de `prisma generate`
  - Bundle **12 KB gzipped** (Prisma 7: ~180 KB)
  - **Edge-native** — Cloudflare Workers, Deno, Vercel Edge
  - **Drizzle Kit** para migrations (`drizzle-kit generate` + `drizzle-kit migrate`)
  - Drizzle Studio (data browser)
  - Suporte a: Postgres, MySQL, SQLite, Turso, D1, Neon
  - Cold start quase instantâneo (~45 ms vs Prisma ~320 ms)
  - 25k+ stars
- **Contras:**
  - Mais código que Prisma para queries complexas (mas mais transparente)
  - Schema-as-code pode ficar verboso com 50+ tabelas
  - Drizzle Studio é menos polido que Prisma Studio
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // src/server/db/schema.ts
  import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
  export const statusEnum = pgEnum("status", ["todo", "doing", "done"]);
  export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    status: statusEnum("status").notNull().default("todo"),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
  ```
  Migrações versionadas em `drizzle/`. `drizzle-kit generate` produz SQL versionado. `drizzle-kit migrate` aplica.
- **Nota:** **9/10** — Pick #1. Combina perfeitamente com TS strict + serverless + edge.

### 4.2 [Prisma 7](https://prisma.io) — ⭐ 8/10

- **Prós:**
  - **DX madura** — schema `.prisma` próprio, super legível
  - **Prisma Studio** polido, ótimo para inspeção
  - Migrations automáticas com `prisma migrate dev`
  - Prisma 7 (2025) removeu engine Rust → cold start caiu de ~1200ms para ~320ms
  - Ecossistema enorme, muitos tutoriais
- **Contras:**
  - **Bundle ~180 KB gzipped** (15x Drizzle)
  - Precisa de `prisma generate` para atualizar tipos (workflow extra)
  - Edge support melhorou mas ainda inferior a Drizzle
  - Queries com N+1 mais fácil de cair (sem transparência SQL)
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se a equipe já conhece Prisma, é seguro. Mas para greenfield, Drizzle é melhor.
- **Nota:** **8/10** — Pick #2 sólido. Vence em maturidade de tooling, perde em bundle e type-safety workflow.

### 4.3 [Kysely](https://kysely.dev) — ⭐ 7.5/10

- **Prós:**
  - Type-safe query builder puro, sem ORM
  - Bundle pequeno
  - 12k+ stars
- **Contras:**
  - Sem schema-as-code (você mantém tipos manualmente ou via `kysely-codegen`)
  - Migrations você faz separado (`kysely-migrations` ou externo)
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Para quem quer SQL puro com type-safety. Mais controle, mais responsabilidade.
- **Nota:** **7.5/10** — Bom, mas Drizzle tem mais features (schema + migrations integradas).

### 4.4 [Neon Postgres](https://neon.tech) — ⭐ 9/10 (DB Host)

- **Prós:**
  - **Serverless Postgres** — autoscale, paga por uso
  - **Branching por PR** — cada PR cria um branch de DB isolado (game changer)
  - **Free tier**: 0.5 GB, 190 horas compute/mês
  - **Pro**: $19/mês, escala automática
  - Compatível com Drizzle, Prisma, Kysely
  - **Cold start rápido** com autosuspend (escala a zero)
  - Vercel partner oficial
- **Conras:**
  - Vendor próprio (não AWS RDS), mas Postgres puro
  - Latência de cold start se não configurar autosuspend corretamente
  - Sem painel tão bonito quanto Supabase
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Provisionar projeto Neon, copiar `DATABASE_URL` para `.env`. Branch por PR: `neonctl branches create --name feat/xyz`. Drizzle aponta para o branch.
- **Nota:** **9/10** — Pick #1 para DB. Branching por PR economiza horas de staging.

### 4.5 [Supabase Postgres](https://supabase.com) — ⭐ 8.5/10 (DB Host)

- **Prós:**
  - **Postgres + Auth + Storage + Realtime** num único painel
  - **RLS nativo** — políticas SQL (`auth.uid()`)
  - **Free tier generoso**: 500 MB, 50k MAU auth
  - **Studio bonito** para inspeção
  - Real-time subscriptions para o Kanban
- **Contras:**
  - **Lock-in médio** — RLS policies, storage, auth tudo junto
  - Migração para fora é trabalhosa
  - Storage para anexos de tarefas tem custo separado
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se quiser Auth + DB + Storage num só lugar, Supabase é a escolha. Caso contrário, Neon + Better Auth.
- **Nota:** **8.5/10** — Pick #2. Vence se quiser tudo num só lugar. Perde em flexibilidade.

### 4.6 [Railway Postgres](https://railway.app) — ⭐ 7.5/10 (DB Host)

- **Prós:**
  - Postgres tradicional, fácil
  - $5/mês + uso, sem per-MAU
  - Integra com GitHub
- **Contras:**
  - Sem autoscale (precisa provisionar tamanho fixo)
  - Sem branching
  - Sem painel avançado tipo Neon/Supabase
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Bom para dev/staging simples. Para produção, Neon ganha.
- **Nota:** **7.5/10** — Para simplicidade, ok. Para features modernas, Neon.

---

## 5. Categoria 6 — Filas/Jobs e Notificações

### 5.1 [Inngest](https://www.inngest.com) — ⭐ 9/10 (Filas)

- **Prós:**
  - **Event-driven, serverless-native** — roda dentro do Next.js deploy, sem worker process
  - **`step.sleep('3d')`** pausa execução sem segurar serverless function (drip campaigns, notificações agendadas)
  - **Step-level retry** — se `send-welcome-email` falha, só esse step retenta, não a função inteira
  - **Durable execution** — checkpointing automático
  - **Free tier**: 25k function runs/mês
  - **Basic**: $30/mês
  - **Pro**: $300/mês
  - Funciona com Vercel, Netlify, Cloudflare
  - TypeScript-first, Zod schemas
  - **Local dev excelente** (`npx inngest-cli dev`)
- **Contras:**
  - **Lock-in médio** — vendor gerenciado (mas self-hostable)
  - Limitado a jobs que cabem em minutos (não horas)
  - Custo cresce com uso (mas free tier é generoso)
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // inngest/functions/task-overdue.ts
  import { inngest } from "@/lib/inngest";
  export const taskOverdueReminder = inngest.createFunction(
    { id: "task-overdue-reminder" },
    { event: "task/overdue" },
    async ({ event, step }) => {
      await step.run("send-email", async () => {
        await resend.emails.send({...});
      });
      await step.sleep("wait-1-day");
      await step.run("send-push", async () => {...});
    }
  );
  ```
  Evento `task/overdue` é disparado quando tarefa vence. Inngest orquestra. Perfeito para notificações de vencimento + recorrência + auditoria.
- **Nota:** **9/10** — Pick #1. Especialmente bom se deploy for em Vercel.

### 5.2 [Trigger.dev v3](https://trigger.dev) — ⭐ 8/10 (Filas)

- **Prós:**
  - **Containers dedicados** — jobs longos (AI inference, video processing) sem timeout
  - **Free tier**: 50k task runs/mês, 1000 steps por run
  - Self-hostable
  - TypeScript-first, Zod schemas
  - **Real-time progress streaming** para o frontend
- **Contras:**
  - Custo sobe rápido em volume
  - Lock-in médio
  - Setup mais complexo que Inngest
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Bom se tiver jobs de IA (sugestão de próxima tarefa, priorização automática). Para o MVP, Inngest é mais simples.
- **Nota:** **8/10** — Plano B sólido, especialmente para V2 com features AI.

### 5.3 [BullMQ](https://bullmq.io) — ⭐ 7.5/10 (Filas, self-hosted)

- **Prós:**
  - Maduro, 1M+ downloads/semana, battle-tested desde 2017
  - Redis-backed, controle total
  - Concurrency, priorities, rate limiting precisos
  - 100% open-source
- **Contras:**
  - **Precisa de Redis** (custo + infra)
  - **Workers são processos Node separados** — em Vercel não roda, precisa Railway/Fly.io/VPS
  - Mais código pra configurar
  - Sem step-level retry nativo (você implementa)
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se quiser zero vendor e estiver em Fly.io/Railway. Em Vercel, prefira Inngest.
- **Nota:** **7.5/10** — Bom para quem evita SaaS. Não recomendado para Vercel.

### 5.4 [Resend](https://resend.com) — ⭐ 9/10 (E-mail transacional)

- **Prós:**
  - **DX moderna** — `import { Resend } from "resend"; resend.emails.send({...})`
  - **React Email** — templates em JSX/TSX
  - **Free tier**: 3k e-mails/mês
  - **Pro**: $20/mês 50k
  - DKIM/SPF/DMARC configurados automaticamente
  - Webhooks para tracking
- **Contras:**
  - Sem SMS/WhatsApp (foco é e-mail)
  - Custo por volume (mas free tier é generoso)
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```tsx
  // emails/task-assigned.tsx
  import { Button, Html } from "@react-email/components";
  export function TaskAssignedEmail({ task, user }) {
    return (
      <Html lang="pt-BR">
        <h1>Você foi atribuído a "{task.title}"</h1>
        <Button href={`https://app.tarefas/tasks/${task.id}`}>Ver tarefa</Button>
      </Html>
    );
  }
  ```
- **Nota:** **9/10** — Pick #1 para e-mail. React Email + Resend = templates bonitos e DX top.

### 5.5 [Novu](https://novu.co) — ⭐ 8.5/10 (Notificações multi-canal)

- **Prós:**
  - **In-app + e-mail + push + SMS** num só workflow
  - Open-source, self-hostable
  - **Free tier**: 30k events/mês
  - Workflows visuais no painel
  - Multi-canal fácil (subscribe uma vez, escolha canal)
- **Contras:**
  - Documentação poderia ser melhor
  - Self-host tem overhead operacional
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Para o V1 (notificações multi-canal: in-app + e-mail). Centraliza "vencimento de tarefa", "menção em comentário", etc.
- **Nota:** **8.5/10** — Pick #1 para notificações multi-canal. Para MVP simples, Resend sozinho resolve.

### 5.6 [Knock](https://knock.app) — ⭐ 8/10 (Notificações BaaS)

- **Prós:**
  - API elegante, multi-canal
  - Workflows visuais
  - In-app feed pronto
  - $0.01/notification
- **Contras:**
  - SaaS-only, sem self-host
  - Custo pode crescer
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Alternativa ao Novu se quiser SaaS gerenciado.
- **Nota:** **8/10** — Bom, mas Novu open-source ganha em flexibilidade.

---

## 6. Recomendações finais para app.tarefas

A **stack backend vencedora**:

```text
✅  Auth:         Better Auth + plugin organization (multi-tenant) + 2FA + passkeys
✅  ORM:          Drizzle ORM
✅  DB Host:      Neon Postgres (com branching por PR)
✅  Filas:        Inngest (event-driven, serverless-native)
✅  E-mail:       Resend + React Email
✅  Notif multi:  Novu (V1, multi-canal)
```

**Justificativa em 1 parágrafo:** Better Auth entrega multi-tenant + RBAC + 2FA out-of-the-box, sem lock-in (dados no seu Neon). Drizzle dá type-safety SQL-first com bundle minúsculo, perfeito para edge/serverless. Neon hospeda Postgres com branching por PR (game changer para CI/CD). Inngest roda filas sem precisar de Redis/worker, ideal para deploy em Vercel — `step.sleep` é mágico para notificações de vencimento. Resend manda e-mails transacionais com React Email (DX nota 10). No V1, Novu centraliza notificações multi-canal.

**Stack final proposto (backend):**
- **Auth:** Better Auth (lib) + Drizzle adapter
- **RBAC:** Better Auth organization plugin (roles: owner, admin, member, guest)
- **ORM:** Drizzle ORM
- **Migrations:** Drizzle Kit
- **DB:** Neon Postgres
- **Filas:** Inngest (event-driven)
- **E-mail:** Resend + React Email
- **Notificações in-app:** Novu (V1)
- **API style:** tRPC (vem com T3) — type-safety end-to-end
- **Validação:** Zod (compartilhado client+server)
- **Rate limiting:** Upstash Ratelimit ou in-memory (V1)

---

## 7. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Better Auth quebrar em upgrade | Média | Alto | Fixar versão no MVP; ler CHANGELOG antes de subir minor |
| Inngest indisponível | Baixa | Médio | Plano B: BullMQ (se mover de Vercel) |
| Neon cold start lento | Média | Médio | Habilitar autosuspend balanceado; usar connection pooler (PgBouncer) |
| RLS policy mal escrita vazar dados | Média (se Supabase) | **Crítico** | Testes de tenant isolation obrigatórios; code review de toda policy |
| Lock-in em SaaS de e-mail | Baixa | Médio | Templates em React Email = portáveis; abstração `EmailProvider` |
| Custos de e-mail/notification em escala | Média | Médio | Monitorar volume; alert em free tier |
| Drizzle Kit migration falhar em produção | Baixa | Alto | **Testar migração em branch Neon antes de prod**; migration reversível |
| Multi-tenant data leak | Média | **Crítico** | Middleware que valida `workspaceId` em todo request; testes e2e |
| LGPD: dados em US (Clerk) | Alta (se Clerk) | Alto | **Não usar Clerk** se o app visa público BR |
| Vendor SaaS cair (Inngest/Resend) | Baixa | Médio | Fallback para self-hosted (BullMQ + SMTP) |

---

## 8. Recursos complementares

- [Better Auth docs](https://www.better-auth.com/docs)
- [Drizzle ORM docs](https://orm.drizzle.team/docs/overview)
- [Neon branching guide](https://neon.tech/docs/guides/branching)
- [Inngest quick start](https://www.inngest.com/docs/quick-start)
- [React Email components](https://react.email/docs)
- [Novu notifications](https://docs.novu.co)

---

> **Próximo passo:** ver `/workspace/curadoria/quality/relatorio-quality.md` para testes, observabilidade, deploy e CI/CD.
