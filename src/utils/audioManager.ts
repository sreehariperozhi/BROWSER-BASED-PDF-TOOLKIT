import { useStore } from '../store';

class AudioManager {
    private static instance: AudioManager;
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private constructor() {
        this.initAudio();
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    private initAudio() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3; // Default volume
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    private get isSoundEnabled(): boolean {
        return useStore.getState().settings.soundEnabled;
    }

    private async resumeContext() {
        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    public async playClick() {
        if (!this.isSoundEnabled || !this.audioContext || !this.masterGain) return;
        await this.resumeContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Short high-pitched click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);

        gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
    }

    public async playSuccess() {
        if (!this.isSoundEnabled || !this.audioContext || !this.masterGain) return;
        await this.resumeContext();

        const t = this.audioContext.currentTime;

        // Arpeggio up
        this.playTone(600, t, 0.1);
        this.playTone(800, t + 0.1, 0.1);
        this.playTone(1200, t + 0.2, 0.3);
    }

    public async playError() {
        if (!this.isSoundEnabled || !this.audioContext || !this.masterGain) return;
        await this.resumeContext();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    private playTone(freq: number, startTime: number, duration: number) {
        if (!this.audioContext || !this.masterGain) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }
}

export const audioManager = AudioManager.getInstance();
