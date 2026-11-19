import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { ResetPasswordClient } from "./ResetPasswordClient";

export default async function ResetPasswordPage({
  params,
}: PageProps<"/[lang]/reset-password">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <ResetPasswordClient lang={lang} dict={dict} />;
}
