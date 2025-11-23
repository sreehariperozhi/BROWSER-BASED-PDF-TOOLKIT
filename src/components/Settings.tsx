import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Wifi, WifiOff } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [blockExternalRequests, setBlockExternalRequests] = useState(
    localStorage.getItem('block-external-requests') === 'true'
  );

  if (!isOpen) return null;

  const handleToggleBlock = (value: boolean) => {
    setBlockExternalRequests(value);
    localStorage.setItem('block-external-requests', value.toString());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SettingsIcon className="w-6 h-6" />
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                  Privacy & Security
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  All PDF processing happens 100% in your browser. No files are ever uploaded to any server.
                  Your data never leaves your device.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-3">
                {blockExternalRequests ? (
                  <WifiOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Block All External Requests
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Prevents any network requests (updates, analytics, etc.)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={blockExternalRequests}
                onChange={(e) => handleToggleBlock(e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              About This App
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>License:</strong> MIT (Open Source)
              </p>
              <p>
                <strong>Technology:</strong> React, TypeScript, pdf-lib, pdf.js
              </p>
              <p className="pt-2">
                This application runs entirely in your browser. All PDF operations
                are performed locally using WebAssembly and JavaScript. No server
                is involved in processing your files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

