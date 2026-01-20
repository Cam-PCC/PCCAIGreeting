
'use server';

import { handleComplexText } from '@/ai/flows/handle-complex-text';

export async function generateAudioAction(text: string, model: string): Promise<{ audioDataUri?: string; error?: string }> {
  if (!text.trim()) {
    return { error: 'Please enter some text to convert.' };
  }
  try {
    const result = await handleComplexText({ text, model });
    if (!result.media) {
        return { error: 'The AI failed to generate audio. Please try a different input.' };
    }
    return { audioDataUri: result.media };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate audio. Please try again.' };
  }
}
