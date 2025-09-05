'use server';
/**
 * @fileOverview Flow to generate an image from a script and a desired style.
 *
 * - generateImageFromScript - A function that takes script and style inputs and returns a data URI of the generated image.
 * - GenerateImageFromScriptInput - The input type for the generateImageFromScript function.
 * - GenerateImageFromScriptOutput - The return type for the generateImageFromScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromScriptInputSchema = z.object({
  script: z.string().describe('The script to generate an image from.'),
  imageStyle: z.string().describe('The desired style of the image.'),
});
export type GenerateImageFromScriptInput = z.infer<typeof GenerateImageFromScriptInputSchema>;

const GenerateImageFromScriptOutputSchema = z.object({
  image: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageFromScriptOutput = z.infer<typeof GenerateImageFromScriptOutputSchema>;

export async function generateImageFromScript(input: GenerateImageFromScriptInput): Promise<GenerateImageFromScriptOutput> {
  return generateImageFromScriptFlow(input);
}

const generateImageFromScriptFlow = ai.defineFlow(
  {
    name: 'generateImageFromScriptFlow',
    inputSchema: GenerateImageFromScriptInputSchema,
    outputSchema: GenerateImageFromScriptOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'openai/dall-e-3',
      prompt: `Generate an image based on the following script and style.\n\nScript: ${input.script}\n\nStyle: ${input.imageStyle}`,
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed to produce a URL.');
    }

    return {image: media.url};
  }
);
