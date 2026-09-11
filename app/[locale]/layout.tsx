import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ESimProvider } from "@/context/ESimContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AnalyticsInjector, { AnalyticsHeadInjector } from "@/components/global/AnalyticsInjector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soovia eSIM | Instant International eSIM Data",
  description: "Fast international eSIM data with zero roaming fees. Activate instantly and stay connected in 190+ countries worldwide.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <AnalyticsHeadInjector />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AnalyticsInjector />
        <NextIntlClientProvider messages={messages}>
          <ESimProvider>{children}</ESimProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
