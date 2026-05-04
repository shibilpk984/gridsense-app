import { redirect } from "next/navigation";

import {
  FileText,
  House,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import EditBillModal from "@/app/components/bills/EditBillModal";
import DeleteBillButton from "@/app/components/bills/DeleteBillButton";

export default async function BillsPage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bills =
    await prisma.bill.findMany({
      where: {
        home: {
          userId: user.id,
        },
      },

      include: {
        home: true,
      },

      orderBy: {
        billDate: "desc",
      },
    });

  const totalAmount =
    bills.reduce(
      (sum, bill) =>
        sum + bill.amount,
      0
    );

  const totalUsage =
    bills.reduce(
      (sum, bill) =>
        sum +
        bill.unitsConsumed,
      0
    );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-white">
              Bills
            </h1>

            <p className="mt-4 text-zinc-500">
              Electricity billing
              history across all
              homes.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-sm text-zinc-500">
                Total Usage
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {totalUsage} kWh
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4">
              <p className="text-sm text-cyan-300">
                Total Spent
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                ₹{totalAmount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empty */}
      {bills.length === 0 && (
        <section className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <div className="mx-auto flex max-w-lg flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
              <FileText className="h-10 w-10 text-cyan-300" />
            </div>

            <h2 className="mt-8 text-3xl font-semibold text-white">
              No bills found
            </h2>

            <p className="mt-4 text-zinc-500">
              Add bills from your
              homes to view complete
              billing history here.
            </p>
          </div>
        </section>
      )}

      {/* Bills Grid */}
      {bills.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <House className="h-4 w-4" />

                    <span className="text-sm">
                      {bill.home.name}
                    </span>
                  </div>

                  <h2 className="mt-4 text-4xl font-semibold text-white">
                    ₹{bill.amount}
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    {bill.month}/
                    {bill.year}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <EditBillModal
                    bill={bill}
                  />

                  <DeleteBillButton
                    billId={bill.id}
                  />
                </div>
              </div>

              {/* Usage */}
              <div className="mt-8 flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-cyan-300" />

                  <span className="text-zinc-300">
                    Usage
                  </span>
                </div>

                <span className="text-lg font-semibold text-white">
                  {bill.unitsConsumed}{" "}
                  kWh
                </span>
              </div>

              {/* Readings */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-zinc-500">
                    Previous
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {
                      bill.previousReading
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-zinc-500">
                    Current
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {
                      bill.currentReading
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}