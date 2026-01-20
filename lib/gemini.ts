import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client with API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY not set - AI features will be disabled");
}

export const gemini = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Default model for text generation
export const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Prompt template for meeting summarization
 */
export const SUMMARY_PROMPT = `You are an AI meeting assistant. Analyze the following meeting transcript and provide a structured summary.

TRANSCRIPT:
{transcript}

HIGHLIGHTS (important moments marked by users):
{highlights}

MEETING DURATION: {duration} minutes

Please provide your response in the following JSON format:
{
  "summary": "A 2-3 sentence executive summary of the meeting",
  "keyPoints": [
    "Key discussion point 1",
    "Key discussion point 2",
    "Key discussion point 3"
  ],
  "sentiment": "positive" | "neutral" | "negative",
  "participantMentions": ["Name1", "Name2"],
  "suggestedTitle": "A concise meeting title"
}

Respond ONLY with valid JSON, no additional text.`;

/**
 * Prompt template for action item extraction
 */
export const ACTIONS_PROMPT = `You are an AI meeting assistant. Extract action items from the following meeting transcript.

SPEAKERS IN THIS MEETING:
{speakers}

TRANSCRIPT:
{transcript}

Extract actionable items and assign them to speakers when mentioned. Use these priority levels:
- HIGH: Urgent, deadline mentioned, blocking other work
- MEDIUM: Important but not urgent
- LOW: Nice to have, future consideration

Respond in the following JSON format:
{
  "actionItems": [
    {
      "description": "Clear description of the task",
      "assignee": "Speaker name or 'Unassigned'",
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ]
}

Respond ONLY with valid JSON, no additional text.`;

/**
 * Generate content using Gemini with error handling
 */
export async function generateWithGemini(prompt: string): Promise<string | null> {
    if (!gemini) {
        console.error("Gemini client not initialized");
        return null;
    }

    try {
        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                maxOutputTokens: 1024,
                temperature: 0.3, // Lower temperature for more consistent outputs
                topP: 0.9,
            },
        });

        return response.text || null;
    } catch (error) {
        console.error("Gemini generation error:", error);
        throw error;
    }
}

/**
 * Parse JSON response from Gemini, handling potential formatting issues
 */
export function parseGeminiJson<T>(response: string): T | null {
    try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : response;

        return JSON.parse(jsonStr.trim()) as T;
    } catch (error) {
        console.error("Failed to parse Gemini response as JSON:", error);
        console.error("Response was:", response);
        return null;
    }
}
