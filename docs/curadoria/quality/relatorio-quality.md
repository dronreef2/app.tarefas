# Curadoria Qualidade & Operações — Testes, Observabilidade, Deploy, CI/CD

> **Curado em:** 2026-07-10  
> **Contexto do projeto:** app.tarefas — TypeScript end-to-end, multi-tenant, deploy contínuo, prioridades segurança > performance > UX.  
> **Estado atual:** zero testes, zero CI/CD, sem observabilidade, sem deploy configurado.  
> **Método:** pesquisa web 2024-2026 + critérios objetivos (manutenção, lock-in, custo, self-host).

---

## 1. TL;DR — Top picks para app.tarefas

| # | Categoria | Pick | Nota |
|---|-----------|------|------|
| 🏆 1 | Framework de teste unit | **Vitest** | **9.5/10** — Vite-native, rápido, Jest-compatible, watch mode excelente |
| 🥈 2 | Unit alt | **Bun test** | 8/10 — Ultra rápido se usar Bun runtime |
| 🏆 1 | E2E | **Playwright** | **9.5/10** — Multi-browser, parallel, trace viewer, MSW integration |
| 🥈 2 | E2E alt | **Cypress** | 8/10 — DX boa mas bundle maior; multi-browser via Cypress 14+ |
| 🏆 1 | Mock API | **MSW (Mock Service Worker)** | **9.5/10** — Intercepta network no browser/node, mesmo mock em test/dev |
| 🏆 1 | Logging estruturado | **Pino** | **9/10** — Rápido, JSON nativo, low-overhead, ecosystem grande |
| 🏆 1 | Error tracking | **Sentry** (cloud) ou **GlitchTip** (self-host) | **9/10** — Sentry é padrão; GlitchTip é drop-in self-hosted |
| 🏆 1 | APM / Tracing | **OpenTelemetry + Sentry** | 8.5/10 — OTel vendor-neutral; Sentry faz APM no plano Team |
| 🏆 1 | Deploy (serverless) | **Vercel** (se Next.js) | **9/10** — DX nota 10, preview deploy por PR, Next.js nativo |
| 🥈 2 | Deploy (containers) | **Fly.io** | 8.5/10 — Docker, edge, postgres adjacente, bom custo |
| 🥈 3 | Deploy (simples) | **Railway** | 8/10 — `git push` deploy, $5/mês |
| 🏆 1 | CI/CD (versionamento) | **release-please** | **9.5/10** — Conventional commits → CHANGELOG → GitHub Release automático |
| 🥈 2 | CI/CD (versionamento) | **changesets** | 8.5/10 — Mais controle, melhor para monorepo |
| 🏆 1 | GitHub Actions setup | **actions/setup-node + pnpm/action-setup** | 9/10 — Cache agressivo, versão fixa |
| 🏆 1 | E2E no CI | **playwright-action** | 9/10 — Roda Playwright no GitHub, faz upload de report/trace |

> ⚠️ **AVISO:** **Highlight.io** está sendo descontinuado em 28/fev/2026 (adquirido pela LaunchDarkly). Não usar em projeto novo. Migrar SDK para LaunchDarkly Observability se já estiver usando.

---

## 2. Tabela comparativa completa

