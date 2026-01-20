"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useStreamingTranscription } from "@/hooks/useStreamingTranscription";
import { WaveformVisualizer } from "@/components/WaveformVisualizer";
import { RecordingControls, RecordingHeader, AIStatus } from "@/components/RecordingControls";
import { LiveTranscript } from "@/components/LiveTranscript";

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

export default function RecordingPage() {
    const router = useRouter();
    const hasStartedRef = useRef(false);

    // Streaming transcription hook
    const {
        isConnected: isTranscriptionConnected,
        isConnecting: isTranscriptionConnecting,
        transcriptEntries,
        error: transcriptionError,
        connect: connectTranscription,
        disconnect: disconnectTranscription,
        sendAudio,
        addHighlight,
        highlights,
    } = useStreamingTranscription();

    // Audio recorder hook with streaming callback
    const {
        isRecording,
        isPaused,
        duration,
        analyzerData,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        error: recorderError,
    } = useAudioRecorder({
        onAudioData: sendAudio,
    });

    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [meetingTitle] = useState("Product Sync - Q3 Roadmap");
    const [showHighlightToast, setShowHighlightToast] = useState(false);

    // Start recording and transcription when page loads
    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const initializeRecording = async () => {
            // First connect to transcription service
            await connectTranscription();
            // Then start recording
            await startRecording();
        };

        initializeRecording();

        // Cleanup on unmount
        return () => {
            disconnectTranscription();
        };
    }, [connectTranscription, startRecording, disconnectTranscription]);

    const handleStop = useCallback(async () => {
        // Disconnect transcription first
        disconnectTranscription();

        // Stop recording
        const audioBlob = await stopRecording();
        if (audioBlob) {
            // In real app, upload blob and create meeting record
            console.log("Recording stopped, blob size:", audioBlob.size);
            console.log("Highlights:", highlights);
        }

        // Navigate to meeting summary (mock ID for now)
        router.push("/meeting/new-meeting-id");
    }, [stopRecording, disconnectTranscription, router, highlights]);

    const handleBack = useCallback(async () => {
        disconnectTranscription();
        await stopRecording();
        router.back();
    }, [stopRecording, disconnectTranscription, router]);

    const handleHighlight = useCallback(() => {
        // Add highlight at current timestamp
        addHighlight(duration);

        // Show toast feedback
        setShowHighlightToast(true);
        setTimeout(() => setShowHighlightToast(false), 2000);
    }, [duration, addHighlight]);

    // Combine errors
    const error = recorderError || transcriptionError;

    // Determine AI status message
    const getAIStatus = (): string => {
        if (isTranscriptionConnecting) {
            return "Connecting to transcription service...";
        }
        if (!isTranscriptionConnected && !isTranscriptionConnecting) {
            return "Transcription offline - recording locally";
        }
        if (transcriptEntries.length === 0) {
            return "AI listening for speech...";
        }
        return "AI is transcribing and generating insights...";
    };

    // Count unique speakers
    const uniqueSpeakers = new Set(transcriptEntries.map(e => e.speaker)).size;

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
                        {isPaused ? "Paused" : isRecording ? "Recording active" : "Starting..."}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        {isTranscriptionConnected && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Live transcription
                            </span>
                        )}
                        {uniqueSpeakers > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {uniqueSpeakers} speaker{uniqueSpeakers !== 1 ? "s" : ""} detected
                            </span>
                        )}
                        {highlights.length > 0 && (
                            <span className="text-xs text-yellow-400">
                                ★ {highlights.length} highlight{highlights.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
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
                    <AIStatus status={getAIStatus()} />
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

            {/* Highlight Toast */}
            {showHighlightToast && (
                <motion.div
                    className="fixed top-20 left-4 right-4 bg-yellow-500/90 backdrop-blur-lg rounded-xl p-4 flex items-center gap-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <span className="text-lg">⭐</span>
                    <p className="text-sm text-black font-medium">Highlight added at {formatDuration(duration)}</p>
                </motion.div>
            )}
        </div>
    );
}
