# Technical Context

## Tech Stack

### Frontend & Mobile
- **Framework:** Next.js 16.1.3 (App Router)
    - *Reasoning:* Handles complex dashboard logic and data fetching efficiently.
- **Mobile Wrapper:** Capacitor 8.0.1
    - *Reasoning:* Enables native iOS/Android builds from the web codebase.
- **Language:** TypeScript 5.9.3
    - *Constraint:* Strict mode enabled.
- **Styling:** Tailwind CSS 3.4.1 + Framer Motion 12.27.1
    - *Theme:* Dark Glassmorphism (#121212 background, blur effects).
- **Fonts:** Inter (Google Fonts)
- **Icons:** Lucide React 0.562.0

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

## Current Architecture

### Audio Recording Pipeline
```
User Microphone → Web Audio API → AnalyserNode
                       ↓              ↓
              MediaRecorder    WaveformVisualizer
                   ↓
              Audio Blob → (future: Supabase Storage)
```

### Component Structure
```
app/
├── globals.css (design system)
├── layout.tsx (viewport, safe areas)
├── page.tsx (Home - dashboard)
├── recording/page.tsx (Recording screen)
└── meeting/[id]/page.tsx (Summary screen)

components/
├── RecordButton.tsx (original)
├── WaveformVisualizer.tsx (canvas)
├── GradientHeader.tsx
├── BottomNavigation.tsx
├── MetricCard.tsx
├── MeetingListItem.tsx
├── RecordingControls.tsx
├── LiveTranscript.tsx
└── meeting/
    ├── SummaryTab.tsx
    ├── SentimentChart.tsx (canvas)
    └── ActionItemsCard.tsx

hooks/
└── useAudioRecorder.ts (Web Audio API)
```

## Development Environment
- **Local Runtime:** Node.js
- **Package Manager:** npm
- **Version Control:** Git
- **Dev Server:** `npm run dev` (port 3000)

## Key Technical Decisions

### Implemented
1. **Canvas-based visualizers:** Using raw Canvas API for WaveformVisualizer and SentimentChart for performance.
2. **useAudioRecorder hook:** Custom hook encapsulating all Web Audio API logic with pause/resume support.
3. **CSS Variables for theming:** Design tokens defined in `:root` for easy theme customization.
4. **Dynamic routes enabled:** Removed `output: 'export'` from next.config.js to support `/meeting/[id]`.

### Pending
1. **Real-time transcription:** WebSocket integration with AssemblyAI.
2. **Audio persistence:** Capacitor background execution for mobile.
3. **Vector search:** pgvector setup for semantic meeting search.
