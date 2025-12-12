/**
 * UI helpers for the planning options popup.
 * Self-contained; does not depend on idle stubs.
 */

// Minimal sendPopup implementation (avoids shared stubs to keep plugin self-contained)
export async function sendPopup(client: any, sessionID: string, text: string): Promise<void> {
  if (!client || !client.session?.prompt) return
  try {
    await client.session.prompt({
      path: { id: sessionID },
      body: {
        noReply: true,
        parts: [{ type: "text", text, ignored: true }],
      },
    })
  } catch {
    // best-effort UI; swallow errors
  }
}

export function buildPlanMessage(plan: string, modelLabel?: string): string {
  const trimmed = plan.trim()
  // Prompt-engineering hook: tweak header wording for clarity/urgency
  const header = modelLabel ? `▣ Planning Options | ${modelLabel}` : "▣ Planning Options | plan generated"
  // Always show the model used; append even on empty content
  const body = trimmed || "(no plan content returned)"
  return [header, "", body].join("\n").trim()
}
