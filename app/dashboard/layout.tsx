import type { ReactNode } from "react";

import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSidebar";
import Navbar from "@/app/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Ambient glows */}
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[140px]" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[140px]" />

        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Mobile nav */}
      <MobileSidebar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Desktop navbar */}
          <div className="hidden lg:block">
            <Navbar />
          </div>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto w-full max-w-[1700px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}