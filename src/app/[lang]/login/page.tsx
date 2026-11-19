import { notFound } from "next/navigation";
import { getDictionaryByLocale, hasLocale } from "../dictionaries";
import { LoginPageClient } from "./LoginPageClient";

export default async function LoginPage({
  params,
}: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionaryByLocale(lang);

  return <LoginPageClient lang={lang} dict={dict} />;
}
