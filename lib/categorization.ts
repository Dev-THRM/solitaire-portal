import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import prisma from './prisma';
import { extractText, cleanText, parseSections } from './extraction';
import { buildPrompt, type GeminiCategoryResult } from './prompts/categorize-resume';
import { resolveUploadedFilePath } from './uploadPath';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
  return new GoogleGenerativeAI(apiKey);
}

const GeminiResultSchema = z.array(
  z.object({
    category: z.string().min(1),
    confidence: z.number().min(0).max(1),
    evidence: z.string().min(1),
  }),
);

export async function extractAndCategorize(
  applicationId: string,
  filePath: string,
): Promise<void> {
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

  let rawText = '';
  try {
    const resolvedPath = resolveUploadedFilePath(filePath);
    if (!fs.existsSync(resolvedPath)) {
      const filename = path.basename(filePath);
      throw new Error(`Resume file "${filename}" was not found on the server. Please re-upload the applicant's resume.`);
    }

    rawText = await extractText(resolvedPath);
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
    return;
  }

  await categorizeResume(resume.id);
}

export async function categorizeResume(resumeId: string): Promise<void> {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: { application: { select: { id: true } } },
  });

  if (!resume) throw new Error(`Resume ${resumeId} not found`);
  if (resume.extractionStatus !== 'DONE' || !resume.rawText) {
    throw new Error('Resume text extraction must succeed before categorization');
  }

  await prisma.resume.update({
    where: { id: resumeId },
    data: { categorizationStatus: 'PROCESSING', categorizationError: null },
  });

  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, description: true },
    });

    if (categories.length === 0) {
      throw new Error('No active categories found in database');
    }

    const prompt = buildPrompt(resume.rawText, categories);
    const rawResponse = await callGeminiWithRetry(prompt);
    const results = parseGeminiResponse(rawResponse);

    const categoryMap = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });
    const nameToId = new Map(categoryMap.map((c) => [c.name, c.id]));

    await prisma.candidateCategory.deleteMany({
      where: { resumeId, source: 'LLM' },
    });

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

async function callGeminiWithRetry(
  prompt: string,
  maxRetries = 3,
): Promise<string> {
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const isRetryable =
        err?.status === 429 ||
        (typeof err?.status === 'number' && err.status >= 500);

      if (!isRetryable || attempt === maxRetries) {
        throw lastError;
      }

      const delayMs = Math.min(1000 * Math.pow(2, attempt), 16000);
      console.warn(
        `[gemini] Rate limit / server error (attempt ${attempt + 1}). Retrying in ${delayMs}ms...`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError ?? new Error('Gemini call failed after max retries');
}

export function parseGeminiResponse(raw: string): GeminiCategoryResult[] {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
