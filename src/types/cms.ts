export interface CmsPage {
  id: number;
  name?: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CmsPageResponse {
  success: boolean;
  data: CmsPage;
  message?: string;
}

export interface PaginatedCmsResponse {
  success: boolean;
  data: CmsPage[];
  message?: string;
}
