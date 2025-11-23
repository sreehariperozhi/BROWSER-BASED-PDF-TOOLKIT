import { useStore } from '../store';
import { TOOLS } from '../constants/tools';
import { ToolType } from '../types';
import * as Icons from 'lucide-react';

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
};

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500 hover:bg-blue-600 text-blue-50',
  green: 'bg-green-500 hover:bg-green-600 text-green-50',
  purple: 'bg-purple-500 hover:bg-purple-600 text-purple-50',
  orange: 'bg-orange-500 hover:bg-orange-600 text-orange-50',
  indigo: 'bg-indigo-500 hover:bg-indigo-600 text-indigo-50',
  red: 'bg-red-500 hover:bg-red-600 text-red-50',
  pink: 'bg-pink-500 hover:bg-pink-600 text-pink-50',
  teal: 'bg-teal-500 hover:bg-teal-600 text-teal-50',
  cyan: 'bg-cyan-500 hover:bg-cyan-600 text-cyan-50',
  amber: 'bg-amber-500 hover:bg-amber-600 text-amber-50',
};

export default function ToolGrid() {
  const { setSelectedTool } = useStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Available Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TOOLS.map((tool) => {
          const IconComponent = iconMap[tool.icon] || Icons.File;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as ToolType)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-lg ${colorClasses[tool.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

