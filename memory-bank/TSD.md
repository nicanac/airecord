# Technical Specification Document (TSD)

## System Architecture

### High-Level Overview
MeetFlow AI follows a client-server architecture with a heavy emphasis on real-time data streaming.

- **Client:** Next.js (Web/Mobile via Capacitor).
- **API:** Next.js Server Actions / API Routes.
- **Database:** Supabase (PostgreSQL).
- **AI Services:** External providers (AssemblyAI/Deepgram, Google Gemini) accessed via backend proxies to secure keys.

### Data Flow
1.  **Audio Stream:** Client Microphone -> WebSocket -> Server/Edge Function -> Transcription Provider.
2.  **Transcription:** Provider -> Text Stream -> Client (Display) & Database (Storage).
3.  **Intelligence:** Transcription Text + Metadata -> LLM (Gemini) -> Summary/Action Items/Sentiment -> Database.

## Data Model (Supabase)

### `users`
- `id` (UUID, PK)
- `email` (Text)
- `full_name` (Text)
- `created_at` (Timestamp)

### `meetings`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `title` (Text)
- `started_at` (Timestamp)
- `ended_at` (Timestamp)
- `audio_url` (Text)
- `status` (Enum: live, processing, completed)
- `sentiment_score` (Float)

### `transcripts`
- `id` (UUID, PK)
- `meeting_id` (UUID, FK)
- `speaker` (Text)
- `content` (Text)
- `start_time` (Float)
- `end_time` (Float)
- `embedding` (Vector) - *for semantic search*

### `action_items`
- `id` (UUID, PK)
- `meeting_id` (UUID, FK)
- `description` (Text)
- `assignee` (Text)
- `priority` (Enum: High, Medium, Low)
- `is_completed` (Boolean)

## Component Architecture (Frontend)

### Core Components
- `RecordButton`: Floating action button with pulsing animation.
- `WaveformVisualizer`: Renders real-time audio data (Canvas/SVG).
- `TranscriptView`: Auto-scrolling list of dialogue.
- `SentimentGraph`: Recharts or similar library for time-series data.
- `MeetingCard`: Glassmorphic card summary.

### State Management
- **Local State:** React `useState`/`useReducer` for UI interactions.
- **Global State:** Zustand or React Context for Recording Session state.
- **Server State:** React Query (TanStack Query) or SWR for fetching meeting history.

## Security Considerations
- **RLS (Row Level Security):** All database tables must have RLS enabled. Users can only access their own meetings.
- **API Keys:** No AI provider keys in client-side code. Proxy all requests through Next.js API routes.
