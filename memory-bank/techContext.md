# Technical Context

## Tech Stack

### Frontend & Mobile
- **Framework:** Next.js (App Router)
    - *Reasoning:* Handles complex dashboard logic and data fetching efficiently.
- **Mobile Wrapper:** Capacitor
    - *Reasoning:* Enables native iOS/Android builds from the web codebase.
- **Language:** TypeScript
    - *Constraint:* Strict mode enabled.
- **Styling:** Tailwind CSS v4 (if available) or v3.4 + Framer Motion.
    - *Theme:* Dark Glassmorphism (#121212 background, blur effects).
- **Fonts:** Inter or San Francisco.

### Backend & Database
- **Platform:** Vercel (Web/API)
- **Database:** Supabase (PostgreSQL)
    - **Extensions:** `pgvector` for RAG and semantic search.
- **Auth:** Supabase Auth.
- **Storage:** Supabase Storage (for audio files).

### AI & Intelligence
- **Transcription (STT):** AssemblyAI (Universal-Streaming) or Deepgram.
    - *Requirement:* Low-latency streaming.
- **LLM (Inference):** 
    - **Production:** Google Gemini.
    - **Local/Test:** Ollama.
- **RAG:** Custom implementation using `pgvector` to query meeting history.

## Development Environment
- **Local Runtime:** Node.js
- **Package Manager:** npm
- **Version Control:** Git

## Key Technical Challenges
1.  **Real-time State Management:** Synchronizing streaming text with UI updates without performance regression.
2.  **Audio Persistence:** Ensuring recording continues when the app is backgrounded on mobile (requires Capacitor background execution plugins).
3.  **Vector Search Performance:** Optimizing embeddings for large volumes of meeting transcripts.
