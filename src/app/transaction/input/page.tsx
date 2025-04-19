'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import TransactionForm from '@/components/transaction/TransactionForm';
import TransactionTable from '@/components/transaction/TransactionTable';
import { Transaction, NewTransaction } from '@/types/transaction';

export default function TransactionInput() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveTransaction = (transaction: NewTransaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleUpdateTransaction = (id: number, updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...updatedTransaction, id } : t)
    );
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // 클라이언트 사이드 렌더링 전에는 로딩 상태 표시
  if (!isClient) {
    return (
      <main className="min-h-[calc(100vh-8rem)] bg-[#17195c] text-white p-6">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-2/4 mb-8"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[#17195c] text-white p-6">
      <div className="container mx-auto space-y-8">
        <PageHeader 
          title="거래 입력" 
          description="수입과 지출 내역을 입력하고 관리하세요."
        />
        
        {/* 신규거래입력 섹션 */}
        <section className="bg-[#232882]/40 rounded-lg p-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-6">신규거래입력</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 수입거래입력 */}
            <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4">수입거래입력</h3>
              <TransactionForm 
                type="income"
                onSave={handleSaveTransaction}
              />
            </div>
            
            {/* 지출거래입력 */}
            <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/20">
              <h3 className="text-xl font-semibold mb-4">지출거래입력</h3>
              <TransactionForm 
                type="expense"
                onSave={handleSaveTransaction}
              />
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="border-t-2 border-dotted border-white/20" />

        {/* 거래목록현황 섹션 */}
        <section className="bg-[#1d2170]/40 rounded-lg p-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-6">거래목록현황</h2>
          <TransactionTable 
            transactions={transactions}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </section>
      </div>
    </main>
  );
} 