import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionaryByLocale, hasLocale } from "../dictionaries";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage({
  params,
}: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Server-side auth check — this page must not be accessible without a session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${lang}/login`);
  }

  const dict = await getDictionaryByLocale(lang);

  return (
    <DashboardClient
      lang={lang}
      dict={dict.dashboard}
      email={session.user.email}
      name={session.user.name}
    />
  );
}
