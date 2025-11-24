import { useState } from 'react';
import { useStore } from '../../store';
import { extractText } from '../../utils/pdf';
import { FileText, Copy, Check } from 'lucide-react';

export default function ExtractTextTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  const handleExtract = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Extracting text...' });

    try {
      setProcessing({ progress: 50, message: 'Reading page content...' });
      const text = await extractText(file.file, selectedPage);

      setExtractedText(text || '(No text found on this page)');
      setProcessing({ isProcessing: false, progress: 100, message: 'Text extracted!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Extract text error:', error);
      alert(`Error extracting text: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (extractedText) {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select PDF
          </label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              setSelectedPage(0);
              setExtractedText('');
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

        {selectedFileObj && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select page (1-{selectedFileObj.pages})
            </label>
            <input
              type="number"
              min="1"
              max={selectedFileObj.pages}
              value={selectedPage + 1}
              onChange={(e) => setSelectedPage(Math.max(0, Math.min(selectedFileObj.pages - 1, parseInt(e.target.value) - 1)))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-panel text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple outline-none transition-all"
            />
          </div>
        )}

        <button
          onClick={handleExtract}
          disabled={!selectedFile || isProcessing}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20"
        >
          <FileText className="w-5 h-5" />
          Extract Text
        </button>

        {extractedText && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Extracted Text
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded transition-colors text-gray-700 dark:text-gray-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              value={extractedText}
              readOnly
              className="w-full h-64 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple outline-none transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
}

