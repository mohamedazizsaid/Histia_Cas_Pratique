import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { ForgotPasswordClient } from "./ForgotPasswordClient";

export default async function ForgotPasswordPage({
  params,
}: PageProps<"/[lang]/forgot-password">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <ForgotPasswordClient lang={lang} dict={dict} />;
}
