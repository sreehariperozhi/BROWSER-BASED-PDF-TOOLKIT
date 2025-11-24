import { useState } from 'react';
import { useStore } from '../../store';
import { reorderPages } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { FileDown, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

export default function ReorderTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  const initializeOrder = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      setPageOrder(Array.from({ length: file.pages }, (_, i) => i));
    }
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...pageOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setPageOrder(newOrder);
  };

  const handleReorder = async () => {
    if (!selectedFile || pageOrder.length === 0) {
      alert('Please select a file and arrange pages');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Reordering pages...' });

    try {
      setProcessing({ progress: 50, message: 'Rebuilding PDF...' });
      const reorderedPdf = await reorderPages(file.file, pageOrder);

      setProcessing({ progress: 90, message: 'Preparing download...' });

      const filename = `${file.name.replace('.pdf', '')}_reordered.pdf`;
      const saved = await saveFileWithFSA(reorderedPdf, filename);

      if (!saved) {
        downloadFile(reorderedPdf, filename);
      }

      setProcessing({ isProcessing: false, progress: 100, message: 'Reorder complete!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Reorder error:', error);
      alert(`Error reordering pages: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select PDF to reorder
          </label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              initializeOrder(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-panel text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple outline-none transition-all"
          >
            <option value="">Choose a file...</option>
            {files.map((file) => (
              <option key={file.id} value={file.id}>
                {file.name} ({file.pages} pages)
              </option>
            ))}
          </select>
        </div>

        {selectedFileObj && pageOrder.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drag pages to reorder (or use arrows)
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-white/10 rounded-lg p-4 bg-gray-50 dark:bg-black/20">
              {pageOrder.map((pageIndex, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', index.toString());
                    e.currentTarget.classList.add('opacity-50', 'scale-105', 'shadow-2xl');
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.classList.remove('opacity-50', 'scale-105', 'shadow-2xl');
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const toIndex = index;
                    if (fromIndex !== toIndex) {
                      const newOrder = [...pageOrder];
                      const [movedPage] = newOrder.splice(fromIndex, 1);
                      newOrder.splice(toIndex, 0, movedPage);
                      setPageOrder(newOrder);
                    }
                  }}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/5 hover:border-neon-purple/30 transition-all cursor-move hover:shadow-md active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-gray-900 dark:text-white">
                    Page {pageIndex + 1}
                  </span>
                  <button
                    onClick={() => movePage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-50 text-gray-500 dark:text-gray-400"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => movePage(index, 'down')}
                    disabled={index === pageOrder.length - 1}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-50 text-gray-500 dark:text-gray-400"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleReorder}
          disabled={!selectedFile || pageOrder.length === 0 || isProcessing}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20"
        >
          <FileDown className="w-5 h-5" />
          Save Reordered PDF
        </button>
      </div>
    </div>
  );
}

