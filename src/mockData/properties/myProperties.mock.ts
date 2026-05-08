export interface MyProperty {
  id: string;
  title: string;
  location: string;
  type: string;
  listingType: "Sale" | "Rent" | "Lease";
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: "active" | "expired" | "pending" | "rejected";
  listedOn: string;
  expiresOn: string;
  views: number;
  leads: number;
  image: string;
}

export const myProperties: MyProperty[] = [
  {
    id: "P001",
    title: "3 BHK Premium Apartment",
    location: "Koramangala, Bangalore",
    type: "Apartment",
    listingType: "Sale",
    price: "₹85,00,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,450 sq.ft",
    status: "active",
    listedOn: "2026-03-01",
    expiresOn: "2026-06-01",
    views: 248,
    leads: 12,
    image:
      "https://testing.houselink360.com/projects/details/13/premium-2bhk-apartments-pallikaranai-price-starts-from-78-lakhs",
  },
  {
    id: "P002",
    title: "2 BHK Modern Flat",
    location: "Indiranagar, Bangalore",
    type: "Apartment",
    listingType: "Rent",
    price: "₹35,000/month",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,100 sq.ft",
    status: "active",
    listedOn: "2026-04-10",
    expiresOn: "2026-07-10",
    views: 182,
    leads: 8,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
  },
  {
    id: "P003",
    title: "4 BHK Luxury Villa",
    location: "Whitefield, Bangalore",
    type: "Villa",
    listingType: "Sale",
    price: "₹2,20,00,000",
    bedrooms: 4,
    bathrooms: 4,
    area: "3,200 sq.ft",
    status: "active",
    listedOn: "2026-02-15",
    expiresOn: "2026-05-15",
    views: 520,
    leads: 18,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop",
  },
  {
    id: "P004",
    title: "1 BHK Studio Apartment",
    location: "HSR Layout, Bangalore",
    type: "Studio",
    listingType: "Rent",
    price: "₹18,000/month",
    bedrooms: 1,
    bathrooms: 1,
    area: "600 sq.ft",
    status: "expired",
    listedOn: "2025-11-01",
    expiresOn: "2026-02-01",
    views: 310,
    leads: 22,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
  },
  {
    id: "P005",
    title: "Commercial Office Space",
    location: "MG Road, Bangalore",
    type: "Commercial",
    listingType: "Lease",
    price: "₹1,20,000/month",
    bedrooms: 0,
    bathrooms: 2,
    area: "2,500 sq.ft",
    status: "expired",
    listedOn: "2025-10-15",
    expiresOn: "2026-01-15",
    views: 145,
    leads: 5,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
  },
  {
    id: "P006",
    title: "3 BHK Independent House",
    location: "JP Nagar, Bangalore",
    type: "House",
    listingType: "Sale",
    price: "₹1,50,00,000",
    bedrooms: 3,
    bathrooms: 3,
    area: "2,100 sq.ft",
    status: "pending",
    listedOn: "2026-05-07",
    expiresOn: "2026-08-07",
    views: 0,
    leads: 0,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop",
  },
];
