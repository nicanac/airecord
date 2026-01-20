"use client";

import React from "react";
import { motion } from "framer-motion";

interface SummaryTabProps {
    summary: string;
    highlights: string[];
    participants: string[];
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
    summary,
    highlights,
    participants,
}) => {
    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* AI Summary Card */}
            <div className="vibe-glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">✨</span>
                    <h3 className="font-semibold text-foreground">AI Summary</h3>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed">
                    {summary}
                </p>

                {/* Participant mentions */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {participants.map((participant, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                            {participant}
                        </span>
                    ))}
                </div>
            </div>

            {/* Key Highlights */}
            <div className="vibe-glass rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Key Highlights</h3>

                <ul className="space-y-3">
                    {highlights.map((highlight, index) => (
                        <motion.li
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                                {index + 1}
                            </span>
                            <p className="text-sm text-foreground/80">{highlight}</p>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};
