import AdminSidebar from '../_components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-surface-2)]">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
