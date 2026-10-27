import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || typeof imageFile === 'string') {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image size exceeds 10MB limit' }, { status: 400 });
    }

    const ext = path.extname(imageFile.name || '').toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    if (!allowed.includes(ext)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid image type. Allowed: JPG, PNG, WEBP, GIF, SVG',
      }, { status: 400 });
    }

    const filename = `blog-${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/blogs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const bytes = await imageFile.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(bytes));

    const imageUrl = `/uploads/blogs/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (err) {
    console.error('[blogs/admin/upload-image/POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to upload blog image' }, { status: 500 });
  }
}
