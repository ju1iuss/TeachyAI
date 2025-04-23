# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm start` or `npm run dev`: Start development server
- `npm run android`: Run on Android
- `npm run ios`: Run on iOS 
- `npm run web`: Start web version
- `npm run prebuild`: Run Expo prebuild
- `npm run clean`: Remove build artifacts
- `npm run build:ios`: Build iOS development version
- `npm run build:android`: Build Android development version

## Code Style Guidelines
- **TypeScript**: Use strict mode, explicit types for function parameters/returns
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Components**: Functional components with hooks preferred
- **Imports**: Group related imports, React imports at top
- **Error Handling**: Use ErrorLogger for centralized logging, handle async errors with safeAsync utility
- **State Management**: Use React contexts for shared state
- **Styling**: Use StyleSheet for component styling, follow theme constants
- **File Structure**: Components in app/components, screens in app/screens, utils in app/utils or utils/

Always run `npm run prebuild` after significant dependency changes.