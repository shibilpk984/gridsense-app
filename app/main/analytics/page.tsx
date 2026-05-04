import { redirect } from "next/navigation";

import {
  Activity,
  BarChart3,
  FileText,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import UsageChart from "@/app/components/charts/UsageChart";

export default async function AnalyticsPage() {
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
        bills: true,
      },
    });

  const allBills =
    homes.flatMap(
      (home) => home.bills
    );

  const totalUsage =
    allBills.reduce(
      (sum, bill) =>
        sum +
        bill.unitsConsumed,
      0
    );

  const totalSpent =
    allBills.reduce(
      (sum, bill) =>
        sum + bill.amount,
      0
    );

  const averageUsage =
    allBills.length > 0
      ? (
          totalUsage /
          allBills.length
        ).toFixed(1)
      : "0";

  const highestBill =
    allBills.length > 0
      ? Math.max(
          ...allBills.map(
            (bill) =>
              bill.amount
          )
        )
      : 0;

  const homeUsage =
    homes.map((home) => {
      const usage =
        home.bills.reduce(
          (sum, bill) =>
            sum +
            bill.unitsConsumed,
          0
        );

      return {
        name: home.name,
        usage,
      };
    });

  const highestUsageHome =
    [...homeUsage].sort(
      (a, b) =>
        b.usage - a.usage
    )[0];

  const lowestUsageHome =
    [...homeUsage].sort(
      (a, b) =>
        a.usage - b.usage
    )[0];

  const latestBill =
    allBills.sort(
      (a, b) =>
        new Date(
          b.billDate
        ).getTime() -
        new Date(
          a.billDate
        ).getTime()
    )[0];

  let usageTrend = 0;

  const sortedBills =
    [...allBills].sort(
      (a, b) =>
        new Date(
          a.billDate
        ).getTime() -
        new Date(
          b.billDate
        ).getTime()
    );

  if (
    sortedBills.length >= 2
  ) {
    const last =
      sortedBills[
        sortedBills.length - 1
      ];

    const prev =
      sortedBills[
        sortedBills.length - 2
      ];

    usageTrend =
      ((last.unitsConsumed -
        prev.unitsConsumed) /
        prev.unitsConsumed) *
      100;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-5xl font-semibold tracking-tight text-white">
          Analytics
        </h1>

        <p className="mt-4 max-w-2xl text-zinc-500">
          Global electricity
          analytics, consumption
          insights, and billing
          trends across all homes.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title:
              "Total Usage",
            value: `${totalUsage} kWh`,
            icon: Zap,
            color:
              "text-cyan-300",
          },
          {
            title:
              "Total Spent",
            value: `₹${totalSpent}`,
            icon: FileText,
            color:
              "text-emerald-300",
          },
          {
            title:
              "Average Usage",
            value: `${averageUsage} kWh`,
            icon: Activity,
            color:
              "text-violet-300",
          },
          {
            title:
              "Highest Bill",
            value: `₹${highestBill}`,
            icon: BarChart3,
            color:
              "text-orange-300",
          },
        ].map((item) => {
          const Icon =
            item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    {item.title}
                  </p>

                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    {item.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Icon
                    className={`h-5 w-5 ${item.color}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Chart */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div>
          <h2 className="text-3xl font-semibold text-white">
            Usage Trends
          </h2>

          <p className="mt-3 text-zinc-500">
            Electricity usage
            trends across all
            homes.
          </p>
        </div>

        <div className="mt-10">
          <UsageChart
            bills={allBills}
          />
        </div>
      </section>

      {/* Insights */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Trend */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              {usageTrend >= 0 ? (
                <TrendingUp className="h-7 w-7 text-red-300" />
              ) : (
                <TrendingDown className="h-7 w-7 text-emerald-300" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Consumption Trend
              </h2>

              <p className="mt-1 text-zinc-500">
                Compared to previous
                bill cycle
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div
              className={`inline-flex rounded-2xl px-5 py-3 text-lg font-semibold ${
                usageTrend >= 0
                  ? "bg-red-500/10 text-red-300"
                  : "bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {sortedBills.length <
              2
                ? "Not enough data"
                : `${Math.abs(
                    usageTrend
                  ).toFixed(
                    1
                  )}% ${
                    usageTrend >= 0
                      ? "Increase"
                      : "Decrease"
                  }`}
            </div>
          </div>
        </div>

        {/* Latest */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Latest Bill
          </h2>

          {latestBill ? (
            <div className="mt-8">
              <h3 className="text-5xl font-semibold text-white">
                ₹
                {
                  latestBill.amount
                }
              </h3>

              <p className="mt-4 text-zinc-400">
                {
                  latestBill.unitsConsumed
                }{" "}
                kWh consumed
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                {
                  latestBill.month
                }
                /
                {
                  latestBill.year
                }
              </p>
            </div>
          ) : (
            <div className="mt-8 text-zinc-500">
              No bills found
            </div>
          )}
        </div>
      </section>

      {/* Comparisons */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Highest Usage Home
          </h2>

          <p className="mt-6 text-4xl font-semibold text-white">
            {highestUsageHome
              ?.name || "-"}
          </p>

          <p className="mt-3 text-zinc-500">
            {highestUsageHome?.usage ||
              0}{" "}
            kWh consumed
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Lowest Usage Home
          </h2>

          <p className="mt-6 text-4xl font-semibold text-white">
            {lowestUsageHome
              ?.name || "-"}
          </p>

          <p className="mt-3 text-zinc-500">
            {lowestUsageHome?.usage ||
              0}{" "}
            kWh consumed
          </p>
        </div>
      </section>
    </div>
  );
}