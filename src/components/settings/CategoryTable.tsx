'use client';

import { useState, useEffect } from 'react';
import { Category, CategoryType } from '@/types/category';
import { categoryDB } from '@/utils/indexedDB';
import ConfirmModal from '../common/ConfirmModal';
import Toast from '../common/Toast';

interface CategoryTableProps {
  type: CategoryType;
  categories: Category[];
  onUpdate: () => void;
}

export default function CategoryTable({ type, categories, onUpdate }: CategoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    section: '',
    category: '',
    subcategory: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const pageOptions = [10, 20, 30];
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (toast) {
      setToast(null);
      setTimeout(() => setToast({ message, type }), 100);
    } else {
      setToast({ message, type });
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (toast) {
      timeoutId = setTimeout(() => setToast(null), 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [toast]);

  const validateForm = () => {
    if (!formData.section.trim()) {
      setError('관을 입력해주세요.');
      return false;
    }
    if (!formData.category.trim()) {
      setError('항을 입력해주세요.');
      return false;
    }
    if (!formData.subcategory.trim()) {
      setError('목을 입력해주세요.');
      return false;
    }
    return true;
  };

  const isDuplicate = (newCategory: Omit<Category, 'id'>) => {
    return categories.some(
      (cat) =>
        cat.type === newCategory.type &&
        cat.section.trim() === newCategory.section.trim() &&
        cat.category.trim() === newCategory.category.trim() &&
        cat.subcategory.trim() === newCategory.subcategory.trim()
    );
  };

  const handleAdd = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const newCategory = {
        type,
        section: formData.section.trim(),
        category: formData.category.trim(),
        subcategory: formData.subcategory.trim(),
      };

      if (isDuplicate(newCategory)) {
        setError('이미 존재하는 카테고리입니다.');
        setIsSubmitting(false);
        return;
      }

      const categoryToAdd: Category = {
        ...newCategory,
        id: crypto.randomUUID(),
      };

      await categoryDB.addCategory(categoryToAdd);
      setFormData({ section: '', category: '', subcategory: '' });
      showToast('카테고리가 추가되었습니다.', 'success');
      await onUpdate();
    } catch (error) {
      console.error('카테고리 추가 실패:', error);
      showToast('카테고리 추가에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      section: category.section,
      category: category.category,
      subcategory: category.subcategory,
    });
  };

  const handleSave = async (id: string) => {
    if (!formData.section || !formData.category || !formData.subcategory) {
      return;
    }

    await categoryDB.updateCategory({
      id,
      type,
      ...formData,
    });
    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await categoryDB.deleteCategory(deleteId);
      setDeleteId(null);
      onUpdate();
    }
  };

  const inputClassName = "bg-gray-700 border-gray-600 text-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const buttonClassName = {
    edit: "text-indigo-400 hover:text-indigo-300 font-medium",
    save: "text-green-400 hover:text-green-300 font-medium",
    delete: "text-red-400 hover:text-red-300 font-medium",
    cancel: "text-gray-400 hover:text-gray-300 font-medium",
    add: "text-emerald-400 hover:text-emerald-300 font-medium"
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // 페이지 크기가 변경되면 첫 페이지로 이동
  };

  return (
    <div className="mt-4">
      <div className="mb-4 bg-gray-700/30 rounded-lg p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="text-lg text-gray-300">
              {type === 'income' ? '수입' : '지출'}
            </div>
            <div>
              <input
                type="text"
                className={`${inputClassName} ${error && !formData.section.trim() ? 'border-red-500' : ''}`}
                value={formData.section}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, section: e.target.value });
                }}
                onKeyDown={handleKeyPress}
                placeholder="관 입력"
              />
            </div>
            <div>
              <input
                type="text"
                className={`${inputClassName} ${error && !formData.category.trim() ? 'border-red-500' : ''}`}
                value={formData.category}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, category: e.target.value });
                }}
                onKeyDown={handleKeyPress}
                placeholder="항 입력"
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                className={`${inputClassName} ${error && !formData.subcategory.trim() ? 'border-red-500' : ''}`}
                value={formData.subcategory}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, subcategory: e.target.value });
                }}
                onKeyDown={handleKeyPress}
                placeholder="목 입력"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className={`${buttonClassName.add} whitespace-nowrap ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-red-400 text-sm">
              {error}
            </div>
          )}
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-200 uppercase tracking-wider">유형</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-200 uppercase tracking-wider">관</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-200 uppercase tracking-wider">항</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-200 uppercase tracking-wider">목</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-200 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {currentCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-300">
                  {type === 'income' ? '수입' : '지출'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-300">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      className={inputClassName}
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    />
                  ) : (
                    category.section
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-300">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      className={inputClassName}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  ) : (
                    category.category
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-300">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      className={inputClassName}
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  ) : (
                    category.subcategory
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium space-x-4">
                  {editingId === category.id ? (
                    <>
                      <button
                        onClick={() => handleSave(category.id)}
                        className={buttonClassName.save}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className={buttonClassName.cancel}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(category)}
                        className={buttonClassName.edit}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className={buttonClassName.delete}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between bg-gray-700/30 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">페이지당 항목:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="bg-gray-700 text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {pageOptions.map((option) => (
              <option key={option} value={option}>
                {option}개
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {'<<'}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {'<'}
          </button>

          <span className="text-gray-200">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages || totalPages === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {'>'}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages || totalPages === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {'>>'}
          </button>
        </div>

        <div className="text-gray-300">
          총 {categories.length}개 항목
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="카테고리 삭제"
        message="이 카테고리를 삭제하시겠습니까?"
      />
    </div>
  );
} 