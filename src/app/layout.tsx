// Root layout: minimal shell. The [lang] segment layout handles html/body.
// This file exists so Next.js has a valid root layout for routes outside [lang]
// (like /code and /email).

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stolos",
  description: "Stolos — Authentication",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
