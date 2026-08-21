"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type State = {
  error?: string;
  success?: boolean;
};

export async function updateBill(
  billId: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        home: {
          userId: user.id,
        },
      },
      include: {
        home: true,
      },
    });

    if (!bill) {
      return {
        error: "Bill not found",
      };
    }

    const previousReading = Number(
      formData.get("previousReading")
    );

    const currentReading = Number(
      formData.get("currentReading")
    );

    const amount = Number(
      formData.get("amount")
    );

    const month = Number(
      formData.get("month")
    );

    const year = Number(
      formData.get("year")
    );

    if (
      Number.isNaN(previousReading) ||
      Number.isNaN(currentReading) ||
      Number.isNaN(amount) ||
      Number.isNaN(month) ||
      Number.isNaN(year)
    ) {
      return {
        error: "Invalid bill values",
      };
    }

    if (
      previousReading < 0 ||
      currentReading < 0 ||
      amount < 0
    ) {
      return {
        error: "Values cannot be negative",
      };
    }

    if (currentReading <= previousReading) {
      return {
        error: "Current reading must be greater",
      };
    }

    const existingBill = await prisma.bill.findFirst({
      where: {
        homeId: bill.homeId,
        month,
        year,
        NOT: {
          id: bill.id,
        },
      },
    });

    if (existingBill) {
      return {
        error: "Bill already exists for this month",
      };
    }

    const unitsConsumed =
      currentReading - previousReading;

    await prisma.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        previousReading,
        currentReading,
        amount,
        month,
        year,
        unitsConsumed,
      },
    });

    revalidatePath(
      `/main/homes/${bill.homeId}`
    );

    revalidatePath("/main/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Failed to update bill",
    };
  }
}