export default function LogoutButton() {
  async function handleLogout() {
    "use server";

    const { cookies } = await import(
      "next/headers"
    );

    const { redirect } = await import(
      "next/navigation"
    );

    const { prisma } = await import(
      "@/lib/prisma"
    );

    const cookieStore = await cookies();

    const sessionToken =
      cookieStore.get("session")?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: {
          token: sessionToken,
        },
      });
    }

    cookieStore.delete("session");

    redirect("/login");
  }

  return (
    <form action={handleLogout}>
      <button className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white backdrop-blur-xl transition-all hover:border-red-500/30 hover:bg-red-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative z-10">
          Logout
        </span>
      </button>
    </form>
  );
}