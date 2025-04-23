'use client';

import { useState, useEffect } from 'react';
import { NewTransaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { categoryDB } from '@/utils/indexedDB';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSave: (transaction: NewTransaction) => void;
}

export default function TransactionForm({ type, onSave }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    section: '',
    category: '',
    subcategory: '',
    memo: ''
  });

  // 카테고리 상태 관리
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<string[]>([]);

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await categoryDB.getAllCategories();
        const typeCategories = allCategories.filter(cat => cat.type === type);
        setCategories(typeCategories);
        
        // 관(section) 목록 추출
        const uniqueSections = Array.from(new Set(typeCategories.map(cat => cat.section)));
        setSections(uniqueSections);
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      }
    };
    
    loadCategories();
  }, [type]);

  // 선택된 관(section)에 따른 항(category) 목록 업데이트
  useEffect(() => {
    if (formData.section) {
      const filteredCategories = categories.filter(cat => cat.section === formData.section);
      const uniqueCategories = Array.from(new Set(filteredCategories.map(cat => cat.category)));
      setCategoryOptions(uniqueCategories);
      setFormData(prev => ({ ...prev, category: '', subcategory: '' }));
    } else {
      setCategoryOptions([]);
    }
  }, [formData.section, categories]);

  // 선택된 항(category)에 따른 목(subcategory) 목록 업데이트
  useEffect(() => {
    if (formData.section && formData.category) {
      const filteredSubcategories = categories.filter(
        cat => cat.section === formData.section && cat.category === formData.category
      );
      const uniqueSubcategories = Array.from(new Set(filteredSubcategories.map(cat => cat.subcategory)));
      setSubcategoryOptions(uniqueSubcategories);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    } else {
      setSubcategoryOptions([]);
    }
  }, [formData.section, formData.category, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    
    if (!amount || !formData.section || !formData.category || !formData.subcategory) {
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }

    onSave({
      amount,
      type,
      date: formData.date,
      section: formData.section,
      category: formData.category,
      subcategory: formData.subcategory,
      memo: formData.memo
    });

    // 폼 초기화
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      section: '',
      category: '',
      subcategory: '',
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
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            required
          >
            <option value="">선택하세요</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">항</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            required
            disabled={!formData.section}
          >
            <option value="">선택하세요</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">목</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:outline-none focus:border-white/40"
            required
            disabled={!formData.category}
          >
            <option value="">선택하세요</option>
            {subcategoryOptions.map(subcategory => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
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