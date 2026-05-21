export async function generateWithAI(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, apiKey }),
    })
    const data = await res.json()
    if (data.success) return data.data
    return null
  } catch {
    return null
  }
}
