'use server';
/**
 * @fileOverview A Genkit flow to fetch the Deepgram credit balance.
 *
 * - getDeepgramBalance - A function that fetches the Deepgram credit balance.
 * - GetDeepgramBalanceOutput - The return type for the getDeepgramBalance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetDeepgramBalanceOutputSchema = z.object({
  amount: z.number().describe('The remaining credit balance.'),
  units: z.string().describe('The currency unit of the balance (e.g., USD).'),
});
export type GetDeepgramBalanceOutput = z.infer<typeof GetDeepgramBalanceOutputSchema>;

export async function getDeepgramBalance(): Promise<GetDeepgramBalanceOutput> {
  return getDeepgramBalanceFlow();
}

const getDeepgramBalanceFlow = ai.defineFlow(
  {
    name: 'getDeepgramBalanceFlow',
    outputSchema: GetDeepgramBalanceOutputSchema,
  },
  async () => {
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error(
        'DEEPGRAM_API_KEY is not set. Please add it to your .env file.'
      );
    }

    const headers = {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
    };

    // First, get the project ID
    const projectsResponse = await fetch('https://api.deepgram.com/v1/projects', { headers });
    if (!projectsResponse.ok) {
      const errorText = await projectsResponse.text();
      throw new Error(`Failed to fetch Deepgram projects: ${errorText}`);
    }
    const { projects } = await projectsResponse.json();
    if (!projects || projects.length === 0) {
      throw new Error('No Deepgram projects found for this API key.');
    }
    const projectId = projects[0].project_id;

    // Then, get the balance for that project
    const balanceResponse = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/balance`, { headers });
    if (!balanceResponse.ok) {
        const errorText = await balanceResponse.text();
        throw new Error(`Failed to fetch Deepgram balance: ${errorText}`);
    }
    const { amount, units } = await balanceResponse.json();

    return { amount, units };
  }
);
