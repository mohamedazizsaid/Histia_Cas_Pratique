import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { hasLocale } from "./dictionaries";
import { QueryProvider } from "@/providers/QueryProvider";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stolos",
  description: "Stolos — Authentication",
};

export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
