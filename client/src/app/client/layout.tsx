// app/client/layout.tsx
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}