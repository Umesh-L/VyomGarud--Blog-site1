import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getCategories } from "@/lib/strapi";
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
  title: "VyomGarud Systems — Mission Log",
  description:
    "VyomGarud designs military-grade UAV and drone systems—this mission log shares reliability intelligence, precision engineering updates, and autonomy breakthroughs.",
  icons: {
    icon: "/icons/VYOMGARUD.jpg",
    shortcut: "/icons/VYOMGARUD.jpg",
    apple: "/icons/VYOMGARUD.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="bg-grid flex min-h-screen flex-col">
            <SiteHeader categories={categories} />
            <main className="flex-1 pb-16 pt-10">{children}</main>
            <SiteFooter categories={categories} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
