import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
              <span className="text-lg font-black text-black">
                ⚡
              </span>
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                GridSense
              </h1>

              <p className="text-xs text-zinc-500">
                Energy Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            {[
              {
                href: "/dashboard",
                label: "Dashboard",
              },
              {
                href: "/homes",
                label: "Homes",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-transparent px-4 py-2 text-sm text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.03] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl md:block">
            Secure Session Active
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}