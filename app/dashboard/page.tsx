import { redirect } from "next/navigation";

import Link from "next/link";

import {
  ArrowRight,
  Building2,
  FileText,
  Gauge,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import UsageChart from "@/app/components/charts/UsageChart";

export default async function DashboardPage() {
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

      include: {
        meters: {
          include: {
            bills: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const totalHomes =
    homes.length;

  const totalMeters =
    homes.reduce(
      (sum, home) =>
        sum +
        home.meters.length,
      0
    );

  const allBills =
    homes.flatMap((home) =>
      home.meters.flatMap(
        (meter) =>
          meter.bills
      )
    );

  const totalBills =
    allBills.length;

  const totalUsage =
    allBills.reduce(
      (sum, bill) =>
        sum +
        bill.unitsConsumed,
      0
    );

  const totalCost =
    allBills.reduce(
      (sum, bill) =>
        sum + bill.amount,
      0
    );

  const recentBills =
    [...allBills]
      .sort(
        (a, b) =>
          new Date(
            b.billDate
          ).getTime() -
          new Date(
            a.billDate
          ).getTime()
      )
      .slice(0, 8);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Electricity overview
            and billing analytics.
          </p>
        </div>

       
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Homes",
            value: totalHomes,
            icon: Building2,
          },
          {
            title: "Meters",
            value: totalMeters,
            icon: Gauge,
          },
          {
            title: "Usage",
            value: `${totalUsage} kWh`,
            icon: Zap,
          },
          {
            title: "Bills",
            value: totalBills,
            icon: FileText,
          },
        ].map((item) => {
          const Icon =
            item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-white/5 bg-[#111111] p-5 transition-all duration-200 hover:border-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-[30px] font-semibold tracking-tight text-white">
                    {item.value}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 bg-[#181818]">
                  <Icon className="h-5 w-5 text-zinc-300" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Analytics */}
      <section className="rounded-2xl border border-white/5 bg-[#111111] p-5">
        <div className="flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Usage Analytics
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Electricity usage
              across all connected
              meters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/10 px-4 py-2">
              <p className="text-xs font-medium text-emerald-400">
                Total Cost
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                ₹{totalCost}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <UsageChart
            bills={allBills}
          />
        </div>
      </section>

      {/* Recent Bills */}
      <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#111111]">
        <div className="border-b border-white/5 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            Recent Bills
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Latest billing records.
          </p>
        </div>

        {recentBills.length ===
        0 ? (
          <div className="p-10 text-center text-sm text-zinc-500">
            No bills added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#151515] text-left">
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Month
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Usage
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Previous
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Current
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBills.map(
                  (bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-white/5 transition-colors hover:bg-[#151515]"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-white">
                        {bill.month}/
                        {bill.year}
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-300">
                        {
                          bill.unitsConsumed
                        }{" "}
                        kWh
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-white">
                        ₹
                        {
                          bill.amount
                        }
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {
                          bill.previousReading
                        }
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {
                          bill.currentReading
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Homes */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Homes
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Connected properties
            and active meters.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {homes.map((home) => (
            <Link
              href={`/homes/${home.id}`}
              key={home.id}
              className="group rounded-2xl border border-white/5 bg-[#111111] p-5 transition-all duration-200 hover:border-white/10 hover:bg-[#151515]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {home.name}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    {
                      home.meters.length
                    }{" "}
                    connected meters
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#181818] p-3">
                  <Building2 className="h-5 w-5 text-zinc-300" />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">
                Open workspace

                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}