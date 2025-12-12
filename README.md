# planning_options plugin

Planning Options plugin
-----------------------
Structured planning helper for OpenCode. It creates a ghost planning session with the built-in `plan` agent, shows the generated options in a popup, keeps the main assistant silent, and lets the user reply with compact selections (e.g., `1A 2b 3-C note`) that get routed back to the ghost session.

Features
- Generates three Q/A blocks (Q1–Q3) with A/B/C options in plain text.
- Popup header shows the model used (configurable via `~/.config/opencode/planning-options.jsonc`).
- Suppresses assistant chatter after plan generation; waits for user selection.
- New tool `planning_answers` forwards the user’s picks to the ghost session, returns a concise acknowledgement, and clears state. Ghost deletion is optional via `PLANNING_DELETE_GHOST=1`.

Config
- Auto-creates `~/.config/opencode/planning-options.jsonc`:
  - `model`: provider/model string for the ghost planner. Leave unset to use the parent session model.

Usage
- `planning_options` tool: generate options (returns `Await further instructions`).
- User replies with selections (e.g., `1A 2c 3b more notes`).
- `planning_answers` tool: captures the selection and replies with a refined summary from the ghost planner.

Notes
- Tools are disabled in the ghost session (`tools: {}`) to prevent it from running commands.
- Each call creates a fresh ghost session; prior one can be deleted if `PLANNING_DELETE_GHOST=1`.

## Running locally

```bash
cd planning_options
bun run dev
```

The `dev` script runs `opencode plugin dev`, so ensure the OpenCode CLI is available in your PATH. No additional dependencies beyond `@opencode-ai/plugin` are required at runtime.
