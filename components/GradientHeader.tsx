"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface GradientHeaderProps {
    showSearch?: boolean;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    children?: React.ReactNode;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
    showSearch = true,
    onSearchChange,
    searchPlaceholder = "Search transcripts, tasks...",
    children,
}) => {
    return (
        <motion.header
            className="gradient-header relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Background glow effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 px-6 pt-safe">
                {/* Branding */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-lg">🎙️</span>
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-bold text-white">MeetFlow AI</h1>
                            <p className="text-xs text-white/70">Good Morning, Alex</p>
                        </div>
                    </div>
                    <motion.button
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-lg">⚙️</span>
                    </motion.button>
                </div>

                {/* Search bar */}
                {showSearch && (
                    <motion.div
                        className="pb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                            />
                        </div>
                    </motion.div>
                )}

                {children}
            </div>
        </motion.header>
    );
};
