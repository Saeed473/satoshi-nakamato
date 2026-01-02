"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import InitProducts from "@/components/InitProducts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          {/* Fetch products once */}
          <InitProducts />

          {/* Header only for non-admin */}
          {!isAdminRoute && <Header />}

          {children}

          {/* Footer only for non-admin */}
          {!isAdminRoute && <Footer />}
        </ReduxProvider>
      </body>
    </html>
  );
}
