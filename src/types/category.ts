export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  type: CategoryType;
  section: string;    // 관
  category: string;   // 항
  subcategory: string; // 목
} 