| Recurso | Categoria | Link | Stars | Custo | Lock-in | Self-host | Nota |
|---|---|---|---|---|---|---|---|
| Vitest | Unit test | https://vitest.dev | ~14k | Grátis (MIT) | Nenhum | N/A | 9.5/10 |
| Bun test | Unit test | https://bun.sh/docs/cli/test | — | Grátis (MIT) | Baixo (Bun) | N/A | 8/10 |
| Playwright | E2E | https://playwright.dev | ~70k | Grátis (MIT) | Nenhum | N/A | 9.5/10 |
| Cypress | E2E | https://cypress.io | ~48k | Free 500 testes/mês | Médio | N/A | 8/10 |
| MSW | API mock | https://mswjs.io | ~16k | Grátis (MIT) | Nenhum | N/A | 9.5/10 |
| Testcontainers | Integração DB | https://testcontainers.com | ~4k | Grátis (MIT) | Nenhum | N/A | 8.5/10 |
| Pact | Contract test | https://pact.io | — | Grátis (MIT) | Nenhum | N/A | 7.5/10 |
| k6 | Load test | https://k6.io | ~25k | Grátis (MIT) | Nenhum | N/A | 8.5/10 |
| Stryker | Mutation test | https://stryker-mutator.io | ~2.5k | Grátis (MIT) | Nenhum | N/A | 7.5/10 |
| Pino | Logging | https://getpino.io | ~15k | Grátis (MIT) | Nenhum | N/A | 9/10 |
| OpenTelemetry | Tracing | https://opentelemetry.io | — | Grátis (Apache 2) | Nenhum | N/A | 9/10 |
| Sentry | Error tracking | https://sentry.io | ~40k | Free 5k events/mês | Médio | Sim (OSS) | 9/10 |
| GlitchTip | Error tracking | https://glitchtip.com | ~2.5k | $15/mo hosted; free self-host | Baixo | **Sim** | 8.5/10 |
| ~~Highlight.io~~ | Error tracking | ~~https://highlight.io~~ | — | — | — | — | ❌ (descontinua fev/2026) |
| HyperDX | OTel logs | https://www.hyperdx.io | — | Free tier | Médio | Sim | 8/10 |
| Vercel | Deploy | https://vercel.com | — | Free hobby; $20/mo Pro | **Alto** (serverless) | Não | 9/10 |
| Fly.io | Deploy | https://fly.io | — | Free tier; ~$5/mo | Baixo (Docker) | Sim | 8.5/10 |
| Railway | Deploy | https://railway.app | — | $5/mo + uso | Baixo | Não | 8/10 |
| Cloudflare Pages/Workers | Deploy | https://cloudflare.com | — | Free tier generoso | Médio (CF) | Não | 8/10 |
| release-please | Versioning | https://github.com/googleapis/release-please | ~5k | Grátis (Apache 2) | Nenhum | N/A | 9.5/10 |
| changesets | Versioning | https://github.com/changesets/changesets | ~8k | Grátis (MIT) | Nenhum | N/A | 8.5/10 |

---

## 3. Categoria 7 — Testes

### 3.1 [Vitest](https://vitest.dev) — ⭐ 9.5/10 (Unit / Integration)

- **Prós:**
  - **Vite-native** — usa a mesma config do Vite (compatível com Next.js via adapter)
  - **Jest-compatible** — `describe`, `it`, `expect`, mocks
  - Watch mode ultra-rápido
  - Suporte a TS, ESM, JSX out-of-the-box
  - **In-source testing** (`if (import.meta.vitest)`)
  - 14k+ stars
  - Integra com `@testing-library/react`
- **Contras:**
  - Ecossistema de plugins menor que Jest
  - Snapshot testing menos polido
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // vitest.config.ts
  import { defineConfig } from "vitest/config";
  export default defineConfig({
    test: {
      environment: "jsdom", // ou "node" para API
      setupFiles: ["./test/setup.ts"],
      coverage: { provider: "v8", thresholds: { lines: 80, functions: 80 } },
    },
  });
  ```
  Cobrir: services (80%+), utils (90%+), componentes (70%+).
- **Nota:** **9.5/10** — Pick #1. Padrão para projetos Vite/Next modernos.

### 3.2 [Bun test](https://bun.sh/docs/cli/test) — ⭐ 8/10 (Unit)

- **Prós:**
  - **Mais rápido que Vitest** (5-10x em alguns casos)
  - Built-in no Bun runtime
  - Jest-compatible API
- **Contras:**
  - Precisa migrar runtime para Bun (trade-off)
  - Ecossistema de plugins de teste menor
  - Compatibilidade com Next.js parcial
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Apenas se for usar Bun como runtime. Para Next.js, Vitest é melhor.
- **Nota:** **8/10** — Vale considerar se estiver em Bun.

### 3.3 [Playwright](https://playwright.dev) — ⭐ 9.5/10 (E2E)

- **Prós:**
  - **Multi-browser** (Chromium, Firefox, WebKit)
  - **Parallel nativo** — `workers` em CI
  - **Trace viewer** — visualiza sessão completa (DOM, network, console)
  - **Auto-wait** — espera elementos sem flaky tests
  - Suporte a **multiple tabs**, **mobile emulation**
  - 70k+ stars
  - Integra com MSW para mock de API em E2E
  - `playwright-test` runner com describe/test
- **Conras:**
  - Curva de aprendizado maior que Cypress
  - Setup inicial precisa de browsers (no CI: `npx playwright install --with-deps`)
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // e2e/auth.spec.ts
  import { test, expect } from "@playwright/test";
  test("usuário cria tarefa e move para done", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("E-mail").fill("user@example.com");
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.getByRole("button", { name: "Nova tarefa" }).click();
    await page.getByLabel("Título").fill("Minha primeira tarefa");
    await page.getByRole("button", { name: "Criar" }).click();
    await expect(page.getByText("Minha primeira tarefa")).toBeVisible();
    await page.getByRole("button", { name: "Mover para Doing" }).click();
    await expect(page.getByText("Minha primeira tarefa")).toBeVisible();
  });
  ```
  Roda em CI via `playwright-action` oficial.
