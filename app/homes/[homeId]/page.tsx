import { redirect } from "next/navigation";

import {
  Gauge,
  House,
  MapPin,
  Pencil,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import CreateMeterModal from "@/app/components/metres/CreateMeterModal";
import EditHomeModal from "@/app/homes/EditHomeModal";
import DeleteHomeButton from "@/app/homes/DeleteHomeButton";

type Props = {
  params: Promise<{
    homeId: string;
  }>;
};

export default async function HomeDetailsPage({
  params,
}: Props) {
  const { homeId } =
    await params;

  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const home =
    await prisma.home.findFirst({
      where: {
        id: homeId,
        userId: user.id,
      },

      include: {
        meters: true,
      },
    });

  if (!home) {
    redirect("/homes");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
              <House className="h-10 w-10 text-cyan-300" />
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
              {home.name}
            </h1>

            <div className="mt-5 flex items-center gap-3 text-zinc-500">
              <MapPin className="h-5 w-5" />

              {home.location ||
                "No location added"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <EditHomeModal
              homeId={home.id}
              currentName={
                home.name
              }
              currentLocation={
                home.location || ""
              }
            />

            <DeleteHomeButton
              homeId={home.id}
            />
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Meters",
            value:
              home.meters.length,
          },
          {
            title: "Bills",
            value: "0",
          },
          {
            title: "Usage",
            value: "0 kWh",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="text-sm text-zinc-500">
              {item.title}
            </p>

            <h2 className="mt-4 text-4xl font-semibold text-white">
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      {/* Meters Section */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        {/* Top */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">
              Electricity Meters
            </h2>

            <p className="mt-3 text-zinc-500">
              Manage connected energy
              meters for this property.
            </p>
          </div>

          <CreateMeterModal
            homeId={home.id}
          />
        </div>

        {/* Empty State */}
        {home.meters.length ===
          0 && (
          <div className="mt-10 rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="mx-auto flex max-w-lg flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
                <Gauge className="h-10 w-10 text-cyan-300" />
              </div>

              <h3 className="mt-8 text-3xl font-semibold text-white">
                No meters connected
              </h3>

              <p className="mt-4 text-zinc-500">
                Add your first
                electricity meter to
                begin tracking bills and
                energy usage.
              </p>
            </div>
          </div>
        )}

        {/* Meter Grid */}
        {home.meters.length >
          0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {home.meters.map(
              (meter) => (
                <a
                  href={`/homes/${home.id}/meters/${meter.id}`}
                  key={meter.id}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-500/20 hover:bg-white/[0.05]"
                >
                  {/* Glow */}
                  <div className="absolute right-[-40px] top-[-40px] h-[120px] w-[120px] rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Icon */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
                    <Gauge className="h-8 w-8 text-cyan-300" />
                  </div>

                  {/* Content */}
                  <div className="relative mt-6">
                    <h3 className="text-2xl font-semibold text-white">
                      {meter.nickname ||
                        "Unnamed Meter"}
                    </h3>

                    <p className="mt-2 text-zinc-500">
                      {
                        meter.meterNumber
                      }
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="relative mt-8 border-t border-white/10 pt-5">
                    <p className="text-sm text-cyan-300">
                      Active meter
                    </p>
                  </div>
                </a>
              )
            )}
          </div>
        )}
      </section>

      {/* Placeholder */}
      <section className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] p-14 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
            <Pencil className="h-10 w-10 text-cyan-300" />
          </div>

          <h2 className="mt-8 text-3xl font-semibold text-white">
            Bill tracking coming next
          </h2>

          <p className="mt-4 text-zinc-500">
            This workspace is now
            ready for electricity bill
            entry, analytics, and
            intelligent usage tracking.
          </p>
        </div>
      </section>
    </div>
  );
}