"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-brand-background" suppressHydrationWarning>
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-h-screen pb-28 lg:pb-8 p-3 sm:p-6 lg:p-8" suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}
