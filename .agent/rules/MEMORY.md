---
trigger: always_on
---

---
trigger: always_on
---

## 🔗 Memory Bank

The project uses a structured Memory Bank for documentation.

- **Tasks & Status**: [memory-bank/TASKS.md](memory-bank/TASKS.md)
- **Tech Specs**: [memory-bank/TSD.md](memory-bank/TSD.md)
- **Product Requirements**: [memory-bank/PRD.md](memory-bank/PRD.md)

## 🛠️ Operational Commands

- **Dev Server**: `npm run dev` (Runs on http://localhost:3000)
- **Lint**: `npm run lint`
- **Database Status**: `npx supabase status`
- **Type Check**: `npx tsc --noEmit`

## 🚨 Critical Rules (The "Vibe")

- **Styling**: Tailwind 4.1 CSS-only config. NO manual CSS files. Use `globals.css` variables.
- **Components**: shadcn/ui 3.6 (Lyra/Sharp). Composition over complex props.
- **Data**: Supabase Server Actions for mutations. `use cache` for fetching.
- **Code**: Strict TypeScript 7.0 (tsgo).

## 🤖 Agent Rules

Detailed coding rules are in `.agent/rules/`:

- [Architecture](.agent/rules/architecture.md)
- [Workflows](.agent/workflows/workflows.md)
- [Skills](.agent/skills/skill-name/SKILL.md)
- [Git Conventions](.agent/rules/git.md)
- [Pinecone Guidelines](.agent/rules/pinecode.md)

## 🔄 Task Execution Workflow

Before starting ANY task from `memory-bank/TASKS.md`, follow this workflow:

### 1. Create Branch
```bash
# Use /create-branch workflow
node scripts/create-branch.js --type "feature" --desc "task-description" --yes
```

### 2. Execute Task
- Mark task as `[/]` (in progress) in TASKS.md
- **Run `/brainstorm`** to gather all context, research docs, and plan approach
- Implement the feature/fix following TSD.md architecture
- Make atomic commits after each sub-task (conventional commits)

### 3. Commit & PR
```bash
git add .
git commit -m "feat(scope): description"
git push origin <branch-name>
gh pr create --title "feat: task description" --body "Closes #issue"
```

### 4. Complete & Sync
- Mark task as `[x]` in `memory-bank/TASKS.md`
- Upsert completion status to Pinecone (`meetflow-docs` namespace)
- Sync task status to Notion (page ID: `2ed9555c-6779-8034-9e0a-d76d1dbfff2e`)
- Update `memory-bank/activeContext.md` with recent changes
- Update pinecone 
## 🌲 Pinecone Knowledge Base

The project uses Pinecone for vector-based knowledge retrieval.

**Index**: `blueprint` (1024 dimensions, multilingual-e5-large)

| Namespace | Purpose | Example Query |
|-----------|---------|---------------|
| `tech` | Tech stack, frameworks, database schemas | "Next.js App Router Server Actions" |
| `agent` | Workflows, rules, skills documentation | "workflow for debugging errors" |
| `style` | Design tokens, color palette, UX patterns | "purple gradient theme card-based UI" |

**MCP Tools**:
- `mcp_pinecone-mcp-server_search-records` - Query existing knowledge
- `mcp_pinecone-mcp-server_upsert-records` - Add new knowledge
- `mcp_pinecone-mcp-server_list-indexes` - List available indexes

### 5. Next Task
- Checkout `main`, pull latest
- **Review docs for updates needed:**
  - `.gemini/rules/architecture.md` - tech stack, guardrails still accurate?
  - `memory-bank/` - PRD, TSD, activeContext reflect current state?
- Repeat from Step 1 with next incomplete task
```

**Workflows**: `/create-branch`,  `/task-loo`, `/commit-fast-conventional`

