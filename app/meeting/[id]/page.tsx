"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SummaryTab } from "@/components/meeting/SummaryTab";
import { SentimentChart, type SentimentDataPoint } from "@/components/meeting/SentimentChart";
import { ActionItemsCard, type ActionItem } from "@/components/meeting/ActionItemsCard";

type TabType = "summary" | "transcript" | "media";

// Mock data
const mockSummary = `The team discussed the Q4 roadmap priorities. **Sarah** highlighted the potential delays in the backend migration. It was agreed to prioritize the authentication module to enable mobile app deployment.`;

const mockHighlights = [
    "Backend migration pushed to Nov 15th",
    "Design team to finalize data model assets by Friday",
    "Priority shift to authentication module",
];

const mockSentimentData: SentimentDataPoint[] = [
    { time: "0:00", positive: 60, negative: 20 },
    { time: "5:00", positive: 75, negative: 15 },
    { time: "10:00", positive: 50, negative: 40 },
    { time: "15:00", positive: 80, negative: 10 },
    { time: "20:00", positive: 70, negative: 25 },
    { time: "25:00", positive: 85, negative: 8 },
];

const mockActionItems: ActionItem[] = [
    {
        id: "1",
        description: "Review API documentation",
        assignee: "Alex",
        priority: "High",
        isCompleted: false,
    },
    {
        id: "2",
        description: "Update design mockups for mobile",
        assignee: "Sarah",
        priority: "Medium",
        isCompleted: false,
    },
    {
        id: "3",
        description: "Schedule security audit meeting",
        assignee: "Mike",
        priority: "Low",
        isCompleted: true,
    },
];

export default function MeetingPage() {
    const router = useRouter();
    const params = useParams();
    const [activeTab, setActiveTab] = useState<TabType>("summary");
    const [actionItems, setActionItems] = useState<ActionItem[]>(mockActionItems);

    const meetingTitle = "Product Sync";
    const meetingDate = "Jan 20, 2026 • 45 minutes";

    const tabs: { id: TabType; label: string }[] = [
        { id: "summary", label: "Summary" },
        { id: "transcript", label: "Transcript" },
        { id: "media", label: "Media" },
    ];

    const handleToggleActionItem = (id: string) => {
        setActionItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            )
        );
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            {/* Header */}
            <div className="px-6 py-4 pt-safe flex items-center justify-between border-b border-white/5">
                <motion.button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full vibe-glass flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="text-center">
                    <h1 className="font-semibold text-foreground">{meetingTitle}</h1>
                    <p className="text-xs text-muted-foreground">{meetingDate}</p>
                </div>

                <motion.button
                    className="w-10 h-10 rounded-full vibe-glass flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Share2 className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 py-4">
                <div className="flex gap-2 p-1 vibe-glass rounded-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-button flex-1 ${activeTab === tab.id ? "active" : ""}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <main className="px-6 space-y-4">
                {activeTab === "summary" && (
                    <>
                        <SummaryTab
                            summary={mockSummary}
                            highlights={mockHighlights}
                            participants={["Sarah", "Mike", "Alex"]}
                        />

                        <SentimentChart
                            data={mockSentimentData}
                            overallSentiment="Positive"
                        />

                        <ActionItemsCard
                            items={actionItems}
                            onToggle={handleToggleActionItem}
                        />
                    </>
                )}

                {activeTab === "transcript" && (
                    <motion.div
                        className="vibe-glass rounded-2xl p-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center py-12">
                            <span className="text-4xl mb-4 block">📝</span>
                            <p className="text-muted-foreground">Full transcript view</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Coming soon</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === "media" && (
                    <motion.div
                        className="vibe-glass rounded-2xl p-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center py-12">
                            <span className="text-4xl mb-4 block">🎵</span>
                            <p className="text-muted-foreground">Audio playback</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Coming soon</p>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}
