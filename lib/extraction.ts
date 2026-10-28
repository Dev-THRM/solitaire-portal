import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Polyfill browser globals required by pdfjs-dist in headless Node environments
function ensureNodePolyfills() {
  if (typeof (globalThis as any).DOMMatrix === 'undefined') {
    (globalThis as any).DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      m11 = 1; m12 = 0; m13 = 0; m14 = 0;
      m21 = 0; m22 = 1; m23 = 0; m24 = 0;
      m31 = 0; m32 = 0; m33 = 1; m34 = 0;
      m41 = 0; m42 = 0; m43 = 0; m44 = 1;
      is2D = true;
      isIdentity = true;
      constructor(_init?: any) {}
      static fromMatrix(_init?: any) { return new (globalThis as any).DOMMatrix(); }
      static fromFloat32Array(_init?: any) { return new (globalThis as any).DOMMatrix(); }
      static fromFloat64Array(_init?: any) { return new (globalThis as any).DOMMatrix(); }
      multiply() { return this; }
      translate() { return this; }
      scale() { return this; }
      rotate() { return this; }
      transformPoint(p?: any) { return p || { x: 0, y: 0, z: 0, w: 1 }; }
      inverse() { return this; }
    };
  }
  if (typeof (globalThis as any).ImageData === 'undefined') {
    (globalThis as any).ImageData = class ImageData {
      width = 0;
      height = 0;
      data = new Uint8ClampedArray(0);
      constructor(w = 0, h = 0) { this.width = w; this.height = h; }
    };
  }
  if (typeof (globalThis as any).Path2D === 'undefined') {
    (globalThis as any).Path2D = class Path2D {
      addPath() {}
      closePath() {}
      moveTo() {}
      lineTo() {}
      bezierCurveTo() {}
      quadraticCurveTo() {}
      arc() {}
      arcTo() {}
      ellipse() {}
      rect() {}
    };
  }
}

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
  ensureNodePolyfills();
  try {
    const { PDFParse } = await import('pdf-parse');
    let url: string;
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      url = filePath;
    } else {
      url = 'file:///' + path.resolve(filePath).replace(/\\/g, '/');
    }
    const parser = new PDFParse({ url });
    const data = await parser.getText();
    return data.text || '';
  } catch (err) {
    console.warn('[extractFromPdf] pdf-parse failed, falling back to Gemini extract:', err);
    return extractFromImage(filePath);
  }
}

async function extractFromDocx(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractFromImage(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'application/pdf';
  if (ext === '.png') mimeType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
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
