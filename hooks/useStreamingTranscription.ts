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
    addHighlight: (timestamp: number) => void;
    highlights: number[];
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

// Speaker colors for visual differentiation
const SPEAKER_LABELS = ["Speaker 1", "Speaker 2", "Speaker 3", "Speaker 4", "Speaker 5"];

export function useStreamingTranscription(): UseStreamingTranscriptionReturn {
    const [state, setState] = useState<StreamingTranscriptionState>({
        isConnected: false,
        isConnecting: false,
        transcriptEntries: [],
        error: null,
        sessionId: null,
    });

    const [highlights, setHighlights] = useState<number[]>([]);

    const wsRef = useRef<WebSocket | null>(null);
    const entryIdRef = useRef<number>(0);
    const partialEntryRef = useRef<TranscriptEntry | null>(null);
    const currentSpeakerRef = useRef<number>(0);
    const lastAudioEndRef = useRef<number>(0);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    /**
     * Detect speaker change based on silence gap between utterances
     * A gap > 2 seconds suggests a different speaker
     */
    const detectSpeakerChange = useCallback((audioStart: number): string => {
        const silenceGap = audioStart - lastAudioEndRef.current;
        
        // If there's a significant gap (>2s), likely a different speaker
        if (silenceGap > 2000 && lastAudioEndRef.current > 0) {
            currentSpeakerRef.current = (currentSpeakerRef.current + 1) % SPEAKER_LABELS.length;
        }

        return SPEAKER_LABELS[currentSpeakerRef.current];
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
            // Enable format_turns for better turn detection
            const wsUrl = `${ASSEMBLYAI_REALTIME_URL}?sample_rate=16000&token=${token}&format_turns=true`;
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
                    const audioStart = message.audio_start || 0;
                    const timestamp = audioStart / 1000;
                    const speaker = detectSpeakerChange(audioStart);

                    if (!partialEntryRef.current) {
                        // Create new partial entry
                        partialEntryRef.current = {
                            id: `partial-${Date.now()}`,
                            speaker,
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
                    const audioStart = message.audio_start || 0;
                    const audioEnd = message.audio_end || audioStart;
                    const timestamp = audioStart / 1000;
                    const speaker = detectSpeakerChange(audioStart);

                    // Update last audio end for speaker detection
                    lastAudioEndRef.current = audioEnd;

                    const newEntry: TranscriptEntry = {
                        id: `entry-${++entryIdRef.current}`,
                        speaker,
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
    }, [detectSpeakerChange]);

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

    /**
     * Add a highlight at the specified timestamp
     */
    const addHighlight = useCallback((timestamp: number) => {
        setHighlights(prev => [...prev, timestamp]);

        // Also mark the current transcript entry as highlighted if it exists
        setState(prev => {
            const entries = prev.transcriptEntries.map((entry, index) => {
                // Find the entry closest to this timestamp
                if (index === prev.transcriptEntries.length - 1) {
                    return { ...entry, isHighlighted: true };
                }
                return entry;
            });
            return { ...prev, transcriptEntries: entries };
        });
    }, []);

    return {
        ...state,
        connect,
        disconnect,
        sendAudio,
        addHighlight,
        highlights,
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
