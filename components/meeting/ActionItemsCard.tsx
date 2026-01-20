"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Circle, ChevronRight, User } from "lucide-react";
import Link from "next/link";

export interface ActionItem {
    id: string;
    description: string;
    assignee: string;
    priority: "High" | "Medium" | "Low";
    isCompleted: boolean;
}

interface ActionItemRowProps {
    item: ActionItem;
    onToggle: (id: string) => void;
    index: number;
}

const priorityClasses = {
    High: "priority-high",
    Medium: "priority-medium",
    Low: "priority-low",
};

const ActionItemRow: React.FC<ActionItemRowProps> = ({ item, onToggle, index }) => {
    return (
        <motion.div
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${item.isCompleted ? "opacity-50" : "hover:bg-white/5"}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            {/* Checkbox */}
            <button
                onClick={() => onToggle(item.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item.isCompleted
                        ? "bg-primary border-primary"
                        : "border-white/30 hover:border-primary"
                    }`}
            >
                {item.isCompleted && <Check className="w-3 h-3 text-white" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm ${item.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.description}
                </p>

                <div className="flex items-center gap-3 mt-2">
                    {/* Assignee */}
                    <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.assignee}</span>
                    </div>

                    {/* Priority */}
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${priorityClasses[item.priority]}`}>
                        {item.priority}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

interface ActionItemsCardProps {
    items: ActionItem[];
    onToggle: (id: string) => void;
    showViewAll?: boolean;
}

export const ActionItemsCard: React.FC<ActionItemsCardProps> = ({
    items,
    onToggle,
    showViewAll = true,
}) => {
    const completedCount = items.filter(item => item.isCompleted).length;

    return (
        <motion.div
            className="vibe-glass rounded-2xl p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-foreground">Action Items</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {completedCount}/{items.length} completed
                    </p>
                </div>

                {showViewAll && (
                    <Link href="#" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                        See All
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
                <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / items.length) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                />
            </div>

            {/* Items list */}
            <div className="space-y-1">
                {items.slice(0, 5).map((item, index) => (
                    <ActionItemRow
                        key={item.id}
                        item={item}
                        onToggle={onToggle}
                        index={index}
                    />
                ))}
            </div>
        </motion.div>
    );
};
