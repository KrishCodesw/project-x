// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // We'll use Inter as a clean, default font
import "./globals.css";
import Navbar from "@/components/shared/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Starter Kit",
  description: "A battle-tested Next.js 16 starter kit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
