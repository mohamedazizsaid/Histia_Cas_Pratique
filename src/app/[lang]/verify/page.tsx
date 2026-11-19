import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { VerifyPageClient } from "./VerifyPageClient";

export default async function VerifyPage({
  params,
}: PageProps<"/[lang]/verify">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <VerifyPageClient lang={lang} dict={dict} />;
}
