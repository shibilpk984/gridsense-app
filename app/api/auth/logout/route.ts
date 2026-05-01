import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const sessionToken =
      cookieStore.get("session")?.value;

    // Delete session from DB
    if (sessionToken) {
      await prisma.session.deleteMany({
        where: {
          token: sessionToken,
        },
      });
    }

    // Remove cookie
    cookieStore.delete("session");

    return NextResponse.json({
      message: "Logged out",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}