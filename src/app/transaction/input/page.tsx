'use client';

import PageHeader from '@/components/common/PageHeader';

export default function TransactionInput() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="거래 입력" 
        description="수입과 지출 내역을 입력하고 관리하세요."
      />
    </div>
  );
} 