- **Nota:** **9.5/10** — Pick #1. Padrão de fato em 2025-2026.

### 3.4 [Cypress](https://cypress.io) — ⭐ 8/10 (E2E)

- **Prós:**
  - DX muito boa, time-travel debugger
  - Cypress 14+ adicionou multi-browser
  - Documentação interativa
- **Contras:**
  - Bundle maior, mais pesado
  - Plano free limitado (500 testes/mês)
  - Trace/visualização menos poderoso que Playwright
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Alternativa ao Playwright. Time-travel é bom para debug, mas para CI paralelo Playwright vence.
- **Nota:** **8/10** — Pick #2. Use se a equipe já conhece.

### 3.5 [MSW (Mock Service Worker)](https://mswjs.io) — ⭐ 9.5/10 (API Mock)

- **Prós:**
  - **Intercepta network no browser e no Node** — mesmo mock em test e dev
  - Service Worker (browser) + fetch interceptor (Node)
  - Suporta REST e GraphQL
  - TypeScript-first
  - 16k+ stars
- **Contras:**
  - Setup inicial (definir handlers)
  - Debugging pode ser confuso (request não chega ao backend real)
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // test/mocks/handlers.ts
  import { http, HttpResponse } from "msw";
  export const handlers = [
    http.get("/api/tasks", () =>
      HttpResponse.json([
        { id: "1", title: "Mock task", status: "todo" }
      ])
    ),
  ];
  // test/setup.ts
  import { setupServer } from "msw/node";
  import { handlers } from "./mocks/handlers";
  export const server = setupServer(...handlers);
  ```
  Mesmo handler roda em Vitest (Node) e em browser (Service Worker).
- **Nota:** **9.5/10** — Pick #1 absoluto. Mocks compartilhados economizam horas.

### 3.6 [Testcontainers](https://testcontainers.com) — ⭐ 8.5/10 (Integration DB)

- **Prós:**
  - Sobe **Postgres/Redis/etc em Docker** para cada suite de teste
  - Isolamento total entre testes
  - Funciona em CI (GitHub Actions tem Docker)
- **Contras:**
  - Mais lento que SQLite in-memory
  - Requer Docker
  - Setup inicial não-trivial
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Para testes de integração do Drizzle, sobe Postgres real:
  ```ts
  import { PostgreSqlContainer } from "@testcontainers/postgresql";
  const container = await new PostgreSqlContainer().start();
  const db = drizzle(`${container.getConnectionUri()}/test`);
  ```
- **Nota:** **8.5/10** — Use para testes de integração críticos. Para unit, mock com MSW.

### 3.7 [k6](https://k6.io) — ⭐ 8.5/10 (Load test)

- **Prós:**
  - Load test em JS
  - Cloud k6 ou self-hosted
  - Integra com Grafana
- **Contras:**
  - Carga de manter scripts
  - Não substitui teste de stress real
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Smoke test em produção a cada release: simular 100 RPS por 30s na API. Catching regressões de performance.
- **Nota:** **8.5/10** — Adicionar no V1, não no MVP.

---

## 4. Categoria 8 — Observabilidade e Logging

### 4.1 [Pino](https://getpino.io) — ⭐ 9/10 (Logging estruturado)

- **Prós:**
  - **JSON nativo** — `pino.info({ workspaceId, taskId }, "task created")`
  - **Ultra-rápido** — benchmark acima de winston
  - **Child loggers** para contexto (`logger.child({ userId })`)
  - Integra com `pino-http` (Express/Hono), `pino-pretty` (dev)
  - OpenTelemetry support
  - 15k+ stars
- **Contras:**
  - API minimalista (pode assustar)
  - Configurar transports (ex: enviar para Sentry) você monta
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // src/lib/logger.ts
  import pino from "pino";
  export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    redact: ["req.headers.authorization", "req.headers.cookie"],
  });
  // src/server/api/routers/tasks.ts
  const log = logger.child({ workspaceId, userId });
  log.info({ taskId }, "task created");
  ```
  PII e segredos são automaticamente redactados.
- **Nota:** **9/10** — Pick #1. Padrão em Node.js TS moderno.

