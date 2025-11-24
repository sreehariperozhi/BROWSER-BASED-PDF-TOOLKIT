import { useState } from 'react';
import { useStore } from '../../store';
import { extractImages } from '../../utils/pdf';
import { downloadZip } from '../../utils/file';
import { Image } from 'lucide-react';

export default function ExtractImagesTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  const handleExtract = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Extracting images...' });

    try {
      setProcessing({ progress: 50, message: 'Scanning page for images...' });
      const images = await extractImages(file.file, selectedPage);

      if (images.length === 0) {
        alert('No images found on this page');
        setProcessing({ isProcessing: false, progress: 0, message: '' });
        return;
      }

      setProcessing({ progress: 80, message: 'Preparing download...' });

      const filesToZip = images.map((img, index) => {
        const base64Data = img.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return {
          data: byteArray,
          filename: `${file.name.replace('.pdf', '')}_page${selectedPage + 1}_image${index + 1}.png`,
        };
      });

      downloadZip(filesToZip, `${file.name.replace('.pdf', '')}_images.zip`);

      setProcessing({ isProcessing: false, progress: 100, message: `Extracted ${images.length} image(s)!` });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Extract images error:', error);
      alert(`Error extracting images: ${error}`);
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
            Select PDF
          </label>
          <select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              setSelectedPage(0);
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
          <Image className="w-5 h-5" />
          Extract Images
        </button>
      </div>
    </div>
  );
}

