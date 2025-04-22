'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLinkClassName = (path: string) => {
    if (!mounted) return '';
    
    const isActive = pathname === path;
    return `text-lg font-medium relative
      ${isActive ? 'text-orange-500' : 'text-[#41416e]/80'} 
      hover:text-[#41416e] transition-colors duration-200
      after:content-[""] after:absolute after:left-0 after:bottom-[-4px] 
      after:w-full after:h-[2px] after:transition-transform after:duration-200
      ${isActive ? 'after:bg-orange-500 after:scale-x-100' : 'after:bg-orange-500 after:scale-x-0'}
      hover:after:scale-x-100`;
  };

  return (
    <nav className="bg-[#bebec2] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className={getLinkClassName('/')}
            >
              홈
            </Link>
            <Link 
              href="/transaction/input" 
              className={getLinkClassName('/transaction/input')}
            >
              거래입력
            </Link>
            <Link 
              href="/transaction/statistics" 
              className={getLinkClassName('/transaction/statistics')}
            >
              거래통계
            </Link>
            <Link 
              href="/settings" 
              className={getLinkClassName('/settings')}
            >
              거래설정
            </Link>
          </div>
          <button className="text-lg font-medium text-[#41416e]/80 hover:text-[#41416e] transition-colors duration-200">
            로그인
          </button>
        </div>
      </div>
    </nav>
  );
} 