'use client';

import { Suspense } from 'react';
import PageHeader from '@/components/common/PageHeader';

export default function TransactionSettings() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-cyan-900 via-cyan-800 to-gray-800 text-white p-6">
      <div className="container mx-auto">
        <PageHeader 
          title="거래 설정" 
          description="거래 내역 관리를 위한 설정을 구성하세요."
        />
        {/* 추후 설정 옵션 구현 */}
      </div>
    </main>
  );
} 