### 4.2 [OpenTelemetry](https://opentelemetry.io) — ⭐ 9/10 (Tracing)

- **Prós:**
  - **Vendor-neutral** — envia para Sentry, Datadog, Honeycomb, Grafana, etc.
  - **Spans** para HTTP, DB, queue
  - Auto-instrumentation para Express, Drizzle, etc.
  - Open-source, CNCF
- **Contras:**
  - Setup inicial verboso
  - Vendor de destino precisa suportar OTel
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // instrumentation.ts (Next.js)
  import { NodeSDK } from "@opentelemetry/sdk-node";
  import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  });
  sdk.start();
  ```
  Exporta para Sentry, Grafana Cloud, etc.
- **Nota:** **9/10** — Pick #1. Vendor-neutral = sem lock-in.

### 4.3 [Sentry](https://sentry.io) — ⭐ 9/10 (Error tracking + APM)

- **Prós:**
  - **Padrão de mercado** — SDK oficial para React, Next.js, Node
  - **Source maps** automáticos
  - **Performance monitoring** (APM) com traces
  - **Session Replay** (opcional)
  - **Free tier**: 5k events/mês
  - **Team**: $26/mês
  - Alertas via Slack, e-mail, PagerDuty
  - Releases associadas a commits
- **Contras:**
  - **Lock-in médio** (Sentry-specific data)
  - Plano Team a $26/mês é barreira para early
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```ts
  // sentry.client.config.ts
  import * as Sentry from "@sentry/nextjs";
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1, // 10% das requisições
    replaysSessionSampleRate: 0.0, // session replay off por padrão
    beforeSend(event) {
      if (event.user) delete event.user.ip_address;
      return event;
    },
  });
  ```
- **Nota:** **9/10** — Pick #1 (cloud). Use free tier até travar.

### 4.4 [GlitchTip](https://glitchtip.com) — ⭐ 8.5/10 (Error tracking, self-hosted)

- **Prós:**
  - **Drop-in Sentry** — só troca o DSN
  - 4 containers vs 40 do Sentry self-hosted
  - **Open source MIT**
  - Self-hosted free
  - **Hosted**: $15/mo (100k events)
  - EU hosting disponível
- **Contras:**
  - Menos features que Sentry (sem algumas integrações avançadas)
  - Comunidade menor
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se quiser zero custo e evitar vendor. Sentry SDK continua funcionando, só aponta para GlitchTip.
- **Nota:** **8.5/10** — Plano B sólido se Sentry ficar caro.

### 4.5 ~~[Highlight.io](https://highlight.io)~~ — ❌ DESCONTINUADO

- **Status:** Adquirido pela LaunchDarkly em abr/2025. Descontinuação em 28/fev/2026.
- **Por que NÃO usar:** Migração forçada em março/2026. Adoção de novo SDK ou migração para LaunchDarkly Observability.
- **Migração recomendada:** Sentry (recomendado) ou GlitchTip.

### 4.6 [HyperDX](https://www.hyperdx.io) — ⭐ 8/10 (OTel-native)

- **Prós:**
  - **OpenTelemetry-native** (logs + traces + errors em uma view)
  - Self-hostable
  - Free tier generoso
  - Correlação automática log → trace
- **Contras:**
  - Mais novo, menos maduro
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se quiser OTel-first e self-host, é o pick.
- **Nota:** **8/10** — Alternativa moderna ao Datadog.

---

## 5. Categoria 9 — Deploy

### 5.1 [Vercel](https://vercel.com) — ⭐ 9/10 (Serverless, se Next.js)

- **Prós:**
  - **DX nota 10** — `git push` deploy, preview por PR
  - Next.js nativo (Vercel mantém Next)
  - **Edge Functions** + Serverless + ISR
  - Integração com Neon, Supabase, Upstash
  - Free tier hobby
  - **Pro**: $20/mês por membro
  - CDN global, HTTPS automático
- **Contras:**
  - **Lock-in serverless** (não roda Docker, cron, workers)
  - Custo escala com uso (bandwidth, function execution)
  - Cold start em funções maiores
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se a stack for T3 (Next.js), Vercel é a escolha natural. `vercel.json` com env vars. PR preview deploy. Postgres via Neon com connection pooler.
- **Nota:** **9/10** — Pick #1 se a stack for Next.js.

### 5.2 [Fly.io](https://fly.io) — ⭐ 8.5/10 (Containers, edge)

- **Prós:**
  - **Docker nativo** — qualquer runtime
  - **Edge deploy** em várias regiões
  - Postgres adjacente (`fly postgres create`)
  - Free tier para apps pequenos
  - Sem lock-in (Docker padrão)
- **Contras:**
  - DX inferior a Vercel
  - Precisa de Dockerfile
  - Configuração manual de scaling
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se precisar rodar worker BullMQ ou backend separado, Fly.io é ideal. Pode hospedar Next.js também (mas Vercel é melhor DX).
- **Nota:** **8.5/10** — Plano B se Vercel ficar caro ou se precisar de long-running workers.

### 5.3 [Railway](https://railway.app) — ⭐ 8/10 (Simples)

- **Prós:**
  - `git push` deploy
  - $5/mês + uso
  - Postgres, Redis, etc. com 1-click
  - Sem vendor lock-in de runtime
- **Contras:**
  - Sem edge/CDN nativo (precisa Cloudflare na frente)
  - Sem preview deploy por PR out-of-the-box
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Bom para apps fullstack com backend Node. Mais simples que Fly.
- **Nota:** **8/10** — Bom, mas Vercel + Neon é melhor para T3/Next.

### 5.4 [Cloudflare Pages/Workers](https://cloudflare.com) — ⭐ 8/10 (Edge)

- **Prós:**
  - **Free tier generoso** (100k requests/dia)
  - Edge global
  - Workers suportam Node-ish runtime
  - Pages para SSG/SSR
- **Contras:**
  - Limitações de runtime (não 100% Node)
  - Sem Postgres próprio (precisa Neon/Supabase externo)
  - DX menos polido que Vercel
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Para apps edge-first, ultra low-cost. Para T3/Next, Vercel é melhor.
- **Nota:** **8/10** — Plano B para apps super leves.

---

## 6. Categoria 10 — Templates de GitHub Actions para CI/CD

### 6.1 [release-please](https://github.com/googleapis/release-please) — ⭐ 9.5/10 (Versioning)

- **Prós:**
  - Mantido pelo Google
  - Lê **conventional commits** → calcula versão semver → gera CHANGELOG → abre PR de release
  - Bump de versão automático (patch/minor/major)
  - **GitHub Releases** automáticos
  - 5k+ stars
- **Contras:**
  - Precisa de conventional commits na equipe (educar devs)
  - Conflito com monorepo sem configuração extra
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```yaml
  # .github/workflows/release-please.yml
  on:
    push:
      branches: [main]
  jobs:
    release-please:
      runs-on: ubuntu-latest
      steps:
        - uses: googleapis/release-please-action@v4
          with:
            token: ${{ secrets.GITHUB_TOKEN }}
            release-type: node
  ```
  Mensagem `feat: add task recurrence` → bump minor. `fix: ...` → bump patch.
- **Nota:** **9.5/10** — Pick #1. Combina perfeitamente com semver.

### 6.2 [changesets](https://github.com/changesets/changesets) — ⭐ 8.5/10 (Versioning)

- **Prós:**
  - Desenvolvido pela Atlassian
  - Excelente para monorepo
  - Versionamento por pacote
  - Controle fino de "what changed"
- **Contras:**
  - Mais complexo que release-please para monorepo simples
  - Workflow manual de `pnpm changeset`
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se virar monorepo com múltiplos pacotes (ex: `web`, `api`, `shared-types`).
- **Nota:** **8.5/10** — Plano B. Use release-please no MVP, migre para changesets se virar monorepo.

### 6.3 [actions/setup-node](https://github.com/actions/setup-node) + [pnpm/action-setup](https://github.com/pnpm/action-setup) — ⭐ 9/10 (Setup CI)

- **Prós:**
  - Cache automático de `node_modules`
  - Versão fixa do Node (ex: `node-version: 20`)
  - pnpm cache integrado
- **Contras:**
  - Nenhum relevante
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```yaml
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: pnpm
  - uses: pnpm/action-setup@v4
    with:
      version: 9
  ```
- **Nota:** **9/10** — Padrão.

### 6.4 [playwright-action](https://github.com/microsoft/playwright-github-action) — ⭐ 9/10 (E2E no CI)

- **Prós:**
  - Roda Playwright no GitHub Actions
  - Faz upload de **trace viewer** e **HTML report** como artifacts
  - Comentário em PR com link para test results
- **Contras:**
  - Precisa de `npx playwright install --with-deps` no workflow
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  ```yaml
  - uses: microsoft/playwright-github-action@v1
  - uses: actions/upload-artifact@v4
    if: ${{ !cancelled() }}
    with:
      name: playwright-report
      path: playwright-report/
  ```
- **Nota:** **9/10** — Padrão para E2E.

### 6.5 [super-linter](https://github.com/super-linter/super-linter) — ⭐ 7.5/10 (Lint multi-lang)

- **Prós:**
  - Combina ESLint, Prettier, TypeScript, etc. em uma action
  - Configurável
- **Contras:**
  - Pesado (sobe tudo)
  - Lint de TS já é coberto por `tsc --noEmit`
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Opcional. Para TS+Next, melhor lint granular próprio.
- **Nota:** **7.5/10** — Plano B.

### 6.6 [act](https://github.com/nektos/act) — ⭐ 8/10 (Local CI)

- **Prós:**
  - Roda GitHub Actions **localmente**
  - Debug workflows sem push
  - Acelera dev loop
- **Contras:**
  - Não 100% compatível (Linux-only features)
  - Docker necessário
- **Maturidade:** Produção
- **Como usar no app.tarefas:** `act -j test` roda o job `test` localmente. Economiza push/PR para debug.
- **Nota:** **8/10** — Excelente para DX de quem mantém workflows.

---

## 7. Recomendações finais para app.tarefas

A **stack de qualidade/ops vencedora**:

```text
✅  Unit + Integration:  Vitest + @testing-library/react + MSW
✅  E2E:                 Playwright + MSW + playwright-action
✅  Cobertura:           Vitest --coverage (v8) com thresholds
✅  Contract test:       Pact (V1, quando houver API consumers externos)
✅  Load test:           k6 (smoke test por release no V1)
✅  Mutation test:       Stryker (trimestral, no V1)
✅  Logging:             Pino (JSON, redact de PII)
✅  Tracing:             OpenTelemetry → Sentry APM
✅  Errors:              Sentry (free → team) com source maps
✅  RUM/Frontend perf:   Vercel Analytics (se Vercel) + Sentry Performance
✅  Deploy:              Vercel (serverless, se T3)  +  Neon (DB)
✅  CI:                  GitHub Actions (lint+typecheck+test+build → preview deploy → release-please)
✅  Versioning:          release-please + conventional commits
```

**Pipeline GitHub Actions proposto:**

```text
PR aberto:
  ├─ lint (ESLint, Prettier check)
  ├─ typecheck (tsc --noEmit)
  ├─ unit + integration (Vitest)
  ├─ e2e (Playwright, contra preview deploy)
  └─ preview deploy (Vercel)

