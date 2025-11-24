import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../../store';

interface WorkspaceLayoutProps {
    title: string;
    description?: string;
    stepsPanel: ReactNode;
    previewPanel: ReactNode;
    configPanel: ReactNode;
}

export default function WorkspaceLayout({
    title,
    description,
    stepsPanel,
    previewPanel,
    configPanel
}: WorkspaceLayoutProps) {
    const { setSelectedTool } = useStore();

    return (
        <div className="h-full flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <button
                    onClick={() => setSelectedTool(null)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:text-neon-purple dark:hover:text-neon-cyan group border border-transparent hover:border-neon-purple/20"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Left: Steps / Input (25%) */}
                <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
                    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-4 flex-1">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            1. Input & Selection
                        </h3>
                        {stepsPanel}
                    </div>
                </div>

                {/* Center: Preview (50%) */}
                <div className="lg:col-span-6 flex flex-col gap-4 min-h-[400px]">
                    <div className="bg-gray-100 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 p-4 flex-1 flex flex-col relative overflow-hidden">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 absolute top-4 left-4 z-10">
                            2. Preview
                        </h3>
                        <div className="flex-1 flex items-center justify-center overflow-auto pt-8">
                            {previewPanel}
                        </div>
                    </div>
                </div>

                {/* Right: Config (25%) */}
                <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pl-2">
                    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-4 flex-1">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            3. Configuration
                        </h3>
                        {configPanel}
                    </div>
                </div>
            </div>
        </div>
    );
}
