import { useRef, useCallback } from 'react';
import { create } from 'zustand';

export const useAudioStore = create((set) => ({
    isMuted: false,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));

const FREQUENCIES = {
    critical: [880, 660, 880],
    high: [660, 550],
    medium: [440],
    low: [330],
};

const DURATIONS = {
    critical: 150,
    high: 120,
    medium: 100,
    low: 80,
};

export function useAudioAlert() {
    const audioContextRef = useRef(null);

    const getContext = useCallback(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playAlert = useCallback((priority = 'medium') => {
        const { isMuted } = useAudioStore.getState();
        if (isMuted) return;

        try {
            const ctx = getContext();
            const freqs = FREQUENCIES[priority] || FREQUENCIES.medium;
            const dur = DURATIONS[priority] || 100;

            freqs.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                osc.type = priority === 'critical' ? 'square' : 'sine';

                const startTime = ctx.currentTime + (i * dur * 1.5) / 1000;
                const endTime = startTime + dur / 1000;

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, endTime);

                osc.start(startTime);
                osc.stop(endTime + 0.05);
            });
        } catch (e) {
            // Audio not supported or blocked
        }
    }, [getContext]);

    return { playAlert };
}
