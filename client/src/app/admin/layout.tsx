import AdminWrapper from "./adminWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminWrapper>
      {children}
    </AdminWrapper>
  );
}