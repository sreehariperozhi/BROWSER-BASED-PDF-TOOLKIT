import { X, FileText, GripVertical } from 'lucide-react';
import { formatFileSize } from '../../utils/file';
import { PDFFile } from '../../types';

interface FileCardProps {
    file: PDFFile;
    onRemove?: (id: string) => void;
    index?: number;
    isSelected?: boolean;
    onSelect?: () => void;
    showSelection?: boolean;
}

export default function FileCard({
    file,
    onRemove,
    isSelected = false,
    onSelect,
    showSelection = false
}: FileCardProps) {
    return (
        <div
            onClick={showSelection && onSelect ? onSelect : undefined}
            className={`
                group relative backdrop-blur-md rounded-xl border p-4 transition-all duration-300 
                ${showSelection
                    ? 'cursor-pointer'
                    : 'hover:-translate-y-1'
                }
                ${isSelected
                    ? 'bg-neon-purple/10 border-neon-purple shadow-[0_0_20px_rgba(160,107,255,0.2)]'
                    : 'bg-white/80 dark:bg-dark-card/50 border-gray-200 dark:border-white/10 hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(160,107,255,0.15)]'
                }
            `}
        >
            {/* Glass Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

            <div className="flex items-start gap-4 relative z-10">
                {/* Selection Checkbox */}
                {showSelection && (
                    <div className={`
                        absolute top-2 left-2 z-20 w-5 h-5 rounded border flex items-center justify-center transition-all
                        ${isSelected
                            ? 'bg-neon-purple border-neon-purple'
                            : 'bg-white/50 dark:bg-black/50 border-gray-400 dark:border-gray-500 group-hover:border-neon-purple'
                        }
                    `}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                    </div>
                )}

                {/* Thumbnail / Icon */}
                <div className={`
                    relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border transition-colors
                    ${isSelected
                        ? 'border-neon-purple/50 bg-neon-purple/5'
                        : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 group-hover:border-neon-purple/30'
                    }
                `}>
                    {file.thumbnail ? (
                        <img
                            src={file.thumbnail}
                            alt={file.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FileText className={`w-8 h-8 ${isSelected ? 'text-neon-purple' : 'text-gray-400 dark:text-gray-500'}`} />
                        </div>
                    )}

                    {/* Overlay on Hover */}
                    {!showSelection && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <GripVertical className="w-6 h-6 text-white/80" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                    <h4 className={`font-medium truncate pr-6 transition-colors ${isSelected ? 'text-neon-purple' : 'text-gray-900 dark:text-white group-hover:text-neon-purple'}`}>
                        {file.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs font-mono">
                            {file.pages} pages
                        </span>
                        <span className="text-xs opacity-60">
                            {formatFileSize(file.size)}
                        </span>
                    </p>
                </div>

                {/* Actions */}
                {onRemove && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(file.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
                        title="Remove file"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
