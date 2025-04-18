'use client';

import { useState } from 'react';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  subcategory: string;
  item: string;
  memo: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: (id: number, transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionTable({ transactions, onUpdate, onDelete }: TransactionTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Transaction | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingData({ ...transaction });
  };

  const handleEditChange = (field: keyof Transaction, value: string) => {
    if (!editingData) return;

    if (field === 'amount') {
      // 숫자만 추출하고 천단위 구분자 추가
      const numericValue = value.replace(/[^0-9]/g, '');
      const amount = numericValue ? parseInt(numericValue) : 0;
      setEditingData({ ...editingData, amount });
    } else {
      setEditingData({ ...editingData, [field]: value });
    }
  };

  const handleEditSave = () => {
    if (!editingData || !editingId) return;
    onUpdate(editingId, editingData);
    setEditingId(null);
    setEditingData(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingData(null);
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

  return (
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
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-white/10 hover:bg-white/5">
              {editingId === transaction.id ? (
                // 수정 모드
                <>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={editingData?.date || ''}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editingData?.type || ''}
                      onChange={(e) => handleEditChange('type', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20"
                    >
                      <option value="income">수입</option>
                      <option value="expense">지출</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editingData?.category || ''}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editingData?.subcategory || ''}
                      onChange={(e) => handleEditChange('subcategory', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editingData?.item || ''}
                      onChange={(e) => handleEditChange('item', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editingData?.amount.toLocaleString() || ''}
                      onChange={(e) => handleEditChange('amount', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20 text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editingData?.memo || ''}
                      onChange={(e) => handleEditChange('memo', e.target.value)}
                      className="w-full px-2 py-1 bg-white/10 rounded border border-white/20"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
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
                    </div>
                  </td>
                </>
              ) : (
                // 보기 모드
                <>
                  <td className="px-4 py-3">{transaction.date}</td>
                  <td className="px-4 py-3">
                    <span className={transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'}>
                      {transaction.type === 'income' ? '수입' : '지출'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{transaction.category}</td>
                  <td className="px-4 py-3">{transaction.subcategory}</td>
                  <td className="px-4 py-3">{transaction.item}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'}>
                      {transaction.amount.toLocaleString()}원
                    </span>
                  </td>
                  <td className="px-4 py-3">{transaction.memo}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
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
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">거래 삭제 확인</h3>
            <p className="mb-6">이 거래를 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 