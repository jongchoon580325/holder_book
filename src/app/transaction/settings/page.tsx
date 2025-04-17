'use client';

import { Suspense, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';

function SettingsContent() {
  return (
    <div className="mt-8 space-y-6">
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">기본 설정</h2>
        {/* 설정 컨텐츠는 추후 구현 */}
      </section>
    </div>
  );
}

export default function TransactionSettings() {
  useEffect(() => {
    const cleanup = () => {
      // 클린업 로직
    };
    return cleanup;
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="거래 설정" 
        description="거래 내역 관리를 위한 설정을 구성하세요."
      />
      <Suspense fallback={<div>로딩 중...</div>}>
        <SettingsContent />
      </Suspense>
    </div>
  );
} 