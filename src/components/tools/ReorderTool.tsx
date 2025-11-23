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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {pageOrder.map((pageIndex, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-gray-900 dark:text-white">
                    Page {pageIndex + 1}
                  </span>
                  <button
                    onClick={() => movePage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => movePage(index, 'down')}
                    disabled={index === pageOrder.length - 1}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded disabled:opacity-50"
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
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FileDown className="w-5 h-5" />
          Save Reordered PDF
        </button>
      </div>
    </div>
  );
}

