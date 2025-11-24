import { useStore } from '../store';
import { Loader2 } from 'lucide-react';

export default function ProgressIndicator() {
  const { processing } = useStore();

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6 mb-6">
      <div className="flex items-center gap-4">
        <Loader2 className="w-6 h-6 text-primary-600 dark:text-neon-cyan animate-spin" />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {processing.message || 'Processing...'}
          </p>
          <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden relative">
            <div
              className="bg-primary-600 dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(160,107,255,0.5)] relative overflow-hidden"
              style={{ width: `${processing.progress}%` }}
            >
              {/* Laser Scan Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/2 h-full animate-laser-scan" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(processing.progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}

