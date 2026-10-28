import AdminSidebar from '../_components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root-container">
      <style>{`
        .admin-root-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: var(--color-surface-2);
        }
        .admin-main-viewport {
          flex: 1;
          padding: 36px 40px 64px;
          overflow-y: auto;
          min-width: 0;
        }
        @media (min-width: 768px) {
          .admin-root-container {
            flex-direction: row;
          }
        }
        @media (max-width: 767px) {
          .admin-main-viewport {
            padding: 24px 16px 48px;
          }
        }
      `}</style>
      <AdminSidebar />
      <main className="admin-main-viewport">
        {children}
      </main>
    </div>
  );
}
