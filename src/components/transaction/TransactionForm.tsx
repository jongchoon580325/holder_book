'use client';

import { useState } from 'react';
import { NewTransaction } from '@/types/transaction';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSave: (transaction: NewTransaction) => void;
}

export default function TransactionForm({ type, onSave }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    subcategory: '',
    item: '',
    memo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // 숫자만 추출
      const numericValue = value.replace(/[^0-9]/g, '');
      // 천단위 구분자 추가
      const formattedValue = numericValue ? Number(numericValue).toLocaleString() : '';
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 천단위 구분자 제거하고 숫자로 변환
    const amount = Number(formData.amount.replace(/,/g, ''));
    
    if (!amount || !formData.category || !formData.subcategory || !formData.item) {
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }

    onSave({
      amount,
      type,
      date: formData.date,
      category: formData.category,
      subcategory: formData.subcategory,
      item: formData.item,
      memo: formData.memo
    });

    // 폼 초기화
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      subcategory: '',
      item: '',
      memo: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1단: 날짜, 유형, 금액 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">날짜</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">유형</label>
          <input
            type="text"
            value={type === 'income' ? '수입' : '지출'}
            disabled
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">금액</label>
          <div className="relative">
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
              placeholder="0"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70">원</span>
          </div>
        </div>
      </div>

      {/* 2단: 관, 항, 목, 메모 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">관</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            placeholder="관 입력"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">항</label>
          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            placeholder="항 입력"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">목</label>
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            placeholder="목 입력"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">메모</label>
          <input
            type="text"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            placeholder="메모 입력"
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
          type === 'income' 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        거래입력저장
      </button>
    </form>
  );
} 