/**
 * Per-session one-shot suppression of the next assistant text completion.
 * Used to keep the model silent after the planning tool, relying on the popup for UX.
 */

type TextCompleteInput = { sessionID: string; messageID: string; partID: string }
type TextCompleteOutput = { text: string }

const suppressNext = new Set<string>()

export const suppression = {
  mark(sessionID: string) {
    suppressNext.add(sessionID)
  },
  consume(input: TextCompleteInput, _output: TextCompleteOutput): boolean {
    if (!suppressNext.has(input.sessionID)) return false
    suppressNext.delete(input.sessionID)
    return true
  },
}
