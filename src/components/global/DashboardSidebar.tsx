"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  ShoppingBag,
  Home,
  Users,
  MessageCircle,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Package Details", href: "/dashboard/packages", icon: FileText, exact: false },
  { label: "Buy Packages", href: "/dashboard/credits", icon: ShoppingBag, exact: false },
  { label: "My Properties", href: "/dashboard/properties", icon: Home, exact: true },
  { label: "Property Leads", href: "/dashboard/leads", icon: Users, exact: false },
  { label: "My Enquiries", href: "/dashboard/enquiries", icon: MessageCircle, exact: false },
  { label: "Expired Properties", href: "/dashboard/properties/expired", icon: Clock, exact: false },
  { label: "History", href: "/dashboard/history", icon: LayoutGrid, exact: false },
  { label: "Settings", href: "/dashboard/profile", icon: Settings, exact: false },
];

/* ─── Sidebar inner content (shared between desktop and mobile drawer) ─── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* User */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="/assets/images/about-us/unknown.jpg"
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <span className="text-sm font-semibold text-ink truncate">Abraham</span>

        {/* Close button — only visible inside the mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-4 mx-1 text-sm font-medium rounded-lg transition-colors duration-150",
                isActive
                  ? "bg-brand text-white"
                  : "text-ink-secondary hover:bg-brand/5 hover:text-brand"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3">
        <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

/* ─── Main export ──────────────────────────────────────────────────────── */
export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Guarantee cleanup on unmount (catches navigation-away-while-open edge case)
  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* ── Mobile hamburger trigger (visible on md and below) ── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand/90 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile drawer backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile slide-in drawer ── */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 z-50 h-full w-[260px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent onClose={() => setOpen(false)} />
      </div>

      {/* ── Desktop sidebar (static, always visible on lg+) ── */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 bg-white shadow-lg rounded-xl overflow-hidden self-start sticky top-20">
        <SidebarContent />
      </aside>
    </>
  );
}
