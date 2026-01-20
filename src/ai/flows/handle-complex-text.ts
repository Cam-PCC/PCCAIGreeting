'use server';
/**
 * @fileOverview An AI agent that processes complex text, splits it into smaller,
 *   meaningful chunks, and then converts each chunk to audio using Deepgram Aura.
 *
 * - handleComplexText - The main function to process the complex text.
 * - HandleComplexTextInput - The input type for the handleComplexText function.
 * - HandleComplexTextOutput - The return type for the handleComplexText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleComplexTextInputSchema = z.object({
  text: z.string().describe('The complex text to be converted to audio.'),
  model: z.string().describe('The Deepgram Aura model to use for audio conversion.'),
});
export type HandleComplexTextInput = z.infer<typeof HandleComplexTextInputSchema>;

const HandleComplexTextOutputSchema = z.object({
  media: z.string().describe('The audio data in WAV format as a data URI.'),
});
export type HandleComplexTextOutput = z.infer<typeof HandleComplexTextOutputSchema>;

export async function handleComplexText(input: HandleComplexTextInput): Promise<HandleComplexTextOutput> {
  return handleComplexTextFlow(input);
}

const handleComplexTextFlow = ai.defineFlow(
  {
    name: 'handleComplexTextFlow',
    inputSchema: HandleComplexTextInputSchema,
    outputSchema: HandleComplexTextOutputSchema,
  },
  async ({ text, model }) => {
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error(
        'DEEPGRAM_API_KEY is not set. Please add it to your .env file.'
      );
    }
    
    const url = `https://api.deepgram.com/v1/speak?model=${model}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
    };
    const body = JSON.stringify({ text });

    console.log('--- Sending Request to Deepgram ---');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('------------------------------------');

    const response = await fetch(
        url,
        {
          method: 'POST',
          headers: headers,
          body: body,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('--- Deepgram API Error ---');
        console.error('Status:', response.status);
        console.error('Response:', errorText);
        console.error('--------------------------');
        throw new Error(`Deepgram API error: ${response.statusText} - ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');
      const audioDataUri = `data:audio/wav;base64,${audioBase64}`;

      return { media: audioDataUri };
  }
);
