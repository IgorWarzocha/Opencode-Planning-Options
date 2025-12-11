/**
 * UI helpers for the planning options popup.
 * Stubbed idle message lives in ui-stubs/idle-popup.ts for reuse.
 */

import { sendPopup as sharedSendPopup } from "../ui-stubs/idle-popup"

export function buildPlanMessage(plan: string, modelLabel?: string): string {
  const trimmed = plan.trim()
  // Prompt-engineering hook: tweak header wording for clarity/urgency
  const header = modelLabel ? `▣ Planning Options | ${modelLabel}` : "▣ Planning Options | plan generated"
  // Always show the model used; append even on empty content
  const body = trimmed || "(no plan content returned)"
  return [header, "", body].join("\n").trim()
}

export const sendPopup = sharedSendPopup
