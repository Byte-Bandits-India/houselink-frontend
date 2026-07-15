export type Partner = {
  id: number;
  name: string;
  title: string | null;
  description: string | null;
  image: string | null;
  email: string | null;
  phone: string | null;
  link: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type PartnerInquiry = {
  id: number;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  propertyName: string | null;
  propertyLocation: string | null;
  message: string | null;
  attachment: string | null;
  status: number; // 0 for Unread, 1 for Read
  createdAt: string;
  updatedAt: string;
};

export type PartnersResponse = {
  success: boolean;
  data: Partner[];
};

export type PartnerInquiryResponse = {
  success: boolean;
  message: string;
  data: PartnerInquiry;
};
