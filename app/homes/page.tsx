import { redirect } from "next/navigation";

import {
  House,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import CreateHomeModal from "@/app/homes/CreateHomeModal";

export default async function HomesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const homes = await prisma.home.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              <Sparkles className="h-4 w-4" />

              Smart Energy Management
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Energy Homes
            </h1>

            <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">
              Manage electricity tracking,
              analytics, and energy
              insights across all your
              connected properties.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <CreateHomeModal />

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Connected
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {homes.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Properties",
            value: homes.length,
            subtitle:
              "Managed home locations",
            icon: House,
          },
          {
            title: "Tracking",
            value: "Active",
            subtitle:
              "Realtime monitoring enabled",
            icon: Zap,
          },
          {
            title: "Security",
            value: "Secure",
            subtitle:
              "Protected authenticated access",
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    {item.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-400">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </section>

      {/* Empty State */}
      {homes.length === 0 && (
        <section className="relative overflow-hidden rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] p-8 md:p-14">
          {/* Glow */}
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="relative flex flex-col items-center text-center">
            {/* Icon */}
            <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
              <House className="h-12 w-12 text-cyan-300" />
            </div>

            {/* Text */}
            <h2 className="mt-8 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              No homes added yet
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Create your first home to
              begin tracking electricity
              bills, analytics, and
              consumption trends.
            </p>

            {/* Features */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                "Multi-home support",
                "Realtime analytics",
                "Secure cloud sync",
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
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
                    Ready for tracking
                  </p>
                </div>

                <a
  href={`/homes/${home.id}`}
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