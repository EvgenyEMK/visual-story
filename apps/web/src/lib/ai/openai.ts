// Extracted from docs/modules/ai-assistant/script-feedback.md
// and docs/modules/ai-assistant/visual-suggestions.md

import OpenAI from 'openai';

/**
 * Server-side OpenAI client instance.
 * Uses OPENAI_API_KEY from environment variables.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
