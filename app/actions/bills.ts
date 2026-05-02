"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type State = {
  error?: string;
  success?: boolean;
};

export async function createBill(
  meterId: string,
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

    // Verify ownership
    const meter =
      await prisma.meter.findFirst({
        where: {
          id: meterId,

          home: {
            userId: user.id,
          },
        },

        include: {
          home: true,
        },
      });

    if (!meter) {
      return {
        error: "Meter not found",
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

    const billDate =
      formData
        .get("billDate")
        ?.toString() || "";

    // Validation
    if (
      currentReading <=
      previousReading
    ) {
      return {
        error:
          "Current reading must be greater than previous reading",
      };
    }

    const unitsConsumed =
      currentReading -
      previousReading;

    await prisma.bill.create({
      data: {
        meterId: meter.id,

        previousReading,
        currentReading,

        unitsConsumed,
        amount,

        month,
        year,

        billDate:
          new Date(billDate),
      },
    });

    revalidatePath(
      `/homes/${meter.homeId}/meters/${meter.id}`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        "Failed to create bill",
    };
  }
}