"use client";

import { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  BarChart3,
  House,
  LayoutDashboard,
  Menu,
  Receipt,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";

import LogoutButton from "./LogoutButton";

const navItems = [
  {
    label: "Dashboard",
    href: "/main/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Homes",
    href: "/main/homes",
    icon: House,
  },
  {
    label: "Bills",
    href: "/main/bills",
    icon: Receipt,
  },
  {
    label: "Analytics",
    href: "/main/analytics",
    icon: BarChart3,
  },
];

export default function MobileSidebar() {
  const [open, setOpen] =
    useState(false);

  const pathname =
    usePathname();

  return (
    <>
      {/* Topbar */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#050505] px-4 lg:hidden">
        <Link
          href="/main/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500">
            <Zap className="h-5 w-5 text-black" />
          </div>

          <span className="text-lg font-semibold text-white">
            GridSense
          </span>
        </Link>

        <button
          onClick={() =>
            setOpen(true)
          }
          className="rounded-xl border border-white/10 p-2 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
          <div className="flex h-full w-[290px] flex-col border-r border-white/10 bg-[#050505]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500">
                  <Zap className="h-5 w-5 text-black" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    GridSense
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Energy Intelligence
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-white/10 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => {
                const Icon =
                  item.icon;

                const isActive =
                  pathname ===
                    item.href ||
                  pathname.startsWith(
                    `${item.href}/`
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setOpen(false)
                    }
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all ${
                      isActive
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />

                    <span className="font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="space-y-4 border-t border-white/10 p-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />

                  <p className="text-sm font-medium text-cyan-300">
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