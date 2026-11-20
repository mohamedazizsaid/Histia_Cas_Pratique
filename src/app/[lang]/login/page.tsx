import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { LoginPageClient } from "./LoginPageClient";

async function LoginContent({
  params,
}: {
  params: PageProps<"/[lang]/login">["params"];
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <LoginPageClient lang={lang} dict={dict} />;
}

export default function LoginPage({
  params,
}: PageProps<"/[lang]/login">) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginContent params={params} />
    </Suspense>
  );
}

