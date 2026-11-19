import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stolos",
  description: "Stolos — Authentication",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "fr";

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
