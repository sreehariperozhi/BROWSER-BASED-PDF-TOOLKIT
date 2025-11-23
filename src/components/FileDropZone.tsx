import { Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useStore } from '../store';
import { PDFFile } from '../types';
import { getPDFPageCount, generateThumbnail } from '../utils/pdf';
import { formatFileSize } from '../utils/file';

export default function FileDropZone() {
  const { files, addFile, removeFile } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File): Promise<PDFFile> => {
    const pages = await getPDFPageCount(file);
    const thumbnail = await generateThumbnail(file);
    
    return {
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      pages,
      size: file.size,
      thumbnail,
    };
  };

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;
    
    const pdfFiles = Array.from(fileList).filter(
      (file) => file.type === 'application/pdf'
    );
    
    for (const file of pdfFiles) {
      try {
        const pdfFile = await processFile(file);
        addFile(pdfFile);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing ${file.name}: ${error}`);
      }
    }
  }, [addFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  return (
    <div className="mb-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600'
          }
        `}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Drop PDF files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          All processing happens in your browser. Files never leave your device.
        </p>
        <label className="inline-block">
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-block px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg cursor-pointer transition-colors">
            Select Files
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Loaded Files ({files.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-4"
              >
                {file.thumbnail && (
                  <img
                    src={file.thumbnail}
                    alt="Thumbnail"
                    className="w-16 h-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {file.pages} pages • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

