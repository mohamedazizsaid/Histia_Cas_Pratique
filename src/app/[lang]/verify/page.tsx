import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { VerifyPageClient } from "./VerifyPageClient";

export default async function VerifyPage({
  params,
}: PageProps<"/[lang]/verify">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerifyPageClient lang={lang} dict={dict} />
    </Suspense>
  );
}
