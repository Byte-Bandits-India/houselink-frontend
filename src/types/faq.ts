export type FaqCategory = {
  id: number;
  parentId: null;
  title: string;
  answer: null;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type FaqItem = {
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
};

export type FaqsResponse = {
  success: boolean;
  message?: string;
  data: FaqItem[];
};

export type FaqCategoriesResponse = {
  success: boolean;
  message?: string;
  data: FaqCategory[];
};
