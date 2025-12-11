import { tool } from "@opencode-ai/plugin"
import { planningState } from "./state"

type ToolCtx = { client: any }

export function createPlanningAnswersTool(ctx: ToolCtx) {
  return tool({
    description:
      "Submit the user's selection for planning options. Accepts freeform text like '1A 2b 3-C more notes'. " +
      "Uses the last planning sub-session for this parent session, forwards the selection there, and returns the ghost model's tweaks.",
    args: {
      planning_answers: tool.schema.string().describe("User selections and optional commentary"),
    },
    async execute(args, toolCtx) {
      const parentSessionID = toolCtx.sessionID
      const selection = args.planning_answers?.trim()
      if (!selection) return "No selection provided."

      const saved = planningState.get(parentSessionID)
      if (!saved) {
        return "No prior planning session found for this conversation. Run planning_options first."
      }

      const ghostResp = await ctx.client.session.prompt({
        path: { id: saved.subSessionID },
        body: {
          parts: [
            {
              type: "text",
              // Prompt-engineering hook: adjust how the selection is handed off
              text: `User selection for planning options:\n${selection}\n\nIf needed, restate the chosen options and any adjustments concisely.`,
            },
          ],
        },
      })

      if (ghostResp.error) {
        return "Failed to send selection to planning sub-session."
      }

      const text = extractText(ghostResp.data?.parts) || "Selection noted."

      // Cleanup: delete the ghost session now that it served its purpose
      await ctx.client.session
        .delete({ path: { id: saved.subSessionID } })
        .catch(() => {}) // best-effort; ignore failures
      planningState.clear(parentSessionID)

      return text
    },
  })
}

function extractText(parts: any[] | undefined): string | null {
  if (!parts) return null
  const texts = parts.filter((p) => p.type === "text" && typeof p.text === "string").map((p) => p.text.trim())
  if (texts.length === 0) return null
  return texts.join("\n\n")
}
