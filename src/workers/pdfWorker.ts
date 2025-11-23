// Web Worker for heavy PDF operations
// This runs in a separate thread to keep UI responsive

self.onmessage = async function(e) {
  const { type, payload } = e.data;

  try {
    switch (type) {
      case 'MERGE_PDFS':
        // Import pdf-lib dynamically in worker
        const { PDFDocument } = await import('pdf-lib');
        const mergedPdf = await PDFDocument.create();
        
        for (const fileData of payload.files) {
          const pdf = await PDFDocument.load(fileData);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((page) => mergedPdf.addPage(page));
          
          // Report progress
          self.postMessage({
            type: 'PROGRESS',
            progress: (payload.files.indexOf(fileData) + 1) / payload.files.length * 100,
            message: `Processing file ${payload.files.indexOf(fileData) + 1} of ${payload.files.length}`,
          });
        }
        
        const mergedBytes = await mergedPdf.save();
        self.postMessage({ type: 'SUCCESS', data: mergedBytes });
        break;

      case 'COMPRESS_PDF':
        const { PDFDocument: PDFDoc } = await import('pdf-lib');
        const pdf = await PDFDoc.load(payload.fileData);
        
        // Remove metadata
        pdf.setTitle('');
        pdf.setAuthor('');
        pdf.setSubject('');
        pdf.setKeywords([]);
        pdf.setProducer('');
        pdf.setCreator('');
        
        const compressedBytes = await pdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
        });
        
        self.postMessage({ type: 'SUCCESS', data: compressedBytes });
        break;

      default:
        self.postMessage({ type: 'ERROR', error: 'Unknown operation' });
    }
  } catch (error: any) {
    self.postMessage({ type: 'ERROR', error: error.message });
  }
};

