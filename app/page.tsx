"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Clock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { GradientHeader } from "@/components/GradientHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MetricCard } from "@/components/MetricCard";
import { MeetingList, type Meeting } from "@/components/MeetingListItem";

// Mock data for demonstration
const mockMeetings: Meeting[] = [
    {
        id: "1",
        title: "Product Roadmap Q3",
        participants: ["Sarah", "Mike", "Alex"],
        duration: "45m",
        time: "10:30 AM",
        status: "completed",
        avatarEmoji: "📊",
    },
    {
        id: "2",
        title: "Client Sync",
        participants: ["John", "Emma"],
        duration: "30m",
        time: "Yesterday",
        status: "completed",
        avatarEmoji: "🤝",
    },
    {
        id: "3",
        title: "Design Review",
        participants: ["Lisa", "Tom", "Sarah", "Mike"],
        duration: "1h 15m",
        time: "Yesterday",
        status: "processing",
        avatarEmoji: "🎨",
    },
];

export default function Home() {
    const router = useRouter();

    const handleStartRecording = () => {
        router.push("/recording");
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            {/* Header */}
            <GradientHeader />

            {/* Main Content */}
            <main className="px-6 -mt-2">
                {/* Start Recording Hero Card */}
                <motion.div
                    className="vibe-glass-strong rounded-3xl p-6 gradient-glow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(139, 92, 246, 0.4)",
                                    "0 0 40px rgba(139, 92, 246, 0.6)",
                                    "0 0 20px rgba(139, 92, 246, 0.4)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Mic className="w-7 h-7 text-white" />
                        </motion.div>

                        <h2 className="text-xl font-bold text-foreground mb-1">Start Recording</h2>
                        <p className="text-sm text-muted-foreground mb-5">
                            AI will transcribe &amp; summarize instantly
                        </p>

                        <motion.button
                            onClick={handleStartRecording}
                            className="w-full py-3.5 px-6 gradient-primary rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Mic className="w-4 h-4" />
                            Record Meeting
                        </motion.button>
                    </div>
                </motion.div>

                {/* Metrics Row */}
                <motion.div
                    className="grid grid-cols-2 gap-4 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <MetricCard
                        icon={Clock}
                        value="12.5"
                        label="SAVED TIME"
                        sublabel="↑ 3 hrs this week"
                        variant="highlight"
                    />
                    <MetricCard
                        icon={FileText}
                        value="24"
                        label="MEETINGS"
                        sublabel="2 processing"
                    />
                </motion.div>

                {/* Recent Meetings */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <MeetingList meetings={mockMeetings} />
                </motion.div>
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}
