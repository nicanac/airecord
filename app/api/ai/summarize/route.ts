import { NextResponse } from "next/server";
import {
    gemini,
    GEMINI_MODEL,
    SUMMARY_PROMPT,
    parseGeminiJson,
} from "@/lib/gemini";

interface TranscriptEntry {
    speaker: string;
    content: string;
    timestamp: number;
}

interface SummarizeRequest {
    transcript: TranscriptEntry[];
    highlights: number[];
    duration: number;
}

interface SummaryResponse {
    summary: string;
    keyPoints: string[];
    sentiment: "positive" | "neutral" | "negative";
    participantMentions: string[];
    suggestedTitle: string;
}

export async function POST(request: Request) {
    try {
        // Check if Gemini is configured
        if (!gemini) {
            return NextResponse.json(
                { error: "Gemini API not configured" },
                { status: 500 }
            );
        }

        const body: SummarizeRequest = await request.json();
        const { transcript, highlights, duration } = body;

        // Validate input
        if (!transcript || !Array.isArray(transcript)) {
            return NextResponse.json(
                { error: "Invalid transcript data" },
                { status: 400 }
            );
        }

        // Format transcript for prompt
        const formattedTranscript = transcript
            .map((entry) => `[${entry.speaker}]: ${entry.content}`)
            .join("\n");

        // Format highlights
        const formattedHighlights =
            highlights.length > 0
                ? highlights.map((h) => `${Math.floor(h / 60)}:${(h % 60).toString().padStart(2, "0")}`).join(", ")
                : "None marked";

        // Build the prompt
        const prompt = SUMMARY_PROMPT
            .replace("{transcript}", formattedTranscript)
            .replace("{highlights}", formattedHighlights)
            .replace("{duration}", String(Math.ceil(duration / 60)));

        // Generate summary using Gemini
        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                maxOutputTokens: 1024,
                temperature: 0.3,
            },
        });

        const responseText = response.text;
        if (!responseText) {
            return NextResponse.json(
                { error: "Empty response from AI" },
                { status: 500 }
            );
        }

        // Parse the JSON response
        const summary = parseGeminiJson<SummaryResponse>(responseText);
        if (!summary) {
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        return NextResponse.json(summary);
    } catch (error) {
        console.error("Summarization error:", error);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}
