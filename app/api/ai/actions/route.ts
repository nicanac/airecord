import { NextResponse } from "next/server";
import {
    gemini,
    GEMINI_MODEL,
    ACTIONS_PROMPT,
    parseGeminiJson,
} from "@/lib/gemini";

interface TranscriptEntry {
    speaker: string;
    content: string;
    timestamp: number;
}

interface ActionsRequest {
    transcript: TranscriptEntry[];
    speakers: string[];
}

interface ActionItem {
    description: string;
    assignee: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
}

interface ActionsResponse {
    actionItems: ActionItem[];
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

        const body: ActionsRequest = await request.json();
        const { transcript, speakers } = body;

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

        // Format speakers
        const formattedSpeakers = speakers.length > 0 ? speakers.join(", ") : "Unknown speakers";

        // Build the prompt
        const prompt = ACTIONS_PROMPT
            .replace("{transcript}", formattedTranscript)
            .replace("{speakers}", formattedSpeakers);

        // Generate action items using Gemini
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
        const actions = parseGeminiJson<ActionsResponse>(responseText);
        if (!actions) {
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        return NextResponse.json(actions);
    } catch (error) {
        console.error("Action extraction error:", error);
        return NextResponse.json(
            { error: "Failed to extract action items" },
            { status: 500 }
        );
    }
}
