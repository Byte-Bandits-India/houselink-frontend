export type WishlistResponse<T = any> = {
  success: boolean;
  message: string;
  data: T;
};
