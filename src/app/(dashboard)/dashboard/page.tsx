"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/packages");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12 text-sm text-ink-muted">
      Redirecting to Package Details...
    </div>
  );
}
