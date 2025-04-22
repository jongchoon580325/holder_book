'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { CategoryTabs } from '@/components/settings/CategoryTabs';
import { Toast } from '@/components/common/Toast';
import { parseCSV, validateTransactionData, validateCategoryData, exportToCSV } from '@/utils/csvHandler';
import { formatDateForFilename } from '@/utils/dateFormatter';
import { categoryDB, transactionDB } from '@/utils/indexedDB';
import { useState } from 'react';
import { Category } from '@/types/category';
import { Transaction } from '@/types/transaction';

export default function SettingsPage() {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleImportTransactions = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const data = await parseCSV(file);
        if (!validateTransactionData(data)) {
          showToast('CSV 파일 형식이 올바르지 않습니다.', 'error');
          return;
        }

        // 거래내역 데이터 저장
        for (const item of data) {
          const transaction: Transaction = {
            id: crypto.randomUUID(),
            date: item.date,
            type: item.type,
            section: item.section,
            category: item.category,
            subcategory: item.subcategory || '',
            amount: parseFloat(String(item.amount).replace(/,/g, '')),
            memo: item.memo || ''
          };
          await transactionDB.addTransaction(transaction);
        }

        showToast('거래내역을 성공적으로 가져왔습니다.', 'success');
        
        // 거래목록 테이블 새로고침
        window.dispatchEvent(new CustomEvent('transactionUpdate'));
        
      } catch (error) {
        console.error('거래내역 가져오기 실패:', error);
        showToast('거래내역 가져오기에 실패했습니다.', 'error');
      }
    };
    input.click();
  };

  const handleExportTransactions = async () => {
    try {
      // IndexedDB에서 모든 거래내역 가져오기
      const transactions = await transactionDB.getAllTransactions();
      
      // 파일명 생성
      const dateStr = formatDateForFilename();
      const filename = `${dateStr}-거래내역_내보내기.csv`;
      
      // 거래내역이 없는 경우에도 빈 데이터로 CSV 생성
      const exportData = transactions.length > 0 
        ? transactions.map(transaction => ({
            date: transaction.date || '',
            type: transaction.type || 'expense',
            section: transaction.section || '',
            category: transaction.category || '',
            subcategory: transaction.subcategory || '',
            amount: typeof transaction.amount === 'number' ? transaction.amount : 0,
            memo: transaction.memo || ''
          }))
        : []; // 빈 배열 전달

      // CSV 파일 생성 및 다운로드
      exportToCSV(exportData, filename, false);
      showToast('거래내역을 성공적으로 내보냈습니다.', 'success');
      
    } catch (error) {
      console.error('거래내역 내보내기 실패:', error);
      showToast('거래내역 내보내기에 실패했습니다.', 'error');
    }
  };

  const handleImportCategories = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const data = await parseCSV(file);
        if (!validateCategoryData(data)) {
          showToast('CSV 파일 형식이 올바르지 않습니다.', 'error');
          return;
        }

        // 카테고리 데이터 저장
        for (const item of data) {
          const category: Category = {
            id: crypto.randomUUID(),
            type: item.type,
            section: item.section,
            category: item.category,
            subcategory: item.subcategory || '',
            order: parseInt(item.order) || 0
          };
          await categoryDB.addCategory(category);
        }

        showToast('카테고리를 성공적으로 가져왔습니다.', 'success');
        
        // 카테고리 테이블 새로고침
        window.dispatchEvent(new CustomEvent('categoryUpdate'));
        
      } catch (error) {
        console.error('카테고리 가져오기 실패:', error);
        showToast('카테고리 가져오기에 실패했습니다.', 'error');
      }
    };
    input.click();
  };

  const handleExportCategories = async () => {
    try {
      const categories = await categoryDB.getAllCategories();
      const dateStr = formatDateForFilename();
      const filename = `${dateStr}-카테고리_내보내기.csv`;
      exportToCSV(categories, filename, true);
      showToast('카테고리를 성공적으로 내보냈습니다.', 'success');
    } catch (error) {
      console.error('카테고리 내보내기 실패:', error);
      showToast('카테고리 내보내기에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="거래 설정" description="거래와 관련된 설정을 관리합니다." />
        <hr className="my-8 border-gray-700" />
        
        {/* 2:1 Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section (2/3) */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold mb-6 text-white">카테고리 관리</h2>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
              <CategoryTabs />
            </div>
          </div>

          {/* Right Section (1/3) */}
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-3xl font-bold mb-6 text-white">관리 설정</h2>
            
            {/* Data Management Section */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">데이터 관리</h3>
              
              {/* 거래내역 데이터 관리 */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3 text-white">거래내역 데이터</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleImportTransactions}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    <span>가져오기</span>
                    <span className="text-xs ml-1">(CSV)</span>
                  </button>
                  <button 
                    onClick={handleExportTransactions}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                  >
                    <span>내보내기</span>
                    <span className="text-xs ml-1">(CSV)</span>
                  </button>
                </div>
              </div>

              {/* 카테고리 데이터 관리 */}
              <div>
                <h4 className="text-lg font-medium mb-3 text-white">카테고리 데이터</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleImportCategories}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    <span>가져오기</span>
                    <span className="text-xs ml-1">(CSV)</span>
                  </button>
                  <button 
                    onClick={handleExportCategories}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                  >
                    <span>내보내기</span>
                    <span className="text-xs ml-1">(CSV)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Password Management Section */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">비밀번호 관리</h3>
              <div className="space-y-4">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  비밀번호 변경
                </button>
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  비밀번호 초기화
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type as 'success' | 'error'} 
          onClose={() => setToast({ show: false, message: '', type: '' })} 
        />
      )}
    </div>
  );
} 