PR mergeado na main:
  ├─ build
  ├─ deploy produção (Vercel)
  └─ release-please (bump + CHANGELOG + GitHub Release)
```

---

## 8. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Playwright flaky em CI | Média | Médio | Usar `auto-wait`, retry-on-failure, rodar em container Linux |
| Cold start Vercel afetar UX | Baixa | Médio | Monitorar TTFB p95, edge functions para rotas quentes |
| Sentry free tier estourar | Média | Baixo | Alert em 80% do limite; sampling rate adaptativo |
| Pino log volume alto | Baixa | Médio | Sampling de logs (1% em prod), redact agressivo |
| Migration Drizzle quebrar em prod | Baixa | Alto | **Testar em branch Neon** antes de aplicar em prod; migration reversível |
| Vercel cost spike | Baixa | Médio | Monitorar function invocations; cache agressivo |
| OTel exporter cair e travar app | Média | Médio | Sampling no exporter; circuit breaker; fallback para stdout |
| GitHub Actions consumir muitos minutos | Média | Baixo | Self-hosted runner se crescer; cache agressivo |
| Sentry lock-in | Baixa | Baixo | Logs em JSON puro no stdout (vendor-agnostic) |
| Conventional commits não serem seguidos | Alta | Médio | Husky + commitlint bloqueia PR; `git commit -m ""` falhará |
| Preview deploy vazar dados reais | Média | **Crítico** | **Sempre usar branch Neon de dados sintéticos em preview** |
| Falta de teste de acessibilidade | Alta | Médio | Adicionar `@axe-core/playwright` no E2E |

---

## 9. Recursos complementares

- [Vitest docs](https://vitest.dev/guide/)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [MSW examples](https://mswjs.io/docs/examples)
- [Pino docs](https://getpino.io/#/)
- [OpenTelemetry Node getting started](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
- [Sentry Next.js setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [release-please config](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md)

---

> **Próximo passo:** ver `/workspace/curadoria/sintese/relatorio-sintese.md` — a síntese que consolida tudo: arquitetura, dados, API, roadmap, backlog e issues.
