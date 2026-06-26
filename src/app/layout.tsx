import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "next-zero-rpc | Type-Safe Fetch for Next.js API Routes",
  description:
    "Type-safe fetch for Next.js App Router API routes with zero dependencies, zero lock-in, and precise error type narrowing. Four files. Full type safety. 1.8 KB runtime.",
  keywords: [
    "next.js",
    "rpc",
    "type-safe",
    "fetch",
    "api",
    "typescript",
    "app router",
    "error narrowing",
  ],
  authors: [{ name: "caocchinh" }],
  openGraph: {
    title: "next-zero-rpc | Type-Safe Fetch for Next.js API Routes",
    description:
      "Compile-time type-safe fetch for Next.js App Router API routes. Zero dependencies. Zero lock-in.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "next-zero-rpc | Type-Safe Fetch for Next.js API Routes",
    description: "Compile-time type-safe fetch for Next.js App Router API routes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
