# Contributing to PDF Toolkit

Thank you for your interest in contributing! This project is open source and welcomes contributions.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/       # React components
│   ├── tools/      # Individual tool components
│   └── ...
├── utils/          # Utility functions
│   ├── pdf.ts     # PDF operations
│   └── file.ts    # File handling
├── workers/        # Web Workers
├── store.ts        # Zustand state management
└── types.ts        # TypeScript types
```

## Adding New Tools

1. Add tool definition to `src/constants/tools.ts`
2. Create component in `src/components/tools/`
3. Add to `ToolView.tsx` routing
4. Implement PDF operations in `src/utils/pdf.ts` if needed

## Code Style

- Use TypeScript
- Follow existing code patterns
- Use functional components with hooks
- Keep components focused and modular
- Add comments for complex logic

## Testing

- Test with various PDF sizes
- Test in different browsers
- Verify offline functionality
- Check PWA installation

## Privacy Requirements

- Never add server-side file processing
- Keep all operations client-side
- Document any network requests
- Respect user privacy settings

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

