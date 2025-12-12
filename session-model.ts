/**
 * Fetch session model info via SDK. Returns { providerID, modelID } or undefined.
 */
export async function getSessionModel(client: any, sessionID: string): Promise<{ providerID: string; modelID: string } | undefined> {
  try {
    const res = await client.session.get({ path: { id: sessionID } })
    const model = res?.data?.model
    if (model?.providerID && model?.modelID) {
      return { providerID: model.providerID, modelID: model.modelID }
    }
  } catch {
    // ignore
  }
  return undefined
}
