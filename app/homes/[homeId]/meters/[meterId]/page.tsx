import { redirect } from "next/navigation";

import {
  Activity,
  BarChart3,
  FileText,
  Gauge,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import UsageChart from "@/app/components/charts/UsageChart";
import CreateBillModal from "@/app/components/bills/CreateBillModal";

type Props = {
  params: Promise<{
    homeId: string;
    meterId: string;
  }>;
};

export default async function MeterPage({
  params,
}: Props) {
  const {
    homeId,
    meterId,
  } = await params;

  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const meter =
    await prisma.meter.findFirst({
      where: {
        id: meterId,
        homeId,

        home: {
          userId: user.id,
        },
      },

      include: {
        bills: {
          orderBy: {
            billDate: "desc",
          },
        },

        home: true,
      },
    });

  if (!meter) {
    redirect("/homes");
  }

  // Analytics
  const totalUsage =
    meter.bills.reduce(
      (sum, bill) =>
        sum +
        bill.unitsConsumed,
      0
    );

  const totalAmount =
    meter.bills.reduce(
      (sum, bill) =>
        sum + bill.amount,
      0
    );

  const averageUsage =
    meter.bills.length > 0
      ? (
          totalUsage /
          meter.bills.length
        ).toFixed(1)
      : "0";

  const highestBill =
    meter.bills.length > 0
      ? Math.max(
          ...meter.bills.map(
            (bill) =>
              bill.amount
          )
        )
      : 0;

  const latestBill =
    meter.bills[0];

  const previousBill =
    meter.bills[1];

  let trend = 0;

  if (
    latestBill &&
    previousBill
  ) {
    trend =
      ((latestBill.unitsConsumed -
        previousBill.unitsConsumed) /
        previousBill.unitsConsumed) *
      100;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        {/* Glow */}
        <div className="absolute right-[-100px] top-[-100px] h-[250px] w-[250px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
              <Gauge className="h-10 w-10 text-cyan-300" />
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
              {meter.nickname ||
                "Unnamed Meter"}
            </h1>

            <p className="mt-4 text-zinc-500">
              {
                meter.meterNumber
              }
            </p>
          </div>

          {/* Actions */}
          <CreateBillModal
            meterId={meter.id}
          />
        </div>
      </section>

      {/* Main Analytics */}
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
              "Total Bills",
            value: `₹${totalAmount}`,
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

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
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

      {/* Smart Insights */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Usage Trend */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              {trend >= 0 ? (
                <TrendingUp className="h-7 w-7 text-red-300" />
              ) : (
                <TrendingDown className="h-7 w-7 text-emerald-300" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Usage Trend
              </h2>

              <p className="mt-1 text-zinc-500">
                Compared to previous
                bill cycle
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div
              className={`inline-flex items-center rounded-2xl px-5 py-3 text-lg font-semibold ${
                trend >= 0
                  ? "bg-red-500/10 text-red-300"
                  : "bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {meter.bills.length <
              2
                ? "Not enough data"
                : `${Math.abs(
                    trend
                  ).toFixed(
                    1
                  )}% ${
                    trend >= 0
                      ? "Increase"
                      : "Decrease"
                  }`}
            </div>
          </div>
        </div>

        {/* Latest Bill */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <FileText className="h-7 w-7 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Latest Bill
              </h2>

              <p className="mt-1 text-zinc-500">
                Most recent billing
                cycle
              </p>
            </div>
          </div>

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
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-zinc-500">
              No bills available yet
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-semibold text-white">
        Usage Analytics
      </h2>

      <p className="mt-3 text-zinc-500">
        Electricity consumption
        trends across billing
        cycles.
      </p>
    </div>
  </div>

  <div className="mt-10">
    <UsageChart
      bills={meter.bills}
    />
  </div>
</section>

      {/* Bill History */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">
              Bill History
            </h2>

            <p className="mt-3 text-zinc-500">
              Historical electricity
              usage and billing data.
            </p>
          </div>
        </div>

        {/* Empty */}
        {meter.bills.length ===
          0 && (
          <div className="mt-10 rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-14 text-center">
            <div className="mx-auto flex max-w-lg flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
                <FileText className="h-10 w-10 text-cyan-300" />
              </div>

              <h3 className="mt-8 text-3xl font-semibold text-white">
                No bills added
              </h3>

              <p className="mt-4 text-zinc-500">
                Add your first
                electricity bill to
                unlock analytics and
                trends.
              </p>
            </div>
          </div>
        )}

        {/* Bills Grid */}
        {meter.bills.length >
          0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {meter.bills.map(
              (bill) => (
                <div
                  key={bill.id}
                  className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-500/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">
                        {bill.month}/
                        {bill.year}
                      </p>

                      <h3 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                        ₹
                        {
                          bill.amount
                        }
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                      {
                        bill.unitsConsumed
                      }{" "}
                      kWh
                    </div>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-5 text-sm text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span>
                        Previous
                      </span>

                      <span>
                        {
                          bill.previousReading
                        }
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span>
                        Current
                      </span>

                      <span>
                        {
                          bill.currentReading
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}