"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    duration: number;
    audioLevel: number;
    analyzerData: Uint8Array | null;
    error: string | null;
}

export interface UseAudioRecorderReturn extends AudioRecorderState {
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    pauseRecording: () => void;
    resumeRecording: () => void;
    getAudioBlob: () => Blob | null;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
    const [state, setState] = useState<AudioRecorderState>({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioLevel: 0,
        analyzerData: null,
        error: null,
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedDurationRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const updateAnalyzerData = useCallback(() => {
        if (!analyzerRef.current || !state.isRecording || state.isPaused) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);

        // Calculate audio level (average of frequencies)
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        const normalizedLevel = average / 255;

        setState(prev => ({
            ...prev,
            audioLevel: normalizedLevel,
            analyzerData: dataArray,
        }));

        animationFrameRef.current = requestAnimationFrame(updateAnalyzerData);
    }, [state.isRecording, state.isPaused]);

    const startRecording = useCallback(async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            streamRef.current = stream;

            // Setup Audio Context for visualization
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyzerRef.current = audioContextRef.current.createAnalyser();
            analyzerRef.current.fftSize = 256;
            source.connect(analyzerRef.current);

            // Setup MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm")
                    ? "audio/webm"
                    : "audio/mp4",
            });

            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(1000); // Collect data every second

            startTimeRef.current = Date.now();
            pausedDurationRef.current = 0;

            // Start duration timer
            timerRef.current = setInterval(() => {
                setState(prev => {
                    if (prev.isPaused) return prev;
                    const elapsed = Date.now() - startTimeRef.current - pausedDurationRef.current;
                    return { ...prev, duration: Math.floor(elapsed / 1000) };
                });
            }, 100);

            setState(prev => ({
                ...prev,
                isRecording: true,
                isPaused: false,
                duration: 0,
                error: null,
            }));

            // Start analyzer animation
            animationFrameRef.current = requestAnimationFrame(updateAnalyzerData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to access microphone";
            setState(prev => ({ ...prev, error: errorMessage }));
            console.error("Recording error:", err);
        }
    }, [updateAnalyzerData]);

    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: mediaRecorderRef.current?.mimeType || "audio/webm",
                });

                // Cleanup
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }

                setState(prev => ({
                    ...prev,
                    isRecording: false,
                    isPaused: false,
                    audioLevel: 0,
                    analyzerData: null,
                }));

                resolve(blob);
            };

            mediaRecorderRef.current.stop();
        });
    }, []);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.pause();
            pausedDurationRef.current = Date.now();

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            setState(prev => ({ ...prev, isPaused: true }));
        }
    }, []);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
            mediaRecorderRef.current.resume();
            pausedDurationRef.current = Date.now() - pausedDurationRef.current;

            animationFrameRef.current = requestAnimationFrame(updateAnalyzerData);

            setState(prev => ({ ...prev, isPaused: false }));
        }
    }, [updateAnalyzerData]);

    const getAudioBlob = useCallback((): Blob | null => {
        if (chunksRef.current.length === 0) return null;
        return new Blob(chunksRef.current, {
            type: mediaRecorderRef.current?.mimeType || "audio/webm",
        });
    }, []);

    return {
        ...state,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        getAudioBlob,
    };
}
