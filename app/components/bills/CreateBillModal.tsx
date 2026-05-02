"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FileText,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { createBill } from "@/app/actions/bills";

type Props = {
  meterId: string;
};

const initialState = {
  error: "",
  success: false,
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CreateBillModal({
  meterId,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const currentDate =
    new Date();

  const currentMonth =
    currentDate.getMonth() +
    1;

  const currentYear =
    currentDate.getFullYear();

  const action = useMemo(() => {
    return createBill.bind(
      null,
      meterId
    );
  }, [meterId]);

  const [state, formAction, pending] =
    useActionState(
      action,
      initialState
    );

  useEffect(() => {
    if (state.success) {
      setOpen(false);

      window.location.reload();
    }
  }, [state.success]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 font-medium text-black transition-all duration-200 hover:scale-[1.02]"
      >
        <Plus className="h-5 w-5" />

        Add Bill
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0f0f10] shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 px-8 py-7">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Add Bill
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Enter electricity
                  bill details.
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-white/10 bg-[#171717] p-2.5 text-zinc-400 transition-colors hover:bg-[#1d1d1d] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              action={formAction}
              className="grid gap-5 p-8 md:grid-cols-2"
            >
              {/* Previous Reading */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Previous Reading
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="previousReading"
                  required
                  placeholder="0"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-4 text-white outline-none transition-all focus:border-white/20"
                />
              </div>

              {/* Current Reading */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Current Reading
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="currentReading"
                  required
                  placeholder="0"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-4 text-white outline-none transition-all focus:border-white/20"
                />
              </div>

              {/* Bill Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Bill Amount
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  required
                  placeholder="₹0"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-4 text-white outline-none transition-all focus:border-white/20"
                />
              </div>

              {/* Bill Month */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Bill Month
                </label>

                <div className="grid grid-cols-[1fr_120px] gap-3">
                  {/* Month */}
                  <select
                    name="month"
                    defaultValue={
                      currentMonth
                    }
                    className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white outline-none transition-all focus:border-white/20"
                  >
                    {months.map(
                      (
                        month,
                        index
                      ) => (
                        <option
                          key={
                            month
                          }
                          value={
                            index +
                            1
                          }
                        >
                          {month}
                        </option>
                      )
                    )}
                  </select>

                  {/* Year */}
                  <input
                    type="number"
                    name="year"
                    required
                    defaultValue={
                      currentYear
                    }
                    placeholder="2026"
                    className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white outline-none transition-all focus:border-white/20"
                  />
                </div>
              </div>

              {/* Hidden Bill Date */}
              <input
                type="hidden"
                name="billDate"
                value={new Date()
                  .toISOString()
                  .split("T")[0]}
              />

              {/* Error */}
              {state.error && (
                <div className="md:col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                className="md:col-span-2 mt-2 flex h-12 items-center justify-center gap-3 rounded-xl bg-white font-medium text-black transition-all duration-200 hover:bg-zinc-200 disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />

                    Saving Bill...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />

                    Add Bill
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}