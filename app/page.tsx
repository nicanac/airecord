"use client";

import { useState } from "react";
import { RecordButton } from "@/components/RecordButton";

export default function Home() {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--background)]">
            <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-12 text-center">
                <div className="space-y-2">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        MeetFlow AI
                    </h1>
                    <p className="text-muted-foreground text-sm tracking-widest uppercase">
                        Intelligent Meeting Companion
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <RecordButton
                        isRecording={isRecording}
                        onClick={() => setIsRecording(!isRecording)}
                    />
                    <div className="flex flex-col items-center gap-1">
                        <p className={cn(
                            "text-xs uppercase tracking-[0.2em] transition-all duration-300",
                            isRecording ? "text-primary animate-pulse" : "text-muted-foreground"
                        )}>
                            {isRecording ? "Listening..." : "Tap to record"}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
