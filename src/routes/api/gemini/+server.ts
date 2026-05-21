import { GoogleGenAI } from '@google/genai'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt, apiKey } = await request.json()
    if (!apiKey) {
      return json({ success: false, data: null })
    }
    const ai = new GoogleGenAI({ apiKey })
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Return the response to the below prompt in Markdown (.md) only, if the prompt isn't correct, you may ask the user other questions. Prompt: : ${prompt}`,
    })
    return json({ success: true, data: res.text })
  } catch {
    return json({ success: false, data: null })
  }
}
