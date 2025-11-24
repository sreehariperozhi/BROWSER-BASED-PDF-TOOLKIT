import { useState } from 'react';
import { useStore } from '../../store';
import { compressPDF } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA, formatFileSize } from '../../utils/file';
import { FileDown, Minus, Plus } from 'lucide-react';

export default function CompressTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [quality, setQuality] = useState(0.8);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompress = async () => {
    if (!selectedFile) {
      alert('Please select a file to compress');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Compressing PDF...' });

    try {
      setProcessing({ progress: 30, message: 'Optimizing PDF structure...' });
      const compressedPdf = await compressPDF(file.file, quality);

      setProcessing({ progress: 90, message: 'Preparing download...' });

      const filename = `${file.name.replace('.pdf', '')}_compressed.pdf`;
      const saved = await saveFileWithFSA(compressedPdf, filename);

      if (!saved) {
        downloadFile(compressedPdf, filename);
      }

      const originalSize = file.size;
      const newSize = compressedPdf.length;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      setProcessing({
        isProcessing: false,
        progress: 100,
        message: `Compression complete! Reduced by ${reduction}%`
      });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 3000);
    } catch (error) {
      console.error('Compress error:', error);
      alert(`Error compressing PDF: ${error}`);
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select PDF to compress
          </label>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-panel text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple outline-none transition-all"
          >
            <option value="">Choose a file...</option>
            {files.map((file) => (
              <option key={file.id} value={file.id}>
                {file.name} ({formatFileSize(file.size)})
              </option>
            ))}
          </select>
        </div>

        {selectedFileObj && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compression Level: {(quality * 100).toFixed(0)}%
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuality(Math.max(0.1, quality - 0.1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-400"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="flex-1 accent-primary-600 dark:accent-neon-purple"
              />
              <button
                onClick={() => setQuality(Math.min(1, quality + 0.1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-400"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Lower values = smaller file size but may reduce quality
            </p>
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={!selectedFile || isProcessing}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20"
        >
          <FileDown className="w-5 h-5" />
          Compress PDF
        </button>
      </div>
    </div>
  );
}

