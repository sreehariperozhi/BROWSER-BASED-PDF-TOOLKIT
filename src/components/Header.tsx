import { ArrowLeft, Shield, Github, Settings } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import SettingsPanel from './Settings';

export default function Header() {
  const { selectedTool, setSelectedTool } = useStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedTool && (
              <button
                onClick={() => setSelectedTool(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to tools"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">
                PDF Toolkit
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="View source code"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}

