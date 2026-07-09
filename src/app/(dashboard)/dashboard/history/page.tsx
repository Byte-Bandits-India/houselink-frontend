"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getCustomerInvoices, type UserInvoice } from "@/lib/api";

type Filter = "sell" | "rent";
type Status = "live" | "expired";

interface HistoryPkg {
  id: string;
  name: string;
  price: string;
  userType: string;
  type: "sell" | "rent";
  status: "live" | "expired";
  remainingPoints?: number;
  totalPoints?: number;
  rawInvoice: UserInvoice;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("sell");
  const [status, setStatus] = useState<Status>("live");
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<UserInvoice | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    async function loadInvoices() {
      try {
        setLoading(true);
        const data = await getCustomerInvoices(Number(userId));
        setInvoices(data);
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, [user?.id]);

  // 1. Separate user credits by type
  let ownerCreditsLeft = user?.creditPointsOwner ?? 0;
  let builderCreditsLeft = user?.creditPointsBuilder ?? 0;
  let consultantCreditsLeft = user?.creditPointsConsultant ?? 0;

  // 2. Sort invoices by created_at desc (most recent first) to allocate points properly
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const mappedPackages: HistoryPkg[] = sortedInvoices.map((inv) => {
    const type: "sell" | "rent" = inv.package_type === "rent" ? "rent" : "sell";
    const userType = inv.user_type || "Owner";

    // Allocate remaining user credits to this invoice
    let allocatedCredits = 0;
    const totalPoints = inv.no_of_credit;

    if (inv.status === "Paid") {
      if (type === "rent") {
        allocatedCredits = Math.min(totalPoints, ownerCreditsLeft);
        ownerCreditsLeft -= allocatedCredits;
      } else {
        const uType = userType.toLowerCase();
        if (uType === "builder") {
          allocatedCredits = Math.min(totalPoints, builderCreditsLeft);
          builderCreditsLeft -= allocatedCredits;
        } else if (uType === "consultant") {
          allocatedCredits = Math.min(totalPoints, consultantCreditsLeft);
          consultantCreditsLeft -= allocatedCredits;
        } else {
          allocatedCredits = Math.min(totalPoints, ownerCreditsLeft);
          ownerCreditsLeft -= allocatedCredits;
        }
      }
    }

    let isExpired = false;
    if (inv.status !== "Paid") {
      isExpired = true;
    } else if (inv.total_days_limit) {
      const createdDate = new Date(inv.created_at);
      const expiryDate = new Date(createdDate.getTime() + inv.total_days_limit * 24 * 60 * 60 * 1000);
      // A package is expired only if the date has passed AND it has no active points allocated/remaining
      isExpired = new Date() > expiryDate && allocatedCredits <= 0;
    }

    return {
      id: `INV-${inv.id}`,
      name: `${inv.name} / Rs. ${Number(inv.amount).toFixed(2)}`,
      price: String(inv.amount),
      userType,
      type,
      status: isExpired ? "expired" : "live",
      totalPoints,
      remainingPoints: allocatedCredits,
      rawInvoice: inv,
    };
  });

  const filtered = mappedPackages.filter((p) => p.type === filter && p.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">History</h1>

      {/* Sell / Rent toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setStatus("live"); }}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-semibold border transition-colors duration-200",
              filter === f ? "bg-primary border-primary text-white" : "bg-white border-primary text-primary hover:bg-primary hover:text-white"
            )}
          >
            {f === "sell" ? "Sell" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Live / Expired tabs */}
      <div className="flex border border-gray-200 rounded-md overflow-hidden mt-6">
        {(["live", "expired"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0",
               status === s ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-50"
            )}
          >
            {s === "live" ? "Live Packages" : "Expired Packages List"}
          </button>
        ))}
      </div>

      {/* Package list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          <p className="font-medium">No packages found.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col md:flex-row gap-5">
              <div className="shrink-0 flex items-start justify-center">
                <img src="/icon/validating-ticket.png" alt="Invoice Icon" className="w-16 h-16 object-contain" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col items-start">
                <h3 className="text-base font-bold text-gray-900 mb-2">{pkg.name}</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  {pkg.type === "rent" ? (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[#0dcaf0] text-white">Type: Rent/Lease</span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[#ef4444] text-white">
                      User Type: {pkg.userType}
                    </span>
                  )}

                  <>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-500 text-white">Total Points: {pkg.totalPoints}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[#ffc107] text-white">Remaining: {pkg.remainingPoints}</span>
                  </>

                  {pkg.status === "live" ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#198754] text-white">
                      Live
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#dc3545] text-white">
                      Expired
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedInvoice(pkg.rawInvoice)}
                  className="mt-1 text-sm font-semibold border border-primary text-primary px-4 py-1.5 rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-white/80 hover:text-white transition-colors text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Invoice Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[75vh]" id="printable-invoice">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-primary">HOUSELINK</h1>
                  <p className="text-xs text-gray-500 mt-1">Premium Property Listing Portal</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-800">INVOICE</h3>
                  <p className="text-sm font-semibold text-gray-600">#INV-{selectedInvoice.id}</p>
                  <p className="text-xs text-gray-500 mt-1">Date: {new Date(selectedInvoice.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Client & Billing Info */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-bold text-gray-700 uppercase tracking-wider text-xs">Billed To:</p>
                  <p className="font-semibold text-gray-900 mt-1">{user?.firstName} {user?.lastName}</p>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-gray-600">{user?.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700 uppercase tracking-wider text-xs">Payment Method:</p>
                  <p className="font-semibold text-gray-900 mt-1">Razorpay Online</p>
                  <p className="font-bold text-gray-700 uppercase tracking-wider text-xs mt-3">Status:</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1 ${
                    selectedInvoice.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Table of Items */}
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs border-b">
                    <th className="py-3 px-4 font-bold">Package Name</th>
                    <th className="py-3 px-4 font-bold text-center">User Type</th>
                    <th className="py-3 px-4 font-bold text-center">Credits</th>
                    <th className="py-3 px-4 font-bold text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-semibold text-gray-900">{selectedInvoice.name}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{selectedInvoice.user_type || "Owner"}</td>
                    <td className="py-4 px-4 text-center text-gray-600 font-bold">{selectedInvoice.no_of_credit}</td>
                    <td className="py-4 px-4 text-right text-gray-900 font-semibold">Rs. {Number(selectedInvoice.amount).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Summary / Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal (Excl. 18% GST):</span>
                    <span>Rs. {(Number(selectedInvoice.amount) / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%):</span>
                    <span>Rs. {(Number(selectedInvoice.amount) - (Number(selectedInvoice.amount) / 1.18)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                    <span>Total:</span>
                    <span>Rs. {Number(selectedInvoice.amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const printContent = document.getElementById("printable-invoice")?.innerHTML;
                  if (printContent) {
                    const win = window.open("", "_blank");
                    if (win) {
                      win.document.write(`
                        <html>
                          <head>
                            <title>Invoice - #INV-${selectedInvoice.id}</title>
                            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                          </head>
                          <body class="p-10 font-sans" onload="window.print(); window.close();">
                            <div class="max-w-2xl mx-auto border p-8 rounded-lg shadow-sm">
                              ${printContent}
                            </div>
                          </body>
                        </html>
                      `);
                      win.document.close();
                    }
                  }
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
