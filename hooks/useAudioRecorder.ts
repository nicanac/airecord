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

export interface AudioRecorderOptions {
    /**
     * Callback for streaming audio data (PCM 16-bit, 16kHz mono)
     * Called approximately every 100ms with audio buffer
     */
    onAudioData?: (audioData: ArrayBuffer) => void;
    /**
     * Sample rate for streaming (default: 16000 for AssemblyAI)
     */
    streamingSampleRate?: number;
}

export interface UseAudioRecorderReturn extends AudioRecorderState {
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    pauseRecording: () => void;
    resumeRecording: () => void;
    getAudioBlob: () => Blob | null;
}

// Target sample rate for AssemblyAI streaming
const STREAMING_SAMPLE_RATE = 16000;

export function useAudioRecorder(
    options: AudioRecorderOptions = {}
): UseAudioRecorderReturn {
    const { onAudioData, streamingSampleRate = STREAMING_SAMPLE_RATE } = options;

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
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const onAudioDataRef = useRef(onAudioData);

    // Keep callback ref updated
    useEffect(() => {
        onAudioDataRef.current = onAudioData;
    }, [onAudioData]);

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
            if (processorRef.current) {
                processorRef.current.disconnect();
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

    /**
     * Downsample audio from source sample rate to target sample rate
     */
    const downsampleBuffer = useCallback(
        (buffer: Float32Array, sourceSampleRate: number): ArrayBuffer => {
            if (sourceSampleRate === streamingSampleRate) {
                return float32ToPCM16(buffer);
            }

            const ratio = sourceSampleRate / streamingSampleRate;
            const newLength = Math.round(buffer.length / ratio);
            const result = new Float32Array(newLength);

            for (let i = 0; i < newLength; i++) {
                const srcIndex = Math.round(i * ratio);
                result[i] = buffer[srcIndex];
            }

            return float32ToPCM16(result);
        },
        [streamingSampleRate]
    );

    /**
     * Convert Float32Array audio to PCM 16-bit
     */
    const float32ToPCM16 = (input: Float32Array): ArrayBuffer => {
        const buffer = new ArrayBuffer(input.length * 2);
        const view = new DataView(buffer);

        for (let i = 0; i < input.length; i++) {
            // Clamp and convert to 16-bit signed integer
            const sample = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        }

        return buffer;
    };

    const startRecording = useCallback(async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: { ideal: 48000 }, // Higher sample rate for better quality
                },
            });

            streamRef.current = stream;

            // Setup Audio Context for visualization and streaming
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);

            // Setup Analyzer for visualization
            analyzerRef.current = audioContextRef.current.createAnalyser();
            analyzerRef.current.fftSize = 256;
            source.connect(analyzerRef.current);

            // Setup ScriptProcessor for streaming audio data to transcription
            if (onAudioDataRef.current) {
                // Buffer size of 4096 gives ~85ms chunks at 48kHz
                const bufferSize = 4096;
                processorRef.current = audioContextRef.current.createScriptProcessor(
                    bufferSize,
                    1,
                    1
                );

                processorRef.current.onaudioprocess = (event) => {
                    if (state.isPaused) return;

                    const inputBuffer = event.inputBuffer.getChannelData(0);
                    const sourceSampleRate = audioContextRef.current?.sampleRate || 48000;

                    // Downsample and convert to PCM16
                    const pcmData = downsampleBuffer(inputBuffer, sourceSampleRate);

                    // Send to streaming transcription
                    onAudioDataRef.current?.(pcmData);
                };

                source.connect(processorRef.current);
                processorRef.current.connect(audioContextRef.current.destination);
            }

            // Setup MediaRecorder for local recording
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
    }, [updateAnalyzerData, downsampleBuffer]);

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
                if (processorRef.current) {
                    processorRef.current.disconnect();
                    processorRef.current = null;
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
