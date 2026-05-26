export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}
