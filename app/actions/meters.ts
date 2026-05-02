"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type State = {
  error?: string;
  success?: boolean;
};

export async function createMeter(
  homeId: string,
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
    const home =
      await prisma.home.findFirst({
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

    const meterNumber =
      formData
        .get("meterNumber")
        ?.toString()
        .trim();

    const nickname = formData
      .get("nickname")
      ?.toString()
      .trim();

    // Validation
    if (
      !meterNumber ||
      meterNumber.length < 3
    ) {
      return {
        error:
          "Meter number must be at least 3 characters",
      };
    }

    // Prevent duplicate meters
    const existing =
      await prisma.meter.findFirst({
        where: {
          meterNumber,
        },
      });

    if (existing) {
      return {
        error:
          "Meter already exists",
      };
    }

    await prisma.meter.create({
      data: {
        meterNumber,
        nickname,
        homeId: home.id,
      },
    });

    revalidatePath(
      `/homes/${homeId}`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        "Failed to create meter",
    };
  }
}