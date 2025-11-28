import { useState, useEffect } from 'react';
import { useStore } from './store';
import ToolView from './components/ToolView';
import PrivacyNotice from './components/PrivacyNotice';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Settings from './components/Settings';
import ParticleBackground from './components/ui/ParticleBackground';
import Dashboard from './components/Dashboard';
import { useSwipeGesture } from './hooks/useSwipeGesture';

function App() {
  const { selectedTool, setSelectedTool } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Escape key - close tool/go home
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (selectedTool) {
          setSelectedTool(null);
        }
      }

      // Backspace - go back (when not in input)
      if (e.key === 'Backspace' && selectedTool) {
        e.preventDefault();
        setSelectedTool(null);
      }

      // Alt + Left Arrow - browser-style back
      if (e.altKey && e.key === 'ArrowLeft' && selectedTool) {
        e.preventDefault();
        setSelectedTool(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, isSettingsOpen, setSelectedTool]);

  // Global click listener for sound effects
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Play sound for interactive elements that aren't buttons (buttons handle their own sound)
      // We check for specific classes or tag names that indicate interactivity
      if (
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.closest('[role="button"]') ||
        target.closest('.clickable')
      ) {
        // Avoid double playing if the element is inside a button that already plays sound
        if (!target.closest('button')) {
          import('./utils/audioManager').then(({ audioManager }) => {
            audioManager.playClick();
          });
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Swipe gestures for mobile
  useSwipeGesture({
    onSwipeLeft: () => {
      // Swipe left to go back (if on a tool page)
      if (selectedTool) {
        setSelectedTool(null);
      }
    },
  });

  // PWA logic temporarily disabled for development
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({
          immediate: true,
          onRegistered: (r: ServiceWorkerRegistration | undefined) => {
            if (r) console.log('SW Registered: ', r);
          },
          onRegisterError: (error: Error) => {
            console.log('SW registration error', error);
          },
        });
      }).catch(() => {
        // PWA plugin not available in dev mode, that's okay
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 flex overflow-hidden relative">
      <ParticleBackground />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-transparent to-primary-500/5 dark:to-neon-purple/10 transition-colors duration-500" />

      <TopBar onOpenSettings={() => setIsSettingsOpen(true)} />
      <Sidebar />

      <main className="flex-1 pt-16 pl-20 h-screen overflow-y-auto bg-gray-50 dark:bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <PrivacyNotice />

          {!selectedTool ? (
            <Dashboard />
          ) : (
            <div className="h-full animate-fade-in">
              <ToolView />
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
