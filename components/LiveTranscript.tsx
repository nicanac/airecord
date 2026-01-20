"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToggleLeft, ToggleRight, Star } from "lucide-react";

export interface TranscriptEntry {
    id: string;
    speaker: string;
    speakerColor?: string;
    content: string;
    timestamp: number; // in seconds
    isHighlighted?: boolean;
}

interface LiveTranscriptProps {
    entries: TranscriptEntry[];
    isAutoScrolling: boolean;
    onToggleAutoScroll: () => void;
    isRecording: boolean;
}

const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const speakerColors: Record<string, string> = {
    "Speaker 1": "text-purple-400",
    "Speaker 2": "text-blue-400",
    "Speaker 3": "text-green-400",
    "Speaker 4": "text-orange-400",
    "Speaker 5": "text-pink-400",
    default: "text-primary",
};

const speakerBgColors: Record<string, string> = {
    "Speaker 1": "bg-purple-500/20",
    "Speaker 2": "bg-blue-500/20",
    "Speaker 3": "bg-green-500/20",
    "Speaker 4": "bg-orange-500/20",
    "Speaker 5": "bg-pink-500/20",
    default: "bg-primary/20",
};

const getSpeakerColor = (speaker: string): string => {
    return speakerColors[speaker] || speakerColors.default;
};

const getSpeakerBgColor = (speaker: string): string => {
    return speakerBgColors[speaker] || speakerBgColors.default;
};

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
    entries,
    isAutoScrolling,
    onToggleAutoScroll,
    isRecording,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new entries arrive
    useEffect(() => {
        if (isAutoScrolling && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [entries, isAutoScrolling]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-1 pb-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Live Transcript
                </h3>
                <button
                    onClick={onToggleAutoScroll}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {isAutoScrolling ? (
                        <ToggleRight className="w-4 h-4 text-primary" />
                    ) : (
                        <ToggleLeft className="w-4 h-4" />
                    )}
                    <span>Auto-scrolling</span>
                </button>
            </div>

            {/* Transcript Container */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                <AnimatePresence mode="popLayout">
                    {entries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex gap-3 ${entry.isHighlighted ? "relative" : ""}`}
                        >
                            {/* Highlight indicator */}
                            {entry.isHighlighted && (
                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-yellow-400 rounded-full" />
                            )}

                            {/* Speaker Avatar */}
                            <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full ${getSpeakerBgColor(entry.speaker)} flex items-center justify-center text-xs font-medium ${getSpeakerColor(entry.speaker)}`}>
                                    {entry.speaker.charAt(entry.speaker.length - 1)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-medium ${getSpeakerColor(entry.speaker)}`}>
                                        {entry.speaker}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {formatTimestamp(entry.timestamp)}
                                    </span>
                                    {entry.isHighlighted && (
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    )}
                                </div>
                                <p className={`text-sm leading-relaxed ${entry.isHighlighted ? "text-foreground" : "text-foreground/90"}`}>
                                    {entry.content}
                                    {index === entries.length - 1 && isRecording && entry.id.startsWith("partial-") && (
                                        <span className="inline-block w-2 h-4 bg-primary/50 ml-1 animate-pulse" />
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {entries.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <span className="text-2xl">🎙️</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Listening for speech...
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Transcript will appear here in real-time
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
