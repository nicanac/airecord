"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { TranscriptEntry } from "@/components/LiveTranscript";

export interface StreamingTranscriptionState {
    isConnected: boolean;
    isConnecting: boolean;
    transcriptEntries: TranscriptEntry[];
    error: string | null;
    sessionId: string | null;
}

export interface UseStreamingTranscriptionReturn extends StreamingTranscriptionState {
    connect: () => Promise<void>;
    disconnect: () => void;
    sendAudio: (audioData: ArrayBuffer) => void;
}

// AssemblyAI WebSocket endpoint
const ASSEMBLYAI_REALTIME_URL = "wss://api.assemblyai.com/v2/realtime/ws";

interface AssemblyAIMessage {
    message_type: "SessionBegins" | "PartialTranscript" | "FinalTranscript" | "SessionTerminated" | "Error";
    session_id?: string;
    expires_at?: string;
    text?: string;
    audio_start?: number;
    audio_end?: number;
    confidence?: number;
    words?: Array<{
        text: string;
        start: number;
        end: number;
        confidence: number;
    }>;
    error?: string;
}

export function useStreamingTranscription(): UseStreamingTranscriptionReturn {
    const [state, setState] = useState<StreamingTranscriptionState>({
        isConnected: false,
        isConnecting: false,
        transcriptEntries: [],
        error: null,
        sessionId: null,
    });

    const wsRef = useRef<WebSocket | null>(null);
    const entryIdRef = useRef<number>(0);
    const partialEntryRef = useRef<TranscriptEntry | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const connect = useCallback(async () => {
        // Prevent multiple connections
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            // Fetch temporary token from our API route
            const tokenResponse = await fetch("/api/transcribe/token", {
                method: "POST",
            });

            if (!tokenResponse.ok) {
                const error = await tokenResponse.json();
                throw new Error(error.error || "Failed to get transcription token");
            }

            const { token } = await tokenResponse.json();

            // Create WebSocket connection with token and sample rate
            const wsUrl = `${ASSEMBLYAI_REALTIME_URL}?sample_rate=16000&token=${token}`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("AssemblyAI WebSocket connected");
                setState(prev => ({
                    ...prev,
                    isConnected: true,
                    isConnecting: false,
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const message: AssemblyAIMessage = JSON.parse(event.data);
                    handleMessage(message);
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err);
                }
            };

            ws.onerror = (event) => {
                console.error("WebSocket error:", event);
                setState(prev => ({
                    ...prev,
                    error: "Connection error occurred",
                    isConnecting: false,
                }));
            };

            ws.onclose = (event) => {
                console.log("WebSocket closed:", event.code, event.reason);
                setState(prev => ({
                    ...prev,
                    isConnected: false,
                    isConnecting: false,
                    sessionId: null,
                }));
                wsRef.current = null;
            };

            wsRef.current = ws;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Connection failed";
            console.error("Connection error:", error);
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isConnecting: false,
            }));
        }
    }, []);

    const handleMessage = useCallback((message: AssemblyAIMessage) => {
        switch (message.message_type) {
            case "SessionBegins":
                setState(prev => ({
                    ...prev,
                    sessionId: message.session_id || null,
                }));
                console.log("Session started:", message.session_id);
                break;

            case "PartialTranscript":
                // Update partial transcript (shown as "typing" indicator)
                if (message.text && message.text.trim()) {
                    const timestamp = message.audio_start ? message.audio_start / 1000 : 0;

                    if (!partialEntryRef.current) {
                        // Create new partial entry
                        partialEntryRef.current = {
                            id: `partial-${Date.now()}`,
                            speaker: "Speaker 1", // AssemblyAI doesn't provide speaker in basic mode
                            content: message.text,
                            timestamp,
                        };
                    } else {
                        // Update existing partial
                        partialEntryRef.current = {
                            ...partialEntryRef.current,
                            content: message.text,
                        };
                    }

                    // Update state with partial transcript
                    setState(prev => {
                        const entries = prev.transcriptEntries.filter(
                            e => !e.id.startsWith("partial-")
                        );
                        return {
                            ...prev,
                            transcriptEntries: [...entries, partialEntryRef.current!],
                        };
                    });
                }
                break;

            case "FinalTranscript":
                // Finalize transcript entry
                if (message.text && message.text.trim()) {
                    const timestamp = message.audio_start ? message.audio_start / 1000 : 0;
                    const newEntry: TranscriptEntry = {
                        id: `entry-${++entryIdRef.current}`,
                        speaker: "Speaker 1",
                        content: message.text,
                        timestamp,
                    };

                    // Clear partial and add final entry
                    partialEntryRef.current = null;
                    setState(prev => {
                        const entries = prev.transcriptEntries.filter(
                            e => !e.id.startsWith("partial-")
                        );
                        return {
                            ...prev,
                            transcriptEntries: [...entries, newEntry],
                        };
                    });
                }
                break;

            case "SessionTerminated":
                console.log("Session terminated");
                break;

            case "Error":
                console.error("AssemblyAI error:", message.error);
                setState(prev => ({
                    ...prev,
                    error: message.error || "Transcription error",
                }));
                break;
        }
    }, []);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            // Send termination message
            if (wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ terminate_session: true }));
            }
            wsRef.current.close();
            wsRef.current = null;
        }

        setState(prev => ({
            ...prev,
            isConnected: false,
            sessionId: null,
        }));
    }, []);

    const sendAudio = useCallback((audioData: ArrayBuffer) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            // Convert ArrayBuffer to base64
            const base64Audio = arrayBufferToBase64(audioData);
            wsRef.current.send(JSON.stringify({ audio_data: base64Audio }));
        }
    }, []);

    return {
        ...state,
        connect,
        disconnect,
        sendAudio,
    };
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
