"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function deleteBill(
  billId: string
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return;
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
      return;
    }

    await prisma.bill.delete({
      where: {
        id: bill.id,
      },
    });

    revalidatePath(
      `/main/homes/${bill.meter.homeId}/meters/${bill.meterId}`
    );
  } catch (error) {
    console.error(error);
  }
}