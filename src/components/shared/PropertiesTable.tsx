"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, Plus, Search, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// ReUI DataGrid imports
import {
  DataGrid,
  DataGridContainer,
} from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface Property {
  id: number;
  name: string;
  state: string;
  views: number;
  expiredAt: string;
  createdAt: string;
  status: string;
  moderationStatus: string;
  purpose: "sell" | "rent_lease";
  ownerType: "owner" | "builder" | "consultant";
  categoriesId?: number;
}

interface Lead {
  id: number;
  date: string;
  property: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  filter: "sell" | "rent";
  avatarImage?: string | null;
}

interface PropertiesTableProps {
  properties: Property[];
  leads: Lead[];
  onDelete: (id: number, name: string) => void;
}

const CATEGORY_LABELS: Record<number, string> = {
  1: "Apartment",
  2: "Villa",
  3: "Plot",
  4: "Individual House",
  5: "Land",
  6: "Shop",
  7: "Building",
  8: "Godown",
  9: "Warehouse",
  10: "Office Space",
};

function getCategoryIcon(catId: number) {
  if ([1, 7, 10].includes(catId)) return "fa-solid fa-building text-lg";
  if ([2, 4].includes(catId)) return "fa-solid fa-house text-lg";
  if ([3, 5].includes(catId)) return "fa-solid fa-map-location-dot text-lg";
  if (catId === 6) return "fa-solid fa-store text-lg";
  if ([8, 9].includes(catId)) return "fa-solid fa-warehouse text-lg";
  return "fa-solid fa-building text-lg";
}

const statusBadge: Record<string, string> = {
  approved: "bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold px-3 py-1",
  pending: "bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-semibold px-3 py-1",
  rejected: "bg-gray-100 text-gray-500 border border-gray-200 rounded-full text-xs font-semibold px-3 py-1",
};

// Colors for Initials Avatar Background
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-indigo-100 text-indigo-800",
  "bg-pink-100 text-pink-800",
  "bg-rose-100 text-rose-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-cyan-100 text-cyan-800",
];

