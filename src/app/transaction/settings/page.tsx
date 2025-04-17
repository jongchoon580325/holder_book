'use client';

import { Suspense } from 'react';
import PageHeader from '@/components/common/PageHeader';

export default function TransactionSettings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="거래 설정" 
        description="거래 내역 관리를 위한 설정을 구성하세요."
      />
    </div>
  );
} 