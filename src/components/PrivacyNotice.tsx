import { Shield, X } from 'lucide-react';
import { useState } from 'react';

export default function PrivacyNotice() {
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('privacy-notice-dismissed') === 'true'
  );

  if (dismissed) return null;

  return (
    <div className="bg-primary-50 dark:bg-neon-blue/10 border border-primary-200 dark:border-neon-blue/20 rounded-xl p-4 mb-6 relative backdrop-blur-sm">
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem('privacy-notice-dismissed', 'true');
        }}
        className="absolute top-2 right-2 p-1 hover:bg-primary-100 dark:hover:bg-neon-blue/20 rounded transition-colors text-primary-600 dark:text-neon-blue"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <Shield className="w-5 h-5 text-primary-600 dark:text-neon-blue mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-primary-900 dark:text-white mb-1">
            Your Privacy is Protected
          </h3>
          <p className="text-sm text-primary-700 dark:text-gray-300">
            <strong>No file is ever uploaded.</strong> All PDF processing happens 100% in your browser.
            Your files never leave your device. No tracking, no ads, no data collection.
          </p>
        </div>
      </div>
    </div>
  );
}

