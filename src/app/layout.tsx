import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/QueryClientProvider/queryClientProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xbanka",
  description: "Xbanka internal ERP",
  icons: {
    icon: "/xBankaLogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
        position="top-right"
          richColors  // enables built-in colors
          expand      // expands stacked toasts
          closeButton // adds a close button
        />
      </body>
    </html>
    </QueryProvider>
  );
}
