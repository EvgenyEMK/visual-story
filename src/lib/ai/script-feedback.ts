// Extracted from docs/modules/ai-assistant/script-feedback.md

import { openai } from './openai';
import type { ContentIntent } from '@/types/project';
import type { ScriptFeedbackResponse } from '@/types/ai';

/**
 * Prompt template for script feedback analysis.
 * Evaluates hook, structure, clarity, engagement, CTA, and conclusion.
 */
const feedbackPrompt = (script: string, intent: ContentIntent) => `
You are an expert content strategist analyzing a script for a visual presentation.

Script:
"""
${script}
"""

Content Intent: ${intent}

Analyze this script and provide feedback in the following JSON format:

{
  "overall_score": <1-100>,
  "categories": [
    { "name": "Hook", "score": <1-10>, "summary": "<brief assessment>" },
    { "name": "Structure", "score": <1-10>, "summary": "<brief assessment>" },
    { "name": "Clarity", "score": <1-10>, "summary": "<brief assessment>" },
    { "name": "Engagement", "score": <1-10>, "summary": "<brief assessment>" },
    { "name": "CTA", "score": <1-10>, "summary": "<brief assessment>" },
    { "name": "Conclusion", "score": <1-10>, "summary": "<brief assessment>" }
  ],
  "suggestions": [
    {
      "id": "<unique id>",
      "category": "<category name>",
      "severity": "low|medium|high",
      "issue": "<what's wrong>",
      "suggestion": "<how to fix>",
      "original_text": "<text to replace, if applicable>",
      "suggested_text": "<replacement text, if applicable>"
    }
  ]
}

Focus on actionable, specific suggestions. Limit to 5 most impactful suggestions.
Tailor feedback to the ${intent} intent:
- educational: focus on clarity, learning progression
- promotional: focus on benefits, urgency, CTA
- storytelling: focus on narrative arc, emotion
`;

/**
 * Generate AI feedback for a script using OpenAI GPT-4o.
 * Returns scored categories and actionable suggestions.
 *
 * Cost: ~$0.01-0.02 per analysis (~1-2K tokens)
 * Rate limit: Max 5 analyses per project per hour
 */
export async function getScriptFeedback(
  script: string,
  intent: ContentIntent
): Promise<ScriptFeedbackResponse> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: feedbackPrompt(script, intent) }],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  return JSON.parse(content) as ScriptFeedbackResponse;
}
