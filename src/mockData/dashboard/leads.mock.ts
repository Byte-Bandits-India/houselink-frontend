export interface LeadRecord {
  id: string;
  propertyTitle: string;
  propertyLocation: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  date: string;
  status: "contacted" | "interested" | "closed" | "pending";
  creditsUsed: number;
}

export const leadsHistory: LeadRecord[] = [
  {
    id: "L001",
    propertyTitle: "3 BHK Apartment in Koramangala",
    propertyLocation: "Koramangala, Bangalore",
    contactName: "Rahul Sharma",
    contactEmail: "rahul.sharma@email.com",
    contactPhone: "+91 98765 43210",
    date: "2026-05-05",
    status: "interested",
    creditsUsed: 5,
  },
  {
    id: "L002",
    propertyTitle: "2 BHK Flat in Indiranagar",
    propertyLocation: "Indiranagar, Bangalore",
    contactName: "Priya Mehta",
    contactEmail: "priya.mehta@email.com",
    contactPhone: "+91 87654 32109",
    date: "2026-05-03",
    status: "contacted",
    creditsUsed: 5,
  },
  {
    id: "L003",
    propertyTitle: "4 BHK Villa in Whitefield",
    propertyLocation: "Whitefield, Bangalore",
    contactName: "Arun Kumar",
    contactEmail: "arun.kumar@email.com",
    contactPhone: "+91 76543 21098",
    date: "2026-04-28",
    status: "closed",
    creditsUsed: 10,
  },
  {
    id: "L004",
    propertyTitle: "1 BHK Studio in HSR Layout",
    propertyLocation: "HSR Layout, Bangalore",
    contactName: "Sneha Patel",
    contactEmail: "sneha.patel@email.com",
    contactPhone: "+91 65432 10987",
    date: "2026-04-20",
    status: "pending",
    creditsUsed: 5,
  },
  {
    id: "L005",
    propertyTitle: "3 BHK Independent House in JP Nagar",
    propertyLocation: "JP Nagar, Bangalore",
    contactName: "Vikram Singh",
    contactEmail: "vikram.singh@email.com",
    contactPhone: "+91 54321 09876",
    date: "2026-04-15",
    status: "interested",
    creditsUsed: 5,
  },
  {
    id: "L006",
    propertyTitle: "Commercial Space in MG Road",
    propertyLocation: "MG Road, Bangalore",
    contactName: "Kavitha Reddy",
    contactEmail: "kavitha.reddy@email.com",
    contactPhone: "+91 43210 98765",
    date: "2026-04-10",
    status: "closed",
    creditsUsed: 15,
  },
];
