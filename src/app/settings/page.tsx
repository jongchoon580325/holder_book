'use client';

import { PageHeader } from '@/components/common/PageHeader';

export default function SettingsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="거래설정" 
          description="거래와 관련된 설정을 관리할 수 있습니다."
        />
      </div>
    </main>
  );
} 