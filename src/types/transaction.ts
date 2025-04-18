export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  subcategory: string;
  item: string;
  memo: string;
}

export interface NewTransaction extends Omit<Transaction, 'id'> {
  id?: number;
} 