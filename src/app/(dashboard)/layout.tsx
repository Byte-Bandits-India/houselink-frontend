import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import DashboardSidebar from "@/components/global/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div
        className="relative w-full h-[520px] bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=400&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold text-white drop-shadow-md">
            Customer Dashboard
          </h1>
          <nav className="mt-3">
            <ol className="flex items-center justify-center gap-2 text-base text-white/80">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li className="text-white/50">/</li>
              <li className="text-white font-medium">Customer-Dashboard</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Two-Column Content Area ─────────────────────────────── */}
      <div className="flex-1 py-8">
        <div className="container mx-auto px-6">
          <div className="flex gap-6 items-start">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="flex-1 min-w-0 bg-white p-6 animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
