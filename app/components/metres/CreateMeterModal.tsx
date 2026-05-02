"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Gauge,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { createMeter } from "@/app/actions/meters";

type Props = {
  homeId: string;
};

const initialState = {
  error: "",
  success: false,
};

export default function CreateMeterModal({
  homeId,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const action = useMemo(() => {
    return createMeter.bind(
      null,
      homeId
    );
  }, [homeId]);

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
        className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-medium text-black transition-all hover:scale-[1.02]"
      >
        <Plus className="h-5 w-5" />

        Add Meter
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0B0C] p-8 shadow-2xl">
            {/* Glow */}
            <div className="absolute right-[-100px] top-[-100px] h-[240px] w-[240px] rounded-full bg-cyan-500/10 blur-[120px]" />

            {/* Header */}
            <div className="relative flex items-start justify-between">
              <div>
                <h2 className="text-4xl font-semibold text-white">
                  Add Meter
                </h2>

                <p className="mt-3 text-zinc-500">
                  Connect a new
                  electricity meter to this
                  home.
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              action={formAction}
              className="mt-10 space-y-6"
            >
              {/* Meter Number */}
              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Meter Number
                </label>

                <input
                  type="text"
                  name="meterNumber"
                  required
                  placeholder="KSEB-847392"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500/40"
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Nickname
                </label>

                <input
                  type="text"
                  name="nickname"
                  placeholder="Main Floor Meter"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500/40"
                />
              </div>

              {/* Error */}
              {state.error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-medium text-black disabled:opacity-50"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />

                    Adding Meter...
                  </>
                ) : (
                  <>
                    <Gauge className="h-5 w-5" />

                    Add Meter
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