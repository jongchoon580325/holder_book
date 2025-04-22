'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { Category } from '@/types/category';
import { categoryDB } from '@/utils/indexedDB';
import CategoryTable from './CategoryTable';

export const CategoryTabs = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const allCategories = await categoryDB.getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-700/50 p-2">
          {['수입', '지출'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-lg font-medium leading-5 transition-all
                ${selected
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <CategoryTable
              type="income"
              categories={categories.filter((cat) => cat.type === 'income')}
              onUpdate={loadCategories}
            />
          </Tab.Panel>
          <Tab.Panel>
            <CategoryTable
              type="expense"
              categories={categories.filter((cat) => cat.type === 'expense')}
              onUpdate={loadCategories}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 