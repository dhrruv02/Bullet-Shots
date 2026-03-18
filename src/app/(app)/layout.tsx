import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-8 transition-[margin] duration-200 md:ml-[var(--app-sidebar-width)] md:px-10">
        {children}
      </main>
    </>
  );
}
