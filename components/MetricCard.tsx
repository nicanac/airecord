"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Clock, FileText, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
    icon: LucideIcon;
    value: string | number;
    label: string;
    sublabel?: string;
    trend?: "up" | "down" | null;
    trendValue?: string;
    variant?: "default" | "highlight";
}

export const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon,
    value,
    label,
    sublabel,
    trend,
    trendValue,
    variant = "default",
}) => {
    return (
        <motion.div
            className={`metric-card ${variant === "highlight" ? "border-primary/30 bg-primary/5" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
                        {trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                {sublabel && (
                    <p className="text-[10px] text-primary mt-1">{sublabel}</p>
                )}
            </div>
        </motion.div>
    );
};

// Pre-configured variants for common metrics
export const SavedTimeCard: React.FC<{ hours: number; trend?: string }> = ({ hours, trend }) => (
    <MetricCard
        icon={Clock}
        value={`${hours}`}
        label="SAVED TIME"
        sublabel="↑ 3 hrs this week"
        trend="up"
        trendValue={trend}
        variant="highlight"
    />
);

export const MeetingsCountCard: React.FC<{ count: number; processing?: number }> = ({ count, processing }) => (
    <MetricCard
        icon={FileText}
        value={count}
        label="MEETINGS"
        sublabel={processing ? `${processing} processing` : undefined}
    />
);
