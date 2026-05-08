export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  badge?: string;
  features: string[];
  popular?: boolean;
}

export const creditPackages: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 499,
    features: [
      "50 Lead Credits",
      "Valid for 3 months",
      "Email support",
      "Basic analytics",
    ],
  },
  {
    id: "gold",
    name: "Gold Pack",
    credits: 150,
    price: 1299,
    badge: "Most Popular",
    popular: true,
    features: [
      "150 Lead Credits",
      "Valid for 6 months",
      "Priority support",
      "Advanced analytics",
      "Bulk unlock discounts",
    ],
  },
  {
    id: "platinum",
    name: "Platinum Pack",
    credits: 350,
    price: 2799,
    badge: "Best Value",
    features: [
      "350 Lead Credits",
      "Valid for 12 months",
      "Dedicated account manager",
      "Full analytics suite",
      "Bulk unlock discounts",
      "Early access to new properties",
    ],
  },
];
