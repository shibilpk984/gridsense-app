"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname =
    usePathname();

  const isDashboard =
    pathname ===
    "/dashboard";

  const buttonText =
    isDashboard
      ? "Manage Homes"
      : "Dashboard";

  const buttonLink =
    isDashboard
      ? "/homes"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090909]/80 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-end px-4 lg:px-6">
        <Link
          href={buttonLink}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#151515] px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-[#1b1b1b]"
        >
          {buttonText}

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}