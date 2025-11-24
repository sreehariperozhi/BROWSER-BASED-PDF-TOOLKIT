import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { imagesToPDF } from '../../utils/pdf';
import { downloadFile, saveFileWithFSA } from '../../utils/file';
import { FileDown, Upload, X } from 'lucide-react';

export default function ImagesToPDFTool() {
  const { setProcessing } = useStore();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const imageFiles = Array.from(fileList).filter(
      (file) => file.type.startsWith('image/')
    );

    setSelectedImages((prev) => [...prev, ...imageFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...selectedImages];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setSelectedImages(newImages);
  };

  const handleConvert = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0, message: 'Converting images to PDF...' });

    try {
      setProcessing({ progress: 30, message: 'Processing images...' });
      const pdf = await imagesToPDF(selectedImages);

      setProcessing({ progress: 90, message: 'Preparing download...' });

      const filename = `images_${Date.now()}.pdf`;
      const saved = await saveFileWithFSA(pdf, filename);

      if (!saved) {
        downloadFile(pdf, filename);
      }

      setProcessing({ isProcessing: false, progress: 100, message: 'PDF created!' });
      setTimeout(() => setProcessing({ isProcessing: false, progress: 0, message: '' }), 2000);
    } catch (error) {
      console.error('Images to PDF error:', error);
      alert(`Error creating PDF: ${error}`);
      setProcessing({ isProcessing: false, progress: 0, message: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-6">
      <div className="space-y-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 text-center hover:border-primary-400 dark:hover:border-neon-purple/50 transition-colors bg-gray-50 dark:bg-white/5"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Drop images here or click to browse
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <span className="inline-block px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 text-white rounded-lg cursor-pointer transition-colors font-medium shadow-lg shadow-neon-purple/20">
              Select Images
            </span>
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Selected Images ({selectedImages.length}) - Order matters
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-white/10 rounded-lg p-4 bg-gray-50 dark:bg-black/20">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 hover:border-neon-purple/30 transition-colors"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(image.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-50 text-gray-500 dark:text-gray-400"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === selectedImages.length - 1}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-50 text-gray-500 dark:text-gray-400"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      title="Remove"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={selectedImages.length === 0 || isProcessing}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-neon-purple dark:hover:bg-neon-purple/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20"
        >
          <FileDown className="w-5 h-5" />
          Create PDF
        </button>
      </div>
    </div>
  );
}

