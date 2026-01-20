import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

// Initialize AssemblyAI client with server-side API key
const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

export async function POST() {
    try {
        // Validate API key is configured
        if (!process.env.ASSEMBLYAI_API_KEY) {
            return NextResponse.json(
                { error: "AssemblyAI API key not configured" },
                { status: 500 }
            );
        }

        // Generate temporary token for client-side streaming
        // Token expires in 5 minutes (300 seconds)
        const token = await client.realtime.createTemporaryToken({
            expires_in: 300,
        });

        return NextResponse.json({
            token: token,
            expires_in: 300,
        });
    } catch (error) {
        console.error("Error generating AssemblyAI token:", error);
        return NextResponse.json(
            { error: "Failed to generate transcription token" },
            { status: 500 }
        );
    }
}
