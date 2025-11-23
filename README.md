# PDF Toolkit - Privacy-First Client-Side PDF Tools

A fully client-side PDF toolkit that runs 100% in your browser. No uploads, no tracking, no ads.

## Features

- ✅ **100% Client-Side** - PDFs never leave your device
- ✅ **No Login Required** - No accounts, no tracking
- ✅ **Offline-Capable** - Works as a PWA, fully offline after first load
- ✅ **Open Source** - Inspectable code, verify privacy claims
- ✅ **Multiple Tools**:
  - Merge PDFs
  - Split PDFs
  - Reorder pages
  - Compress PDFs
  - Rotate/Delete pages
  - Extract images/text
  - Convert PDF ↔ Images
  - Basic annotations

## Privacy

**No file is ever uploaded. Everything stays on your device.**

All processing happens locally using WebAssembly and JavaScript in your browser's sandbox. The only network requests are:
- Optional: Check for app updates
- Optional: Anonymous error reporting (opt-in)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Development

```bash
npm install
npm run dev
```

**Note**: For full PWA functionality, you'll need to add PWA icons:
- Create `public/pwa-192x192.png` (192x192 pixels)
- Create `public/pwa-512x512.png` (512x512 pixels)
- See `scripts/generate-icons.md` for details

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Architecture

- **Frontend**: React + TypeScript + Vite
- **PDF Engine**: pdf-lib + pdf.js
- **Workers**: Web Workers for heavy operations
- **Storage**: IndexedDB + File System Access API
- **PWA**: Service Worker for offline support

## Browser Support

- Chrome/Edge 86+ (full File System Access API support)
- Firefox 90+ (download fallback)
- Safari 14+ (download fallback)

## License

MIT

