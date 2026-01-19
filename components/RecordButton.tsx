"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface RecordButtonProps {
    isRecording: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
    isRecording,
    onClick,
    disabled = false,
}) => {
    return (
        <div className="relative flex items-center justify-center">
            {/* Outer Pulse Ring */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.1, 0.3],
                        }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute h-24 w-24 rounded-full bg-primary/20 blur-xl"
                    />
                )}
            </AnimatePresence>

            {/* Button Body */}
            <motion.button
                onClick={onClick}
                disabled={disabled}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "vibe-glass relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300",
                    isRecording
                        ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        : "hover:bg-white/10",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            >
                <AnimatePresence mode="wait">
                    {isRecording ? (
                        <motion.div
                            key="square"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Square className="h-6 w-6 text-primary fill-primary" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mic"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Mic className="h-6 w-6 text-foreground" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};
