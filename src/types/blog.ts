export interface BlogTaxonomy {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: "active" | "inactive";
  metaTitle?: string | null;
  metaDesc?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  categories: BlogTaxonomy[];
  tags: BlogTaxonomy[];
}

export interface PaginatedBlogsResponse {
  success: boolean;
  message: string;
  data: {
    posts: BlogPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface BlogDetailResponse {
  success: boolean;
  message: string;
  data: {
    post: BlogPost;
  };
}

export interface BlogTaxonomiesResponse {
  success: boolean;
  message: string;
  data: {
    categories?: BlogTaxonomy[];
    tags?: BlogTaxonomy[];
  };
}
