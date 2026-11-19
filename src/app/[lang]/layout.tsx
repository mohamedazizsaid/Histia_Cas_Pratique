import { notFound } from "next/navigation";
import { hasLocale } from "./dictionaries";
import { QueryProvider } from "@/providers/QueryProvider";

export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  return <QueryProvider>{children}</QueryProvider>;
}
