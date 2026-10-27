import path from 'path';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ParsedSections {
  summary: string;
  experience: string;
  skills: string;
  education: string;
}

// ── Text Extraction ───────────────────────────────────────────────────────────

/**
 * Extract raw text from a PDF, DOCX, or image (JPEG/PNG) file on disk.
 */
export async function extractText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return extractFromPdf(filePath);
  }

  if (ext === '.doc' || ext === '.docx') {
    return extractFromDocx(filePath);
  }

  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    return extractFromImage(filePath);
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

async function extractFromPdf(filePath: string): Promise<string> {
  let url: string;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    url = filePath;
  } else {
    url = 'file:///' + path.resolve(filePath).replace(/\\/g, '/');
  }
  const parser = new PDFParse({ url });
  const data = await parser.getText();
  return data.text;
}

async function extractFromDocx(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractFromImage(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set; cannot extract text from resume image');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  const fileBuffer = await fs.promises.readFile(filePath);
  const base64Data = fileBuffer.toString('base64');

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    },
    'Extract all readable text verbatim from this resume/CV image. Retain structure, headings, dates, experience details, and contact information. Output only the plain extracted text without any conversational preamble or markdown formatting.',
  ]);

  return result.response.text();
}

// ── Text Cleaning ─────────────────────────────────────────────────────────────

export function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/^\s*(page\s+\d+\s*(of\s+\d+)?)\s*$/gim, '')
    .replace(/https?:\/\/\S+/g, '[url]')
    .replace(/^[-=*_]{3,}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim();
}

// ── Section Parsing ───────────────────────────────────────────────────────────

const SECTION_PATTERNS: Record<keyof ParsedSections, RegExp[]> = {
  summary: [
    /^(professional\s+)?summary/i,
    /^(career\s+)?objective/i,
    /^profile/i,
    /^about\s+(me|myself)?/i,
    /^introduction/i,
  ],
  experience: [
    /^(work\s+|professional\s+)?experience/i,
    /^employment(\s+history)?/i,
    /^career\s+history/i,
    /^work\s+history/i,
  ],
  skills: [
    /^(key\s+|core\s+|technical\s+)?skills/i,
    /^competenc(ies|es)/i,
    /^expertise/i,
    /^capabilities/i,
  ],
  education: [
    /^education(\s+&\s+training)?/i,
    /^academic(\s+background)?/i,
    /^qualifications?/i,
    /^certifications?\s*(and\s+training)?/i,
  ],
};

export function parseSections(cleanedText: string): ParsedSections {
  const lines = cleanedText.split('\n');
  const sections: ParsedSections = {
    summary: '',
    experience: '',
    skills: '',
    education: '',
  };

  let currentSection: keyof ParsedSections | null = null;
  const sectionBuffers: Record<keyof ParsedSections, string[]> = {
    summary: [],
    experience: [],
    skills: [],
    education: [],
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const detected = detectSectionHeader(trimmed);
    if (detected) {
      currentSection = detected;
      continue;
    }

    if (currentSection) {
      sectionBuffers[currentSection].push(line);
    }
  }

  for (const key of Object.keys(sections) as Array<keyof ParsedSections>) {
    sections[key] = sectionBuffers[key].join('\n').trim();
  }

  const hasAnySections = Object.values(sections).some((v) => v.length > 0);
  if (!hasAnySections) {
    sections.experience = cleanedText;
  }

  return sections;
}

function detectSectionHeader(line: string): keyof ParsedSections | null {
  if (line.length === 0 || line.length > 60) return null;

  for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(line)) {
        return section as keyof ParsedSections;
      }
    }
  }
  return null;
}
