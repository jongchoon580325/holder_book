import { FaWallet, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { BsPiggyBank } from 'react-icons/bs';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Section - Hero */}
          <div className="col-span-12 lg:col-span-5">
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="text-left">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Smart 가계부
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 mb-4">
                  Financial Management System
                </p>
                <p className="text-base lg:text-lg text-gray-400">
                  당신의 재정을 스마트하게 관리하고 미래를 계획하세요. 더 효율적인 자산 관리를 통해 재정적 자유를 경험하세요.
                </p>
              </div>

              {/* Security Section */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <RiShieldKeyholeLine className="text-3xl text-blue-500" />
                  <h2 className="text-xl font-semibold">보안 접속</h2>
                </div>
                <div>
                  <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                    <input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm">
                    로그인
                  </button>
                  <p className="text-gray-500 text-xs text-center mt-3">
                    안전한 접속을 위해 비밀번호를 타인에게 공유하지 마세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Features Grid */}
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* 지출 관리 */}
              <Link href="/transaction/input" className="group flex">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full flex flex-col justify-between">
                  <div>
                    <div className="text-blue-500 mb-3 text-3xl group-hover:scale-110 transition-transform duration-300">
                      <FaWallet />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">지출 관리</h3>
                  </div>
                  <p className="text-gray-400 text-sm">일별, 월별 지출을 한눈에 관리하세요</p>
                </div>
              </Link>

              {/* 통계 분석 */}
              <Link href="/transaction/statistics" className="group flex">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full flex flex-col justify-between">
                  <div>
                    <div className="text-blue-500 mb-3 text-3xl group-hover:scale-110 transition-transform duration-300">
                      <FaChartLine />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">통계 분석</h3>
                  </div>
                  <p className="text-gray-400 text-sm">소비 패턴을 그래프로 분석하세요</p>
                </div>
              </Link>

              {/* 예산 계획 */}
              <Link href="/transaction/planning" className="group flex">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full flex flex-col justify-between">
                  <div>
                    <div className="text-blue-500 mb-3 text-3xl group-hover:scale-110 transition-transform duration-300">
                      <FaCalendarAlt />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">예산 계획</h3>
                  </div>
                  <p className="text-gray-400 text-sm">미래 예산을 계획하고 관리하세요</p>
                </div>
              </Link>

              {/* 자산 추적 */}
              <Link href="/transaction/assets" className="group flex">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full flex flex-col justify-between">
                  <div>
                    <div className="text-blue-500 mb-3 text-3xl group-hover:scale-110 transition-transform duration-300">
                      <BsPiggyBank />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">자산 추적</h3>
                  </div>
                  <p className="text-gray-400 text-sm">자산 현황을 실시간으로 추적하세요</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </main>
  );
}
