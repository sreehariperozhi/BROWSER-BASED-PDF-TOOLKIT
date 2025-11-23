# Architecture Overview

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **PDF Libraries**:
  - `pdf-lib`: PDF manipulation (merge, split, reorder, etc.)
  - `pdf.js`: PDF rendering and text extraction
- **File Handling**: File System Access API (with download fallback)
- **PWA**: Vite PWA Plugin + Service Worker
- **Icons**: Lucide React

## Architecture Principles

### 1. 100% Client-Side
- All PDF operations run in the browser
- No server-side processing
- No file uploads
- WebAssembly for performance

### 2. Privacy-First
- No tracking
- No analytics (opt-in only)
- Open source code
- User-controlled data

### 3. Offline-Capable
- Service Worker caching
- PWA installation
- Works without internet after first load

### 4. Performance
- Web Workers for heavy operations
- Lazy loading where possible
- Optimized bundle splitting

## Project Structure

```
├── public/              # Static assets
│   ├── manifest.json   # PWA manifest
│   └── robots.txt
├── src/
│   ├── components/     # React components
│   │   ├── tools/     # Tool-specific components
│   │   ├── Header.tsx
│   │   ├── FileDropZone.tsx
│   │   ├── ToolGrid.tsx
│   │   └── ...
│   ├── utils/         # Utility functions
│   │   ├── pdf.ts     # PDF operations
│   │   └── file.ts    # File handling
│   ├── workers/       # Web Workers
│   │   └── pdfWorker.ts
│   ├── constants/     # Constants
│   │   └── tools.ts   # Tool definitions
│   ├── store.ts       # Zustand store
│   ├── types.ts       # TypeScript types
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── vite.config.ts     # Vite configuration
└── package.json
```

## Data Flow

### File Processing Flow

1. **User uploads file** → `FileDropZone`
2. **File processed** → Generate thumbnail, get page count
3. **File stored** → Zustand store (in-memory)
4. **User selects tool** → Navigate to tool view
5. **Operation executed** → PDF utilities process file
6. **Result generated** → File System Access API or download

### State Management

- **Zustand Store** (`src/store.ts`):
  - `files`: Array of loaded PDF files
  - `selectedTool`: Currently active tool
  - `processing`: Processing state and progress

### PDF Operations

All PDF operations are in `src/utils/pdf.ts`:
- Use `pdf-lib` for manipulation
- Use `pdf.js` for rendering and extraction
- Return Uint8Array for PDFs, strings for text, arrays for images

## Web Workers

Heavy operations can run in Web Workers (`src/workers/pdfWorker.ts`):
- PDF merging (large files)
- Compression
- Future: OCR, complex operations

## File System Access API

- **Primary**: Direct file save (Chrome/Edge)
- **Fallback**: Download dialog (Firefox/Safari)
- Implementation in `src/utils/file.ts`

## PWA Features

### Service Worker
- Caches app shell
- Caches static assets
- Enables offline functionality

### Manifest
- App metadata
- Icons
- Display mode
- Theme colors

## Security Considerations

### Browser Sandbox
- All code runs in browser sandbox
- No native file system access (except File System Access API)
- No network access for file data

### Input Validation
- File type checking
- Size limits (browser-dependent)
- Error handling

### Privacy
- No external requests with file data
- Optional network blocking
- Clear privacy messaging

## Performance Optimizations

1. **Code Splitting**: Separate chunks for pdf-lib and pdf.js
2. **Lazy Loading**: Tool components loaded on demand
3. **Web Workers**: Heavy operations don't block UI
4. **Thumbnail Caching**: Store in IndexedDB
5. **Bundle Optimization**: Tree shaking, minification

## Browser Compatibility

### Full Support (File System Access API)
- Chrome 86+
- Edge 86+

### Partial Support (Download Fallback)
- Firefox 90+
- Safari 14+

### Limitations
- Very large files may cause memory issues
- Some operations slower on mobile
- File System Access API not available everywhere

## Future Enhancements

### Possible Additions
- OCR (Tesseract.js)
- PDF form filling
- Digital signatures
- Annotations
- Office format conversion (complex, large WASM)

### Considerations
- Keep client-side only
- Maintain privacy
- Performance impact
- Bundle size

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Testing**: Manual testing with various PDFs
3. **Build**: `npm run build`
4. **Preview**: `npm run preview`
5. **Deploy**: Static hosting (Netlify, Vercel, GitHub Pages)

## Deployment

### Static Hosting
- No server required
- Just static files
- CDN-friendly
- Works with any static host

### Requirements
- HTTPS (for PWA)
- Service Worker support
- Modern browser support

