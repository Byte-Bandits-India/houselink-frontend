import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Page Header */}
      <div
        className="relative w-full h-[550px] flex items-center bg-cover bg-center"
        style={{ backgroundImage: 'url("https://html.awaikenthemes.com/inspaire/images/page-header-bg.jpg")' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 flex items-center justify-center relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
              Authentication
            </h1>
            <nav className="flex items-center justify-center gap-2 text-sm font-medium">
              <Link href="/" className="hover:text-brand transition-colors text-white/90">Home</Link>
              <span className="text-white/60">/</span>
              <span className="text-brand">Account</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Auth Wrapper */}
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        {children}
      </div>
    </div>
  );
}
