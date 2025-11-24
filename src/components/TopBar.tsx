import { Settings, Moon, Sun, Wifi, WifiOff, Bell, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store';

interface TopBarProps {
    onOpenSettings: () => void;
}

export default function TopBar({ onOpenSettings }: TopBarProps) {
    const { setSelectedTool } = useStore();
    const [isDark, setIsDark] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const goHome = () => {
        setSelectedTool(null);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 z-50 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4 pl-20"> {/* pl-20 to account for sidebar width when collapsed */}
                <button
                    onClick={goHome}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan tracking-tight hover:scale-105 transition-transform cursor-pointer font-heading group relative"
                >
                    FT.PDF
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${isOnline
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                    }`}>
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {isOnline ? 'Online' : 'Offline'}
                </div>

                <button
                    onClick={goHome}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-neon-purple dark:hover:text-neon-cyan transition-all group relative"
                    title="Go to Home"
                >
                    <Home className="w-5 h-5" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Home
                    </span>
                </button>

                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full"></span>
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-[2px]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-dark-bg flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                        US
                    </div>
                </div>
            </div>
        </header>
    );
}
