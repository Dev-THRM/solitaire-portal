import { Request, Response } from 'express';
import * as blogsService from '../services/blogs.service';

// Public: GET /api/blogs
export async function listBlogs(req: Request, res: Response): Promise<void> {
  try {
    const result = await blogsService.listPublishedBlogs(req.query as blogsService.BlogQueryParams);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
}

// Public: GET /api/blogs/:slug
export async function getBlogBySlug(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogsService.getBlogBySlug(req.params.slug as string);
    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
}

// Admin: GET /api/blogs/admin/all
export async function listAllBlogsAdmin(req: Request, res: Response): Promise<void> {
  try {
    const result = await blogsService.listAllBlogsAdmin(req.query as blogsService.BlogQueryParams);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch admin blogs' });
  }
}

// Admin: GET /api/blogs/admin/:id
export async function getBlogByIdAdmin(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogsService.getBlogById(req.params.id as string);
    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
}

// Admin: POST /api/blogs/admin
export async function createBlog(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogsService.createBlog(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to create blog post' });
  }
}

// Admin: PUT /api/blogs/admin/:id
export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogsService.updateBlog(req.params.id as string, req.body);
    res.json({ success: true, data: blog });
  } catch (err: any) {
    if (err.message === 'BLOG_NOT_FOUND') {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }
    res.status(500).json({ success: false, error: err.message || 'Failed to update blog post' });
  }
}

// Admin: DELETE /api/blogs/admin/:id
export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    await blogsService.deleteBlog(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    if (err.message === 'BLOG_NOT_FOUND') {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
}

// Admin: POST /api/blogs/admin/upload-image
export async function uploadBlogImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image uploaded' });
      return;
    }
    const baseUrl = process.env.API_URL || 'http://localhost:4000';
    const imageUrl = `${baseUrl}/uploads/blogs/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to upload blog image' });
  }
}
