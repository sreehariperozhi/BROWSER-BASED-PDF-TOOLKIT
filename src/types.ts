export interface PDFFile {
  id: string;
  name: string;
  file: File;
  pages: number;
  size: number;
  thumbnail?: string;
}

export interface PDFPage {
  fileId: string;
  pageIndex: number;
  thumbnail?: string;
}

export type ToolType =
  | 'merge'
  | 'split'
  | 'reorder'
  | 'compress'
  | 'rotate'
  | 'delete'
  | 'extract-images'
  | 'extract-text'
  | 'pdf-to-images'
  | 'images-to-pdf'
  | 'protect'
  | 'unlock'
  | 'watermark'
  | 'metadata'
  | 'annotate';

export interface Tool {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  message: string;
}

