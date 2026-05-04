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
    const user =
      await getCurrentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const bill =
      await prisma.bill.findFirst({
        where: {
          id: billId,

          meter: {
            home: {
              userId:
                user.id,
            },
          },
        },

        include: {
          meter: true,
        },
      });

    if (!bill) {
      return {
        error:
          "Bill not found",
      };
    }

    const previousReading =
      Number(
        formData.get(
          "previousReading"
        )
      );

    const currentReading =
      Number(
        formData.get(
          "currentReading"
        )
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
      currentReading <=
      previousReading
    ) {
      return {
        error:
          "Current reading must be greater",
      };
    }

    const existingBill =
      await prisma.bill.findFirst({
        where: {
          meterId:
            bill.meterId,

          month,
          year,

          NOT: {
            id: bill.id,
          },
        },
      });

    if (existingBill) {
      return {
        error:
          "Bill already exists for this month",
      };
    }

    const unitsConsumed =
      currentReading -
      previousReading;

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
      `/main/homes/${bill.meter.homeId}/meters/${bill.meterId}`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        "Failed to update bill",
    };
  }
}