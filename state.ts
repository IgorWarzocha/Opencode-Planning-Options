/**
 * In-memory state for planning sub-sessions.
 * Maps parent session -> last ghost sub-session and plan text.
 */

export type PlanningState = {
  subSessionID: string
  planText: string
}

const state = new Map<string, PlanningState>()

export const planningState = {
  set(parentSessionID: string, value: PlanningState) {
    state.set(parentSessionID, value)
  },
  get(parentSessionID: string): PlanningState | undefined {
    return state.get(parentSessionID)
  },
  clear(parentSessionID: string) {
    state.delete(parentSessionID)
  },
}
