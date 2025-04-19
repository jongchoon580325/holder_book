'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';

export default function TransactionStatistics() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="min-h-[calc(100vh-8rem)] bg-[#365749] text-white p-6">
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
    <main className="min-h-[calc(100vh-8rem)] bg-[#365749] text-white p-6">
      <div className="container mx-auto space-y-8">
        <PageHeader 
          title="거래 통계" 
          description="수입과 지출 내역을 다양한 차트로 분석해보세요."
        />

        {/* 통계 차트 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 월별 수입/지출 추이 */}
          <section className="bg-white/10 rounded-lg p-6 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-bold mb-6">월별 수입/지출 추이</h2>
            <div className="h-80 flex items-center justify-center border border-white/20 rounded">
              <p className="text-white/60">차트 구현 예정</p>
            </div>
          </section>

          {/* 카테고리별 지출 분포 */}
          <section className="bg-white/10 rounded-lg p-6 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-bold mb-6">카테고리별 지출 분포</h2>
            <div className="h-80 flex items-center justify-center border border-white/20 rounded">
              <p className="text-white/60">차트 구현 예정</p>
            </div>
          </section>

          {/* 일별 수입/지출 패턴 */}
          <section className="bg-white/10 rounded-lg p-6 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-bold mb-6">일별 수입/지출 패턴</h2>
            <div className="h-80 flex items-center justify-center border border-white/20 rounded">
              <p className="text-white/60">차트 구현 예정</p>
            </div>
          </section>

          {/* 예산 대비 실제 지출 */}
          <section className="bg-white/10 rounded-lg p-6 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-bold mb-6">예산 대비 실제 지출</h2>
            <div className="h-80 flex items-center justify-center border border-white/20 rounded">
              <p className="text-white/60">차트 구현 예정</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 