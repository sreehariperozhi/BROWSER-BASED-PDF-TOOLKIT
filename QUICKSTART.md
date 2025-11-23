# Quick Start Guide

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## First Time Setup

1. **Install dependencies**: `npm install`
2. **Generate PWA icons** (optional):
   - Create 192x192 and 512x512 PNG images
   - Place in `public/` as `pwa-192x192.png` and `pwa-512x512.png`
   - Or use placeholder images for now

3. **Start development**: `npm run dev`
4. **Open browser**: Navigate to `http://localhost:5173`

## Features Overview

### Core Tools
- **Merge PDFs**: Combine multiple PDFs into one
- **Split PDF**: Split into individual pages or custom ranges
- **Reorder Pages**: Drag and drop to rearrange
- **Compress**: Reduce file size
- **Rotate**: Rotate selected pages
- **Delete**: Remove unwanted pages

### Extraction Tools
- **Extract Images**: Get images from PDF pages
- **Extract Text**: Copy text content

### Conversion Tools
- **PDF to Images**: Convert pages to PNG
- **Images to PDF**: Combine images into PDF

## Browser Support

- ✅ Chrome/Edge 86+ (full File System Access API)
- ✅ Firefox 90+ (download fallback)
- ✅ Safari 14+ (download fallback)

## PWA Installation

1. Visit the app in a supported browser
2. Look for install prompt or browser menu
3. Click "Install" or "Add to Home Screen"
4. App works offline after installation

## Privacy

- All processing is client-side
- No file uploads
- No tracking
- Works offline

See [PRIVACY.md](./PRIVACY.md) for details.

## Troubleshooting

### pdf.js Worker Error
If you see worker errors, the CDN might be blocked. You can:
1. Bundle the worker locally (see vite.config.ts)
2. Use a different CDN
3. Host the worker yourself

### Large Files
Very large PDFs (>100MB) may cause browser memory issues. Consider:
- Splitting large files first
- Using a more powerful device
- Processing in smaller batches

### File System Access API
Not available in all browsers. The app automatically falls back to download dialogs.

## Development Tips

- Use browser DevTools to inspect IndexedDB storage
- Check Network tab to verify no file uploads
- Test offline mode by disabling network in DevTools
- Use Lighthouse to audit PWA features

