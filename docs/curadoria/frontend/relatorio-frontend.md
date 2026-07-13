# Curadoria Frontend — Boilerplates TS, UI Kit/A11y, Drag-and-Drop Kanban

> **Curado em:** 2026-07-10  
> **Contexto do projeto:** app.tarefas — aplicação Kanban moderna para usuários individuais e equipes pequenas, TypeScript end-to-end, UI pt-BR com base para i18n, prioridades UX > performance > segurança > deploy contínuo.  
> **Stack atual (origem):** React 19 + Vite 6 + Tailwind v4 + TS strict + localStorage, ~370 linhas em um único `TodoApp.tsx`.  
> **Método:** pesquisa web 2024-2026 + critérios objetivos (manutenção, bundle, A11y, lock-in).

---

## 1. TL;DR — Top picks para app.tarefas

| # | Categoria | Pick | Nota |
|---|-----------|------|------|
| 🏆 1 | Boilerplate fullstack TS | **T3 Stack (create-t3-app)** | **9/10** — Next.js + tRPC + Tailwind + Auth.js/Drizzle, type-safety ponta-a-ponta, CLI interativo |
| 🥈 2 | Boilerplate alternativo | **Next.js 15 (App Router) + scaffold próprio** | 8/10 — Mais controle; boilerplates do T3 ainda engatilham com libs desatualizadas |
| 🏆 1 | UI Kit + A11y | **shadcn/ui** | **9.5/10** — Componentes Radix + Tailwind copy-paste, você é dono do código, RSC-friendly, A11y WCAG de fábrica |
| 🥈 2 | UI Kit alternativo | **Mantine v8** | 8/10 — Batteries-included, 120+ componentes, hooks de form prontos, mas lock-in estilístico |
| 🏆 1 | Drag-and-Drop Kanban | **dnd-kit** | **9/10** — Ativo, A11y nativa, virtualização, 12 KB gzipped, padrão de fato após deprec. do react-beautiful-dnd |
| 🥈 2 | Drag-and-Drop alternativo | **Pragmatic drag and drop (Atlassian)** | 8/10 — Sucessor oficial do react-beautiful-dnd, performance excelente, mas API menos ergonômica em React |

> ⚠️ **AVISO:** `react-beautiful-dnd` foi **arquivado em 18/ago/2025** pela Atlassian. Não usar em projeto novo. Migração oficial para Pragmatic DnD ou `dnd-kit`.

---

## 2. Tabela comparativa completa

| Recurso | Categoria | Repo/Link | Stars | Maturidade | Bundle | Custo | Nota |
|---|---|---|---|---|---|---|---|
| T3 Stack | Boilerplate | https://create.t3.gg | ~29k | Produção | — | Grátis | 9/10 |
| Next.js (vanilla) | Boilerplate | https://nextjs.org | ~130k | Produção | — | Grátis | 8/10 |
| Remix | Boilerplate | https://remix.run | ~31k | Produção | — | Grátis | 7/10 |
| Wasp | Boilerplate | https://wasp.sh | ~15k | Intermediário | — | Grátis (self-host) | 7/10 |
| Redwood | Boilerplate | https://redwoodjs.com | ~17k | Intermediário | — | Grátis | 6/10 |
| shadcn/ui | UI Kit | https://ui.shadcn.com | ~80k | Produção | ~0 KB (copy-paste) | Grátis (MIT) | 9.5/10 |
| Radix Primitives | UI Primitives | https://radix-ui.com | ~16k | Produção | ~30 KB gz | Grátis (MIT) | 9/10 |
| Mantine | UI Kit | https://mantine.dev | ~31k | Produção | ~80 KB gz | Grátis (MIT) | 8/10 |
| Ark UI | UI Primitives | https://ark-ui.com | ~6k | Intermediário | ~25 KB gz | Grátis (MIT) | 7.5/10 |
| React Aria | UI Primitives | https://react-spectrum.adobe.com/react-aria | ~12k | Produção | Variável | Grátis (Apache 2) | 8.5/10 |
| dnd-kit | DnD | https://dndkit.com | ~16k | Produção | 12 KB gz | Grátis (MIT) | 9/10 |
| Pragmatic DnD | DnD | https://atlassian.design/components/pragmatic-drag-and-drop | ~6k | Intermediário | ~10 KB gz | Grátis (Apache 2) | 8/10 |
| ~~react-beautiful-dnd~~ | DnD | ~~https://github.com/atlassian/react-beautiful-dnd~~ | 33k | **ARQUIVADO** | — | — | ❌ |
| react-grid-layout | Layout DnD | https://github.com/react-grid-layout/react-grid-layout | ~20k | Produção | 28 KB gz | Grátis (MIT) | 7/10 |

