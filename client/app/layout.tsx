import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibmplexsans"
});

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Steam Worth",
  description: "Discover the value of your Steam account with accurate pricing estimates. Track your game inventory and calculate your account's worth effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${ibmPlexSans.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <main className="flex-grow" suppressHydrationWarning={true}>{children}</main>
        <footer className="mt-auto">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
