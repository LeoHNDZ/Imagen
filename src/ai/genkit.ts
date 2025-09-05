import {genkit} from 'genkit';
import {openAI} from '@genkit-ai/compat-oai/openai';

export const ai = genkit({
  plugins: [openAI()],
  model: 'openai/gpt-4o-mini',
});