---

## 3. Categoria 1 — Boilerplates Fullstack TypeScript

### 3.1 [T3 Stack (create-t3-app)](https://create.t3.gg) — ⭐ 9/10

- **Prós:**
  - CLI interativo (`npm create t3-app@latest`) monta Next.js + tRPC + Tailwind + Prisma **ou** Drizzle + NextAuth.js
  - Type-safety ponta-a-ponta (zod + tRPC + Prisma/Drizzle)
  - Mantido ativamente pela comunidade, ~29k stars
  - Documentação clara, foca em "construir, não configurar"
  - Suporte a App Router e Pages (default App Router)
- **Contras:**
  - Engatilhado com versões específicas — precisa de override manual pra atualizar
  - Decisões pré-tomadas: se quiser sair do Next.js, perde o boilerplate
  - Pequena curva pra tRPC se a equipe só conhece REST
- **Maturidade:** Produção
- **Como usar no app.tarefas:**
  Rodar `npm create t3-app@latest app-tarefas`, escolher **Next.js + tRPC + Tailwind + Drizzle + NextAuth.js**. A partir daí, o `src/server/api/routers/` é onde mora a lógica de tarefas/projetos/workspaces. Como já temos React+Vite+Tailwind, o T3 substitui o Vite por Next.js (ganhamos SSR/SSG, API routes, edge deploy). Migração de ~370 linhas é trivial — só o `TodoApp.tsx` vira um Server Component que faz fetch tRPC no servidor.
- **Nota:** **9/10** — T3 + Drizzle + Better Auth (substituindo NextAuth) é o caminho de menor atrito para chegar ao MVP em 2 semanas com stack moderno. Recomendação primária.

### 3.2 [Next.js 15 (vanilla, App Router)](https://nextjs.org) — ⭐ 8/10

- **Prós:**
  - Framework meta oficial, ~130k stars, mantido pela Vercel
  - RSC (React Server Components) reduz JS no cliente
  - Vasta ecosystem e integrações
  - Suporte nativo a i18n (`next-intl`, `next-i18next`)
- **Contras:**
  - Sem tRPC/ORM/auth pré-configurados — você monta
  - Mais boilerplate pra escrever antes do primeiro endpoint
  - Vendor-friendly Vercel, mas lock-in menor que se imagina
- **Maturidade:** Produção
- **Como usar no app.tarefas:** scaffold manual com `npx create-next-app@latest --typescript --tailwind --app`. Use o App Router. Combine com tRPC (sem T3) e Drizzle (instalado à parte). É o "T3 sem o CLI", bom se você quer entender cada peça.
- **Nota:** **8/10** — Escolha sólida se a equipe prefere controle total em vez do CLI do T3. Equivale a 80% do T3 com 20% mais trabalho.

### 3.3 [Remix](https://remix.run) — ⭐ 7/10

- **Prós:**
  - Filosofia "loaders/actions" elegante, type-safety excelente com TS
  - Form-first, ótimo para mutações
  - Migrou para React Router v7 (mantido, sem trair comunidade)
- **Contras:**
  - Comunidade menor que Next.js em 2025-2026
  - Menos starters/templates prontos
  - i18n menos documentado
- **Maturidade:** Produção
- **Como usar no app.tarefas:** `npx create-remix@latest`. Boa alternativa se a equipe gosta de web standards (FormData, fetch nativo) e prefere não usar React Server Components.
- **Nota:** **7/10** — Vale considerar, mas perde em ecosystem e exemplos prontos. Não é o pick padrão para app.tarefas.

### 3.4 [Wasp](https://wasp.sh) — ⭐ 7/10

- **Prós:**
  - DSL declarativa simples (`wasp.config.ts`)
  - Full-stack com auth, jobs, queries declarativos
  - Suporte a React, Node, Prisma
- **Contras:**
  - DSL própria = learning curve
  - Comunidade pequena
  - Menos flexível que T3/Next puro
- **Maturidade:** Intermediário
- **Como usar no app.tarefas:** `npx wasp new app-tarefas`. Você define queries, actions, auth, e o Wasp monta tudo. Bom para prototipar rápido, mas pode engessar a longo prazo.
- **Nota:** **7/10** — Para um MVP de 2 semanas seria atraente, mas limitações futuras pesam. Fica como opção B.

