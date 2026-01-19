# Project: MeetFlow AI

**Version:** 1.0.0
**Status:** Planning
**Stack:** Next.js, Capacitor, Supabase, Gemini/Ollama

## 1. Executive Summary

**MeetFlow AI** is a high-fidelity mobile meeting assistant designed to transform live conversations into structured summaries, sentiment-tracked insights, and synchronized action items. Unlike standard recorders, it focuses on real-time streaming and "vibes" (sentiment analysis) to help enterprise leaders focus on dialogue rather than documentation.

## 2. Target Audience

- **Primary:** Enterprise Project Managers, Agile Development Teams.
- **Secondary:** Executive Leaders, Consultants.

## 3. Core Features

### A. Live Session Capture
- **Streaming Transcription:** Real-time speech-to-text (<500ms latency) with speaker diarization.
- **Manual "Highlight" Tagging:** Users can mark important moments during live recording.
- **Visual Waveforms:** Dynamic feedback during active recording.

### B. Multi-Modal Review Dashboard
- **Visual Sentiment Analysis:** Time-series bar charts showing emotional/sentiment spikes.
- **Linked Audio Snippets:** Click text to play audio.

### C. Context-Aware Intelligence
- **Action Item Extraction:** Prioritized (High/Medium/Low) tasks assigned to owners.
- **Semantic Search:** Search by meaning (e.g., "discussion about backend delay") using pgvector.
- **Project Sync:** Integration with Jira/Linear (Future Scope).

### D. Meeting Analytics
- **Metrics:** "Saved Time" and "Meeting Efficiency" tracking.
- **Dashboard:** Glassmorphic UI displaying aggregate stats.

## 4. User Experience (The "Vibe")

- **Dark Glassmorphism:** Deep charcoal backgrounds (#121212), high-blur frosted glass, vibrant purple (#8B5CF6) and blue (#3B82F6) gradients.
- **Fluidity:** Framer Motion transitions, responsive animations.
- **Mobile-First:** Built with Capacitor in mind for native feel.

## 5. Success Metrics

- **Efficiency:** "Saved Time" per user.
- **Latency:** Transcription latency < 500ms.
- **Accuracy:** Correct speaker identification rate.
- **Retention:** Weekly active users returning for meeting reviews.

## 6. Privacy & constraints
- **Audio:** Handle 1hr+ recordings with background persistence.
- **Security:** SOC2/HIPAA ready encryption (AES-256).
- **PII:** Automatic redaction options.
