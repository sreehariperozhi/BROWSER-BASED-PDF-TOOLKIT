import { useState } from 'react';
import { useStore } from '../../store';
import { deletePages } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { Trash2 } from 'lucide-react';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select PDF
          </label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              setSelectedPages([]);
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

        {selectedFileObj && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select pages to delete ({selectedPages.length} selected)
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {Array.from({ length: selectedFileObj.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => togglePage(i)}
                  className={`p-2 rounded border transition-colors ${
                    selectedPages.includes(i)
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={!selectedFile || selectedPages.length === 0 || isProcessing}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Delete Selected Pages
        </button>
      </div>
    </div>
  );
}

