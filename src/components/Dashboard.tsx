import { useState } from 'react';
import { useStore } from '../store';
import ToolGrid from './ToolGrid';
import FileDropZone from './FileDropZone';
import { Search, Clock, BarChart2, FileText } from 'lucide-react';
import FileCard from './ui/FileCard';

export default function Dashboard() {
    const { recentFiles, files } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight font-heading">
                    PDF Toolkit
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Professional PDF tools, right in your browser.
                </p>
            </div>

            {/* File Upload Zone */}
            <FileDropZone />

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search tools (e.g., 'Merge', 'Split', 'Compress')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple transition-all shadow-lg shadow-gray-200/50 dark:shadow-none"
                />
            </div>

            {/* Analytics / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Files Processed</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{files.length + recentFiles.length}</p>
                    </div>
                </div>
                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">~{(files.length * 2)}m</p>
                    </div>
                </div>
                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tools Used</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{recentFiles.length > 0 ? 'Active' : 'Ready'}</p>
                    </div>
                </div>
            </div>

            {/* Recent Files Carousel */}
            {recentFiles.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 px-4">
                        <Clock className="w-5 h-5 text-neon-purple" />
                        Recent Files
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-4 no-scrollbar snap-x">
                        {recentFiles.map((file) => (
                            <div key={file.id} className="min-w-[250px] snap-start">
                                <FileCard file={file} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tools Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white px-4">
                    All Tools
                </h2>
                <ToolGrid searchQuery={searchQuery} />
            </div>
        </div>
    );
}
