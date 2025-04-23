'use client';

import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-gray-300 font-semibold hover:text-white transition-colors"
          >
            SMART HOLDER BOOK
          </Link>
        </div>
      </div>
    </nav>
  );
} 