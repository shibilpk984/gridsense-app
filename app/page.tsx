import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (session) {
    redirect("/main/dashboard");
  } else {
    redirect("/login");
  }
}