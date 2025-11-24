import { useState } from 'react';
import { useStore } from '../../store';
import { splitPDF } from '../../utils/pdf';
import { downloadZip } from '../../utils/file';
import { FileDown } from 'lucide-react';
import Button from '../ui/Button';

export default function SplitTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [ranges, setRanges] = useState<string>('1-5,6-10');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSplit = async () => {
    if (!selectedFile) {
      alert('Please select a file to split');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Splitting PDF...' });

    try {
      let pageRanges: Array<{ start: number; end: number }> = [];

      if (splitMode === 'all') {
        // Split each page into its own file
        for (let i = 0; i < file.pages; i++) {
          pageRanges.push({ start: i, end: i });
        }
      } else {
        // Parse ranges (e.g., "1-5,6-10")
        const rangeStrings = ranges.split(',').map((s) => s.trim());
        for (const rangeStr of rangeStrings) {
          const [start, end] = rangeStr.split('-').map((n) => parseInt(n.trim()) - 1);
          if (!isNaN(start) && !isNaN(end) && start >= 0 && end < file.pages && start <= end) {
            pageRanges.push({ start, end });
          }
        }
      }

      if (pageRanges.length === 0) {
        alert('Invalid page ranges');
        return;
      }

      setProcessing({ progress: 30, message: 'Processing pages...' });
      const splitPdfs = await splitPDF(file.file, pageRanges);

      setProcessing({ progress: 80, message: 'Preparing files...' });

      const filesToZip = splitPdfs.map((pdf, index) => ({
        data: pdf,
        filename: `${file.name.replace('.pdf', '')}_part${index + 1}.pdf`,
      }));

      downloadZip(filesToZip, `${file.name.replace('.pdf', '')}_split.zip`);

      setProcessing({ isProcessing: false, progress: 100, message: 'Split complete!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Split error:', error);
      alert(`Error splitting PDF: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading">
            Select PDF to split
          </label>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
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
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading">
                Split mode
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    value="all"
                    checked={splitMode === 'all'}
                    onChange={(e) => setSplitMode(e.target.value as 'all' | 'range')}
                    className="w-4 h-4 text-neon-purple border-gray-300 dark:border-gray-600 focus:ring-neon-purple"
                  />
                  <span className="text-gray-900 dark:text-white font-sans">
                    Split into individual pages ({selectedFileObj.pages} files)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    value="range"
                    checked={splitMode === 'range'}
                    onChange={(e) => setSplitMode(e.target.value as 'all' | 'range')}
                    className="w-4 h-4 text-neon-purple border-gray-300 dark:border-gray-600 focus:ring-neon-purple"
                  />
                  <span className="text-gray-900 dark:text-white font-sans">Custom ranges</span>
                </label>
              </div>
            </div>

            {splitMode === 'range' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading">
                  Page ranges (e.g., "1-5,6-10,11-15")
                </label>
                <input
                  type="text"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  placeholder="1-5,6-10"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-panel text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple outline-none transition-all font-mono"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
                  Enter comma-separated ranges. Each range will become a separate PDF.
                </p>
              </div>
            )}
          </>
        )}

        <div className="pt-4">
          <Button
            onClick={handleSplit}
            disabled={!selectedFile || isProcessing}
            isLoading={isProcessing}
            className="w-full"
            size="lg"
            icon={FileDown}
          >
            Split PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

