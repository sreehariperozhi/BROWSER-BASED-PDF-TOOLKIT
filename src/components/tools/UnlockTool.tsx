import { Unlock } from 'lucide-react';

export default function UnlockTool() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                <Unlock className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-4">
                Unlock PDF
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8">
                To remove passwords and restrictions from your PDF files,
                please use our dedicated security tool.
            </p>

            <a
                href="https://sreehariperozhi.github.io/SEKURE"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105 flex items-center gap-2"
            >
                <Unlock className="w-5 h-5" />
                Go to SEKURE
            </a>
        </div>
    );
}
