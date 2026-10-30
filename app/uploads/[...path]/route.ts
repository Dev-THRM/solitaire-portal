import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { resolveUploadedFilePath } from '@/lib/uploadPath';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  // Documents
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  // Videos
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.ogg': 'video/ogg',
  '.ogv': 'video/ogg',
  '.m4v': 'video/mp4',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: segments } = await params;
    if (!segments || segments.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Prevent path traversal
    for (const seg of segments) {
      if (seg.includes('..') || seg.includes('/') || seg.includes('\\')) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    const relPath = segments.join('/');
    const filePath = resolveUploadedFilePath(relPath);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle HTTP Range requests (crucial for video streaming & seeking in Chrome/Safari/iOS)
    const rangeHeader = request.headers.get('range');
    if (rangeHeader && fileSize > 0) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize || start > end) {
          return new NextResponse(null, {
            status: 416,
            headers: {
              'Content-Range': `bytes */${fileSize}`,
            },
          });
        }

        const chunkSize = end - start + 1;
        const nodeStream = fs.createReadStream(filePath, { start, end });
        const webStream = Readable.toWeb(nodeStream);

        return new NextResponse(webStream as unknown as BodyInit, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunkSize),
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Full file response (streamed to avoid buffering large videos in memory)
    const nodeStream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);

    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('[uploads/GET] Error:', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
