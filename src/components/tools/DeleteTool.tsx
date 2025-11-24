import { useState } from 'react';
import { useStore } from '../../store';
import { deletePages } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';

export default function DeleteTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  const togglePage = (pageIndex: number) => {
    if (selectedPages.includes(pageIndex)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageIndex));
    } else {
      setSelectedPages([...selectedPages, pageIndex]);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile || selectedPages.length === 0) {
      alert('Please select a file and at least one page to delete');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    if (selectedPages.length === file.pages) {
      if (!confirm('You are about to delete all pages. Are you sure?')) {
        return;
      }
    }

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Deleting pages...' });

    try {
      setProcessing({ progress: 50, message: 'Rebuilding PDF...' });
      const newPdf = await deletePages(file.file, selectedPages);

      setProcessing({ progress: 90, message: 'Preparing download...' });

      const filename = `${file.name.replace('.pdf', '')}_edited.pdf`;
      const saved = await saveFileWithFSA(newPdf, filename);

      if (!saved) {
        downloadFile(newPdf, filename);
      }

      setProcessing({ isProcessing: false, progress: 100, message: 'Pages deleted!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error deleting pages: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading">
            Select PDF
          </label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              setSelectedPages([]);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-panel text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple outline-none transition-all font-sans"
          >
            <option value="">Choose a file...</option>
            {files.map((file) => (
              <option key={file.id} value={file.id}>
                {file.name} ({file.pages} pages)
              </option>
            ))}
          </select>
        </div>

        {selectedFileObj && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading">
              Select pages to delete ({selectedPages.length} selected)
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-white/10 rounded-lg p-4 bg-gray-50 dark:bg-black/20">
              {Array.from({ length: selectedFileObj.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => togglePage(i)}
                  className={`p-2 rounded border transition-all font-mono text-sm ${selectedPages.includes(i)
                    ? 'bg-red-600 text-white border-red-700 shadow-lg shadow-red-500/20 scale-105'
                    : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:border-red-400'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={handleDelete}
            disabled={!selectedFile || selectedPages.length === 0 || isProcessing}
            isLoading={isProcessing}
            variant="danger"
            className="w-full"
            size="lg"
            icon={Trash2}
          >
            Delete Selected Pages
          </Button>
        </div>
      </div>
    </div>
  );
}

