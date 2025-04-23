import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Navigation } from '@/components/Navigation';
import { initializeCategories } from '@/utils/categoryInitializer';

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
  // 앱 최초 실행 시 카테고리 초기화
  if (typeof window !== 'undefined') {
    initializeCategories().catch(console.error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background antialiased">
            <Navigation />
            <main>{children}</main>
            <ScrollToTop />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
