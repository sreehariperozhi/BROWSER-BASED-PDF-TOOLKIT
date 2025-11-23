# Privacy Policy

## Your Privacy is Our Priority

**PDF Toolkit** is designed with privacy as a core principle. This document explains how we handle your data (spoiler: we don't collect any).

## Data Collection

### We Collect Nothing

- ❌ No file uploads
- ❌ No user accounts
- ❌ No tracking cookies
- ❌ No analytics (unless explicitly opt-in)
- ❌ No personal information
- ❌ No server-side processing

### What Happens to Your Files?

**All PDF processing happens 100% in your browser.**

- Files are loaded into browser memory
- All operations (merge, split, compress, etc.) run locally
- Results are downloaded directly to your device
- Files are never transmitted over the network

## Technical Details

### Client-Side Processing

This application uses:
- **pdf-lib**: JavaScript PDF library (runs in browser)
- **pdf.js**: Mozilla's PDF renderer (runs in browser)
- **WebAssembly**: For performance-critical operations
- **Web Workers**: To keep UI responsive during heavy operations

All of these run entirely in your browser's sandbox. No external servers are involved in processing your PDFs.

### Storage

The application may use:
- **localStorage**: For user preferences (theme, settings)
- **IndexedDB**: For caching thumbnails and temporary data
- **File System Access API**: For direct file access (where supported)

All storage is local to your device and browser. You can clear it at any time through your browser settings.

### Network Requests

The only network requests made are:
1. **Initial app load**: HTML, CSS, JavaScript, WASM files
2. **PDF.js worker**: Loaded from CDN (can be configured to use local bundle)
3. **Optional updates**: Service Worker checks for app updates (can be disabled)

No file data is included in any network requests.

## Opt-In Features

### Error Reporting (Future)

If we add error reporting, it will be:
- Completely opt-in
- Anonymous (no file data, no personal info)
- Clearly labeled in settings

### Analytics (Future)

If we add analytics, it will be:
- Opt-in only
- Privacy-focused (no personal tracking)
- Can be completely disabled

## Your Rights

- **Inspect the code**: This is open source - you can verify our claims
- **Use offline**: Works completely offline after first load
- **Block external requests**: Settings option to block all network requests
- **Delete data**: Clear browser storage anytime

## Open Source

This application is open source. You can:
- Review the code
- Verify privacy claims
- Fork and modify
- Host your own instance

## Questions?

If you have privacy concerns or questions, please open an issue on GitHub.

---

**Last Updated**: 2024

**Version**: 1.0.0

