"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LeadCharts from "@/components/shared/LeadCharts";
import { getLeads } from "@/lib/api/leads";
import { message } from "antd";
import Pagination from "@/components/ui/pagination";

/* ── Types ───────────────────────────────────────────────── */
type Filter = "sell" | "rent";

interface Lead {
  id: number;
  date: string;
  property: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  filter: Filter;
}

const ITEMS_PER_PAGE = 10;

export default function LeadsPage() {
  const [filter, setFilter] = useState<Filter>("sell");
  const [leadsList, setLeadsList] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await getLeads();
        if (response.success && Array.isArray(response.data)) {
          setLeadsList(response.data);
        } else {
          message.error(response.message || "Failed to load leads");
        }
      } catch (err: any) {
        console.error("Error fetching leads:", err);
        message.error("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filtered = leadsList.filter((l) => l.filter === filter);
  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginatedLeads = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isEnquiry = false; // For Property Leads context (not "My Enquiries")

  const headingText = isEnquiry ? "My Enquiries" : "Property Leads";
  const nameHeader = isEnquiry ? "Owner Name" : "Customer Name";
  const phoneHeader = isEnquiry ? "Owner Phone" : "Customer Phone";
  const emailHeader = isEnquiry ? "Owner Email" : "Customer Email";
  const messageHeader = isEnquiry ? "My Message" : "Message From Customer";

  const handleDownloadCSV = () => {
    if (filtered.length === 0) return;
    
    const headers = ["#", "Date", "Property", nameHeader, phoneHeader, emailHeader, messageHeader];
    
    const rows = filtered.map((l, index) => [
      index + 1,
      l.date,
      l.property,
      l.name,
      l.phone,
      l.email,
      l.message.replace(/"/g, '""'),
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${val}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `property_leads_${filter}.csv`);
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
        <h1 className="text-2xl font-bold text-ink">{headingText}</h1>
        {filtered.length > 0 && (
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-brand hover:bg-brand/80 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      <LeadCharts leads={leadsList} />

      {/* Sell / Rent-Lease toggle */}
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
            {f === "sell" ? (isEnquiry ? "For Sale" : "Sell") : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium">No leads found.</p>
          <p className="text-sm mt-1">New leads will appear here.</p>
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
                  <th className="text-left px-4 py-3 font-semibold">{nameHeader}</th>
                  <th className="text-left px-4 py-3 font-semibold">{phoneHeader}</th>
                  <th className="text-left px-4 py-3 font-semibold">{emailHeader}</th>
                  <th className="text-left px-4 py-3 font-semibold">{messageHeader}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead, idx) => (
                  <tr key={lead.id} className={cn("border-t border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                    <td className="px-4 py-4 text-center font-semibold text-ink">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-4 text-ink-secondary whitespace-nowrap">{lead.date}</td>
                    <td className="px-4 py-4 font-medium text-ink">{lead.property}</td>
                    <td className="px-4 py-4 text-ink">{lead.name}</td>
                    <td className="px-4 py-4 text-ink whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-4 text-ink">{lead.email}</td>
                    <td className="px-4 py-4 text-ink-secondary max-w-[200px]">{lead.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filtered.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={ITEMS_PER_PAGE}
              total={filtered.length}
              onChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      )}
    </div>
  );
}
