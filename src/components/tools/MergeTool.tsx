import { useState } from 'react';
import { useStore } from '../../store';
import { mergePDFs } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { FileDown } from 'lucide-react';
import Button from '../ui/Button';
import FileCard from '../ui/FileCard';
import ResultModal from '../ui/ResultModal';

export default function MergeTool() {
  const { files, setProcessing } = useStore();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [lastMergedPdf, setLastMergedPdf] = useState<Uint8Array | null>(null);

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
      setLastMergedPdf(mergedPdf);

      setProcessing({ progress: 90, message: 'Preparing download...' });

      const filename = `merged-${Date.now()}.pdf`;
      const saved = await saveFileWithFSA(mergedPdf, filename);

      if (!saved) {
        downloadFile(mergedPdf, filename);
      }

      setProcessing({ isProcessing: false, progress: 100, message: 'Merge complete!' });
      setResultMessage(`Successfully merged ${selectedFiles.length} files into ${filename}`);
      setShowResult(true);

      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Merge error:', error);
      alert(`Error merging PDFs: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleDownloadAgain = () => {
    if (lastMergedPdf) {
      downloadFile(lastMergedPdf, `merged-${Date.now()}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">
          Select files to merge (order matters)
        </h3>

        {files.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 font-sans">
            No files loaded. Please add PDF files above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selectedFiles.includes(file.id)}
                onSelect={() => toggleFileSelection(file.id)}
                showSelection={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleMerge}
          disabled={selectedFiles.length < 2 || isProcessing}
          isLoading={isProcessing}
          size="lg"
          icon={FileDown}
        >
          Merge PDFs
        </Button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Merge Successful!"
        message={resultMessage}
        onDownload={handleDownloadAgain}
      />
    </div>
  );
}

