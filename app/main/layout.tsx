import type { ReactNode } from "react";

import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSidebar";

type Props = {
  children: ReactNode;
};

export default function MainLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile Nav */}
        <MobileSidebar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}