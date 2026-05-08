export interface Invoice {
  id: string;
  invoiceNumber: string;
  package: string;
  credits: number;
  amount: number;
  date: string;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
}

export const invoices: Invoice[] = [
  {
    id: "INV001",
    invoiceNumber: "HL-2026-001",
    package: "Gold Pack",
    credits: 150,
    amount: 1299,
    date: "2026-05-01",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV002",
    invoiceNumber: "HL-2026-002",
    package: "Starter Pack",
    credits: 50,
    amount: 499,
    date: "2026-04-15",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV003",
    invoiceNumber: "HL-2026-003",
    package: "Platinum Pack",
    credits: 350,
    amount: 2799,
    date: "2026-03-10",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV004",
    invoiceNumber: "HL-2026-004",
    package: "Gold Pack",
    credits: 150,
    amount: 1299,
    date: "2026-02-20",
    status: "failed",
    downloadUrl: "#",
  },
];
