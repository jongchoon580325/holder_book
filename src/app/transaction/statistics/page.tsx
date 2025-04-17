'use client';

import PageHeader from '@/components/common/PageHeader';

export default function TransactionStatistics() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="거래 통계" 
        description="수입과 지출 내역을 다양한 차트와 통계로 분석하세요."
      />
    </div>
  );
} 