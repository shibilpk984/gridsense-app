"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type CreateHomeState = {
  error?: string;
  success?: boolean;
};

export async function createHome(
  prevState: CreateHomeState,
  formData: FormData
): Promise<CreateHomeState> {
  try {
    const user = await getCurrentUser();

    // Secure auth validation
    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const name = formData
      .get("name")
      ?.toString()
      .trim();

    const location = formData
      .get("location")
      ?.toString()
      .trim();

    // Validation
    if (!name || name.length < 2) {
      return {
        error:
          "Home name must be at least 2 characters",
      };
    }

    if (name.length > 50) {
      return {
        error:
          "Home name is too long",
      };
    }

    if (
      location &&
      location.length > 100
    ) {
      return {
        error:
          "Location is too long",
      };
    }

    // Create home securely
    await prisma.home.create({
      data: {
        name,
        location,
        userId: user.id,
      },
    });

    // Refresh homes page
    revalidatePath("/homes");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        "Failed to create home",
    };
  }
}