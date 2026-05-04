"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { updateBill } from "@/app/actions/updateBill";

type Props = {
  bill: {
    id: string;
    previousReading: number;
    currentReading: number;
    amount: number;
    month: number;
    year: number;
  };
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

export default function EditBillModal({
  bill,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const action = useMemo(() => {
    return updateBill.bind(
      null,
      bill.id
    );
  }, [bill.id]);

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
        onClick={() =>
          setOpen(true)
        }
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 transition-all hover:bg-white/[0.06]"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0f0f10]">
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <h2 className="text-2xl font-semibold text-white">
                Edit Bill
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-white/10 bg-[#171717] p-2 text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={formAction}
              className="grid gap-5 p-8 md:grid-cols-2"
            >
              <input
                type="number"
                name="previousReading"
                defaultValue={
                  bill.previousReading
                }
                required
                className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white"
              />

              <input
                type="number"
                name="currentReading"
                defaultValue={
                  bill.currentReading
                }
                required
                className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white"
              />

              <input
                type="number"
                name="amount"
                defaultValue={
                  bill.amount
                }
                required
                className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white"
              />

              <div className="grid grid-cols-[1fr_120px] gap-3">
                <select
                  name="month"
                  defaultValue={
                    bill.month
                  }
                  className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white"
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

                <input
                  type="number"
                  name="year"
                  defaultValue={
                    bill.year
                  }
                  required
                  className="h-12 rounded-xl border border-white/10 bg-[#151515] px-4 text-white"
                />
              </div>

              {state.error && (
                <div className="md:col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="md:col-span-2 flex h-12 items-center justify-center gap-3 rounded-xl bg-white font-medium text-black"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
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