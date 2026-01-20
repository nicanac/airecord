"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { WaveformVisualizer } from "@/components/WaveformVisualizer";
import { RecordingControls, RecordingHeader, AIStatus } from "@/components/RecordingControls";
import { LiveTranscript, type TranscriptEntry } from "@/components/LiveTranscript";

// Format seconds to MM:SS:CC format
const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `00:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Mock transcript entries for demo
const generateMockTranscript = (duration: number): TranscriptEntry[] => {
    const entries: TranscriptEntry[] = [];

    if (duration >= 3) {
        entries.push({
            id: "1",
            speaker: "Speaker 1",
            content: "Let's review the API and see if we have time for the frontend updates.",
            timestamp: 3,
        });
    }

    if (duration >= 8) {
        entries.push({
            id: "2",
            speaker: "Speaker 2",
            content: "I think we should prioritize the authentication flow first. The team has been waiting on that.",
            timestamp: 8,
        });
    }

    if (duration >= 15) {
        entries.push({
            id: "3",
            speaker: "Speaker 1",
            content: "Good point. Sarah, can you take the lead on the backend integration? Mike can handle the UI components.",
            timestamp: 15,
        });
    }

    return entries;
};

export default function RecordingPage() {
    const router = useRouter();
    const {
        isRecording,
        isPaused,
        duration,
        analyzerData,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        error,
    } = useAudioRecorder();

    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
    const [meetingTitle] = useState("Product Sync - Q3 Roadmap");

    // Start recording when page loads
    useEffect(() => {
        startRecording();
    }, []);

    // Update mock transcript based on duration
    useEffect(() => {
        setTranscriptEntries(generateMockTranscript(duration));
    }, [duration]);

    const handleStop = useCallback(async () => {
        const audioBlob = await stopRecording();
        if (audioBlob) {
            // In real app, upload blob and create meeting record
            console.log("Recording stopped, blob size:", audioBlob.size);
        }
        // Navigate to meeting summary (mock ID for now)
        router.push("/meeting/new-meeting-id");
    }, [stopRecording, router]);

    const handleBack = useCallback(async () => {
        await stopRecording();
        router.back();
    }, [stopRecording, router]);

    const handleHighlight = useCallback(() => {
        // Add highlight timestamp
        console.log("Highlight added at:", duration);
    }, [duration]);

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            {/* Header */}
            <RecordingHeader title={meetingTitle} onBack={handleBack} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col px-6 py-4">
                {/* Timer */}
                <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <p className="recording-timer text-gradient">
                        {formatDuration(duration)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {isPaused ? "Paused" : "Recording active"}
                    </p>
                </motion.div>

                {/* Waveform Visualizer */}
                <motion.div
                    className="py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <WaveformVisualizer
                        analyzerData={analyzerData}
                        isRecording={isRecording}
                        isPaused={isPaused}
                        className="vibe-glass rounded-2xl p-4"
                    />
                </motion.div>

                {/* Live Transcript */}
                <motion.div
                    className="flex-1 vibe-glass rounded-2xl p-4 mt-4 min-h-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <LiveTranscript
                        entries={transcriptEntries}
                        isAutoScrolling={isAutoScrolling}
                        onToggleAutoScroll={() => setIsAutoScrolling(!isAutoScrolling)}
                        isRecording={isRecording && !isPaused}
                    />
                </motion.div>

                {/* Participants */}
                <motion.div
                    className="flex items-center justify-center gap-4 py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex -space-x-2">
                        {["👨‍💼", "👩‍💼", "🧑‍💻"].map((emoji, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-white/10 border-2 border-[var(--background)] flex items-center justify-center text-sm"
                            >
                                {emoji}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-[var(--background)] flex items-center justify-center">
                            <span className="text-xs text-primary">+2</span>
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">5 participants</span>
                </motion.div>
            </main>

            {/* Bottom Section */}
            <div className="px-6 pb-safe">
                {/* AI Status */}
                <div className="pb-4">
                    <AIStatus status="AI is generating action items..." />
                </div>

                {/* Controls */}
                <div className="pb-6">
                    <RecordingControls
                        isPaused={isPaused}
                        onPause={pauseRecording}
                        onResume={resumeRecording}
                        onStop={handleStop}
                        onHighlight={handleHighlight}
                    />
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <motion.div
                    className="fixed top-20 left-4 right-4 bg-destructive/90 backdrop-blur-lg rounded-xl p-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-sm text-white">{error}</p>
                </motion.div>
            )}
        </div>
    );
}
