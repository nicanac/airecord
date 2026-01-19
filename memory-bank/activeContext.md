# Active Context

## Current Focus
Phase 2: Audio Capture & Streaming.

## Recent Changes
- Phase 1 Foundation & Infrastructure completed.
- Supabase schema applied with RLS and pgvector.
- Capacitor initialized for iOS/Android.
- Next.js static export enabled for mobile compatibility.

## Next Steps
1.  Build `RecordButton` component.
2.  Implement microphone access.
3.  Integrate streaming transcription.

## Active Decisions
- **Mobile Strategy:** Using Capacitor instead of React Native to leverage web skills (React/Tailwind) while targeting native platforms.
- **AI Strategy:** Using Google Gemini for high-level intelligence and AssemblyAI/Deepgram for low-latency streaming transcription.
