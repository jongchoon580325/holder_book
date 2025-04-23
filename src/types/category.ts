export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Category {
  id: number;
  type: CategoryType;
  section: string;    // 관
  category: string;   // 항
  subcategory: string; // 목
  order: number;
}

export interface CategoryFormData {
  type: CategoryType;
  section: string;
  category: string;
  subcategory: string;
} 