function getAvatarColor(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ── Sub-table for Property Leads ─────────────────────────── */
function LeadsSubTable({ leads }: { leads: Lead[] }) {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const total = leads.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLeads = useMemo(() => {
    return leads.slice(startIndex, startIndex + pageSize);
  }, [leads, startIndex, pageSize]);

  // Reset page if leads count changes or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [total, pageSize]);

  if (total === 0) {
    return (
      <div className="bg-slate-50/40 p-6 pl-12 text-center text-gray-400 border-y border-gray-100">
        No leads found for this property.
      </div>
    );
  }

  return (
    <div className="bg-[#f9fbfb]/30 p-6 pl-12 pr-6 border-y border-gray-100 min-w-0">
      {/* Inner Card Container */}
      <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-md">
        <Table className="min-w-full">
          <TableHeader className="bg-[#fafbfb] border-b border-gray-150">
            <TableRow>
              <TableHead className="font-bold text-xs text-gray-500 uppercase tracking-wider py-3.5 pl-6">Customer</TableHead>
              <TableHead className="font-bold text-xs text-gray-500 uppercase tracking-wider py-3.5">Phone</TableHead>
              <TableHead className="font-bold text-xs text-gray-500 uppercase tracking-wider py-3.5">Message</TableHead>
              <TableHead className="font-bold text-xs text-gray-500 uppercase tracking-wider py-3.5 pr-6">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => {
              const initials = getInitials(lead.name);
              const avColor = getAvatarColor(lead.name);

              return (
                <TableRow key={lead.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                  {/* Customer name, email, avatar */}
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-inner overflow-hidden", !lead.avatarImage && avColor)}>
                        {lead.avatarImage ? (
                          <img
                            src={getImageUrl(lead.avatarImage)}
                            alt={lead.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const textSibling = e.currentTarget.nextElementSibling as HTMLElement;
                              if (textSibling) {
                                textSibling.style.display = "flex";
                              }
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.className = `w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-inner overflow-hidden ${avColor}`;
                              }
                            }}
                          />
                        ) : null}
                        <span className={lead.avatarImage ? "hidden" : ""}>{initials}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-snug">{lead.name}</p>
                        <p className="text-xs text-gray-500 -mt-2 font-medium">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Phone */}
                  <TableCell className="py-4 text-slate-700 text-sm font-semibold whitespace-nowrap">
                    {lead.phone}
                  </TableCell>
                  
                  {/* Message */}
                  <TableCell className="py-4">
                    <p className="text-gray-600 text-sm max-w-md whitespace-normal break-words leading-relaxed font-medium">
                      {lead.message}
                    </p>
                  </TableCell>
                  
                  {/* Date */}
                  <TableCell className="py-4 text-gray-500 text-sm font-medium pr-6 whitespace-nowrap">
                    {lead.date}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Nested Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#fafbfb] border-t border-gray-150">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="text-xs font-semibold text-gray-600 bg-white border border-gray-250 rounded px-1.5 py-1 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-semibold">
              Showing {startIndex + 1} - {Math.min(startIndex + pageSize, total)} of {total}
            </span>
            {total > pageSize && (
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesTable({ properties, leads, onDelete }: PropertiesTableProps) {
  const router = useRouter();

  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [ownershipFilter, setOwnershipFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Search input state
  const [searchInputValue, setSearchInputValue] = useState<string>("");

  // React Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "expand",
    "name",
    "categoriesId",
    "createdAt",
    "expiredAt",
    "views",
    "leadsCount",
    "moderationStatus",
    "actions",
  ]);

  // Filter logic
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      // 1. Type (purpose) filter
      if (typeFilter !== "all") {
        if (typeFilter === "sell" && p.purpose !== "sell") return false;
        if (typeFilter === "rent_lease" && p.purpose !== "rent_lease") return false;
      }
      // 2. Ownership filter
      if (ownershipFilter !== "all" && p.ownerType !== ownershipFilter) return false;
      // 3. Status filter
      if (statusFilter !== "all" && p.moderationStatus !== statusFilter) return false;
      // 4. Search query filter
      if (searchInputValue.trim() !== "") {
        if (!p.name.toLowerCase().includes(searchInputValue.toLowerCase())) return false;
      }
      // 5. Hide archived
      if (p.moderationStatus === "archived") return false;

      return true;
    });
  }, [properties, typeFilter, ownershipFilter, statusFilter, searchInputValue]);

  const columns = useMemo<ColumnDef<Property>[]>(
    () => [
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
          return (
            <Button
              onClick={row.getToggleExpandedHandler()}
              size="icon-sm"
              variant="ghost"
              className="opacity-70 hover:bg-transparent hover:opacity-100"
              aria-label={
                row.getIsExpanded()
                  ? "Collapse details"
                  : "Expand details"
              }
            >
              {row.getIsExpanded() ? (
                <ChevronUp className="size-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-4" aria-hidden="true" />
              )}
            </Button>
          );
        },
        size: 40,
        enableResizing: false,
        meta: {
          expandedContent: (row) => {
            const propLeads = leads.filter(
              (l) => l.property.toLowerCase() === row.name.toLowerCase()
            );
            return <LeadsSubTable leads={propLeads} />;
          },
        },
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Property"
            column={column}
          />
        ),
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex flex-col gap-1">
              <p
                className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors leading-normal text-sm"
                onClick={() => router.push(`/dashboard/properties/${p.id}`)}
              >
                {p.name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{p.state}</span>
                <span className="text-gray-300">•</span>
                <span className="capitalize">{p.ownerType}</span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 250,
      },
      {
        accessorKey: "categoriesId",
        id: "categoriesId",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Category"
            column={column}
          />
        ),
        cell: ({ row }) => {
          const p = row.original;
          const catId = p.categoriesId || 1;
          const catLabel = CATEGORY_LABELS[catId] || "Apartment";
          const catIconClass = getCategoryIcon(catId);
          return (
            <div className="flex items-center gap-2 text-slate-700 text-sm">
              <i className={cn(catIconClass, "text-[#163D75]/70 text-sm")} />
              <span>{catLabel}</span>
            </div>
          );
        },
        enableSorting: true,
        size: 130,
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Created at"
            column={column}
          />
        ),
        cell: (info) => <span className="text-gray-600 text-sm">{info.getValue() as string}</span>,
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: "expiredAt",
        id: "expiredAt",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Expiry Date"
            column={column}
          />
        ),
        cell: (info) => <span className="text-gray-600 text-sm">{info.getValue() as string}</span>,
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: "views",
        id: "views",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Views"
            column={column}
          />
        ),
        cell: (info) => <span className="text-gray-600 text-sm font-medium">{info.getValue() as number}</span>,
        enableSorting: true,
        size: 90,
      },
      {
        id: "leadsCount",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Leads"
            column={column}
          />
        ),
        cell: ({ row }) => {
          const propLeads = leads.filter(
            (l) => l.property.toLowerCase() === row.original.name.toLowerCase()
          );
          const count = propLeads.length;
          return (
            <button
              onClick={row.getToggleExpandedHandler()}
              className={cn(
                "px-2.5 py-1 rounded-full font-bold text-xs transition-colors flex items-center gap-1.5",
                count === 0
                  ? "bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              )}
            >
              <span>{count}</span>
              {row.getIsExpanded() ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          );
        },
        size: 100,
      },
      {
        accessorKey: "moderationStatus",
        id: "moderationStatus",
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Status"
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.moderationStatus;
          return (
            <span className={statusBadge[status] || "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
        enableSorting: true,
        size: 110,
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors mx-auto">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 bg-white border border-gray-100 shadow-md">
                {p.moderationStatus === "pending" ? (
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                    className="flex items-center gap-2 cursor-pointer py-2 text-gray-600 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/properties/${p.id}/edit`)}
                    className="flex items-center gap-2 cursor-pointer py-2 text-gray-600 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(p.id, p.name)}
                  className="flex items-center gap-2 cursor-pointer py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 70,
      },
    ],
    [leads, router, onDelete]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getRowId: (row) => String(row.id),
    getRowCanExpand: (row) => true,
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
      columnOrder,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* ── Filter Card ─────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink mb-4">Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Select Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Select Type</label>
            <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); table.setPageIndex(0); }}>
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="rent_lease">Rent/Lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select Property Ownership */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Select Property Ownership</label>
            <Select value={ownershipFilter} onValueChange={(val) => { setOwnershipFilter(val); table.setPageIndex(0); }}>
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="builder">Builder</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select Property Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Select Property Status</label>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); table.setPageIndex(0); }}>
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Table Container Card ────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Search, page size and Add Property Action Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search a property name ..."
              value={searchInputValue}
              onChange={(e) => { setSearchInputValue(e.target.value); table.setPageIndex(0); }}
              className="pl-9 pr-4 py-2 w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#163D75]/20 focus:border-[#163D75] transition-all bg-white placeholder-gray-400"
            />
          </div>

          {/* Page size & Add Property button */}
          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto justify-end">
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => { table.setPageSize(Number(val)); table.setPageIndex(0); }}
            >
              <SelectTrigger className="w-16 bg-white border-gray-300">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent className="min-w-[4rem]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => router.push("/dashboard/properties/new")}
              variant="gradient"
              className="flex items-center gap-2 text-white font-bold text-sm px-4 py-2.5 rounded-[50px] transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Property
            </Button>
          </div>
        </div>

        {/* DataGrid Table */}
        <DataGrid
          table={table}
          recordCount={filtered.length}
          tableLayout={{
            rowBorder: true,
          }}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white">
              <p className="font-medium mb-3">No properties found matching filters.</p>
            </div>
          ) : (
            <DataGridContainer>
              <DataGridScrollArea>
                <DataGridTable />
              </DataGridScrollArea>
              <DataGridPagination className="px-6 py-4 border-t border-gray-100 bg-white" />
            </DataGridContainer>
          )}
        </DataGrid>
      </div>
    </div>
  );
}
