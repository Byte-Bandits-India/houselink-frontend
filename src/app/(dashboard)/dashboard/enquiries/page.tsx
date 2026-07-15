"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyEnquiries } from "@/lib/api/leads";
import { message } from "antd";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import PurposeToggle from "@/components/shared/PurposeToggle";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Filter = "sell" | "rent" | "lease";

import type { Enquiry } from "@/types/dashboard";

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

  // "sell" tab shows sell; "rent" tab shows both rent + lease
  const filtered = enquiriesList.filter((e) =>
    filter === "sell" ? e.filter === "sell" : e.filter === "rent" || e.filter === "lease"
  );
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
          <Button 
            onClick={handleDownloadCSV}
            variant="gradient"
            className="flex items-center gap-2 text-white font-semibold text-sm px-4 py-2 rounded-[50px] transition-colors duration-200"
          >
            <Download className="w-4 h-4" /> Download
          </Button>
        )}
      </div>

      {/* For Sale / Rent-Lease toggle */}
      <PurposeToggle value={filter as "sell" | "rent"} onChange={(val) => setFilter(val)} sellLabel="For Sale" />

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium">No enquiries found.</p>
          <p className="text-sm mt-1">New enquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-secondary text-white hover:bg-transparent">
                  <TableHead className="text-center font-bold text-white w-12 py-3">#</TableHead>
                  <TableHead className="text-left font-bold text-white py-3">Date</TableHead>
                  <TableHead className="text-left font-bold text-white py-3">Property</TableHead>
                  <TableHead className="text-left font-bold text-white py-3">Owner Name</TableHead>
                  <TableHead className="text-left font-bold text-white py-3">Owner Phone</TableHead>
                  <TableHead className="text-left font-bold text-white py-3">Owner Email</TableHead>
                  <TableHead className="text-left font-bold text-white py-3">My Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEnquiries.map((enq, idx) => (
                  <TableRow key={enq.id} className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center font-semibold text-gray-700 py-4">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap py-4">{enq.date}</TableCell>
                    <TableCell className="font-bold text-slate-800 py-4">{enq.property}</TableCell>
                    <TableCell className="text-gray-700 py-4">{enq.ownerName}</TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap py-4">{enq.ownerPhone}</TableCell>
                    <TableCell className="text-gray-600 py-4">{enq.ownerEmail}</TableCell>
                    <TableCell className="text-gray-500 max-w-[220px] leading-normal py-4">{enq.myMessage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
