"use client";

import { Trash2 } from "lucide-react";

import { deleteHome } from "@/app/actions/home-details";

type Props = {
  homeId: string;
};

export default function DeleteHomeButton({
  homeId,
}: Props) {
  async function handleDelete() {
    const confirmed =
      confirm(
        "Delete this home permanently?"
      );

    if (!confirmed) {
      return;
    }

    await deleteHome(homeId);
  }

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300 transition hover:bg-red-500/20"
    >
      <Trash2 className="h-5 w-5" />

      Delete Home
    </button>
  );
}