import type { Plugin } from "@opencode-ai/plugin"
import { createPlanningTool } from "./planning-tool"
import { suppression } from "./suppress"
import { createPlanningAnswersTool } from "./planning-answers-tool"

export const PlanningOptionsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      planning_options: createPlanningTool(ctx),
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
