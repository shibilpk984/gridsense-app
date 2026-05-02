"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type State = {
  error?: string;
  success?: boolean;
};

export async function updateHome(
  homeId: string,
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

    const name = formData
      .get("name")
      ?.toString()
      .trim();

    const location = formData
      .get("location")
      ?.toString()
      .trim();

    if (!name || name.length < 2) {
      return {
        error:
          "Name must be at least 2 characters",
      };
    }

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

    await prisma.home.update({
      where: {
        id: home.id,
      },
      data: {
        name,
        location,
      },
    });

    revalidatePath("/homes");
    revalidatePath(`/homes/${homeId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        "Failed to update home",
    };
  }
}

export async function deleteHome(
  homeId: string
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const home =
    await prisma.home.findFirst({
      where: {
        id: homeId,
        userId: user.id,
      },
    });

  if (!home) {
    throw new Error(
      "Home not found"
    );
  }

  await prisma.home.delete({
    where: {
      id: home.id,
    },
  });

  revalidatePath("/homes");

  redirect("/homes");
}