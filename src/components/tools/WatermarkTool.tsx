import { useState } from 'react';
import { useStore } from '../../store';
import { audioManager } from '../../utils/audioManager';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Upload, FileText, Download, Type, Palette, Layout } from 'lucide-react';
import Button from '../ui/Button';

export default function WatermarkTool() {
    const { setProcessing } = useStore();
    const [file, setFile] = useState<File | null>(null);
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [color, setColor] = useState('#FF0000');
    const [opacity, setOpacity] = useState(0.3);
    const [size, setSize] = useState(50);
    const [rotation, setRotation] = useState(45);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const applyWatermark = async () => {
        if (!file) return;

        try {
            setProcessing({ isProcessing: true, message: 'Applying watermark...', progress: 0 });

            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            // Convert hex color to RGB
            const r = parseInt(color.slice(1, 3), 16) / 255;
            const g = parseInt(color.slice(3, 5), 16) / 255;
            const b = parseInt(color.slice(5, 7), 16) / 255;

            pages.forEach((page) => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - (size * watermarkText.length) / 4, // Rough centering
                    y: height / 2,
                    size: size,
                    color: rgb(r, g, b),
                    opacity: opacity,
                    rotate: degrees(rotation),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            saveAs(blob, `watermarked_${file.name}`);

            audioManager.playSuccess();
            setProcessing({ isProcessing: false, message: 'Watermark applied!', progress: 100 });
        } catch (error) {
            console.error('Error applying watermark:', error);
            audioManager.playError();
            setProcessing({ isProcessing: false, message: 'Error applying watermark', progress: 0 });
            alert('Failed to apply watermark. Please try again.');
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-dark-card/50 p-6 rounded-xl border border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Type className="w-5 h-5 text-neon-purple" />
                                Text Settings
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Watermark Text
                                    </label>
                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Font Size ({size}px)
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="200"
                                        value={size}
                                        onChange={(e) => setSize(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card/50 p-6 rounded-xl border border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-neon-cyan" />
                                Style Settings
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Color
                                    </label>
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full h-10 rounded-lg cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Opacity ({Math.round(opacity * 100)}%)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={opacity}
                                        onChange={(e) => setOpacity(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card/50 p-6 rounded-xl border border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Layout className="w-5 h-5 text-neon-pink" />
                                Position
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Rotation ({rotation}°)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-100 dark:bg-gray-800/50 p-8 rounded-xl flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-700 relative overflow-hidden">
                            <div className="text-center z-10">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">{file.name}</p>
                            </div>

                            {/* Preview overlay */}
                            <div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    opacity: opacity,
                                    color: color,
                                    fontSize: `${size}px`,
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {watermarkText}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => setFile(null)}
                                className="flex-1"
                            >
                                Change File
                            </Button>
                            <Button
                                variant="primary"
                                onClick={applyWatermark}
                                className="flex-1"
                                icon={Download}
                            >
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
