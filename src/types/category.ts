export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  type: CategoryType;
  section: string;    // 관
  category: string;   // 항
  subcategory: string; // 목
}

export interface CategoryFormData {
  type: CategoryType;
  section: string;
  category: string;
  subcategory: string;
} 