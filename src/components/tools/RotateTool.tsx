import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { rotatePages, generateThumbnail } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { FileDown, RotateCw, Loader2 } from 'lucide-react';
import WorkspaceLayout from '../ui/WorkspaceLayout';
import Button from '../ui/Button';

export default function RotateTool() {
  const { files, setProcessing } = useStore();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [angle, setAngle] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);

  const selectedFileObj = files.find((f) => f.id === selectedFile);

  useEffect(() => {
    const loadThumbnails = async () => {
      if (!selectedFileObj) {
        setThumbnails([]);
        return;
      }

      setLoadingThumbnails(true);
      const newThumbnails: string[] = [];

      try {
        // Generate thumbnails for all pages
        // In a real app with large PDFs, we might want to virtualize this or load on demand
        for (let i = 0; i < selectedFileObj.pages; i++) {
          const thumb = await generateThumbnail(selectedFileObj.file, i);
          newThumbnails.push(thumb);
        }
        setThumbnails(newThumbnails);
      } catch (error) {
        console.error('Error generating thumbnails:', error);
      } finally {
        setLoadingThumbnails(false);
      }
    };

    loadThumbnails();
  }, [selectedFileObj]);

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

  // Panel 1: Steps / Input
  const stepsPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Select PDF
        </label>
        <select
          value={selectedFile}
          onChange={(e) => {
            setSelectedFile(e.target.value);
            setSelectedPages([]);
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Rotation Angle
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[90, 180, 270].map((a) => (
            <button
              key={a}
              onClick={() => setAngle(a)}
              className={`py-2 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${angle === a
                ? 'bg-primary-600 dark:bg-neon-purple text-white border-primary-700 dark:border-neon-purple shadow-lg shadow-neon-purple/20'
                : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
            >
              <RotateCw className={`w-4 h-4 ${angle === a ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              <span className="text-xs font-medium">{a}°</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Panel 2: Preview
  const previewPanel = selectedFileObj ? (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Select Pages to Rotate
        </h3>
        <div className="flex items-center gap-4">
          {loadingThumbnails && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading previews...
            </div>
          )}
          <button
            onClick={selectAll}
            className="text-sm text-primary-600 dark:text-neon-cyan hover:text-primary-700 dark:hover:text-neon-cyan/80 font-medium"
          >
            Select All Pages
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: selectedFileObj.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => togglePage(i)}
              className={`aspect-[1/1.4] rounded-lg border-2 transition-all relative group overflow-hidden ${selectedPages.includes(i)
                ? 'border-neon-purple shadow-[0_0_15px_rgba(160,107,255,0.3)]'
                : 'border-gray-200 dark:border-white/10 hover:border-neon-purple/50'
                }`}
            >
              {/* Thumbnail Image */}
              {thumbnails[i] ? (
                <img
                  src={thumbnails[i]}
                  alt={`Page ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/5">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}

              {/* Page Number Badge */}
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs font-medium text-white">
                {i + 1}
              </div>

              {/* Selection Overlay */}
              <div className={`absolute inset-0 transition-colors ${selectedPages.includes(i)
                  ? 'bg-neon-purple/20'
                  : 'bg-transparent group-hover:bg-black/10 dark:group-hover:bg-white/10'
                }`} />

              {/* Rotation Indicator Overlay */}
              {selectedPages.includes(i) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full">
                    <RotateCw className="w-6 h-6 text-white" style={{ transform: `rotate(${angle}deg)` }} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <RotateCw className="w-16 h-16 mx-auto mb-4 opacity-20" />
      <p>Select a PDF file to view pages</p>
    </div>
  );

  // Panel 3: Configuration / Action
  const configPanel = (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/5">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Summary</h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex justify-between">
            <span>Selected File:</span>
            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
              {selectedFileObj?.name || '-'}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Pages to Rotate:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedPages.length}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Rotation Angle:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {angle}°
            </span>
          </li>
        </ul>
      </div>

      <Button
        onClick={handleRotate}
        disabled={!selectedFile || selectedPages.length === 0 || isProcessing}
        isLoading={isProcessing}
        className="w-full"
        size="lg"
        icon={FileDown}
      >
        Rotate Pages
      </Button>
    </div>
  );

  return (
    <WorkspaceLayout
      title="Rotate PDF Pages"
      description="Permanently rotate specific pages in your PDF document."
      stepsPanel={stepsPanel}
      previewPanel={previewPanel}
      configPanel={configPanel}
    />
  );
}
