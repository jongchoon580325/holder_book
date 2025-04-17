import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-white">
          Money Book
        </h1>
        <p className="text-xl text-gray-400">
          당신의 재정을 스마트하게 관리하세요
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href="/transaction/input"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            거래 입력하기
          </a>
          <a
            href="/statistics"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            통계 보기
          </a>
        </div>
      </div>
    </main>
  );
}
