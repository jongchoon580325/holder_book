import React from 'react';
import { Template } from '../registry/types';
import EditablePageTemplate from '../pages/EditablePageTemplate';
import Link from 'next/link';

const DarkTemplate: Template = {
  metadata: {
    id: 'dark-template',
    name: 'Dark Mode Template',
    description: 'A modern dark mode template with scroll to top functionality',
    category: 'general',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  component: EditablePageTemplate,
  defaultProps: {
    title: "우리집 스마트 가계부",
    description: "Your Personal Finance Partner",
    header: (
      <>
        <div className="bg-gray-900 py-1">
          <div className="container mx-auto px-4">
            <p className="text-sm text-gray-400 text-center">우리집 스마트 가계부</p>
          </div>
        </div>
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                SMART HOLDER BOOK
              </Link>
              <div className="space-x-4">
                <Link href="/transaction/input" className="text-gray-300 hover:text-white">거래관리</Link>
                <Link href="#" className="text-gray-300 hover:text-white">통계분석</Link>
                <Link href="#" className="text-gray-300 hover:text-white">데이터관리</Link>
                <Link href="#" className="text-gray-300 hover:text-white">로그인</Link>
              </div>
            </div>
          </div>
        </nav>
      </>
    ),
    footer: (
      <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-300">
            Smart Holder - Your Personal Finance Partner | Built with ❤️ by Najongchoon | Contact: najongchoon@gmail.com
          </p>
        </div>
      </footer>
    ),
    className: "min-h-screen bg-gray-900 flex flex-col"
  }
};

export default DarkTemplate; 