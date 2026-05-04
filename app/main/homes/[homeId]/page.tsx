import { redirect } from "next/navigation";

import {
  Activity,
  BarChart3,
  FileText,
  House,
  MapPin,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import UsageChart from "@/app/components/charts/UsageChart";

import CreateBillModal from "@/app/components/bills/CreateBillModal";
import EditBillModal from "@/app/components/bills/EditBillModal";
import DeleteBillButton from "@/app/components/bills/DeleteBillButton";

import EditHomeModal from "@/app/main/homes/EditHomeModal";
import DeleteHomeButton from "@/app/main/homes/DeleteHomeButton";

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
        bills: {
          orderBy: {
            billDate: "desc",
          },
        },
      },
    });

  if (!home) {
    redirect("/main/homes");
  }

  const bills =
    home.bills;

  const totalUsage =
    bills.reduce(
      (sum, bill) =>
        sum +
        bill.unitsConsumed,
      0
    );

  const totalAmount =
    bills.reduce(
      (sum, bill) =>
        sum + bill.amount,
      0
    );

  const averageUsage =
    bills.length > 0
      ? (
          totalUsage /
          bills.length
        ).toFixed(1)
      : "0";

  const highestBill =
    bills.length > 0
      ? Math.max(
          ...bills.map(
            (bill) =>
              bill.amount
          )
        )
      : 0;

  const latestBill =
    bills[0];

  const previousBill =
    bills[1];

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
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
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

          <div className="flex flex-wrap items-center gap-4">
            <CreateBillModal
              meterId={home.id}
            />

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

      {/* Insights */}
      <section className="grid gap-4 lg:grid-cols-2">
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
                Compared to previous bill
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
              {bills.length < 2
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
            </div>
          ) : (
            <div className="mt-8 text-zinc-500">
              No bills available
            </div>
          )}
        </div>
      </section>

      {/* Chart */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <h2 className="text-3xl font-semibold text-white">
          Usage Analytics
        </h2>

        <div className="mt-10">
          <UsageChart
            bills={bills}
          />
        </div>
      </section>

      {/* Bills */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <h2 className="text-3xl font-semibold text-white">
          Bill History
        </h2>

        {bills.length ===
          0 && (
          <div className="mt-10 text-zinc-500">
            No bills added yet
          </div>
        )}

        {bills.length >
          0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {bills.map(
              (bill) => (
                <div
                  key={bill.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">
                        {bill.month}/
                        {bill.year}
                      </p>

                      <h3 className="mt-3 text-4xl font-semibold text-white">
                        ₹
                        {
                          bill.amount
                        }
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                        {
                          bill.unitsConsumed
                        }{" "}
                        kWh
                      </div>

                      <EditBillModal
                        bill={bill}
                      />

                      <DeleteBillButton
                        billId={
                          bill.id
                        }
                      />
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