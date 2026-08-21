import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 7;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password required",
        },
        { status: 400 }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const isValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isValid) {
      return NextResponse.json(
        {
          error:
            "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const sessionToken =
      `${crypto.randomUUID()}${crypto.randomUUID()}`;

    const expiresAt = new Date(
      Date.now() +
        SESSION_DURATION_SECONDS * 1000
    );

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore =
      await cookies();

    cookieStore.set(
      "session",
      sessionToken,
      {
        httpOnly: true,

        // HTTPS production only
        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          SESSION_DURATION_SECONDS,
      }
    );

    return NextResponse.json({
      message:
        "Login successful",
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}