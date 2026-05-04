"use client";

import { Trash2 } from "lucide-react";

import { deleteBill } from "@/app/actions/deleteBill";

type Props = {
  billId: string;
};

export default function DeleteBillButton({
  billId,
}: Props) {
  async function handleDelete() {
    const confirmed =
      confirm(
        "Delete this bill?"
      );

    if (!confirmed) {
      return;
    }

    await deleteBill(billId);

    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/10 text-red-300 transition-all hover:bg-red-500/20"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}