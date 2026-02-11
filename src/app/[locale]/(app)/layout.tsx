export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add sidebar navigation */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
