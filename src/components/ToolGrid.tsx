import { useStore } from '../store';
import { TOOLS } from '../constants/tools';
import { ToolType } from '../types';
import * as Icons from 'lucide-react';
import { useRef, useState } from 'react';
import { audioManager } from '../utils/audioManager';

const iconMap: Record<string, any> = {
  FileMerge: Icons.FileStack,
  Scissors: Icons.Scissors,
  ArrowUpDown: Icons.ArrowUpDown,
  Minimize2: Icons.Minimize2,
  RotateCw: Icons.RotateCw,
  Trash2: Icons.Trash2,
  Image: Icons.Image,
  FileText: Icons.FileText,
  FileImage: Icons.FileImage,
  Shield: Icons.Shield,
  Unlock: Icons.Unlock,
  Stamp: Icons.Stamp,
  FileCode: Icons.FileCode,
};

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

function ToolCard({ tool, onClick }: { tool: any; onClick: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const IconComponent = iconMap[tool.icon] || Icons.File;

  return (
    <button
      ref={cardRef}
      onClick={() => {
        audioManager.playClick();
        onClick();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6 hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-200 text-left group relative overflow-hidden h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-purple/30 rounded-xl transition-colors duration-300" />

      <div className={`w-14 h-14 rounded-xl ${colorClasses[tool.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-lg`}>
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-xl" />
        <IconComponent className="w-7 h-7 relative z-10" />
      </div>

      <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white mb-2 relative z-10 group-hover:text-neon-cyan transition-colors">
        {tool.name}
      </h3>

      <p className="text-sm font-sans text-gray-600 dark:text-gray-400 relative z-10 leading-relaxed">
        {tool.description}
      </p>
    </button>
  );
}

interface ToolGridProps {
  searchQuery?: string;
}

export default function ToolGrid({ searchQuery = '' }: ToolGridProps) {
  const { setSelectedTool } = useStore();

  const filteredTools = TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-neon-purple rounded-full"></span>
        Available Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onClick={() => setSelectedTool(tool.id as ToolType)}
          />
        ))}
      </div>
    </div>
  );
}
