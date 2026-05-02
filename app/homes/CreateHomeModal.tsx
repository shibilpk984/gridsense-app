"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { createHome } from "@/app/actions/homes";

const initialState = {
  error: "",
  success: false,
};

export default function CreateHomeModal() {
  const [mounted, setMounted] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [state, formAction, pending] =
    useActionState(
      createHome,
      initialState
    );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  // Prevent SSR mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-medium text-black transition-all hover:scale-[1.02]"
      >
        <Plus className="h-5 w-5" />

        Create Home
      </button>

      {/* Modal Portal */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            {/* Modal */}
            <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0B0C] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
              {/* Glow */}
              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[240px] w-[240px] rounded-full bg-cyan-500/10 blur-[120px]" />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-semibold tracking-tight text-white">
                    Create Home
                  </h2>

                  <p className="mt-3 max-w-sm text-zinc-500">
                    Add a property for
                    electricity tracking,
                    analytics, and smart
                    energy monitoring.
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
                {/* Home Name */}
                <div>
                  <label className="mb-3 block text-sm text-zinc-400">
                    Home Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Lakeview Apartment"
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
                    placeholder="Kerala, India"
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
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-medium text-black transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      Creating Home...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />

                      Create Home
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}