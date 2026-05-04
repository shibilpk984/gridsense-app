"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  BarChart3,
  House,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[290px] flex-col border-r border-white/10 bg-[#050505] lg:flex">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-7">
        <Link
          href="/main/dashboard"
          className="flex items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-[0_0_50px_rgba(34,211,238,0.35)]">
            <Zap className="h-7 w-7 text-black" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              GridSense
            </h1>

            <p className="text-sm text-zinc-500">
              Energy Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
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

          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Your session is encrypted and protected.
          </p>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}