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
  X,
} from "lucide-react";

import { updateHome } from "@/app/actions/home-details";

type Props = {
  homeId: string;
  currentName: string;
  currentLocation: string;
};

const initialState = {
  error: "",
  success: false,
};

export default function EditHomeModal({
  homeId,
  currentName,
  currentLocation,
}: Props) {
  const [open, setOpen] =
    useState(false);

  // Bind action with homeId
  const action = useMemo(() => {
    return updateHome.bind(
      null,
      homeId
    );
  }, [homeId]);

  const [state, formAction, pending] =
    useActionState(
      action,
      initialState
    );

  // Close modal after successful save
  useEffect(() => {
    if (state.success) {
      setOpen(false);

      // Force refresh visually
      window.location.reload();
    }
  }, [state.success]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white transition hover:border-cyan-500/20"
      >
        <Pencil className="h-5 w-5" />

        Edit Home
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0B0C] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            {/* Glow */}
            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[240px] w-[240px] rounded-full bg-cyan-500/10 blur-[120px]" />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-6">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-white">
                  Edit Home
                </h2>

                <p className="mt-3 max-w-sm text-zinc-500">
                  Update your home
                  information and
                  property details.
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              action={formAction}
              className="relative mt-10 space-y-6"
            >
              {/* Name */}
              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Home Name
                </label>

                <input
                  type="text"
                  name="name"
                  defaultValue={
                    currentName
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500/40"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  defaultValue={
                    currentLocation
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500/40"
                />
              </div>

              {/* Error */}
              {state.error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </div>
              )}

              {/* Success */}
              {state.success && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  Home updated successfully
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-medium text-black transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />

                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Pencil className="h-5 w-5" />

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