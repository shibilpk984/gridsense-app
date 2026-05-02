"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function logout() {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("session")?.value;

  // Delete DB session
  if (sessionToken) {
    await prisma.session.deleteMany({
      where: {
        token: sessionToken,
      },
    });
  }

  // Delete cookie
  cookieStore.delete("session");

  redirect("/login");
}