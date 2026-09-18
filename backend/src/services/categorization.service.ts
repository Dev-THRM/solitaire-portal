import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import prisma from '../config/db';
import { extractText, cleanText, parseSections } from './extraction.service';
import { buildPrompt, type GeminiCategoryResult } from '../prompts/categorize-resume';
import path from 'path';

// ── Gemini client (lazy init so missing key only errors at call-time) ─────────

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
  return new GoogleGenerativeAI(apiKey);
}

// ── Zod schema for Gemini response validation ─────────────────────────────────

const GeminiResultSchema = z.array(
  z.object({
    category: z.string().min(1),
    confidence: z.number().min(0).max(1),
    evidence: z.string().min(1),
  }),
);

// ── Main orchestration ────────────────────────────────────────────────────────

/**
 * Full pipeline: extract text → categorize via Gemini → persist results.
 * Designed to be called fire-and-forget (never throws to caller).
 */
export async function extractAndCategorize(
  applicationId: string,
  filePath: string,
): Promise<void> {
  // 1. Find or create the Resume row
  let resume = await prisma.resume.findUnique({ where: { applicationId } });
  if (!resume) {
    resume = await prisma.resume.create({
      data: {
        applicationId,
        rawText: '',
        extractionStatus: 'PENDING',
        categorizationStatus: 'PENDING',
      },
    });
  }

  // 2. Extract text
  let rawText = '';
  try {
    rawText = await extractText(filePath);
    const cleaned = cleanText(rawText);
    const sections = parseSections(cleaned);

    resume = await prisma.resume.update({
      where: { id: resume.id },
      data: {
        rawText: cleaned,
        parsedSections: sections as any,
        extractionStatus: 'DONE',
        extractionError: null,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[extraction] Failed for application ${applicationId}:`, msg);
    await prisma.resume.update({
      where: { id: resume.id },
      data: { extractionStatus: 'FAILED', extractionError: msg },
    });
    return; // don't proceed to categorization if extraction failed
  }

  // 3. Categorize
  await categorizeResume(resume.id);
}

/**
 * Run (or re-run) Gemini categorization for an existing Resume row.
 * On re-run: deletes previous LLM assignments, preserves MANUAL ones.
 */
export async function categorizeResume(resumeId: string): Promise<void> {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: { application: { select: { id: true } } },
  });

  if (!resume) throw new Error(`Resume ${resumeId} not found`);
  if (resume.extractionStatus !== 'DONE' || !resume.rawText) {
    throw new Error('Resume text extraction must succeed before categorization');
  }

  // Mark as processing
  await prisma.resume.update({
    where: { id: resumeId },
    data: { categorizationStatus: 'PROCESSING', categorizationError: null },
  });

  try {
    // Fetch active categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, description: true },
    });

    if (categories.length === 0) {
      throw new Error('No active categories found in database');
    }

    // Build prompt and call Gemini
    const prompt = buildPrompt(resume.rawText, categories);
    const rawResponse = await callGeminiWithRetry(prompt);
    const results = parseGeminiResponse(rawResponse);

    // Build a map of category name → DB id
    const categoryMap = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });
    const nameToId = new Map(categoryMap.map((c) => [c.name, c.id]));

    // Delete previous LLM assignments (preserve MANUAL)
    await prisma.candidateCategory.deleteMany({
      where: { resumeId, source: 'LLM' },
    });

    // Insert new LLM results
    const toInsert = results
      .filter((r) => nameToId.has(r.category))
      .map((r) => ({
        resumeId,
        categoryId: nameToId.get(r.category)!,
        confidence: r.confidence,
        evidence: r.evidence,
        source: 'LLM' as const,
        isActive: true,
      }));

    if (toInsert.length > 0) {
      await prisma.candidateCategory.createMany({ data: toInsert });
    }

    // Mark done + update application status to CATEGORIZED
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        categorizationStatus: 'DONE',
        categorizationError: null,
        categorizedAt: new Date(),
      },
    });

    await prisma.application.update({
      where: { id: resume.application.id },
      data: { status: 'CATEGORIZED' },
    });

    console.log(
      `[categorization] Done for resume ${resumeId}: ${toInsert.length} categories assigned`,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[categorization] Failed for resume ${resumeId}:`, msg);
    await prisma.resume.update({
      where: { id: resumeId },
      data: { categorizationStatus: 'FAILED', categorizationError: msg },
    });
  }
}

// ── Gemini call with exponential backoff ──────────────────────────────────────

async function callGeminiWithRetry(
  prompt: string,
  maxRetries = 3,
): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Retry on 429 (rate limit) or 5xx
      const isRetryable =
        err?.status === 429 ||
        (typeof err?.status === 'number' && err.status >= 500);

      if (!isRetryable || attempt === maxRetries) {
        throw lastError;
      }

      const delayMs = Math.min(1000 * Math.pow(2, attempt), 16000); // 1s, 2s, 4s, 8s cap
      console.warn(
        `[gemini] Rate limit / server error (attempt ${attempt + 1}). Retrying in ${delayMs}ms...`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError ?? new Error('Gemini call failed after max retries');
}

// ── Response parser ───────────────────────────────────────────────────────────

export function parseGeminiResponse(raw: string): GeminiCategoryResult[] {
  // Strip markdown code fences if Gemini added them despite instructions
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  // Find the first '[' to handle any stray preamble text
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end === -1) {
    console.warn('[gemini] No JSON array found in response:', raw.slice(0, 200));
    return [];
  }

  const jsonStr = cleaned.slice(start, end + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    const validated = GeminiResultSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn('[gemini] Schema validation failed:', validated.error.format());
      return [];
    }
    return validated.data;
  } catch (err) {
    console.warn('[gemini] JSON parse error:', err, 'Raw:', raw.slice(0, 200));
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
