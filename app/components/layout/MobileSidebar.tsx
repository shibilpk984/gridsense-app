"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  LayoutDashboard,
  House,
  Receipt,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

import LogoutButton from "./LogoutButton";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Homes",
    href: "/homes",
    icon: House,
  },
  {
    label: "Bills",
    href: "/bills",
    icon: Receipt,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <>
      {/* Mobile topbar */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-black/50 px-4 backdrop-blur-2xl lg:hidden">
        <h1 className="text-lg font-semibold text-white">
          GridSense ⚡
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-white/10 p-2 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
          {/* Sidebar */}
          <div className="flex h-full w-[290px] flex-col border-r border-white/10 bg-[#09090B]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-xl font-bold text-white">
                GridSense
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setOpen(false)
                    }
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition ${
                      isActive
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />

                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="space-y-4 border-t border-white/10 p-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />

                  <p className="text-sm text-cyan-300">
                    Secure Session
                  </p>
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  Authenticated successfully.
                </p>
              </div>

              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}