import { useEffect, useRef } from 'react';
import { Check, X, Download } from 'lucide-react';
import { useStore } from '../../store';
import { playUISound } from '../../utils/sound';

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onDownload?: () => void;
}

export default function ResultModal({ isOpen, onClose, title, message, onDownload }: ResultModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { settings } = useStore();

    useEffect(() => {
        if (isOpen && settings.soundEnabled) {
            playUISound('success');
        }

        if (isOpen && settings.particlesEnabled && canvasRef.current) {
            // Simple confetti effect
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const particles: any[] = [];
            const colors = ['#a06bff', '#00f2ff', '#ffffff'];

            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 4 + 2,
                    life: 100
                });
            }

            const animate = () => {
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                let activeParticles = false;

                particles.forEach((p) => {
                    if (p.life > 0) {
                        activeParticles = true;
                        p.x += p.vx;
                        p.y += p.vy;
                        p.life--;
                        p.vy += 0.1; // gravity

                        ctx.globalAlpha = p.life / 100;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                if (activeParticles) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }
    }, [isOpen, settings]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-drop border border-neon-purple/50">
                {/* Confetti Canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

                <div className="relative z-10 p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse-slow">
                        <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                        {title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium"
                        >
                            Close
                        </button>

                        {onDownload && (
                            <button
                                onClick={onDownload}
                                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 text-white transition-all shadow-lg shadow-neon-purple/20 font-medium flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Again
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
