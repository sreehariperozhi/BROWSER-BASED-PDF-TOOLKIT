import { useStore } from '../store';
import { Loader2 } from 'lucide-react';

export default function ProgressIndicator() {
  const { processing } = useStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center gap-4">
        <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {processing.message || 'Processing...'}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processing.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(processing.progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}

