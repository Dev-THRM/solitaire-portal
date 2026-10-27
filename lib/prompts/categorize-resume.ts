/**
 * Gemini prompt template for multi-label resume categorization.
 */

export interface CategoryInput {
  name: string;
  description: string;
}

export interface GeminiCategoryResult {
  category: string;
  confidence: number; // 0.0 – 1.0
  evidence: string;   // short justification from resume text
}

export const SYSTEM_PROMPT = `You are an expert HR analyst specialising in luxury hospitality and private household staffing.

Your task is to analyse a resume and assign it to one or more job categories from the provided list.
This is MULTI-LABEL classification — a single resume may match several categories if the candidate has relevant experience in each.

Rules:
- Only assign categories that the resume genuinely supports with evidence.
- Do NOT assign categories with no textual basis.
- Confidence scores must be between 0.0 and 1.0 (two decimal places).
- Evidence must be a short, direct quote or paraphrase from the resume — not a generic explanation.
- Return ONLY a valid JSON array. No markdown, no preamble, no trailing text.
- If no category matches, return an empty array: []

Output format (strict JSON array):
[
  {
    "category": "<exact category name from the list>",
    "confidence": <number 0.0-1.0>,
    "evidence": "<brief quote/paraphrase from the resume that supports this category>"
  }
]`;

const FEW_SHOT_EXAMPLES = `
=== EXAMPLE 1 ===
Categories available: Butler, Personal Chef, Chauffeur, Nanny

Resume text:
"Over 12 years working in high-net-worth households. Served as head butler at a Mayfair residence — managed household staff of 8, handled formal silver service dining and wine cellar. Previously employed as a private chauffeur for a Dubai-based family, operating a fleet of 4 vehicles including a Rolls-Royce Phantom. Held a valid UK advanced driving licence throughout."

Expected output:
[
  {
    "category": "Butler",
    "confidence": 0.95,
    "evidence": "Head butler at a Mayfair residence — managed household staff of 8, formal silver service dining"
  },
  {
    "category": "Chauffeur",
    "confidence": 0.90,
    "evidence": "Private chauffeur for a Dubai-based family, operating a fleet of 4 vehicles including Rolls-Royce Phantom"
  }
]

=== EXAMPLE 2 ===
Categories available: Butler, House Manager, Multicuisine Chef, Nanny, Facility Manager

Resume text:
"Experienced house manager with 8 years overseeing a 14-bedroom estate in Surrey. Responsibilities included staff scheduling, vendor management, maintenance oversight, and budgeting. Also provided primary childcare for two children aged 3–7, managing school runs, activities, and meal preparation. Basic cooking skills — prepared simple family meals daily."

Expected output:
[
  {
    "category": "House Manager",
    "confidence": 0.92,
    "evidence": "8 years overseeing a 14-bedroom estate — staff scheduling, vendor management, maintenance oversight"
  },
  {
    "category": "Nanny",
    "confidence": 0.85,
    "evidence": "Primary childcare for two children aged 3–7, managing school runs, activities, and meal preparation"
  }
]
`;

export function buildPrompt(resumeText: string, categories: CategoryInput[]): string {
  const categoryList = categories
    .map((c) => `- ${c.name}: ${c.description}`)
    .join('\n');

  return `${SYSTEM_PROMPT}

${FEW_SHOT_EXAMPLES}

=== YOUR TASK ===
Available categories:
${categoryList}

Resume text:
"""
${resumeText}
"""

Output (strict JSON array only):`;
}
