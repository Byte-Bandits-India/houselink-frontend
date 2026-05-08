export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-card-hover border border-border p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
