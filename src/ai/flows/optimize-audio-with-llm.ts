
'use server';
/**
 * @fileOverview This file contains a Genkit flow that analyzes input text using an LLM
 *  and optimizes Deepgram Aura settings for high-quality audio output.
 *
 * - optimizeAudioWithLLM - A function that optimizes audio output using an LLM.
 * - OptimizeAudioWithLLMInput - The input type for the optimizeAudioWithLLM function.
 * - OptimizeAudioWithLLMOutput - The return type for the optimizeAudioWithLLM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeAudioWithLLMInputSchema = z.object({
  text: z.string().describe('The text to be converted to audio.'),
  selectedModel: z.string().describe('The selected Deepgram audio model.'),
});

export type OptimizeAudioWithLLMInput = z.infer<typeof OptimizeAudioWithLLMInputSchema>;

const OptimizeAudioWithLLMOutputSchema = z.object({
  audioDataUri: z.string().describe('The audio data URI of the converted audio.'),
});

export type OptimizeAudioWithLLMOutput = z.infer<typeof OptimizeAudioWithLLMOutputSchema>;

export async function optimizeAudioWithLLM(input: OptimizeAudioWithLLMInput): Promise<OptimizeAudioWithLLMOutput> {
  return optimizeAudioWithLLMFlow(input);
}

const optimizeAudioWithLLMFlow = ai.defineFlow(
  {
    name: 'optimizeAudioWithLLMFlow',
    inputSchema: OptimizeAudioWithLLMInputSchema,
    outputSchema: OptimizeAudioWithLLMOutputSchema,
  },
  async ({text, selectedModel}) => {
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error(
        'DEEPGRAM_API_KEY is not set. Please add it to your .env file.'
      );
    }
    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=${selectedModel}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        },
        body: JSON.stringify({text}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepgram API error: ${response.statusText} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioDataUri = `data:audio/wav;base64,${audioBase64}`;
    
    return { audioDataUri };
  }
);
