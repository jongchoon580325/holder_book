'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-[#bebec2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-[#41416e] hover:text-[#41416e]/80">
                스마트 재무관리
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link 
              href="/transaction/input"
              className={`${
                isActive('/transaction/input')
                  ? 'text-[#41416e] border-b-2 border-[#41416e]'
                  : 'text-[#41416e]/80 hover:text-[#41416e]'
              } px-3 py-2 text-sm font-medium`}
            >
              거래입력
            </Link>
            <Link 
              href="/transaction/statistics"
              className={`${
                isActive('/transaction/statistics')
                  ? 'text-[#41416e] border-b-2 border-[#41416e]'
                  : 'text-[#41416e]/80 hover:text-[#41416e]'
              } px-3 py-2 text-sm font-medium`}
            >
              거래통계
            </Link>
            <Link 
              href="/transaction/settings"
              className={`${
                isActive('/transaction/settings')
                  ? 'text-[#41416e] border-b-2 border-[#41416e]'
                  : 'text-[#41416e]/80 hover:text-[#41416e]'
              } px-3 py-2 text-sm font-medium`}
            >
              거래설정
            </Link>
            <button
              className="bg-[#41416e] hover:bg-[#41416e]/80 text-[#ebf0ec] px-4 py-2 rounded-md text-sm font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 