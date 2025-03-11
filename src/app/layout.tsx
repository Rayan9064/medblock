import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header1 } from "./components/ui/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedBlock - Decentralized Medical Report Tracking",
  description: "MedBlock is a secure and decentralized platform for medical report tracking, powered by blockchain technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWalletProvider>
            <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header1 />
              <main className="flex-1 pt-22"> {/* Adjust pt-16 based on your navbar height */}
              {children}
              </main>
            </div>
            </ThemeProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
