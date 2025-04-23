'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { Category, CategoryType } from '@/types/category';
import { categoryDB } from '@/utils/indexedDB';
import CategoryTable from './CategoryTable';
import { classNames } from '@/utils/classNames';

export default function CategoryTabs() {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const allCategories = await categoryDB.getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-700/20 p-1">
        <Tab
          className={({ selected }) =>
            classNames(
              'w-full rounded-lg py-2.5 text-lg font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-100 hover:bg-white/[0.12] hover:text-white'
            )
          }
        >
          수입
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              'w-full rounded-lg py-2.5 text-lg font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-100 hover:bg-white/[0.12] hover:text-white'
            )
          }
        >
          지출
        </Tab>
      </Tab.List>
      <Tab.Panels className="mt-2">
        <Tab.Panel>
          <CategoryTable
            type={CategoryType.INCOME}
            categories={categories.filter((cat) => cat.type === CategoryType.INCOME)}
            onUpdate={loadCategories}
          />
        </Tab.Panel>
        <Tab.Panel>
          <CategoryTable
            type={CategoryType.EXPENSE}
            categories={categories.filter((cat) => cat.type === CategoryType.EXPENSE)}
            onUpdate={loadCategories}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
} 