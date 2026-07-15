export type SearchApiItem = {
  id: number;
  query: string;
  count?: number;
  updatedAt?: string;
};

export type SearchApiResponse = {
  success: boolean;
  type: "user" | "popular";
  data: SearchApiItem[];
};
