import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedSections {
  summary: string;
  experience: string;
  skills: string;
  education: string;
}

// ── Text Extraction ───────────────────────────────────────────────────────────

/**
 * Extract raw text from a PDF or DOCX file on disk.
 */
export async function extractText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return extractFromPdf(filePath);
  }

  if (ext === '.doc' || ext === '.docx') {
    return extractFromDocx(filePath);
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

async function extractFromPdf(filePath: string): Promise<string> {
  // If it's already an HTTP(S) URL, pass it directly — PDFParse v2 can fetch it.
  // Otherwise convert a local file path to a proper file:// URL.
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

// ── Text Cleaning ─────────────────────────────────────────────────────────────

/**
 * Normalize whitespace, strip repeated separators, and remove
 * common header/footer noise (page numbers, URLs, etc.)
 */
export function cleanText(raw: string): string {
  return raw
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Strip common header/footer patterns (page numbers, URLs)
    .replace(/^\s*(page\s+\d+\s*(of\s+\d+)?)\s*$/gim, '')
    .replace(/https?:\/\/\S+/g, '[url]')
    // Collapse runs of dashes/equals used as section dividers to a single blank line
    .replace(/^[-=*_]{3,}\s*$/gm, '')
    // Collapse 3+ consecutive blank lines to 2
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive leading/trailing spaces from each line
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

/**
 * Attempt to split clean text into logical resume sections.
 * Returns raw full text as fallback if no sections are detectable.
 */
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

    // Check if this line is a section header
    const detected = detectSectionHeader(trimmed);
    if (detected) {
      currentSection = detected;
      continue;
    }

    if (currentSection) {
      sectionBuffers[currentSection].push(line);
    }
  }

  // Build section strings
  for (const key of Object.keys(sections) as Array<keyof ParsedSections>) {
    sections[key] = sectionBuffers[key].join('\n').trim();
  }

  // If nothing was detected, put entire text in experience as fallback
  const hasAnySections = Object.values(sections).some((v) => v.length > 0);
  if (!hasAnySections) {
    sections.experience = cleanedText;
  }

  return sections;
}

function detectSectionHeader(line: string): keyof ParsedSections | null {
  // Only consider short lines as potential headers (≤ 60 chars)
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
