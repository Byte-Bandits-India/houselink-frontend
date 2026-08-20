"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getCustomerInvoices, type UserInvoice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import PurposeToggle from "@/components/shared/PurposeToggle";
import type { HistoryPkg } from "@/types/packages";

type Filter = "sell" | "rent";
type Status = "live" | "expired" | "failed";

export default function HistoryPage() {
  const { user, refreshUser } = useAuth();
  const [filter, setFilter] = useState<Filter>("sell");
  const [status, setStatus] = useState<Status>("live");
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<UserInvoice | null>(
    null,
  );

  useEffect(() => {
    async function initUser() {
      try {
        await refreshUser();
      } catch (err) {
        console.error("Failed to refresh user:", err);
      }
    }
    initUser();
  }, [refreshUser]);

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
  let rentCreditsLeft = user?.remainingRentPoints ?? user?.rentPoints ?? 0;

  // 2. Paid / Successful Invoices
  const paidInvoices = invoices.filter((inv) => {
    const s = String(inv.status || "").toLowerCase();
    return s === "paid" || s === "successful";
  });

  const sortedPaidInvoices = [...paidInvoices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const mappedPaidPackages: HistoryPkg[] = sortedPaidInvoices.map((inv) => {
    const type: "sell" | "rent" =
      String(inv.package_type || "").toLowerCase() === "rent" ? "rent" : "sell";
    const userType = inv.user_type || "Owner";

    // Allocate remaining user credits to this invoice
    let allocatedCredits = 0;
    const totalPoints = Number(inv.no_of_credit) || 0;

    if (type === "rent") {
      allocatedCredits = Math.min(totalPoints, rentCreditsLeft);
      rentCreditsLeft -= allocatedCredits;
    } else {
      const uType = (userType || "").toLowerCase();
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

    const createdDate = new Date(inv.created_at);
    const validCreatedDate = isNaN(createdDate.getTime())
      ? new Date()
      : createdDate;
    const daysLimit =
      inv.total_days_limit && Number(inv.total_days_limit) > 0
        ? Number(inv.total_days_limit)
        : 30;
    const expiryDate = new Date(
      validCreatedDate.getTime() + daysLimit * 24 * 60 * 60 * 1000,
    );

    // A package is live as long as it has remaining credits; it is expired when its credits are fully consumed
    const isExpired = allocatedCredits <= 0;

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const dateFormatted = validCreatedDate.toLocaleDateString(
      "en-GB",
      options,
    );

    return {
      id: `INV-${inv.id}`,
      name: inv.name || "Joining Package",
      price: String(inv.amount),
      userType,
      type,
      status: isExpired ? "expired" : "live",
      totalPoints,
      remainingPoints: allocatedCredits,
      rawInvoice: inv,
      formattedDate: dateFormatted,
    };
  });

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const regDateFormatted = new Date(
    user?.createdAt || Date.now(),
  ).toLocaleDateString("en-GB", options);

  // 3. Add active complimentary / admin-assigned credit packages if user has remaining active credits
  if (ownerCreditsLeft > 0) {
    mappedPaidPackages.unshift({
      id: "CREDIT-OWNER",
      name: "Owner Listing Plan",
      price: "0",
      userType: "Owner",
      type: "sell",
      status: "live",
      totalPoints: ownerCreditsLeft,
      remainingPoints: ownerCreditsLeft,
      rawInvoice: {
        id: 0,
        package_id: "plan_owner",
        name: "Owner Listing Plan",
        package_type: "buy",
        user_type: "Owner",
        total_days_limit: 30,
        no_of_credit: ownerCreditsLeft,
        amount: "0",
        status: "Paid",
        created_at: user?.createdAt || new Date().toISOString(),
      },
      formattedDate: regDateFormatted,
    });
  }

  if (builderCreditsLeft > 0) {
    mappedPaidPackages.unshift({
      id: "CREDIT-BUILDER",
      name: "Builder Listing Plan",
      price: "0",
      userType: "Builder",
      type: "sell",
      status: "live",
      totalPoints: builderCreditsLeft,
      remainingPoints: builderCreditsLeft,
      rawInvoice: {
        id: 0,
        package_id: "plan_builder",
        name: "Builder Listing Plan",
        package_type: "buy",
        user_type: "Builder",
        total_days_limit: 30,
        no_of_credit: builderCreditsLeft,
        amount: "0",
        status: "Paid",
        created_at: user?.createdAt || new Date().toISOString(),
      },
      formattedDate: regDateFormatted,
    });
  }

  if (consultantCreditsLeft > 0) {
    mappedPaidPackages.unshift({
      id: "CREDIT-CONSULTANT",
      name: "Consultant Listing Plan",
      price: "0",
      userType: "Consultant",
      type: "sell",
      status: "live",
      totalPoints: consultantCreditsLeft,
      remainingPoints: consultantCreditsLeft,
      rawInvoice: {
        id: 0,
        package_id: "plan_consultant",
        name: "Consultant Listing Plan",
        package_type: "buy",
        user_type: "Consultant",
        total_days_limit: 30,
        no_of_credit: consultantCreditsLeft,
        amount: "0",
        status: "Paid",
        created_at: user?.createdAt || new Date().toISOString(),
      },
      formattedDate: regDateFormatted,
    });
  }

  if (rentCreditsLeft > 0) {
    mappedPaidPackages.unshift({
      id: "CREDIT-RENT",
      name: "Rent Contact Unlock Plan",
      price: "0",
      userType: "Owner",
      type: "rent",
      status: "live",
      totalPoints: rentCreditsLeft,
      remainingPoints: rentCreditsLeft,
      rawInvoice: {
        id: 0,
        package_id: "plan_rent",
        name: "Rent Contact Unlock Plan",
        package_type: "rent",
        user_type: "Owner",
        total_days_limit: 30,
        no_of_credit: rentCreditsLeft,
        amount: "0",
        status: "Paid",
        created_at: user?.createdAt || new Date().toISOString(),
      },
      formattedDate: regDateFormatted,
    });
  }

  // 4. Failed / Pending / Cancelled Invoices
  const failedInvoices = invoices.filter((inv) => {
    const s = String(inv.status || "").toLowerCase();
    return s !== "paid" && s !== "successful";
  });

  const sortedFailedInvoices = [...failedInvoices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const mappedFailedPackages: HistoryPkg[] = sortedFailedInvoices.map((inv) => {
    const type: "sell" | "rent" =
      String(inv.package_type || "").toLowerCase() === "rent" ? "rent" : "sell";
    const userType = inv.user_type || "Owner";
    const createdDate = new Date(inv.created_at);
    const validCreatedDate = isNaN(createdDate.getTime())
      ? new Date()
      : createdDate;
    const dateFormatted = validCreatedDate.toLocaleDateString(
      "en-GB",
      options,
    );

    return {
      id: `INV-${inv.id}`,
      name: inv.name || (type === "rent" ? "Rent Contact Plan" : "Property Listing Plan"),
      price: String(inv.amount),
      userType,
      type,
      status: "failed" as const,
      totalPoints: Number(inv.no_of_credit) || 0,
      remainingPoints: 0,
      rawInvoice: inv,
      formattedDate: dateFormatted,
    };
  });

  const allPackages = [...mappedPaidPackages, ...mappedFailedPackages];
  const filtered = allPackages.filter(
    (p) => p.type === filter && p.status === status,
  );

  // Tab count badges
  const liveCount = allPackages.filter((p) => p.type === filter && p.status === "live").length;
  const expiredCount = allPackages.filter((p) => p.type === filter && p.status === "expired").length;
  const failedCount = allPackages.filter((p) => p.type === filter && p.status === "failed").length;

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
      <PurposeToggle
        value={filter}
        onChange={(val) => {
          setFilter(val);
          setStatus("live");
        }}
      />

      {/* Live / Expired / Failed tabs with counters */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mt-6 bg-white shadow-sm p-1">
        {(["live", "expired", "failed"] as const).map((s) => {
          const count = s === "live" ? liveCount : s === "expired" ? expiredCount : failedCount;
          return (
            <Button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "flex-1 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-lg border-none h-auto shadow-none hover:shadow-none flex items-center justify-center gap-2",
                status === s
                  ? s === "failed"
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white"
                    : "bg-gradient-to-r from-primary to-secondary text-white"
                  : "bg-white text-primary hover:bg-slate-50",
              )}
            >
              <span>
                {s === "live"
                  ? "Live Packages"
                  : s === "expired"
                    ? "Expired Packages List"
                    : "Failed Transactions"}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold transition-colors",
                  status === s
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Package list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-muted bg-white border border-gray-100 rounded-2xl shadow-sm mt-6">
          <p className="font-medium">
            {status === "failed"
              ? `No failed ${filter} transactions found.`
              : `No ${status} ${filter} packages found.`}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {filtered.map((pkg) => {
            const isFailed = pkg.status === "failed";
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedInvoice(pkg.rawInvoice)}
                className={cn(
                  "px-4 py-3.5 flex items-center justify-between transition-all cursor-pointer",
                  isFailed
                    ? "hover:bg-red-50/40 bg-red-50/10"
                    : "hover:bg-slate-50/60"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Left Side Icon Box */}
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border",
                      isFailed
                        ? "bg-red-50 border-red-100 text-red-500"
                        : "bg-slate-50 border-slate-100 text-primary"
                    )}
                  >
                    {isFailed ? (
                      <XCircle className="w-8 h-8 text-red-500" />
                    ) : (
                      <img
                        src="/assets/home/icons/note.png"
                        alt="Package"
                        className="w-9 h-9 object-contain"
                      />
                    )}
                  </div>

                  {/* Middle Details */}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-400 mb-1">
                      {pkg.formattedDate}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">
                        {pkg.name}
                      </h3>
                      {isFailed && (
                        <span className="bg-red-50 text-red-600 border border-red-200 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          Payment Failed
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      User Type: {pkg.userType}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {pkg.status === "live" ? (
                        <>
                          Remaining Credits: <strong className="text-primary font-bold">{pkg.remainingPoints}</strong> / {pkg.totalPoints}
                        </>
                      ) : pkg.status === "expired" ? (
                        <>Total Credits: {pkg.totalPoints} (Expired / Used)</>
                      ) : (
                        <>Credits: {pkg.totalPoints} (Unpaid)</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Side Price Indicator & Actions */}
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <p
                    className={cn(
                      "text-xl font-extrabold",
                      isFailed ? "text-red-500 line-through opacity-80" : "text-[#22c55e]"
                    )}
                  >
                    {isFailed ? "₹" : "+₹"}
                    {Number(pkg.price).toFixed(0)}
                  </p>

                  {isFailed && (
                    <Button
                      variant="gradient"
                      href={`/dashboard/credits?type=${pkg.type === "rent" ? "rent" : "sell"}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg text-white shadow-xs hover:brightness-110 flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} />
                      <span>Retry Payment</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            {(() => {
              const isFailedInvoice =
                String(selectedInvoice.status).toLowerCase() !== "paid" &&
                String(selectedInvoice.status).toLowerCase() !== "successful";

              return (
                <>
                  <div
                    className={cn(
                      "px-6 py-4 flex justify-between items-center shrink-0 text-white",
                      isFailedInvoice
                        ? "bg-gradient-to-r from-red-600 to-rose-700"
                        : "bg-gradient-to-r from-primary to-secondary"
                    )}
                  >
                    <h2 className="text-lg font-bold">
                      {isFailedInvoice
                        ? "Transaction Details (Failed / Unpaid)"
                        : "Invoice Details"}
                    </h2>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="text-white/80 hover:text-white transition-colors text-2xl font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Invoice Content */}
                  <div
                    className="p-8 space-y-6 overflow-y-auto flex-1 min-h-0 text-left"
                    id="printable-invoice"
                  >
                    {/* Failure notice */}
                    {isFailedInvoice && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-xs text-red-800">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm">
                            Payment Unsuccessful / Incomplete
                          </p>
                          <p className="mt-1 text-red-700 leading-relaxed">
                            This transaction attempt was not completed or failed at the payment gateway. No credits have been deducted or allocated to your account.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-6">
                      <div>
                        <h1 className="text-2xl font-extrabold text-primary">
                          HOUSELINK
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                          Premium Property Listing Portal
                        </p>
                      </div>
                      <div className="text-right">
                        <h3 className="text-lg font-bold text-gray-800">
                          {isFailedInvoice ? "TRANSACTION" : "INVOICE"}
                        </h3>
                        <p className="text-sm font-semibold text-gray-600">
                          #INV-{selectedInvoice.id || "SYS"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Date:{" "}
                          {new Date(
                            selectedInvoice.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Client & Billing Info */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                          Billed To:
                        </p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-gray-600">{user?.email}</p>
                        <p className="text-gray-600">{user?.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                          Payment Method:
                        </p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {Number(selectedInvoice.amount) > 0
                            ? "Razorpay Online"
                            : "System / Direct Assignment"}
                        </p>
                        <p className="font-bold text-gray-700 uppercase tracking-wider text-xs mt-3">
                          Status:
                        </p>
                        <span
                          className={cn(
                            "inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 border",
                            isFailedInvoice
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-emerald-100 text-emerald-800 border-emerald-200"
                          )}
                        >
                          {isFailedInvoice ? "FAILED / UNPAID" : "PAID"}
                        </span>
                      </div>
                    </div>

              {/* Table of Items */}
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs border-b">
                    <th className="py-3 px-4 font-bold">Package Name</th>
                    <th className="py-3 px-4 font-bold text-center">
                      User Type
                    </th>
                    <th className="py-3 px-4 font-bold text-center">Credits</th>
                    <th className="py-3 px-4 font-bold text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {selectedInvoice.name}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      {selectedInvoice.user_type || "Owner"}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 font-bold">
                      {selectedInvoice.no_of_credit}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 font-semibold">
                      Rs. {Number(selectedInvoice.amount).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Summary / Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal (Excl. 18% GST):</span>
                    <span>
                      Rs. {(Number(selectedInvoice.amount) / 1.18).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%):</span>
                    <span>
                      Rs.{" "}
                      {(
                        Number(selectedInvoice.amount) -
                        Number(selectedInvoice.amount) / 1.18
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                    <span>Total:</span>
                    <span>Rs. {Number(selectedInvoice.amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
              <Button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </Button>
              {isFailedInvoice ? (
                <Button
                  variant="gradient"
                  href={`/dashboard/credits?type=${selectedInvoice.package_type === "rent" ? "rent" : "sell"}`}
                  className="px-4 py-2 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw size={14} />
                  <span>Retry Purchase</span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const printContent =
                      document.getElementById("printable-invoice")?.innerHTML;
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
                  variant="gradient"
                  className="px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Print Invoice
                </Button>
              )}
            </div>
          </>
        );
      })()}
    </div>
  </div>
)}
    </div>
  );
}
