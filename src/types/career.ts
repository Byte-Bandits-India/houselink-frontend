export type Career = {
  id: number;
  title: string;
  slug: string;
  location?: string | null;
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  status: "active" | "inactive";
  description?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CareersResponse = {
  success: boolean;
  data: Career[];
};

export type CareerDetailResponse = {
  success: boolean;
  data: Career;
};
