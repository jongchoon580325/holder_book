import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Holder - Your Personal Finance Partner',
  description: 'Comprehensive solution for personal finance management',
};

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 