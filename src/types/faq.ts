export interface FaqCategory {
  id: number;
  parentId: null;
  title: string;
  answer: null;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: number;
  parentId: number;
  title: string;
  answer: string;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  parent?: {
    title: string;
  };
}

export interface FaqsResponse {
  success: boolean;
  message?: string;
  data: FaqItem[];
}

export interface FaqCategoriesResponse {
  success: boolean;
  message?: string;
  data: FaqCategory[];
}
