import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary, hasLocale } from "../dictionaries";
import { DashboardClient } from "./DashboardClient";

export const instant = false;

export default async function DashboardPage({
  params,
}: PageProps<"/[lang]/dashboard">) {
  await connection();
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Server-side auth check — this page must not be accessible without a session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${lang}/login`);
  }

  const dict = await getDictionary(lang);

  return (
    <DashboardClient
      lang={lang}
      dict={dict.dashboard}
      email={session.user.email}
      name={session.user.name}
    />
  );
}
