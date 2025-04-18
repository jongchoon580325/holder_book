'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';

export default function TransactionStatistics() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="min-h-[calc(100vh-8rem)] bg-[#5b4d6e] text-white p-6">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-2/4 mb-8"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[#5b4d6e] text-white p-6">
      <div className="container mx-auto space-y-8">
        <PageHeader 
          title="거래 통계" 
          description="수입과 지출 내역을 다양한 차트와 통계로 분석하세요."
        />
        
        {/* 통계 섹션 */}
        <section className="bg-[#6d5a80]/40 rounded-lg p-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-6">통계 차트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">수입/지출 비율</h3>
              <div className="h-64 flex items-center justify-center text-white/50">
                차트 구현 예정
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">카테고리별 지출</h3>
              <div className="h-64 flex items-center justify-center text-white/50">
                차트 구현 예정
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 