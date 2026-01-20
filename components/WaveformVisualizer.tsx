"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface WaveformVisualizerProps {
    analyzerData: Uint8Array | null;
    isRecording: boolean;
    isPaused?: boolean;
    barCount?: number;
    barWidth?: number;
    barGap?: number;
    minBarHeight?: number;
    maxBarHeight?: number;
    color?: string;
    className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
    analyzerData,
    isRecording,
    isPaused = false,
    barCount = 40,
    barWidth = 3,
    barGap = 2,
    minBarHeight = 4,
    maxBarHeight = 60,
    color = "var(--primary)",
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate bar positions
        const totalBarWidth = barWidth + barGap;
        const startX = (width - barCount * totalBarWidth + barGap) / 2;

        // Get frequency data or use idle animation
        const bars: number[] = [];

        if (analyzerData && isRecording && !isPaused) {
            // Sample the analyzer data to match bar count
            const step = Math.floor(analyzerData.length / barCount);
            for (let i = 0; i < barCount; i++) {
                const value = analyzerData[i * step] || 0;
                const normalizedHeight = (value / 255) * (maxBarHeight - minBarHeight) + minBarHeight;
                bars.push(normalizedHeight);
            }
        } else {
            // Idle animation - gentle wave
            const time = Date.now() / 1000;
            for (let i = 0; i < barCount; i++) {
                const wave = Math.sin(time * 2 + i * 0.2) * 0.3 + 0.7;
                bars.push(minBarHeight * wave + minBarHeight);
            }
        }

        // Draw bars with gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.6)");
        gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.9)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 1)");

        ctx.fillStyle = isRecording && !isPaused ? gradient : "rgba(139, 92, 246, 0.4)";

        bars.forEach((barHeight, index) => {
            const x = startX + index * totalBarWidth;
            const y = (height - barHeight) / 2;

            // Draw rounded bar
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
            ctx.fill();
        });

        animationRef.current = requestAnimationFrame(draw);
    }, [analyzerData, isRecording, isPaused, barCount, barWidth, barGap, minBarHeight, maxBarHeight]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size for retina displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        // Start animation loop
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [draw]);

    return (
        <motion.div
            className={`relative ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-16"
                style={{
                    width: "100%",
                    height: "64px",
                }}
            />
            {isPaused && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="text-xs text-white/70 uppercase tracking-wider">Paused</span>
                </motion.div>
            )}
        </motion.div>
    );
};
