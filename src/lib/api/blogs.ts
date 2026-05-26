/**
 * Blogs API functions
 *
 * GET /api/v1/blogs              → list published posts
 * GET /api/v1/blogs/categories   → list categories
 * GET /api/v1/blogs/tags         → list tags
 * GET /api/v1/blogs/:slug        → fetch single post by slug
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";
import type {
  PaginatedBlogsResponse,
  BlogDetailResponse,
  BlogTaxonomiesResponse,
} from "@/types/blog";

/**
 * Fetch published blog posts, paginated with optional category/tag slug filtering.
 */
export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
}): Promise<PaginatedBlogsResponse> {
  let query = "";
  if (params) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });
    const searchParams = new URLSearchParams(cleanParams);
    query = `?${searchParams.toString()}`;
  }
  return apiClient.get<PaginatedBlogsResponse>(`/blogs${query}`, {
    skipAuth: true,
  });
}

/**
 * Fetch a single blog post by its slug.
 */
export async function getBlogBySlug(slug: string): Promise<BlogDetailResponse> {
  return apiClient.get<BlogDetailResponse>(`/blogs/${slug}`, {
    skipAuth: true,
  });
}

/**
 * Fetch all active categories.
 */
export async function getBlogCategories(): Promise<BlogTaxonomiesResponse> {
  return apiClient.get<BlogTaxonomiesResponse>("/blogs/categories", {
    skipAuth: true,
  });
}

/**
 * Fetch all active tags.
 */
export async function getBlogTags(): Promise<BlogTaxonomiesResponse> {
  return apiClient.get<BlogTaxonomiesResponse>("/blogs/tags", {
    skipAuth: true,
  });
}
