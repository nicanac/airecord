# MeetFlow AI - Implementation Tasks

> **Status:** In Progress  
> **Stack:** Next.js 16, Capacitor, Supabase, Gemini/Ollama, AssemblyAI
> **Pinecone:** airecord-meme (14 docs synced)

---

## 🏗️ Phase 1: Foundation & Infrastructure

- [x] Initialize Next.js project with TypeScript & Tailwind <!-- id: 1.1 -->
- [x] Configure tsconfig.json, postcss, tailwind configs <!-- id: 1.2 -->
- [x] Setup Supabase project & environment variables <!-- id: 1.3 -->
    - [ ] Create Supabase project in dashboard
    - [ ] Add `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - [ ] Initialize Supabase client (`lib/supabase.ts`)
- [x] Configure Capacitor for mobile <!-- id: 1.4 -->
    - [ ] Run `npx cap init MeetFlowAI com.meetflow.ai`
    - [ ] Add iOS & Android platforms
    - [ ] Configure `capacitor.config.ts`
- [x] Setup Supabase schema (migrations) <!-- id: 1.5 -->
    - [x] Create `users` table (id, email, full_name, created_at)
    - [x] Create `meetings` table (id, user_id, title, started_at, ended_at, audio_url, status, sentiment_score)
    - [x] Create `transcripts` table (id, meeting_id, speaker, content, start_time, end_time, embedding)
    - [x] Create `action_items` table (id, meeting_id, description, assignee, priority, is_completed)
    - [x] Enable pgvector extension for semantic search
    - [x] Configure Row Level Security (RLS) policies

---

## 🎙️ Phase 2: Audio Capture & Streaming

- [x] Build `RecordButton` component (floating action, pulsing animation) <!-- id: 2.1 -->
- [x] Implement microphone access via Web Audio API / Capacitor <!-- id: 2.2 -->
- [x] Create `WaveformVisualizer` component (Canvas/SVG real-time feedback) <!-- id: 2.3 -->
- [x] Integrate streaming transcription provider <!-- id: 2.4 -->
    - [x] Setup AssemblyAI or Deepgram WebSocket connection
    - [x] Proxy API keys through Next.js API route
    - [x] Handle real-time transcript chunks
- [x] Build `TranscriptView` component (auto-scrolling dialogue list) <!-- id: 2.5 -->
- [x] Implement speaker diarization display <!-- id: 2.6 -->
- [x] Add manual "Highlight" tagging during recording <!-- id: 2.7 -->

---


## 🧠 Phase 3: AI Intelligence Layer

- [/] Setup Gemini API integration (via Next.js API route) <!-- id: 3.1 -->
- [ ] Build post-meeting summarization pipeline <!-- id: 3.2 -->
    - [ ] Send full transcript to Gemini
    - [ ] Parse structured summary response
    - [ ] Store summary in database
- [ ] Implement Action Item extraction <!-- id: 3.3 -->
    - [ ] Prompt engineering for task extraction
    - [ ] Parse High/Medium/Low priority
    - [ ] Assign owners based on speaker names
- [ ] Build Visual Sentiment Analysis <!-- id: 3.4 -->
    - [ ] Analyze sentiment per transcript chunk
    - [ ] Create `SentimentGraph` component (Recharts time-series bar chart)
    - [ ] Display emotional spikes on timeline
- [ ] Implement Semantic Search (pgvector) <!-- id: 3.5 -->
    - [ ] Generate embeddings for transcript chunks
    - [ ] Store embeddings in `transcripts.embedding`
    - [ ] Build search API endpoint
    - [ ] Create search UI component

---

## 📊 Phase 4: Dashboard & Review

- [ ] Design Multi-Modal Review Dashboard <!-- id: 4.1 -->
    - [ ] Glassmorphic card layout
    - [ ] Meeting list with status indicators
- [ ] Build `MeetingCard` component (summary, duration, sentiment) <!-- id: 4.2 -->
- [ ] Implement linked audio snippets (click text → play audio) <!-- id: 4.3 -->
- [ ] Create Meeting Analytics view <!-- id: 4.4 -->
    - [ ] "Saved Time" metric calculation
    - [ ] "Meeting Efficiency" tracking
    - [ ] Aggregate stats dashboard

---

## 🎨 Phase 5: Dark Glassmorphism UI

- [ ] Define design tokens in `globals.css` <!-- id: 5.1 -->
    - [ ] Deep charcoal background (#121212)
    - [ ] Frosted glass overlays (high-blur)
    - [ ] Purple (#8B5CF6) and Blue (#3B82F6) gradients
- [ ] Install & configure Framer Motion <!-- id: 5.2 -->
- [ ] Implement fluid animations & transitions <!-- id: 5.3 -->
- [ ] Mobile-first responsive layouts <!-- id: 5.4 -->
- [ ] Typography: Inter / San Francisco system font <!-- id: 5.5 -->

---

## 🔒 Phase 6: Security & Privacy

- [ ] Implement SOC2/HIPAA-ready encryption (AES-256) <!-- id: 6.1 -->
- [ ] Add PII redaction option in settings <!-- id: 6.2 -->
- [ ] Ensure all API keys proxied through backend <!-- id: 6.3 -->
- [ ] Audit RLS policies for all tables <!-- id: 6.4 -->

---

## 🚀 Phase 7: Deployment & Launch

- [ ] Deploy to Vercel (web) <!-- id: 7.1 -->
- [ ] Build iOS app via Capacitor <!-- id: 7.2 -->
- [ ] Build Android app via Capacitor <!-- id: 7.3 -->
- [ ] Submit to App Store / Google Play <!-- id: 7.4 -->
- [ ] Setup monitoring & error tracking <!-- id: 7.5 -->

---

## 🔮 Future Scope

- [ ] Jira/Linear integration for action items <!-- id: 8.1 -->
- [ ] Ollama local model support for offline mode <!-- id: 8.2 -->
- [ ] Team collaboration features <!-- id: 8.3 -->
