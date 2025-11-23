import { Tool } from '../types';

export const TOOLS: Tool[] = [
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDF files into one',
    icon: 'FileStack',
    color: 'blue',
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Split a PDF into multiple files',
    icon: 'Scissors',
    color: 'green',
  },
  {
    id: 'reorder',
    name: 'Reorder Pages',
    description: 'Rearrange pages in your PDF',
    icon: 'ArrowUpDown',
    color: 'purple',
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: 'Minimize2',
    color: 'orange',
  },
  {
    id: 'rotate',
    name: 'Rotate Pages',
    description: 'Rotate pages in your PDF',
    icon: 'RotateCw',
    color: 'indigo',
  },
  {
    id: 'delete',
    name: 'Delete Pages',
    description: 'Remove pages from your PDF',
    icon: 'Trash2',
    color: 'red',
  },
  {
    id: 'extract-images',
    name: 'Extract Images',
    description: 'Extract images from PDF pages',
    icon: 'Image',
    color: 'pink',
  },
  {
    id: 'extract-text',
    name: 'Extract Text',
    description: 'Extract text content from PDF',
    icon: 'FileText',
    color: 'teal',
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    description: 'Convert PDF pages to images',
    icon: 'FileImage',
    color: 'cyan',
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Convert images to PDF',
    icon: 'Image',
    color: 'amber',
  },
];

