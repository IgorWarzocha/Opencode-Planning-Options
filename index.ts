import type { Plugin } from "@opencode-ai/plugin"
import { createPlanningTool } from "./planning-tool"
import { suppression } from "./suppress"
import { createPlanningAnswersTool } from "./planning-answers-tool"
import { loadConfig } from "./config"

export const PlanningOptionsPlugin: Plugin = async (ctx) => {
  const config = loadConfig(ctx)
  return {
    tool: {
      planning_options: createPlanningTool(ctx, config),
      planning_answers: createPlanningAnswersTool(ctx),
    },
    "experimental.text.complete": async (input, output) => {
      if (suppression.consume(input, output)) {
        output.text = ""
      }
    },
  }
}

export default PlanningOptionsPlugin
