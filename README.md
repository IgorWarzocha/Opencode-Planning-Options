# Planning Options Plugin

A modern OpenCode plugin that transforms brainstorming into structured, actionable planning. This plugin creates interactive planning sessions with multiple approaches, displayed through elegant popups that keep your conversation clean while empowering decision-making.

## ✨ What It Does

- **Structured Planning**: Generates 3-question, 3-option formatted plans across Architecture, UI, UX, API, Data, Testing, Rollout, Risk, and Decision categories
- **Ghost Sessions**: Creates ephemeral sub-sessions for plan generation that don't clutter your main conversation
- **Smart Suppression**: Automatically suppresses follow-up text after showing the planning popup
- **Interactive Selection**: Accept user selections like "1A 2b 3-C add caching layer" and get refined plans
- **Model Flexibility**: Use any model with `provider/model` format (e.g., `openai/gpt-4.1`)

## 🛠️ Tools

### `planning_options`
The core planning tool that creates structured options for any task.

```
User: Help me plan a new feature release
Assistant: [uses planning_options]
✅ Popup appears with structured Q&A options
Assistant: Awaiting further instructions
```

### `planning_answers` 
Processes user selections from the popup and continues the planning flow.

```
User: 1A 2B 3C use react-query for caching
✅ Ghost session processes selection
✅ Cleanup removes temporary session
Assistant: Here's your refined implementation plan...
```

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd planning-options
bun run install-deps

# Start development
bun run dev
```

Requires OpenCode CLI in your PATH.

## 🏗️ Development

```bash
bun run build        # Compile to dist/
bun run typecheck     # Type checking without emit
bun run dev          # Live development mode
```

## 🧠 Architecture

Built with modern TypeScript and OpenCode SDK patterns:

- **Ghost Sessions**: Temporary planning environments that self-destruct
- **State Management**: In-memory session tracking with automatic cleanup  
- **Suppression System**: One-shot text completion suppression for clean UX
- **Error Handling**: Robust error checking with graceful fallbacks
- **Type Safety**: Full TypeScript strict mode with explicit typing

## 🔧 Configuration

Environment variables:
- `PLANNING_DELETE_GHOST=1`: Aggressive cleanup of ghost sessions

## 📋 Planning Format

All plans follow this strict structure:
```
Q1 - Architecture - How should we structure the component?
A: Monolithic single file with inline styles
B: Multi-file component with separate hooks and utilities  
C: Atomic design with compound components

Q2 - API - What data fetching approach?
A: Simple fetch in useEffect with local state
B: Custom hook with loading/error states
C: RTK Query with caching and invalidation

Q3 - Testing - What testing strategy?
A: Jest + Testing Library basic coverage
B: Cypress E2E for critical user flows
C: Storybook + Visual regression testing
```

## 📄 License

MIT
