import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Holder",
  description: "Your Personal Finance Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} antialiased bg-gray-900 text-white`}>
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-start">
              <div className="text-gray-300 font-semibold">SMART HOLDER BOOK</div>
            </div>
          </div>
        </nav>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
