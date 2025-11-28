import { useState } from 'react';
import { useStore } from '../../store';
import { audioManager } from '../../utils/audioManager';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Upload, Save, Info } from 'lucide-react';
import Button from '../ui/Button';

interface Metadata {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
    creationDate: string;
    modificationDate: string;
}

export default function MetadataTool() {
    const { setProcessing } = useStore();
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Metadata>({
        title: '',
        author: '',
        subject: '',
        keywords: '',
        creator: '',
        producer: '',
        creationDate: '',
        modificationDate: '',
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            await loadMetadata(selectedFile);
        }
    };

    const loadMetadata = async (file: File) => {
        try {
            setProcessing({ isProcessing: true, message: 'Reading metadata...', progress: 0 });
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            setMetadata({
                title: pdfDoc.getTitle() || '',
                author: pdfDoc.getAuthor() || '',
                subject: pdfDoc.getSubject() || '',
                keywords: pdfDoc.getKeywords() || '',
                creator: pdfDoc.getCreator() || '',
                producer: pdfDoc.getProducer() || '',
                creationDate: pdfDoc.getCreationDate()?.toLocaleString() || '',
                modificationDate: pdfDoc.getModificationDate()?.toLocaleString() || '',
            });

            setProcessing({ isProcessing: false, message: '', progress: 100 });
        } catch (error) {
            console.error('Error reading metadata:', error);
            setProcessing({ isProcessing: false, message: 'Error reading metadata', progress: 0 });
        }
    };

    const saveMetadata = async () => {
        if (!file) return;

        try {
            setProcessing({ isProcessing: true, message: 'Saving metadata...', progress: 0 });

            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            pdfDoc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));
            pdfDoc.setCreator(metadata.creator);
            pdfDoc.setProducer(metadata.producer);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            saveAs(blob, `metadata_updated_${file.name}`);

            audioManager.playSuccess();
            setProcessing({ isProcessing: false, message: 'Metadata saved!', progress: 100 });
        } catch (error) {
            console.error('Error saving metadata:', error);
            audioManager.playError();
            setProcessing({ isProcessing: false, message: 'Error saving metadata', progress: 0 });
            alert('Failed to save metadata. Please try again.');
        }
    };

    return (
        <div className="h-full flex flex-col">
            {!file ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-4"
                    >
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Upload PDF
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Click to browse or drag and drop your PDF file here
                        </p>
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-dark-card/50 p-6 rounded-xl border border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-neon-purple" />
                                Document Properties
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={metadata.title}
                                        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                        placeholder="Document Title"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.author}
                                            onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                            placeholder="Author Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.subject}
                                            onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                            placeholder="Subject"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Keywords (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={metadata.keywords}
                                        onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                        placeholder="keyword1, keyword2, ..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Creator
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.creator}
                                            onChange={(e) => setMetadata({ ...metadata, creator: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                            placeholder="Creator Application"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Producer
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.producer}
                                            onChange={(e) => setMetadata({ ...metadata, producer: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                            placeholder="PDF Producer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-white/10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                File Info
                            </h3>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>Filename:</span>
                                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{file.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Size:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Created:</span>
                                    <span className="font-medium text-gray-900 dark:text-white text-xs">{metadata.creationDate || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Modified:</span>
                                    <span className="font-medium text-gray-900 dark:text-white text-xs">{metadata.modificationDate || 'Unknown'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                variant="primary"
                                onClick={saveMetadata}
                                className="w-full"
                                icon={Save}
                            >
                                Save Metadata
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setFile(null)}
                                className="w-full"
                            >
                                Change File
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
