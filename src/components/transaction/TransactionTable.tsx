'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import DailyAmountTooltip from './DailyAmountTooltip';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, transaction: Transaction) => Promise<void>;
}

export default function TransactionTable({ transactions, onDelete, onUpdate }: TransactionTableProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // 날짜별 거래 데이터 계산
  const dailyTransactions = useMemo(() => {
    const dailyData = new Map<string, { income: number; expense: number; firstIndex: number }>();
    
    transactions.forEach((transaction, index) => {
      const current = dailyData.get(transaction.date) || { 
        income: 0, 
        expense: 0, 
        firstIndex: index 
      };
      
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'income') {
        current.income += amount;
      } else {
        current.expense += amount;
      }
      
      if (!dailyData.has(transaction.date)) {
        current.firstIndex = index;
      }
      
      dailyData.set(transaction.date, current);
    });
    
    return dailyData;
  }, [transactions]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 현재 페이지에서 각 날짜의 첫 번째 인덱스 계산
  const pageFirstIndices = useMemo(() => {
    const indices = new Set<number>();
    paginatedTransactions.forEach((transaction, index) => {
      const dailyData = dailyTransactions.get(transaction.date);
      if (dailyData && dailyData.firstIndex === transactions.indexOf(transaction)) {
        indices.add(index);
      }
    });
    return indices;
  }, [paginatedTransactions, dailyTransactions, transactions]);

  // 행의 위치에 따른 툴팁 위치 결정
  const getTooltipPosition = (index: number): 'top' | 'middle' | 'bottom' => {
    if (index === 0) return 'top';
    if (index === paginatedTransactions.length - 1) return 'bottom';
    return 'middle';
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction) {
      onDelete(selectedTransaction.id);
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    // 깊은 복사를 통해 원본 데이터의 참조를 끊습니다
    setEditingTransaction(JSON.parse(JSON.stringify(transaction)));
  };

  const handleEditChange = (field: keyof Transaction, value: string | number) => {
    if (!editingTransaction) return;

    setEditingTransaction(prev => {
      if (!prev) return null;

      const updated = { ...prev };

      switch (field) {
        case 'amount':
          // 숫자와 쉼표만 남기고 제거
          const numericValue = value.toString().replace(/[^0-9,]/g, '');
          // 쉼표 제거 후 숫자로 변환
          const numberValue = Number(numericValue.replace(/,/g, ''));
          updated.amount = isNaN(numberValue) ? 0 : numberValue;
          break;
        case 'type':
          updated.type = value as 'income' | 'expense';
          break;
        case 'date':
        case 'section':
        case 'category':
        case 'subcategory':
        case 'memo':
          updated[field] = value.toString();
          break;
        case 'id':
          // id는 수정하지 않음
          break;
      }

      return updated;
    });
  };

  const handleEditSave = async () => {
    if (!editingTransaction) return;

    try {
      // 필수 필드 검증
      const requiredFields: (keyof Transaction)[] = ['date', 'type', 'section', 'category', 'subcategory', 'amount'];
      const missingFields = requiredFields.filter(field => !editingTransaction[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
      }

      // 금액이 유효한 숫자인지 확인
      if (typeof editingTransaction.amount !== 'number' || isNaN(editingTransaction.amount)) {
        throw new Error('유효하지 않은 금액입니다.');
      }

      // 원본 트랜잭션 찾기
      const originalTransaction = transactions.find(t => t.id === editingTransaction.id);
      if (!originalTransaction) {
        throw new Error('수정할 거래를 찾을 수 없습니다.');
      }

      // 업데이트할 데이터 준비
      const updateData: Transaction = {
        ...originalTransaction,
        ...editingTransaction,
        amount: Number(editingTransaction.amount),
        // id는 원본 값을 유지
        id: originalTransaction.id
      };

      // 업데이트 수행
      await onUpdate(updateData.id, updateData);
      setEditingTransaction(null);
    } catch (error) {
      console.error('거래 수정 실패:', error);
      alert(error instanceof Error ? error.message : '거래 수정에 실패했습니다.');
    }
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-4">
      {/* 페이지당 항목 수 선택 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm">페이지당 항목:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-white/10 rounded border border-white/20"
          >
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={30}>30개</option>
          </select>
        </div>
        <div className="text-sm">
          총 {transactions.length}건의 거래내역
        </div>
      </div>

      {/* 거래내역 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="px-4 py-3 text-left">날짜</th>
              <th className="px-4 py-3 text-left">유형</th>
              <th className="px-4 py-3 text-left">관</th>
              <th className="px-4 py-3 text-left">항</th>
              <th className="px-4 py-3 text-left">목</th>
              <th className="px-4 py-3 text-right">금액</th>
              <th className="px-4 py-3 text-left">메모</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="border-t border-white/10 hover:bg-white/5">
                <td 
                  className="px-4 py-3 relative group cursor-help"
                  onMouseEnter={() => setHoveredDate(transaction.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {editingTransaction?.id === transaction.id ? (
                    <input
                      type="date"
                      value={editingTransaction.date}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                    />
                  ) : (
                    <div className="relative">
                      {transaction.date}
                      {hoveredDate === transaction.date && pageFirstIndices.has(index) && (
                        <DailyAmountTooltip
                          date={transaction.date}
                          income={dailyTransactions.get(transaction.date)!.income}
                          expense={dailyTransactions.get(transaction.date)!.expense}
                          position={getTooltipPosition(index)}
                        />
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingTransaction?.id === transaction.id ? (
                    <select
                      value={editingTransaction.type}
                      onChange={(e) => handleEditChange('type', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                    >
                      <option value="income">수입</option>
                      <option value="expense">지출</option>
                    </select>
                  ) : (
                    <span className={transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'}>
                      {transaction.type === 'income' ? '수입' : '지출'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingTransaction?.id === transaction.id ? (
                    <input
                      type="text"
                      value={editingTransaction.section}
                      onChange={(e) => handleEditChange('section', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                    />
                  ) : transaction.section}
                </td>
                <td className="px-4 py-3">
                  {editingTransaction?.id === transaction.id ? (
                    <input
                      type="text"
                      value={editingTransaction.category}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                    />
                  ) : transaction.category}
                </td>
                <td className="px-4 py-3">
                  {editingTransaction?.id === transaction.id ? (
                    <input
                      type="text"
                      value={editingTransaction.subcategory}
                      onChange={(e) => handleEditChange('subcategory', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                    />
                  ) : transaction.subcategory}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingTransaction?.id === transaction.id ? (
                    <input
                      type="text"
                      value={editingTransaction.amount.toLocaleString()}
                      onChange={(e) => handleEditChange('amount', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded text-right"
                    />
                  ) : (
                    <span className={transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'}>
                      {Number(transaction.amount).toLocaleString()}원
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingTransaction?.id === transaction.id ? (
                    <input
                      type="text"
                      value={editingTransaction.memo || ''}
                      onChange={(e) => handleEditChange('memo', e.target.value)}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                    />
                  ) : transaction.memo}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center space-x-2">
                    {editingTransaction?.id === transaction.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-2 py-1 bg-gray-500/20 hover:bg-gray-500/30 rounded text-sm"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 컨트롤 */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white/10 rounded disabled:opacity-50"
        >
          처음
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white/10 rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-white/10 rounded disabled:opacity-50"
        >
          다음
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-white/10 rounded disabled:opacity-50"
        >
          마지막
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
} 