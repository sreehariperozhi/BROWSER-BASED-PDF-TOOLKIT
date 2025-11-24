import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useStore } from '../store';
import { PDFFile } from '../types';
import { getPDFPageCount, generateThumbnail } from '../utils/pdf';
import FileCard from './ui/FileCard';
import Button from './ui/Button';

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
    <div className="mb-12">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 relative overflow-hidden group
          ${isDragging
            ? 'border-neon-purple bg-neon-purple/10 scale-[1.02] animate-ripple-spread'
            : 'border-gray-300 dark:border-white/20 hover:border-neon-purple dark:hover:border-neon-purple hover:bg-gray-50 dark:hover:bg-white/5'
          }
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
            <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-neon-purple' : 'text-gray-400 dark:text-gray-500 group-hover:text-neon-purple'}`} />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-heading">
            Drop PDF files here
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Or click to browse from your computer. All files are processed locally.
          </p>

          <label className="inline-block">
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              variant="primary"
              size="lg"
              icon={Upload}
              as="span"
              className="cursor-pointer hover:animate-pulse-slow"
            >
              Select Files
            </Button>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white font-heading flex items-center gap-2">
            <span className="w-1 h-5 bg-neon-purple rounded-full"></span>
            Loaded Files ({files.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={file.id} className="animate-bounce-drop" style={{ animationDelay: `${index * 100}ms` }}>
                <FileCard
                  file={file}
                  onRemove={removeFile}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

