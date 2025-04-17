'use client';

import PageHeader from '@/components/common/PageHeader';

export default function TransactionInput() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-900 via-blue-800 to-gray-800 text-white p-6">
      <div className="container mx-auto">
        <PageHeader 
          title="거래 입력" 
          description="수입과 지출 내역을 입력하고 관리하세요."
        />
        {/* 추후 거래 입력 폼 구현 */}
      </div>
    </main>
  );
} 