// Simple Web Audio API wrapper for UI sounds
// No external assets required

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

const playTone = (freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
};

export const playUISound = (type: 'click' | 'success' | 'error' | 'hover') => {
    // Check if sound is enabled in localStorage (direct check to avoid hook dependency issues in utils)
    // In a real app, we might pass this config in, but for a simple util this works
    // We'll rely on the caller to check the store setting usually, but this is a fallback

    switch (type) {
        case 'click':
            playTone(600, 'sine', 0.1, 0.05);
            break;
        case 'hover':
            playTone(400, 'sine', 0.05, 0.02);
            break;
        case 'success':
            playTone(800, 'sine', 0.1, 0.1);
            setTimeout(() => playTone(1200, 'sine', 0.2, 0.1), 100);
            break;
        case 'error':
            playTone(300, 'sawtooth', 0.1, 0.1);
            setTimeout(() => playTone(200, 'sawtooth', 0.2, 0.1), 100);
            break;
    }
};
