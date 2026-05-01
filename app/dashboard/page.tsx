import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Dashboard
            </p>

            <h1 className="mt-3 text-5xl font-semibold tracking-tight">
              Welcome back.
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Monitor electricity usage,
              manage homes, and analyze
              consumption trends from one
              intelligent dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-5 backdrop-blur-xl">
            <p className="text-sm text-cyan-300">
              Logged in as
            </p>

            <p className="mt-2 text-lg font-medium text-white">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Energy Usage",
          "Monthly Bills",
          "Analytics",
        ].map((item) => (
          <div
            key={item}
            className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-cyan-500/20 hover:bg-white/[0.05]"
          >
            <div className="mb-6 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-500/20" />

            <h2 className="text-xl font-medium">
              {item}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              This section will contain
              advanced electricity insights
              and interactive data.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}