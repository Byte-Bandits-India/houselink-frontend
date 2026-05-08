export interface CreditTransaction {
  id: string;
  type: "purchase" | "used" | "refund";
  amount: number;
  description: string;
  date: string;
  balance: number;
}

export const creditBalance = 250;

export const creditTransactions: CreditTransaction[] = [
  {
    id: "T001",
    type: "purchase",
    amount: 100,
    description: "Purchased Gold Pack",
    date: "2026-05-01",
    balance: 250,
  },
  {
    id: "T002",
    type: "used",
    amount: -5,
    description: "Unlocked lead: Rahul Sharma",
    date: "2026-05-05",
    balance: 245,
  },
  {
    id: "T003",
    type: "used",
    amount: -5,
    description: "Unlocked lead: Priya Mehta",
    date: "2026-05-03",
    balance: 240,
  },
  {
    id: "T004",
    type: "purchase",
    amount: 50,
    description: "Purchased Starter Pack",
    date: "2026-04-15",
    balance: 200,
  },
  {
    id: "T005",
    type: "used",
    amount: -10,
    description: "Unlocked lead: Arun Kumar (Villa)",
    date: "2026-04-28",
    balance: 190,
  },
  {
    id: "T006",
    type: "refund",
    amount: 10,
    description: "Refund: Property delisted",
    date: "2026-04-10",
    balance: 160,
  },
];
