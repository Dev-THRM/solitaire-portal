import prisma from './prisma';
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
  excerpt?: string;
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

export async function listPublishedBlogs(params: BlogQueryParams) {
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const limit = Math.min(50, parseInt(params.limit ?? '9', 10));
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

  if (params.category && params.category !== 'all' && params.category !== 'All') {
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
        updatedAt: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    success: true,
    blogs: blogs.map((b) => ({
      ...b,
      publishedAt: b.publishedAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blogPost.findUnique({ where: { slug } });
  if (!blog || !blog.isPublished) return null;
  return {
    ...blog,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}

export async function listAllBlogsAdmin(params: BlogQueryParams) {
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const limit = Math.min(50, parseInt(params.limit ?? '15', 10));
  const skip = (page - 1) * limit;

  const where: Prisma.BlogPostWhereInput = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { excerpt: { contains: params.search } },
    ];
  }

  if (params.category && params.category !== 'all') {
    where.category = params.category;
  }

  if (params.status === 'published') {
    where.isPublished = true;
  } else if (params.status === 'draft') {
    where.isPublished = false;
  }

  const [blogs, total, publishedCount, draftCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: false } }),
  ]);

  return {
    success: true,
    blogs: blogs.map((b) => ({
      ...b,
      publishedAt: b.publishedAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })),
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

export async function getBlogByIdAdmin(id: string) {
  const blog = await prisma.blogPost.findUnique({ where: { id } });
  if (!blog) return null;
  return {
    ...blog,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}

export async function createBlog(data: CreateBlogDto) {
  const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);
  const uniqueSlug = await getUniqueSlug(baseSlug);
  const readTime = data.readTime || calculateReadTime(data.content);

  const blog = await prisma.blogPost.create({
    data: {
      title: data.title.trim(),
      slug: uniqueSlug,
      excerpt: data.excerpt?.trim() || '',
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category || 'General',
      author: data.author || 'Solitaire Editorial Team',
      readTime,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      canonicalUrl: data.canonicalUrl || null,
      keywords: data.keywords || null,
      isPublished: data.isPublished ?? false,
      publishedAt: data.isPublished ? new Date() : null,
    },
  });

  return {
    ...blog,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}

export async function updateBlog(id: string, data: UpdateBlogDto) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return null;

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await getUniqueSlug(slugify(data.slug), id);
  } else if (!data.slug && data.title && !existing.slug) {
    slug = await getUniqueSlug(slugify(data.title), id);
  }

  let readTime = data.readTime || existing.readTime;
  if (data.content && !data.readTime) {
    readTime = calculateReadTime(data.content);
  }

  let publishedAt = existing.publishedAt;
  if (data.isPublished === true && !existing.publishedAt) {
    publishedAt = new Date();
  }

  const blog = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      slug,
      ...(data.excerpt !== undefined ? { excerpt: data.excerpt.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.coverImage !== undefined ? { coverImage: data.coverImage || null } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.author !== undefined ? { author: data.author } : {}),
      readTime,
      ...(data.metaTitle !== undefined ? { metaTitle: data.metaTitle || null } : {}),
      ...(data.metaDescription !== undefined ? { metaDescription: data.metaDescription || null } : {}),
      ...(data.canonicalUrl !== undefined ? { canonicalUrl: data.canonicalUrl || null } : {}),
      ...(data.keywords !== undefined ? { keywords: data.keywords || null } : {}),
      ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
      publishedAt,
    },
  });

  return {
    ...blog,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}

export async function deleteBlog(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}
