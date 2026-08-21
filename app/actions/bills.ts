"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type State = {
  error?: string;
  success?: boolean;
};

export async function createBill(
  homeId: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    // ----------------------------------------
    // 1. Authentication
    // ----------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    // ----------------------------------------
    // 2. Verify that the home belongs to user
    // ----------------------------------------

    const home = await prisma.home.findFirst({
      where: {
        id: homeId,
        userId: user.id,
      },
    });

    if (!home) {
      return {
        error: "Home not found",
      };
    }

    // ----------------------------------------
    // 3. Read form values
    // ----------------------------------------

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

    const billDateValue = formData
      .get("billDate")
      ?.toString()
      .trim();

    // ----------------------------------------
    // 4. Validate required values
    // ----------------------------------------

    if (
      !Number.isFinite(previousReading) ||
      !Number.isFinite(currentReading) ||
      !Number.isFinite(amount) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year) ||
      !billDateValue
    ) {
      return {
        error: "Invalid bill values",
      };
    }

    // ----------------------------------------
    // 5. Validate ranges
    // ----------------------------------------

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
        error:
          "Current reading must be greater than previous reading",
      };
    }

    if (month < 1 || month > 12) {
      return {
        error: "Invalid month",
      };
    }

    if (year < 2000 || year > 2100) {
      return {
        error: "Invalid year",
      };
    }

    // ----------------------------------------
    // 6. Validate bill date
    // ----------------------------------------

    const billDate = new Date(billDateValue);

    if (Number.isNaN(billDate.getTime())) {
      return {
        error: "Invalid bill date",
      };
    }

    // ----------------------------------------
    // 7. Calculate consumption
    // ----------------------------------------

    const unitsConsumed =
      currentReading - previousReading;

    // ----------------------------------------
    // 8. Prevent duplicate bill
    // ----------------------------------------

    const existingBill =
      await prisma.bill.findFirst({
        where: {
          homeId,
          month,
          year,
        },
      });

    if (existingBill) {
      return {
        error:
          "A bill for this month already exists",
      };
    }

    // ----------------------------------------
    // 9. Create bill
    // ----------------------------------------

    await prisma.bill.create({
      data: {
        homeId,

        previousReading,
        currentReading,

        unitsConsumed,

        amount,

        month,
        year,

        billDate,
      },
    });

    // ----------------------------------------
    // 10. Revalidate affected pages
    // ----------------------------------------

    revalidatePath(
      `/main/homes/${homeId}`
    );

    revalidatePath(
      "/main/dashboard"
    );

    revalidatePath(
      "/main/bills"
    );

    revalidatePath(
      "/main/analytics"
    );

    // ----------------------------------------
    // 11. Success
    // ----------------------------------------

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "createBill error:",
      error
    );

    return {
      error: "Failed to create bill",
    };
  }
}