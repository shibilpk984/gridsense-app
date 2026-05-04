import { redirect } from "next/navigation";

import {
  House,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import CreateHomeModal from "@/app/main/homes/CreateHomeModal";

export default async function HomesPage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const homes =
    await prisma.home.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Top Bar */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Homes
          </h1>

          <p className="mt-2 text-zinc-500">
            Manage your electricity
            bill workspaces.
          </p>
        </div>

        <CreateHomeModal />
      </section>

      {/* Empty State */}
      {homes.length === 0 && (
        <section className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] p-14">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
              <House className="h-10 w-10 text-cyan-300" />
            </div>

            <h2 className="mt-8 text-3xl font-semibold text-white">
              No homes yet
            </h2>

            <p className="mt-4 max-w-xl text-zinc-500">
              Create your first home
              and start tracking
              electricity bills and
              usage analytics.
            </p>

            <div className="mt-8">
              <CreateHomeModal />
            </div>
          </div>
        </section>
      )}

      {/* Homes Grid */}
      {homes.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {homes.map((home) => (
            <div
              key={home.id}
              className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-500/20 hover:bg-white/[0.05]"
            >
              {/* Glow */}
              <div className="absolute right-[-40px] top-[-40px] h-[120px] w-[120px] rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Top */}
              <div className="relative flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
                  <House className="h-8 w-8 text-cyan-300" />
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  Active
                </div>
              </div>

              {/* Content */}
              <div className="relative mt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {home.name}
                </h2>

                <p className="mt-2 text-zinc-500">
                  {home.location ||
                    "No location added"}
                </p>
              </div>

              {/* Footer */}
              <div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Status
                  </p>

                  <p className="mt-2 text-sm text-cyan-300">
                    Ready
                  </p>
                </div>

                <a
                  href={`/main/homes/${home.id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10"
                >
                  Open
                </a>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}