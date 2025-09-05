'use server';

/**
 * @fileOverview Provides image style suggestions based on a given script.
 *
 * - suggestImageStyles - A function that suggests image styles based on the script content.
 * - SuggestImageStylesInput - The input type for the suggestImageStyles function, containing the script.
 * - SuggestImageStylesOutput - The return type for the suggestImageStyles function, containing suggested styles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImageStylesInputSchema = z.object({
  script: z.string().describe('The script content for which to suggest image styles.'),
});
export type SuggestImageStylesInput = z.infer<typeof SuggestImageStylesInputSchema>;

const SuggestImageStylesOutputSchema = z.object({
  styles: z.array(z.string()).describe('An array of suggested image styles based on the script.'),
});
export type SuggestImageStylesOutput = z.infer<typeof SuggestImageStylesOutputSchema>;

export async function suggestImageStyles(input: SuggestImageStylesInput): Promise<SuggestImageStylesOutput> {
  return suggestImageStylesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImageStylesPrompt',
  input: {schema: SuggestImageStylesInputSchema},
  output: {schema: SuggestImageStylesOutputSchema},
  prompt: `You are an AI assistant designed to suggest image styles based on script content.

  Given the following script, suggest three distinct image styles that would be suitable for generating images that represent the script.
  Return the image styles as an array of strings.

  Script: {{{script}}}`,
});

const suggestImageStylesFlow = ai.defineFlow(
  {
    name: 'suggestImageStylesFlow',
    inputSchema: SuggestImageStylesInputSchema,
    outputSchema: SuggestImageStylesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