### 3.5 [Redwood](https://redwoodjs.com) — ⭐ 6/10

- **Prós:**
  - Convenção clara (Cells, Services, SDLs)
  - GraphQL nativo
  - Storybook integrado
- **Contras:**
  - GraphQL adiciona complexidade desnecessária para um app CRUD
  - Comunidade estagnada em 2024-2025
  - Menos atualizações
- **Maturidade:** Intermediário
- **Como usar no app.tarefas:** Não recomendado. GraphQL é overkill para um app de tarefas.
- **Nota:** **6/10** — Bonito no papel, mas estagnado na prática.

---

## 4. Categoria 2 — UI Kit e Componentes Acessíveis

### 4.1 [shadcn/ui](https://ui.shadcn.com) — ⭐ 9.5/10

- **Prós:**
  - **Copy-paste, não npm install** — você é dono do código, zero lock-in
  - Construído sobre Radix Primitives → A11y WCAG de fábrica
  - Tailwind v4 nativo, combina perfeitamente com o stack atual
  - Funciona em RSC (Next.js App Router) sem `"use client"` em quase todos componentes
  - 80k+ stars, atualizado frequentemente
  - CLI: `npx shadcn@latest add button dialog dropdown-menu ...`
  - Suporte a dark mode, theming, form, data table, command menu, kanban
- **Contras:**
  - Não é "library" — você precisa adicionar componentes sob demanda
  - Sem componentes muito complexos prontos (ex: rich text editor) — fica por sua conta
  - Documentação assume que você conhece Radix e Tailwind
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Adicionar via `npx shadcn@latest init` no projeto. Os componentes viram em `src/components/ui/`. Para o Kanban, usar `Card`, `Dialog`, `DropdownMenu`, `Form`, `Command` (busca), `Toast` (notificações), `Avatar`, `Badge`, `Tooltip`, `Sheet` (drawer mobile). Componentes ficam editáveis — você adapta o visual pra pt-BR e branding próprio.
- **Nota:** **9.5/10** — Pick #1 absoluto. Combina com Tailwind v4 (que já temos), Radix (A11y), copy-paste (sem lock-in). É o que Linear, Vercel, Plausible e a maioria dos SaaS novos usa em 2025-2026.

### 4.2 [Radix UI Primitives](https://radix-ui.com) — ⭐ 9/10

- **Prós:**
  - Componentes não-estilizados (low-level) com A11y de fábrica
  - Mantido pelo time do shadcn/ui (mesmo autor)
  - Tree-shakeable, bundle ~30 KB gzipped (total)
  - WAI-ARIA compliant
- **Contras:**
  - **Sem estilo** — você estiliza do zero (mas é exatamente o que shadcn faz por você)
  - Documentação de API, não de uso
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Não precisa instalar diretamente se usar shadcn/ui. Mas se quiser um componente custom (ex: `KanbanColumn`), instale `@radix-ui/react-*` específicos. Use Radix Dialog, Popover, Tooltip, Context Menu.
- **Nota:** **9/10** — Se shadcn/ui é o "cardápio", Radix é o "ingrediente base". Use via shadcn.

### 4.3 [Mantine v8](https://mantine.dev) — ⭐ 8/10

- **Prós:**
  - 120+ componentes prontos, 100+ hooks (`useForm`, `useNotifications`, `useFocusTrap`)
  - Forms com nested field arrays, validação assíncrona, error handling context-aware
  - Suporte a nested form arrays, validação complexa
  - Dark mode nativo
  - Documentação interativa excelente
  - 31k+ stars, 1.9M downloads/semana
- **Contras:**
  - **CSS Modules em vez de Tailwind** — conflita com o stack atual (teria que abandonar Tailwind)
  - Lock-in estilístico (visual "Mantine")
  - Requer `"use client"` em RSC, mais boundaries
  - Bundle maior (~80 KB gzipped)
  - Acessibilidade boa mas implementação varia entre componentes
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se a equipe não conhece Tailwind ou precisa de forms ultra-complexos rapidamente. Mas **abriria mão de Tailwind v4** que já está no projeto — não vale o trade-off.
- **Nota:** **8/10** — Pick #2. Boa library, mas não combina com Tailwind v4 que já temos.

### 4.4 [Ark UI](https://ark-ui.com) — ⭐ 7.5/10

