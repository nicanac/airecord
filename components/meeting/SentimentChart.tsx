"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface SentimentDataPoint {
    time: string;
    positive: number;
    negative: number;
}

interface SentimentChartProps {
    data: SentimentDataPoint[];
    overallSentiment: "Positive" | "Neutral" | "Negative";
}

export const SentimentChart: React.FC<SentimentChartProps> = ({
    data,
    overallSentiment,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const sentimentColors = {
        Positive: "text-green-400",
        Neutral: "text-yellow-400",
        Negative: "text-red-400",
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size for retina displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const barWidth = (width - 40) / data.length - 4;
        const maxValue = 100;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw bars
        data.forEach((point, index) => {
            const x = 20 + index * (barWidth + 4);
            const positiveHeight = (point.positive / maxValue) * (height - 30);
            const negativeHeight = (point.negative / maxValue) * (height - 30);

            // Gradient for positive bars
            const positiveGradient = ctx.createLinearGradient(x, height - 20, x, height - 20 - positiveHeight);
            positiveGradient.addColorStop(0, "rgba(139, 92, 246, 0.8)");
            positiveGradient.addColorStop(1, "rgba(59, 130, 246, 0.8)");

            // Gradient for negative bars (smaller, offset)
            const negativeGradient = ctx.createLinearGradient(x, height - 20, x, height - 20 - negativeHeight);
            negativeGradient.addColorStop(0, "rgba(239, 68, 68, 0.6)");
            negativeGradient.addColorStop(1, "rgba(239, 68, 68, 0.3)");

            // Draw positive bar
            ctx.fillStyle = positiveGradient;
            ctx.beginPath();
            ctx.roundRect(x, height - 20 - positiveHeight, barWidth * 0.6, positiveHeight, 3);
            ctx.fill();

            // Draw negative bar (offset to the right)
            ctx.fillStyle = negativeGradient;
            ctx.beginPath();
            ctx.roundRect(x + barWidth * 0.4, height - 20 - negativeHeight, barWidth * 0.6, negativeHeight, 3);
            ctx.fill();

            // Draw time label
            ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
            ctx.font = "10px Inter, system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(point.time, x + barWidth / 2, height - 5);
        });
    }, [data]);

    return (
        <motion.div
            className="vibe-glass rounded-2xl p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Sentiment Analysis</h3>
                <span className={`text-sm font-medium ${sentimentColors[overallSentiment]}`}>
                    {overallSentiment}
                </span>
            </div>

            <canvas
                ref={canvasRef}
                className="w-full"
                style={{ width: "100%", height: "120px" }}
            />

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-primary to-secondary" />
                    <span className="text-xs text-muted-foreground">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500/60" />
                    <span className="text-xs text-muted-foreground">Negative</span>
                </div>
            </div>
        </motion.div>
    );
};
