import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'Money Book',
  description: 'Smart Personal Finance Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
