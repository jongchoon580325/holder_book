'use client';

import PageHeader from '@/components/common/PageHeader';

export default function TransactionStatistics() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[#5b4d6e] text-white p-6">
      <div className="container mx-auto">
        <PageHeader 
          title="거래 통계" 
          description="수입과 지출 내역을 다양한 차트와 통계로 분석하세요."
        />
        {/* 추후 통계 차트 구현 */}
      </div>
    </main>
  );
} 