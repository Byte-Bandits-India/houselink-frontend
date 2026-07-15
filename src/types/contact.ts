export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
  updatedAt: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
  data: ContactMessage;
};