- **Prós:**
  - Primitivas como Radix, multi-framework (React, Vue, Solid)
  - 25 KB gzipped
  - Combina com Panda CSS ou Tailwind
- **Contras:**
  - Comunidade menor
  - Documentação mais escassa
  - Menos exemplos práticos
- **Maturidade:** Intermediário
- **Como usar no app.tarefas:** Alternativa ao Radix. Boa se quiser uma API mais consistente entre frameworks.
- **Nota:** **7.5/10** — Boa, mas Radix + shadcn já cobre o caso.

### 4.5 [React Aria (Adobe)](https://react-spectrum.adobe.com/react-aria) — ⭐ 8.5/10

- **Prós:**
  - **A11y nível Adobe** — usado em produtos Adobe reais
  - Internacionalização nativa (i18n)
  - Combina com qualquer lib de estilo (incluindo Tailwind)
  - Apache 2.0
- **Contras:**
  - API mais verbosa que Radix
  - Bundle maior se usar muitos componentes
  - Documentação assume conhecimento de A11y
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Se A11y for prioridade máxima E equipe tem conhecimento de ARIA. Para pt-BR, o suporte a i18n nativo é um plus.
- **Nota:** **8.5/10** — Excelente, mas Radix + shadcn já é mais ergonômico para o caso de uso.

---

## 5. Categoria 3 — Drag-and-Drop para Kanban

### 5.1 [dnd-kit](https://dndkit.com) — ⭐ 9/10

- **Prós:**
  - **Ativo**, mantido em 2025-2026 (em reescrita modular, ver risco)
  - 12 KB gzipped, tree-shakeable
  - Acessibilidade nativa (keyboard navigation, screen reader announcements)
  - Suporta virtualização (listas com milhares de itens a 60fps)
  - TypeScript-first
  - 1.8M downloads/semana
  - API consistente: `DndContext`, `useDraggable`, `useDroppable`, `useSortable`
- **Contras:**
  - Reescrita modular em andamento (status: alpha/beta em 2026) — instável em algumas features
  - Documentação de exemplos avançados é escassa
  - Não tem "magnetic" auto-scroll nativo para listas grandes (precisa customizar)
- **Maturidade:** Produção (com ressalva sobre reescrita)
- **Como usar no app.tarefas:** Wrap do board com `DndContext` + `closestCorners` collision detection. Cada coluna é um `SortableContext` com `verticalListSortingStrategy`. Cada card é um `useSortable`. Para drag entre colunas, `onDragOver` atualiza o status. Para o MVP, instalar `dnd-kit/core` + `dnd-kit/sortable` + `dnd-kit/utilities`. Já tem componente de Kanban no shadcn (snippets da comunidade).
- **Nota:** **9/10** — Pick #1. Padrão de fato em 2025-2026 após o fim do react-beautiful-dnd.

### 5.2 [Pragmatic drag and drop (Atlassian)](https://atlassian.design/components/pragmatic-drag-and-drop) — ⭐ 8/10

- **Prós:**
  - **Sucessor oficial do react-beautiful-dnd** (mesmo time da Atlassian)
  - Performance excelente (frame-perfect a 60fps)
  - Suporta virtualização nativa
  - Pequeno (~10 KB gzipped)
  - Apache 2.0
- **Contras:**
  - API mais low-level que dnd-kit
  - Documentação ainda em construção (projeto relativamente novo, lançado 2024)
  - Menos exemplos práticos com React
  - Requer mais código boilerplate
- **Maturidade:** Intermediário (maduro, mas comunidade ainda crescendo)
- **Como usar no app.tarefas:** `npm install @atlaskit/pragmatic-drag-and-drop`. Usa o conceito de "adapter" para integrar com React. Para Kanban, `draggable` + `dropTargetForElements` + `monitorForElements`. Vale considerar quando a reescrita do dnd-kit causar dor.
- **Nota:** **8/10** — Ótimo backup se dnd-kit ficar instável. Mas dnd-kit tem mais exemplos e comunidade.

### 5.3 ~~[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)~~ — ❌ ARQUIVADO

- **Status:** Arquivado em 18/ago/2025, npm em modo deprecated
- **Por que NÃO usar:** sem suporte a React 18+ strict mode, sem React 19, time da Atlassian migrou para Pragmatic DnD
- **Migração recomendada:** `dnd-kit` ou `@atlaskit/pragmatic-drag-and-drop`

### 5.4 [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) — ⭐ 7/10

