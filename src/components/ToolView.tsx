import { useStore } from '../store';
import { TOOLS } from '../constants/tools';
import MergeTool from './tools/MergeTool';
import SplitTool from './tools/SplitTool';
import ReorderTool from './tools/ReorderTool';
import CompressTool from './tools/CompressTool';
import RotateTool from './tools/RotateTool';
import DeleteTool from './tools/DeleteTool';
import ExtractImagesTool from './tools/ExtractImagesTool';
import ExtractTextTool from './tools/ExtractTextTool';
import PDFToImagesTool from './tools/PDFToImagesTool';
import ImagesToPDFTool from './tools/ImagesToPDFTool';
import ProtectTool from './tools/ProtectTool';
import UnlockTool from './tools/UnlockTool';
import WatermarkTool from './tools/WatermarkTool';
import MetadataTool from './tools/MetadataTool';
import ProgressIndicator from './ProgressIndicator';

const toolComponents: Record<string, React.ComponentType> = {
  merge: MergeTool,
  split: SplitTool,
  reorder: ReorderTool,
  compress: CompressTool,
  rotate: RotateTool,
  delete: DeleteTool,
  'extract-images': ExtractImagesTool,
  'extract-text': ExtractTextTool,
  'pdf-to-images': PDFToImagesTool,
  'images-to-pdf': ImagesToPDFTool,
  protect: ProtectTool,
  unlock: UnlockTool,
  watermark: WatermarkTool,
  metadata: MetadataTool,
};

export default function ToolView() {
  const { selectedTool, processing } = useStore();

  if (!selectedTool) return null;

  const tool = TOOLS.find((t) => t.id === selectedTool);
  const ToolComponent = toolComponents[selectedTool];

  if (!ToolComponent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Tool not implemented yet: {selectedTool}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan inline-block">
          {tool?.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {tool?.description}
        </p>
      </div>

      {processing.isProcessing && <ProgressIndicator />}

      <ToolComponent />
    </div>
  );
}

