import { lang } from "next/root-params";
import { notFound } from "next/navigation";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const locales: Locale[] = ["fr", "en"];
export const defaultLocale: Locale = "fr";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};

export const getDictionaryByLocale = async (locale: string) => {
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};
