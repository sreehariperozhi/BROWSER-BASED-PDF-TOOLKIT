import { useState } from 'react';
import { useStore } from '../../store';
import { mergePDFs } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { FileDown } from 'lucide-react';

export default function MergeTool() {
  const { files, setProcessing } = useStore();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert('Please select at least 2 files to merge');
      return;
    }

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Merging PDFs...' });

    try {
      const filesToMerge = files.filter((f) => selectedFiles.includes(f.id));
      const fileObjects = filesToMerge.map((f) => f.file);

      setProcessing({ progress: 50, message: 'Combining pages...' });
      const mergedPdf = await mergePDFs(fileObjects);

      setProcessing({ progress: 90, message: 'Preparing download...' });
      
      const filename = `merged-${Date.now()}.pdf`;
      const saved = await saveFileWithFSA(mergedPdf, filename);
      
      if (!saved) {
        downloadFile(mergedPdf, filename);
      }

      setProcessing({ isProcessing: false, progress: 100, message: 'Merge complete!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Merge error:', error);
      alert(`Error merging PDFs: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Select files to merge (order matters)
      </h3>
      
      <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
        {files.map((file) => (
          <label
            key={file.id}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedFiles([...selectedFiles, file.id]);
                } else {
                  setSelectedFiles(selectedFiles.filter((id) => id !== file.id));
                }
              }}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="flex-1 text-gray-900 dark:text-white">{file.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {file.pages} pages
            </span>
          </label>
        ))}
      </div>

      {files.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No files loaded. Please add PDF files first.
        </p>
      )}

      <button
        onClick={handleMerge}
        disabled={selectedFiles.length < 2 || isProcessing}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <FileDown className="w-5 h-5" />
        Merge PDFs
      </button>
    </div>
  );
}

