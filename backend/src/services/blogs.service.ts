import prisma from '../config/db';
import { Prisma } from '@prisma/client';

export interface BlogQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  status?: 'all' | 'published' | 'draft';
}

export interface CreateBlogDto {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  author?: string;
  readTime?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string;
  isPublished?: boolean;
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> {}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function calculateReadTime(content: string): string {
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

async function getUniqueSlug(baseSlug: string, currentId?: string): Promise<string> {
  let slug = baseSlug || 'post';
  let counter = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || (currentId && existing.id === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// ── Public: List Published Blogs ──────────────────────────────────────────────
export async function listPublishedBlogs(params: BlogQueryParams) {
  const page = Math.max(1, parseInt(params.page ?? '1'));
  const limit = Math.min(50, parseInt(params.limit ?? '9'));
  const skip = (page - 1) * limit;

  const where: Prisma.BlogPostWhereInput = {
    isPublished: true,
  };

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { excerpt: { contains: params.search } },
      { content: { contains: params.search } },
    ];
  }

  if (params.category && params.category !== 'all') {
    where.category = params.category;
  }

  const [blogs, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        author: true,
        readTime: true,
        metaTitle: true,
        metaDescription: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ── Public: Get Blog By Slug ──────────────────────────────────────────────────
export async function getBlogBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });
}

// ── Admin: List All Blogs (with draft status) ─────────────────────────────────
export async function listAllBlogsAdmin(params: BlogQueryParams = {}) {
  const page = Math.max(1, parseInt(params.page ?? '1'));
  const limit = Math.min(100, parseInt(params.limit ?? '20'));
  const skip = (page - 1) * limit;

  const where: Prisma.BlogPostWhereInput = {};

  if (params.status === 'published') {
    where.isPublished = true;
  } else if (params.status === 'draft') {
    where.isPublished = false;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { slug: { contains: params.search } },
      { excerpt: { contains: params.search } },
    ];
  }

  if (params.category && params.category !== 'all') {
    where.category = params.category;
  }

  const [blogs, total, publishedCount, draftCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: false } }),
  ]);

  return {
    blogs,
    counts: {
      total: publishedCount + draftCount,
      published: publishedCount,
      draft: draftCount,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ── Admin: Get Blog By ID ─────────────────────────────────────────────────────
export async function getBlogById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  });
}

// ── Admin: Create Blog ────────────────────────────────────────────────────────
export async function createBlog(data: CreateBlogDto) {
  const initialSlug = slugify(data.slug?.trim() || data.title);
  const finalSlug = await getUniqueSlug(initialSlug);
  const readTime = data.readTime || calculateReadTime(data.content);

  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug: finalSlug,
      excerpt: data.excerpt || '',
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category || 'General',
      author: data.author || 'Solitaire Team',
      readTime,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || '',
      canonicalUrl: data.canonicalUrl || null,
      keywords: data.keywords || null,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      publishedAt: data.isPublished ? new Date() : null,
    },
  });
}

// ── Admin: Update Blog ────────────────────────────────────────────────────────
export async function updateBlog(id: string, data: UpdateBlogDto) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error('BLOG_NOT_FOUND');

  let finalSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    finalSlug = await getUniqueSlug(slugify(data.slug), id);
  } else if (!data.slug && data.title && data.title !== existing.title && !existing.isPublished) {
    // If not yet published and title changed, update slug
    finalSlug = await getUniqueSlug(slugify(data.title), id);
  }

  const readTime = data.content ? calculateReadTime(data.content) : existing.readTime;
  const isPublishingNow = data.isPublished === true && !existing.isPublished && !existing.publishedAt;

  return prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      slug: finalSlug,
      readTime: data.readTime || readTime,
      publishedAt: isPublishingNow ? new Date() : existing.publishedAt,
    },
  });
}

// ── Admin: Delete Blog ────────────────────────────────────────────────────────
export async function deleteBlog(id: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error('BLOG_NOT_FOUND');
  return prisma.blogPost.delete({ where: { id } });
}
