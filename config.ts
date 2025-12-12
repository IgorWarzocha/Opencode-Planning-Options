import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { homedir } from "os"
import type { PluginInput } from "@opencode-ai/plugin"

export type PlanningConfig = {
  /**
   * Default model for the ghost planning session (provider/model).
   * If omitted, the parent session model is used.
   */
  model?: string
}

const CONFIG_DIR = join(homedir(), ".config", "opencode")
const CONFIG_PATH = join(CONFIG_DIR, "planning-options.jsonc")

const DEFAULT_CONFIG: PlanningConfig = {
  // Example: "anthropic/claude-3-5-sonnet"
  model: undefined,
}

const DEFAULT_FILE_CONTENT = `{
  // Default model for the ghost planning session (provider/model).
  // Leave empty to use the parent session model.
  // "model": "provider/model-name"
}
`

export function loadConfig(_ctx?: PluginInput): PlanningConfig {
  try {
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true })
    }

    if (!existsSync(CONFIG_PATH)) {
      writeFileSync(CONFIG_PATH, DEFAULT_FILE_CONTENT, "utf-8")
      return { ...DEFAULT_CONFIG }
    }

    const raw = readFileSync(CONFIG_PATH, "utf-8")
    // crude jsonc strip: remove // comments and trailing commas
    let cleaned = raw.replace(/^\s*\/\/.*$/gm, "")
    cleaned = cleaned.replace(/,\s*([}\]])/g, "$1")
    const parsed = JSON.parse(cleaned || "{}")
    const model = typeof parsed.model === "string" ? parsed.model : undefined
    return {
      model,
    }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}