- **Prós:**
  - Grid responsivo com DnD, redimensionamento
  - Maduro, ~20k stars
  - Bom para dashboards
- **Contras:**
  - Foco em grid, não em Kanban (não tem reorder de lista puro)
  - Bundle 28 KB gzipped
  - TypeScript via definições separadas
- **Maturidade:** Produção
- **Como usar no app.tarefas:** Não é a melhor escolha para Kanban estilo Trello/Linear. Use dnd-kit.
- **Nota:** **7/10** — Para Kanban, não. Para dashboard, sim.

### 5.5 [react-dnd](https://react-dnd.github.io/react-dnd) — ⭐ 6.5/10

- **Prós:**
  - Maduro, baseado em HTML5 DnD API
  - 2.5M downloads/semana
  - Multi-backend (HTML5, Touch, Test)
- **Contras:**
  - API verbosa, callbacks-heavy
  - Bundle 23 KB gzipped
  - Últimas releases mais lentas que dnd-kit
  - TypeScript via definições
- **Maturidade:** Produção (manutenção lenta)
- **Como usar no app.tarefas:** Funciona, mas dnd-kit é mais ergonômico.
- **Nota:** **6.5/10** — Não recomendado para projeto novo. Use dnd-kit.

---

## 6. Recomendações finais para app.tarefas

A **tríade vencedora** para o frontend:

```text
✅  Boilerplate:    T3 Stack (create-t3-app) — Next.js + tRPC + Tailwind + Drizzle + NextAuth/Better Auth
✅  UI Kit:         shadcn/ui — copy-paste, Radix + Tailwind, owner do código
✅  Drag-and-Drop:  dnd-kit — ativo, A11y, virtualização, 12 KB
```

**Justificativa em 1 parágrafo:** T3 entrega a base fullstack type-safe em 5 minutos (ganho de 2-3 semanas). shadcn/ui te dá componentes prontos com A11y WCAG de fábrica SEM te prender a uma library (você é dono do código, edita à vontade). dnd-kit é o padrão de fato desde que react-beautiful-dnd foi arquivado em ago/2025 — tem A11y nativa, performance com virtualização, e TypeScript-first. Os três combinados cobrem 90% do frontend do MVP em 1 semana de trabalho.

**Stack final proposto (frontend):**
- **Framework:** Next.js 15 (App Router) via T3
- **Linguagem:** TypeScript strict
- **Estilização:** Tailwind v4 + shadcn/ui
- **Form:** React Hook Form + Zod (já vem no T3)
- **State client:** TanStack Query (já vem no T3 via tRPC)
- **i18n:** `next-intl` (pt-BR como default, base para en/es)
- **DnD:** dnd-kit/core + dnd-kit/sortable
- **Ícones:** Lucide React (vem com shadcn)
- **Datas:** date-fns com locale pt-BR
- **Tema dark/light:** next-themes

---

## 7. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| dnd-kit reescrita modular quebrar API em upgrade | Média | Médio | Fixar versão no `package.json`; upgrade manual testado em branch |
| shadcn/ui parar de manter | Baixa | Baixo | Código é seu — fork local se necessário |
| T3 Stack engatilhar versões | Média | Baixo | Após scaffold inicial, remover o CLI e atualizar manualmente |
| Lock-in em Radix (se shadcn descontinuar) | Baixa | Médio | Radix é open-source MIT, fork viável |
| React 19 + Next.js 15 + dnd-kit ter bugs de fronteira | Baixa | Médio | Testar interações críticas em e2e; ter Pragmatic DnD como plano B |
| Bundle do frontend crescer >500 KB | Média | Médio | Monitorar com `next build --analyze` no CI; lazy load de DnD |
| i18n ficar tarde e exigir refactor | Alta | Alto | **Adicionar i18n no dia 1 do MVP** com `next-intl` |

---

## 8. Recursos complementares

- [Awesome shadcn/ui](https://github.com/birobirobiro/awesome-shadcn-ui) — componentes extras da comunidade
- [shadcn/ui kanban board template](https://github.com/georgespake/shadcn-kanban) — base para o Kanban
- [dnd-kit examples](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/) — exemplos oficiais
- [Next.js + Drizzle tutorial](https://orm.drizzle.team/docs/get-started-sqlite) — integração oficial
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) — checklist de A11y

---

> **Próximo passo:** ver `/workspace/curadoria/backend/relatorio-backend.md` para auth, ORM, DB host, filas e notificações.
