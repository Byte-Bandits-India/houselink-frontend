"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] px-2 shrink-0 bg-white shadow-lg rounded-lg overflow-hidden self-start">
      {/* User */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
          <img src="/assets/images/about-us/unknown.jpg" alt="Icon" />
        </div>
        <span className="text-sm font-semibold text-ink truncate">Abraham</span>
      </div>

      {/* Nav */}
      <nav className="py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-brand text-white rounded-lg"
                  : "text-ink-secondary hover:bg-brand-50 hover:text-brand rounded-lg"
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
    </aside>
  );
}
