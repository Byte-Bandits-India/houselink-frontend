"use client";

import { useState } from "react";
import { Download, } from "lucide-react";
import { cn } from "@/lib/utils";
import LeadCharts from "@/components/shared/LeadCharts";

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

/* ── Mock data from all_leads.blade.php ──────────────────── */
const leads: Lead[] = [
  // Sell leads
  { id: 1,  date: "06-05-2026", property: "Greenwood Heights Apartment", name: "Ramesh Kumar",   phone: "+91 98765 43210", email: "ramesh@example.com",  message: "I am interested in buying this property.", filter: "sell" },
  { id: 2,  date: "04-05-2026", property: "Sunrise Villa",               name: "Priya Sharma",   phone: "+91 99887 76655", email: "priya@example.com",   message: "Please share more details.",               filter: "sell" },
  { id: 3,  date: "02-05-2026", property: "Metro Studio Flat",            name: "Arjun Reddy",    phone: "+91 88776 65544", email: "arjun@example.com",   message: "Is the price negotiable?",                 filter: "sell" },
  { id: 4,  date: "01-05-2026", property: "Coastal Dream Villa",          name: "Meena Iyer",     phone: "+91 77665 54430", email: "meena@example.com",   message: "I'd like to schedule a visit.",            filter: "sell" },
  { id: 5,  date: "29-04-2026", property: "Blue Horizon 3BHK",            name: "Suresh Babu",    phone: "+91 80123 45678", email: "suresh@example.com",  message: "Looking for immediate possession.",        filter: "sell" },
  { id: 6,  date: "28-04-2026", property: "Prestige Skyline Tower",       name: "Anita Verma",    phone: "+91 91234 56789", email: "anita@example.com",   message: "Do you have any EMI options?",             filter: "sell" },
  { id: 7,  date: "27-04-2026", property: "Golden Gate Towers",           name: "Rajesh Singh",   phone: "+91 70987 65432", email: "rajesh@example.com",  message: "Can we negotiate the floor plan?",         filter: "sell" },
  { id: 8,  date: "25-04-2026", property: "Greenwood Heights Apartment", name: "Deepa Nair",     phone: "+91 98001 23456", email: "deepa@example.com",   message: "I am ready to book.",                    filter: "sell" },
  { id: 9,  date: "24-04-2026", property: "Royal Heritage Bungalow",      name: "Vijay Rao",      phone: "+91 89000 11223", email: "vijay@example.com",   message: "What are the legal documents available?", filter: "sell" },
  { id: 10, date: "23-04-2026", property: "Emerald Isle Apartments",      name: "Lakshmi Devi",   phone: "+91 93456 78901", email: "laxmi@example.com",   message: "Is it gated community?",                  filter: "sell" },

  // Rent leads
  { id: 11, date: "05-05-2026", property: "Tranquil Nest 2BHK",           name: "Sneha Patel",    phone: "+91 77665 54433", email: "sneha@example.com",   message: "Looking for 11-month lease.",             filter: "rent" },
  { id: 12, date: "03-05-2026", property: "Park View Flat",                name: "Kiran Joshi",    phone: "+91 66554 43322", email: "kiran@example.com",   message: "Are pets allowed?",                       filter: "rent" },
  { id: 13, date: "01-05-2026", property: "Lake Side Studio",              name: "Pooja Menon",    phone: "+91 80765 43219", email: "pooja@example.com",   message: "Can I move in next month?",               filter: "rent" },
  { id: 14, date: "30-04-2026", property: "Urban Loft Studio",             name: "Arun Kumar",     phone: "+91 91122 33445", email: "arun@example.com",    message: "Is furniture included?",                  filter: "rent" },
  { id: 15, date: "28-04-2026", property: "Downtown 2BHK Suite",           name: "Rekha Pillai",   phone: "+91 70011 22334", email: "rekha@example.com",   message: "What is the maintenance charge?",         filter: "rent" },
  { id: 16, date: "26-04-2026", property: "Tranquil Nest 2BHK",           name: "Naveen Raj",     phone: "+91 98234 56710", email: "naveen@example.com",  message: "Is it near a metro station?",             filter: "rent" },
  { id: 17, date: "25-04-2026", property: "Beachside Bungalow",            name: "Shriya Das",     phone: "+91 88009 87654", email: "shriya@example.com",  message: "Interested for 6-month stay.",            filter: "rent" },
  { id: 18, date: "24-04-2026", property: "Hill View Cottage",             name: "Manoj Tiwari",   phone: "+91 77892 34501", email: "manoj@example.com",   message: "What is the deposit amount?",             filter: "rent" },
  { id: 19, date: "23-04-2026", property: "Garden View 1BHK",              name: "Asha Reddy",     phone: "+91 91005 67812", email: "asha@example.com",    message: "Is the water supply 24/7?",               filter: "rent" },
  { id: 20, date: "22-04-2026", property: "Park View Flat",                name: "Rohit Menon",    phone: "+91 80543 21987", email: "rohit@example.com",   message: "Can I see the flat this weekend?",        filter: "rent" },
];

export default function LeadsPage() {
  const [filter, setFilter] = useState<Filter>("sell");

  const filtered = leads.filter((l) => l.filter === filter);
  const isEnquiry = false; // For Property Leads context (not "My Enquiries")

  const headingText = isEnquiry ? "My Enquiries" : "Property Leads";
  const nameHeader = isEnquiry ? "Owner Name" : "Customer Name";
  const phoneHeader = isEnquiry ? "Owner Phone" : "Customer Phone";
  const emailHeader = isEnquiry ? "Owner Email" : "Customer Email";
  const messageHeader = isEnquiry ? "My Message" : "Message From Customer";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{headingText}</h1>
        {filtered.length > 0 && (
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200">
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      <LeadCharts leads={leads} />

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
              {filtered.map((lead, idx) => (
                <tr key={lead.id} className={cn("border-t border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                  <td className="px-4 py-4 text-center font-semibold text-ink">{idx + 1}</td>
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
      )}
    </div>
  );
}
