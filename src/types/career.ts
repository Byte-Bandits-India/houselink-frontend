export interface Career {
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
}

export interface CareersResponse {
  success: boolean;
  data: Career[];
}

export interface CareerDetailResponse {
  success: boolean;
  data: Career;
}
