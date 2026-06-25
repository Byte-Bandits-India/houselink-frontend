"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyEnquiries } from "@/lib/api/leads";
import { message } from "antd";
import Pagination from "@/components/ui/pagination";

type Filter = "sell" | "rent";

interface Enquiry {
  id: number;
  date: string;
  property: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  myMessage: string;
  filter: Filter;
}

const ITEMS_PER_PAGE = 10;

export default function EnquiriesPage() {
  const [filter, setFilter] = useState<Filter>("sell");
  const [enquiriesList, setEnquiriesList] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const response = await getMyEnquiries();
        if (response.success && Array.isArray(response.data)) {
          setEnquiriesList(response.data);
        } else {
          message.error(response.message || "Failed to load enquiries");
        }
      } catch (err: any) {
        console.error("Error fetching enquiries:", err);
        message.error("Failed to load enquiries. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filtered = enquiriesList.filter((e) => e.filter === filter);
  const paginatedEnquiries = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDownloadCSV = () => {
    if (filtered.length === 0) return;
    
    const headers = ["#", "Date", "Property", "Owner Name", "Owner Phone", "Owner Email", "My Message"];
    
    const rows = filtered.map((e, index) => [
      index + 1,
      e.date,
      e.property,
      e.ownerName,
      e.ownerPhone,
      e.ownerEmail,
      e.myMessage.replace(/"/g, '""'),
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `my_enquiries_${filter}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">My Enquiries</h1>
        {filtered.length > 0 && (
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-brand hover:bg-brand/80 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      {/* For Sale / Rent-Lease toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
              filter === f ? "bg-brand border-brand text-white" : "bg-white border-brand text-brand hover:bg-brand hover:text-white"
            )}
          >
            {f === "sell" ? "For Sale" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium">No enquiries found.</p>
          <p className="text-sm mt-1">New enquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand text-white">
                  <th className="text-center px-4 py-3 font-semibold w-10">#</th>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold">Property</th>
                  <th className="text-left px-4 py-3 font-semibold">Owner Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Owner Phone</th>
                  <th className="text-left px-4 py-3 font-semibold">Owner Email</th>
                  <th className="text-left px-4 py-3 font-semibold">My Message</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEnquiries.map((enq, idx) => (
                  <tr key={enq.id} className={cn("border-t border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                    <td className="px-4 py-4 text-center font-semibold text-ink">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-4 text-ink-secondary whitespace-nowrap">{enq.date}</td>
                    <td className="px-4 py-4 font-medium text-ink">{enq.property}</td>
                    <td className="px-4 py-4 text-ink">{enq.ownerName}</td>
                    <td className="px-4 py-4 text-ink whitespace-nowrap">{enq.ownerPhone}</td>
                    <td className="px-4 py-4 text-ink">{enq.ownerEmail}</td>
                    <td className="px-4 py-4 text-ink-secondary max-w-[200px]">{enq.myMessage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            current={currentPage}
            pageSize={ITEMS_PER_PAGE}
            total={filtered.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
