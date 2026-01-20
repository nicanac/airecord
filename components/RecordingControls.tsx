"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pause, Play, Square, Flag, ChevronLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecordingControlsProps {
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onHighlight?: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
    isPaused,
    onPause,
    onResume,
    onStop,
    onHighlight,
}) => {
    return (
        <div className="flex items-center justify-center gap-6">
            {/* Highlight Button */}
            <motion.button
                onClick={onHighlight}
                className="w-12 h-12 rounded-full vibe-glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add highlight"
            >
                <Flag className="w-5 h-5" />
            </motion.button>

            {/* Main Stop Button */}
            <motion.button
                onClick={onStop}
                className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-lg gradient-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Stop recording"
            >
                <Square className="w-6 h-6 text-white fill-white" />
            </motion.button>

            {/* Pause/Resume Button */}
            <motion.button
                onClick={isPaused ? onResume : onPause}
                className="w-12 h-12 rounded-full vibe-glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isPaused ? "Resume recording" : "Pause recording"}
            >
                {isPaused ? (
                    <Play className="w-5 h-5" />
                ) : (
                    <Pause className="w-5 h-5" />
                )}
            </motion.button>
        </div>
    );
};

interface RecordingHeaderProps {
    title: string;
    onBack: () => void;
}

export const RecordingHeader: React.FC<RecordingHeaderProps> = ({ title, onBack }) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 pt-safe">
            <motion.button
                onClick={onBack}
                className="w-10 h-10 rounded-full vibe-glass flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-recording" />
                <span className="text-sm font-medium text-foreground">{title}</span>
            </div>

            <div className="w-10" /> {/* Spacer for centering */}
        </div>
    );
};

interface AIStatusProps {
    status: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ status }) => {
    return (
        <motion.div
            className="flex items-center justify-center gap-2 py-3 px-4 vibe-glass rounded-full mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">{status}</span>
        </motion.div>
    );
};
