'use client';

import { PageHeader } from '@/components/common/PageHeader';
import CategoryTabs from '@/components/settings/CategoryTabs';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="거래 설정" description="거래와 관련된 설정을 관리합니다." />
        <hr className="my-8 border-gray-700" />
        <h2 className="text-3xl font-bold mb-6 text-white">카테고리 관리</h2>
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
          <CategoryTabs />
        </div>
      </div>
    </div>
  );
} 