"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/global/DashboardSidebar";
import DashboardHero from "@/components/global/DashboardHero";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  packages: "Package Details",
  credits: "Buy Packages",
  properties: "My Properties",
  leads: "Property Leads",
  enquiries: "My Enquiries",
  expired: "Expired Properties",
  history: "History",
  profile: "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = routeLabels[segment.toLowerCase()] || 
        segment.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return { label, href };
    })
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <DashboardHero />

      {/* ── Two-Column Content Area ─────────────────────────────── */}
      <div className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Breadcrumbs */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-medium text-ink-muted">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {idx > 0 && (
                      <i className="fi fi-rr-angle-small-right text-gray-400 text-sm leading-none shrink-0"></i>
                    )}
                    {isLast ? (
                      <span className="text-ink font-semibold">{crumb.label}</span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        {idx === 0 && <i className="fi fi-rr-home text-xs leading-none"></i>}
                        <span>{crumb.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* On mobile: content is full-width (sidebar is a drawer)
              On lg+:    sidebar + content side-by-side */}
          <div className="flex gap-6 items-start">
            {/* Sidebar — renders its own mobile FAB + drawer internally */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="flex-1 min-w-0 bg-white rounded-xl p-4 md:p-6 shadow-sm animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
