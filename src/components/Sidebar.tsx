import { useStore } from '../store';
import { ToolType } from '../types';
import { audioManager } from '../utils/audioManager';
import {
    FileStack,
    Scissors,
    Minimize2,
    FileImage,
    Image,
    RotateCw,
    ArrowUpDown,
    Trash2,
    FileText,
    Settings
} from 'lucide-react';

const sidebarTools = [
    { id: 'merge', icon: FileStack, label: 'Merge', color: 'text-blue-500' },
    { id: 'split', icon: Scissors, label: 'Split', color: 'text-green-500' },
    { id: 'compress', icon: Minimize2, label: 'Compress', color: 'text-orange-500' },
    { id: 'pdf-to-images', icon: FileImage, label: 'PDF to Img', color: 'text-cyan-500' },
    { id: 'images-to-pdf', icon: Image, label: 'Img to PDF', color: 'text-amber-500' },
    { id: 'rotate', icon: RotateCw, label: 'Rotate', color: 'text-indigo-500' },
    { id: 'reorder', icon: ArrowUpDown, label: 'Reorder', color: 'text-purple-500' },
    { id: 'delete', icon: Trash2, label: 'Delete', color: 'text-red-500' },
    { id: 'extract-text', icon: FileText, label: 'OCR', color: 'text-teal-500' },
    { id: 'extract-images', icon: Image, label: 'Extract Img', color: 'text-pink-500' },
];

export default function Sidebar() {
    const { selectedTool, setSelectedTool } = useStore();

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-r border-gray-200 dark:border-white/10 flex flex-col items-center py-6 z-40 transition-all duration-300 hover:w-64 group overflow-hidden shadow-2xl">
            <div className="flex-1 w-full px-3 space-y-2 overflow-y-auto no-scrollbar">
                {sidebarTools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => {
                            audioManager.playClick();
                            setSelectedTool(tool.id as ToolType);
                        }}
                        className={`
              w-full flex items-center p-3 rounded-xl transition-all duration-300 relative group/btn
              ${selectedTool === tool.id
                                ? 'bg-primary-50 dark:bg-white/10'
                                : 'hover:bg-gray-100 dark:hover:bg-white/5'
                            }
            `}
                    >
                        {selectedTool === tool.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-neon-purple to-neon-blue rounded-r-full shadow-[0_0_15px_rgba(160,107,255,0.6)] animate-slide-underline" />
                        )}

                        <div className={`
              w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 relative
              ${selectedTool === tool.id ? 'scale-110' : 'group-hover/btn:scale-110'}
            `}>
                            {/* Icon Glow Background */}
                            <div className={`absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 ${selectedTool === tool.id ? 'opacity-20 bg-current animate-pulse-slow' : 'group-hover/btn:opacity-10 bg-current'} ${tool.color}`} />

                            <tool.icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${tool.color} ${selectedTool === tool.id ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-neon-pulse' : ''}`} />
                        </div>

                        <span className={`
              ml-4 font-medium whitespace-nowrap transition-all duration-300 font-sans
              ${selectedTool === tool.id ? 'text-gray-900 dark:text-white font-semibold translate-x-1' : 'text-gray-600 dark:text-gray-400'}
              opacity-0 group-hover:opacity-100 absolute left-14 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md px-3 py-1 rounded-md shadow-lg border border-gray-200 dark:border-white/10 z-50
            `}>
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="w-full px-3 mt-auto">
                <button
                    onClick={() => audioManager.playClick()}
                    className="w-full flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 group/settings"
                >
                    <div className="w-8 h-8 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-500 group-hover/settings:rotate-90" />
                    </div>
                    <span className="ml-4 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 absolute left-14">
                        Settings
                    </span>
                </button>
            </div>
        </aside>
    );
}
