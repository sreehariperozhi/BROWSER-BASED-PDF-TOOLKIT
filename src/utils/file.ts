export function downloadFile(data: Uint8Array | Blob, filename: string) {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadZip(files: Array<{ data: Uint8Array | Blob; filename: string }>, zipFilename: string) {
  import('jszip').then((JSZip) => {
    const zip = new JSZip.default();
    
    files.forEach((file) => {
      const blob = file.data instanceof Blob ? file.data : new Blob([file.data as BlobPart]);
      zip.file(file.filename, blob);
    });
    
    zip.generateAsync({ type: 'blob' }).then((content) => {
      downloadFile(content, zipFilename);
    });
  });
}

export async function saveFileWithFSA(data: Uint8Array | Blob, suggestedName: string): Promise<boolean> {
  if (!('showSaveFilePicker' in window)) {
    return false;
  }
  
  try {
    const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type: 'application/pdf' });
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName,
      types: [{
        description: 'PDF files',
        accept: { 'application/pdf': ['.pdf'] },
      }],
    });
    
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('Error saving file:', error);
    }
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

