import { useState } from 'react';
import { useStore } from '../../store';
import { rotatePages } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { FileDown, RotateCw } from 'lucide-react';

export default function RotateTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [angle, setAngle] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  const togglePage = (pageIndex: number) => {
    if (selectedPages.includes(pageIndex)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageIndex));
    } else {
      setSelectedPages([...selectedPages, pageIndex]);
    }
  };

  const selectAll = () => {
    if (selectedFileObj) {
      setSelectedPages(Array.from({ length: selectedFileObj.pages }, (_, i) => i));
    }
  };

  const handleRotate = async () => {
    if (!selectedFile || selectedPages.length === 0) {
      alert('Please select a file and at least one page to rotate');
      return;
    }

    const file = files.find((f) => f.id === selectedFile);
    if (!file) return;

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Rotating pages...' });

    try {
      setProcessing({ progress: 50, message: 'Applying rotation...' });
      const rotatedPdf = await rotatePages(file.file, selectedPages, angle);

      setProcessing({ progress: 90, message: 'Preparing download...' });
      
      const filename = `${file.name.replace('.pdf', '')}_rotated.pdf`;
      const saved = await saveFileWithFSA(rotatedPdf, filename);
      
      if (!saved) {
        downloadFile(rotatedPdf, filename);
      }

      setProcessing({ isProcessing: false, progress: 100, message: 'Rotation complete!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Rotate error:', error);
      alert(`Error rotating pages: ${error}`);
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
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select pages to rotate
                </label>
                <button
                  onClick={selectAll}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Select All
                </button>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                {Array.from({ length: selectedFileObj.pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => togglePage(i)}
                    className={`p-2 rounded border transition-colors ${
                      selectedPages.includes(i)
                        ? 'bg-primary-600 text-white border-primary-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation angle
              </label>
              <div className="flex gap-4">
                {[90, 180, 270].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAngle(a)}
                    className={`flex-1 py-2 rounded-lg border transition-colors ${
                      angle === a
                        ? 'bg-primary-600 text-white border-primary-700'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <RotateCw className="w-5 h-5 mx-auto mb-1" />
                    {a}°
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleRotate}
          disabled={!selectedFile || selectedPages.length === 0 || isProcessing}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FileDown className="w-5 h-5" />
          Rotate Pages
        </button>
      </div>
    </div>
  );
}

