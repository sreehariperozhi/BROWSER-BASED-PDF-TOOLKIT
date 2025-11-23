import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

export async function loadPDF(file: File): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer();
  return PDFDocument.load(arrayBuffer);
}

export async function getPDFPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}

export async function generateThumbnail(file: File, pageIndex: number = 0): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  
  const viewport = page.getViewport({ scale: 0.5 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) throw new Error('Could not get canvas context');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;
  
  return canvas.toDataURL('image/png');
}

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const pdf = await loadPDF(file);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
}

export async function splitPDF(file: File, pageRanges: Array<{ start: number; end: number }>): Promise<Uint8Array[]> {
  const sourcePdf = await loadPDF(file);
  const results: Uint8Array[] = [];
  
  for (const range of pageRanges) {
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(sourcePdf, 
      Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i)
    );
    pages.forEach((page) => newPdf.addPage(page));
    results.push(await newPdf.save());
  }
  
  return results;
}

export async function reorderPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const sourcePdf = await loadPDF(file);
  const newPdf = await PDFDocument.create();
  
  const pages = await newPdf.copyPages(sourcePdf, newOrder);
  pages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
}

export async function rotatePages(file: File, pageIndices: number[], angle: number): Promise<Uint8Array> {
  const pdf = await loadPDF(file);
  const pages = pdf.getPages();
  
  pageIndices.forEach((index) => {
    const page = pages[index];
    const currentRotation = page.getRotation();
    page.setRotation((currentRotation.angle + angle) as any);
  });
  
  return await pdf.save();
}

export async function deletePages(file: File, pageIndices: number[]): Promise<Uint8Array> {
  const pdf = await loadPDF(file);
  const totalPages = pdf.getPageCount();
  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i)
    .filter((i) => !pageIndices.includes(i));
  
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pagesToKeep);
  pages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
}

export async function compressPDF(_file: File, _quality: number = 0.8): Promise<Uint8Array> {
  // Basic compression by removing metadata and optimizing
  const pdf = await loadPDF(_file);
  
  // Remove metadata
  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('');
  pdf.setCreator('');
  
  // Save with compression
  return await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}

export async function extractImages(file: File, pageIndex: number): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  
  const operatorList = await page.getOperatorList();
  const images: string[] = [];
  
  for (let i = 0; i < operatorList.fnArray.length; i++) {
    if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
      const imageName = operatorList.argsArray[i][0];
      const image = await page.objs.get(imageName);
      
      if (image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.putImageData(image, 0, 0);
          images.push(canvas.toDataURL('image/png'));
        }
      }
    }
  }
  
  return images;
}

export async function extractText(file: File, pageIndex: number): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  const textContent = await page.getTextContent();
  
  return textContent.items
    .map((item: any) => item.str)
    .join(' ');
}

export async function pdfToImages(file: File, dpi: number = 150): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: string[] = [];
  const scale = dpi / 72;
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) continue;
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    images.push(canvas.toDataURL('image/png'));
  }
  
  return images;
}

export async function imagesToPDF(images: File[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  
  for (const imageFile of images) {
    const imageBytes = await imageFile.arrayBuffer();
    let image;
    
    if (imageFile.type === 'image/png') {
      image = await pdf.embedPng(imageBytes);
    } else if (imageFile.type === 'image/jpeg') {
      image = await pdf.embedJpg(imageBytes);
    } else {
      continue;
    }
    
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  return await pdf.save();
}

