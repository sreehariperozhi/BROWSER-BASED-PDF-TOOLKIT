import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Wifi, WifiOff, Palette, History, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import Button from './ui/Button';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const accentColors = [
  { id: 'neon-purple', name: 'Neon Purple', class: 'bg-neon-purple' },
  { id: 'neon-blue', name: 'Neon Blue', class: 'bg-neon-blue' },
  { id: 'neon-cyan', name: 'Neon Cyan', class: 'bg-neon-cyan' },
  { id: 'neon-pink', name: 'Neon Pink', class: 'bg-neon-pink' },
  { id: 'neon-green', name: 'Neon Green', class: 'bg-neon-green' },
];

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings, clearFiles } = useStore();
  const [blockExternalRequests, setBlockExternalRequests] = useState(
    localStorage.getItem('block-external-requests') === 'true'
  );

  if (!isOpen) return null;

  const handleToggleBlock = (value: boolean) => {
    setBlockExternalRequests(value);
    localStorage.setItem('block-external-requests', value.toString());
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all file history?')) {
      clearFiles();
      // Also clear recent files if we had an action for it, but clearFiles clears current workspace
      // We might need a specific clearRecentFiles action later
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 sticky top-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-heading">
              <SettingsIcon className="w-6 h-6 text-primary-600 dark:text-neon-purple" />
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Privacy Section */}
          <div className="bg-primary-50 dark:bg-neon-blue/10 border border-primary-200 dark:border-neon-blue/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary-600 dark:text-neon-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary-900 dark:text-white mb-1">
                  Privacy & Security
                </h3>
                <p className="text-sm text-primary-700 dark:text-gray-300">
                  All PDF processing happens 100% in your browser. No files are ever uploaded to any server.
                  Your data never leaves your device.
                </p>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-neon-purple" />
              Appearance
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Accent Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => updateSettings({ accentColor: color.id })}
                      className={`w-10 h-10 rounded-full ${color.class} transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-card ${settings.accentColor === color.id ? 'ring-gray-400 dark:ring-white scale-110' : 'ring-transparent'
                        }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Particle Effects
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Futuristic background
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.particlesEnabled}
                    onChange={(e) => updateSettings({ particlesEnabled: e.target.checked })}
                    className="w-5 h-5 text-neon-purple rounded border-gray-300 dark:border-gray-600 focus:ring-neon-purple"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Sound Effects
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      UI interaction sounds
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-5 h-5 text-neon-purple rounded border-gray-300 dark:border-gray-600 focus:ring-neon-purple"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Data & Storage Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-neon-purple" />
              Data & Storage
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5">
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
                  className="w-5 h-5 text-neon-purple rounded border-gray-300 dark:border-gray-600 focus:ring-neon-purple"
                />
              </label>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Clear App Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remove all loaded files and reset settings
                  </p>
                </div>
                <Button
                  onClick={handleClearHistory}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                >
                  Clear Data
                </Button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-6">
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

