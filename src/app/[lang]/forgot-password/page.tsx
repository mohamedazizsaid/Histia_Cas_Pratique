import { notFound } from "next/navigation";
import { getDictionaryByLocale, hasLocale } from "../dictionaries";
import { ForgotPasswordClient } from "./ForgotPasswordClient";

export default async function ForgotPasswordPage({
  params,
}: PageProps<"/[lang]/forgot-password">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionaryByLocale(lang);

  return <ForgotPasswordClient lang={lang} dict={dict} />;
}
