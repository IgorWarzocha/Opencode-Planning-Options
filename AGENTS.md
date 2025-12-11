# Development Commands

**Build:** `bun run build` - TypeScript compilation to dist/
**Typecheck:** `bun run typecheck` - Run TypeScript type checking without emit  
**Dev server:** `bun run dev` - Run OpenCode plugin in development mode
**Install deps:** `bun run install-deps` - Install package dependencies

# Code Style Guidelines

**Imports:** Use ES modules, type imports first (`import type { ... }`), then runtime imports
**Formatting:** TypeScript strict mode enabled, ESNext target, consistent casing enforced
**Types:** All functions and variables must be explicitly typed when not inferable
**Naming:** camelCase for variables/functions, PascalCase for types/interfaces, UPPER_SNAKE_CASE for env vars
**Error handling:** Use try/catch for async operations, check `.error` on API responses, return error strings
**Patterns:** Use the OpenCode plugin SDK conventions, tool schema validation, and ghost session architecture
**File structure:** One export per file, export default for main plugin entry point