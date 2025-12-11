import { tool } from "@opencode-ai/plugin"
import { buildPlanMessage, sendPopup } from "./ui"
import { suppression } from "./suppress"
import { planningState } from "./state"

type ToolCtx = {
  client: any
}

export function createPlanningTool(ctx: ToolCtx) {
  return tool({
    description:
      "Generate structured planning options. Behaviors: (1) create a ghost sub-session, (2) show the plan in the planning popup UI, (3) return the literal string 'Await further instructions' so the assistant stays silent and waits for the user to pick an option. Do not expect a textual plan in the tool return value; the plan is shown via popup.",
    args: {
      planning_options: tool.schema.string().describe("Freeform planning request"),
      model: tool.schema.string().optional().describe("Optional model in provider/model format (e.g., openai/gpt-4.1)"),
    },
    async execute(args, toolCtx) {
      const parentSessionID = toolCtx.sessionID
      // Prompt-engineering hook: tweak default ask when caller provides no text
      const userQuestion = args.planning_options?.trim() || "Draft a short implementation plan."
      // Prompt-engineering hook: adjust structured prompt style/limits/categories
      const instruction = buildStructuredPrompt(userQuestion)

      // If there is an existing ghost session for this parent, clear it (and optionally delete)
      const existing = planningState.get(parentSessionID)
      if (existing && process.env.PLANNING_DELETE_GHOST === "1") {
        await ctx.client.session.delete({ path: { id: existing.subSessionID } }).catch(() => {})
      }
      planningState.clear(parentSessionID)

      // 1) Create ghost sub-session
      const created = await ctx.client.session.create({
        body: {
          title: "Planning Options (ghost)",
          parentID: parentSessionID,
        },
      })
      if (created.error || !created.data?.id) {
        return "Failed to create planning sub-session."
      }
      const subSessionID = created.data.id as string

      // 2) Prompt the ghost session
      const modelSpec =
        args.model && args.model.includes("/")
          ? (() => {
              const [providerID, modelID] = args.model.split("/", 2)
              return providerID && modelID ? { providerID, modelID } : undefined
            })()
          : undefined

      const ghost = await ctx.client.session.prompt({
        path: { id: subSessionID },
        body: {
          parts: [
            {
              type: "text",
              text: instruction,
            },
          ],
          ...(modelSpec ? { model: modelSpec } : {}),
          agent: "plan", // force built-in plan agent for ghost session
        },
      })

      if (ghost.error) {
        return "Failed to generate a plan."
      }

      const planText = extractText(ghost.data?.parts) || "No plan content returned."

      // 3) Surface in UI popup on the parent session
      const modelLabel =
        ghost.data?.info?.model
          ? `${ghost.data.info.model.providerID}/${ghost.data.info.model.modelID}`
          : args.model || "unknown-model"

      const popup = buildPlanMessage(planText, modelLabel)
      await sendPopup(ctx.client, parentSessionID, popup)

      // Persist sub-session for follow-up answer selection
      planningState.set(parentSessionID, { subSessionID, planText })

      // 4) Suppress follow-on assistant text and return the agreed marker
      suppression.mark(parentSessionID)
      return "Await further instructions"
    },
  })
}

function extractText(parts: any[] | undefined): string | null {
  if (!parts) return null
  const texts = parts.filter((p) => p.type === "text" && typeof p.text === "string").map((p) => p.text.trim())
  if (texts.length === 0) return null
  return texts.join("\n\n")
}

function buildStructuredPrompt(question: string): string {
  return [
    // Prompt-engineering hook: persona framing
    "You are a planning assistant.",
    "OUTPUT FORMAT (mandatory, no extra text):",
    "Q1 - <category> - <user-facing question>",
    "A: <option A>",
    "B: <option B>",
    "C: <option C>",
    "",
    "Q2 - <category> - <user-facing question>",
    "A: <option A>",
    "B: <option B>",
    "C: <option C>",
    "",
    "Q3 - <category> - <user-facing question>",
    "A: <option A>",
    "B: <option B>",
    "C: <option C>",
    "",
    "Rules (strict):",
    "- category must be one of Architecture | UI | UX | API | Data | Testing | Rollout | Risk | Decision.",
    "- Keep each line <= 90 chars.",
    "- Provide three mutually exclusive, actionable options per question.",
    "- No preamble, no epilogue, no explanations, no follow-up questions.",
    "- Do NOT wrap the output in boxes, markdown fences, or tags.",
    "- Output plain text only.",
    "- If you lack information, propose reasonable defaults; still produce all Q1-Q3.",
    "",
    `User request: ${question}`,
  ].join("\n")
}
