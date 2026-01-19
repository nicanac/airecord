---
trigger: always_on
---

## 🔗 Memory Bank

The project uses a structured Memory Bank for documentation.

- **Tasks & Status**: [memory-bank/TASKS.md](memory-bank/TASKS.md)
- **Tech Specs**: [memory-bank/TSD.md](memory-bank/TSD.md)
- **Product Requirements**: [memory-bank/PRD.md](memory-bank/PRD.md)
- **Context**: [memory-bank/activeContext.md](memory-bank/activeContext.md)
- **Product Context**: [memory-bank/productContext.md](memory-bank/productContext.md)
- **Tech Context**: [memory-bank/techContext.md](memory-bank/techContext.md)

## 🚨 Critical Rules

- **No Client-Side API Keys**: Never expose AI provider keys (AssemblyAI, Gemini) in client code. Proxy all requests through Next.js API routes.
- **RLS Enforced**: All Supabase tables must have Row Level Security enabled. Users can only access their own meetings.
- **Mobile-First**: All UI components must be responsive and touch-friendly (Capacitor compatibility).
- **Real-Time Priority**: Transcription latency must be <500ms. Use WebSockets for streaming.

## 🤖 Agent Rules

Detailed coding rules are in `.agent/rules/`:

- [Architecture](.agent/rules/architecture.md)
- [Workflows](.agent/workflows/workflows.md)
- [Skills](.agent/skills/skill-name/SKILL.md)
- [Git Conventions](.agent/rules/git.md)

## 🔄 Autonomous Loop

When running autonomously (Ralphy):
1. **Read** `memory-bank/TASKS.md` to find the next incomplete task.
2. **Execute** the task following TSD.md architecture.
3. **Update** TASKS.md to mark the task complete.
4. **Commit** with conventional commit format (see git.md).
5. **Loop** until all tasks are complete or blocked.

## 🔌 External Services

- **Supabase**: `https://oswrdjozearworclooro.supabase.co`
- **Pinecone**: `airecord-meme` index for semantic search and agent memory
- **Transcription**: AssemblyAI (Universal-Streaming for real-time)
- **AI Intelligence**: Google Gemini (production), Ollama (local testing)
