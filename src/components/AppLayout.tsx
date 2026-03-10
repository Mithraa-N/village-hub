import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <AppSidebar />
      <main className="flex-1 min-w-0 pt-16 lg:pl-64">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
