import { redirect } from "next/navigation";
import { hasLocale } from "./dictionaries";

export default async function LangIndexPage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "fr";
  redirect(`/${locale}/login`);
}
