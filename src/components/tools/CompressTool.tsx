import { useState } from 'react';
import { useStore } from '../../store';
import { compressPDF } from '../../utils/pdf';
import { saveFileWithFSA, downloadFile, formatFileSize } from '../../utils/file';
import { FileDown, Minus, Plus } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

export default function CompressTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [quality, setQuality] = useState<number>(0.5);
  const [isProcessing, setIsProcessing] = useState(false);

  const [stats, setStats] = useState<{ original: string; compressed: string; reduction: string } | null>(null);

  const selectedFileObj = files.find(f => f.id === selectedFile);

  const handleCompress = async () => {
    if (!selectedFile) {
      alert('Please select a file to compress');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setStats(null);
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

      setStats({
        original: formatFileSize(originalSize),
        compressed: formatFileSize(newSize),
        reduction
      });

      audioManager.playSuccess();
      setProcessing({ isProcessing: false, progress: 100, message: 'Compression complete!' });
    } catch (error) {
      console.error('Compression failed:', error);
      audioManager.playError();
      setProcessing({ isProcessing: false, progress: 0, message: 'Compression failed' });
      alert('Failed to compress PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select PDF to compress
          </label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              setStats(null);
            }}
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
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compression Level
                </label>
                <span className={`text-sm font-bold ${quality > 0.7 ? 'text-green-600 dark:text-green-400' :
                    quality > 0.4 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                  }`}>
                  {(quality * 100).toFixed(0)}%
                  <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                    ({quality > 0.7 ? 'High Quality' : quality > 0.4 ? 'Balanced' : 'Max Compression'})
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    audioManager.playClick();
                    setQuality(prev => Math.max(0.1, Number((prev - 0.1).toFixed(1))));
                  }}
                  disabled={isProcessing}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50"
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
                  disabled={isProcessing}
                  className="flex-1 accent-primary-600 dark:accent-neon-purple cursor-pointer disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => {
                    audioManager.playClick();
                    setQuality(prev => Math.min(1, Number((prev + 0.1).toFixed(1))));
                  }}
                  disabled={isProcessing}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Lower values = smaller file size but reduced image quality (rasterization)
              </p>
            </div>

            {stats && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4 animate-fade-in">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Compression Results</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Original</p>
                    <p className="font-medium text-gray-900 dark:text-white">{stats.original}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Compressed</p>
                    <p className="font-medium text-gray-900 dark:text-white">{stats.compressed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Reduction</p>
                    <p className="font-bold text-green-600 dark:text-green-400">{stats.reduction}%</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                audioManager.playClick();
                handleCompress();
              }}
              disabled={!selectedFile || isProcessing}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20"
            >
              <FileDown className="w-5 h-5" />
              {isProcessing ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
