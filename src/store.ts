import { create } from 'zustand';
import { PDFFile, ProcessingState, ToolType } from './types';

interface AppState {
  files: PDFFile[];
  selectedTool: ToolType | null;
  processing: ProcessingState;
  addFile: (file: PDFFile) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setSelectedTool: (tool: ToolType | null) => void;
  setProcessing: (state: Partial<ProcessingState>) => void;
  updateFile: (id: string, updates: Partial<PDFFile>) => void;
}

export const useStore = create<AppState>((set) => ({
  files: [],
  selectedTool: null,
  processing: {
    isProcessing: false,
    progress: 0,
    message: '',
  },
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  clearFiles: () => set({ files: [] }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setProcessing: (state) => set((prev) => ({
    processing: { ...prev.processing, ...state }
  })),
  updateFile: (id, updates) => set((state) => ({
    files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f))
  })),
}));

