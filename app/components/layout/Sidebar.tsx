"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  House,
  Receipt,
  BarChart3,
  Settings,
  Zap,
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-[290px] flex-col border-r border-white/10 bg-black/40 backdrop-blur-2xl">
      {/* Logo */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-[0_0_40px_rgba(34,211,238,0.35)]">
            <Zap className="h-6 w-6 text-black" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              GridSense
            </h1>

            <p className="text-sm text-zinc-500">
              Energy Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
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

      {/* Bottom section */}
      <div className="space-y-4 border-t border-white/10 p-4">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />

            <p className="text-sm text-cyan-300">
              Secure Session
            </p>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Your session is encrypted and
            protected.
          </p>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}