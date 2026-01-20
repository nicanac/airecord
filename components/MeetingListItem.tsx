"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Meeting {
    id: string;
    title: string;
    participants: string[];
    duration: string;
    time: string;
    status: "completed" | "processing" | "live";
    avatarEmoji?: string;
}

interface MeetingListItemProps {
    meeting: Meeting;
    index?: number;
}

export const MeetingListItem: React.FC<MeetingListItemProps> = ({ meeting, index = 0 }) => {
    const statusColors = {
        completed: "bg-green-500",
        processing: "bg-yellow-500 animate-pulse",
        live: "bg-red-500 animate-recording",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
        >
            <Link href={`/meeting/${meeting.id}`}>
                <div className="meeting-card group">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xl">
                            {meeting.avatarEmoji || "📋"}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${statusColors[meeting.status]} border-2 border-[var(--background)]`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {meeting.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                {meeting.participants.length}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {meeting.duration}
                            </span>
                        </div>
                    </div>

                    {/* Time & Arrow */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{meeting.time}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

interface MeetingListProps {
    meetings: Meeting[];
    title?: string;
    showViewAll?: boolean;
}

export const MeetingList: React.FC<MeetingListProps> = ({
    meetings,
    title = "Recent Meetings",
    showViewAll = true,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                {showViewAll && (
                    <Link href="/meetings" className="text-sm text-primary hover:text-primary/80 transition-colors">
                        View All
                    </Link>
                )}
            </div>
            <div className="space-y-3">
                {meetings.map((meeting, index) => (
                    <MeetingListItem key={meeting.id} meeting={meeting} index={index} />
                ))}
            </div>
        </div>
    );
};
