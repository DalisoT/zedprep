import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZedPrep — Get your students ECZ-ready",
  description:
    "The first revision platform built around the Zambian syllabus. AI-marked past papers, simulated exams, and weekly WhatsApp updates for parents.",
  keywords: [
    "Zambia",
    "ECZ",
    "revision",
    "past papers",
    "Form 3",
    "Form 4",
    "Form 5",
    "exam prep",
    "education",
  ],
  openGraph: {
    title: "ZedPrep — Get your students ECZ-ready",
    description:
      "The first revision platform built around the Zambian syllabus. AI-marked past papers, simulated exams, and weekly WhatsApp updates for parents.",
    type: "website",
    locale: "en_ZM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
