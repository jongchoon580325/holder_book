import { Category } from '@/types/category';
import { Transaction } from '@/types/transaction';

const DB_VERSION = 9; // 버전 업데이트
const DB_NAME = 'moneyBookDB';
const STORES = {
  CATEGORIES: 'categories',
  TRANSACTIONS: 'transactions'
} as const;

interface CategoryWithCompositeKey extends Category {
  compositeKey?: string;
}

class CategoryDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = DB_NAME;
  private readonly storeName = STORES.CATEGORIES;
  private readonly version = DB_VERSION;
  private connecting: Promise<void> | null = null;
  private isInitialized = false;

  private generateCompositeKey(category: Category): string {
    const key = `${category.type}|${category.section.trim()}|${category.category.trim()}|${category.subcategory.trim()}`.toLowerCase();
    return key;
  }

  private isSameCategory(cat1: Category, cat2: Category): boolean {
    return (
      cat1.type === cat2.type &&
      cat1.section.trim().toLowerCase() === cat2.section.trim().toLowerCase() &&
      cat1.category.trim().toLowerCase() === cat2.category.trim().toLowerCase() &&
      cat1.subcategory.trim().toLowerCase() === cat2.subcategory.trim().toLowerCase()
    );
  }

  async connect(): Promise<void> {
    if (this.connecting) {
      return this.connecting;
    }

    if (this.db && this.isInitialized) {
      return Promise.resolve();
    }

    this.connecting = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = (event) => {
          const error = (event.target as IDBOpenDBRequest).error;
          console.error('IndexedDB connection failed:', error?.message || event);
          this.connecting = null;
          this.isInitialized = false;
          reject(new Error(`Failed to connect to IndexedDB: ${error?.message || 'Unknown error'}`));
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.connecting = null;
          this.isInitialized = true;
          
          this.db.onerror = (event) => {
            const target = event.target as IDBRequest;
            console.error('Database error:', target.error);
          };
          
          resolve();
        };

        request.onupgradeneeded = async (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const oldVersion = event.oldVersion;
          
          // 기존 데이터 백업
          let existingCategories: Category[] = [];
          let existingTransactions: Transaction[] = [];

          // 카테고리 데이터 백업
          if (oldVersion > 0 && db.objectStoreNames.contains(STORES.CATEGORIES)) {
            const transaction = (event.target as IDBOpenDBRequest).transaction;
            if (transaction) {
              const store = transaction.objectStore(STORES.CATEGORIES);
              existingCategories = await new Promise((resolve) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
              });
            }
            db.deleteObjectStore(STORES.CATEGORIES);
          }

          // 거래내역 데이터 백업
          if (oldVersion > 0 && db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
            const transaction = (event.target as IDBOpenDBRequest).transaction;
            if (transaction) {
              const store = transaction.objectStore(STORES.TRANSACTIONS);
              existingTransactions = await new Promise((resolve) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
              });
            }
            db.deleteObjectStore(STORES.TRANSACTIONS);
          }

          // 카테고리 스토어 생성
          const categoryStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
          categoryStore.createIndex('type', 'type', { unique: false });
          categoryStore.createIndex('order', 'order', { unique: false });
          console.log('Category store created successfully');

          // 거래내역 스토어 생성
          const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
          console.log('Transaction store created successfully');

          // 카테고리 데이터 복원
          if (existingCategories.length > 0) {
            const uniqueCategories = existingCategories.reduce((acc: Category[], curr) => {
              const isDuplicate = acc.some(cat => this.isSameCategory(cat, curr));
              if (!isDuplicate) {
                acc.push(curr);
              }
              return acc;
            }, []);

            uniqueCategories.forEach((category, index) => {
              const categoryWithOrder = {
                ...category,
                order: index
              };
              categoryStore.add(categoryWithOrder);
            });
          }

          // 거래내역 데이터 복원
          if (existingTransactions.length > 0) {
            existingTransactions.forEach(transaction => {
              transactionStore.add(transaction);
            });
          }
        };
      } catch (error) {
        console.error('Error during IndexedDB connection:', error);
        this.connecting = null;
        this.isInitialized = false;
        reject(error);
      }
    });

    return this.connecting;
  }

  async addCategory(category: Category): Promise<void> {
    try {
      await this.ensureConnection();
      
      if (!this.db || !this.isInitialized) {
        throw new Error('Database is not initialized');
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        transaction.onerror = (event) => {
          const error = (event.target as IDBTransaction).error;
          console.error('Transaction failed:', error?.message || event);
          reject(new Error(`Transaction failed: ${error?.message || 'Unknown error'}`));
        };

        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          const categories = getAllRequest.result || [];
          
          // 중복 체크
          const isDuplicate = categories.some(existingCat => {
            const isSame = this.isSameCategory(existingCat, category);
            if (isSame) {
              console.log('Duplicate found:', {
                existing: {
                  type: existingCat.type,
                  section: existingCat.section,
                  category: existingCat.category,
                  subcategory: existingCat.subcategory
                },
                new: {
                  type: category.type,
                  section: category.section,
                  category: category.category,
                  subcategory: category.subcategory
                }
              });
            }
            return isSame;
          });

          if (isDuplicate) {
            reject(new Error('이미 존재하는 카테고리입니다.'));
            return;
          }

          const maxOrder = categories.reduce((max, cat) => 
            Math.max(max, typeof cat.order === 'number' ? cat.order : -1), -1);

          const newCategory = {
            ...category,
            id: crypto.randomUUID(),
            order: maxOrder + 1,
            section: category.section.trim(),
            category: category.category.trim(),
            subcategory: category.subcategory.trim()
          };

          try {
            const addRequest = store.add(newCategory);
            
            addRequest.onsuccess = () => {
              console.log('Category added successfully:', {
                type: newCategory.type,
                section: newCategory.section,
                category: newCategory.category,
                subcategory: newCategory.subcategory,
                order: newCategory.order
              });
              resolve();
            };
            
            addRequest.onerror = (event) => {
              const error = (event.target as IDBRequest).error;
              console.error('Failed to add category:', error?.message || event);
              reject(new Error(`Failed to add category: ${error?.message || 'Unknown error'}`));
            };
          } catch (error) {
            console.error('Error during add request:', error);
            reject(error);
          }
        };

        getAllRequest.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          console.error('Failed to get categories:', error?.message || event);
          reject(new Error(`Failed to get categories: ${error?.message || 'Unknown error'}`));
        };
      });
    } catch (error) {
      console.error('Error during category addition:', error);
      throw error;
    }
  }

  async updateCategory(category: CategoryWithCompositeKey): Promise<void> {
    try {
      await this.ensureConnection();
      
      return new Promise((resolve, reject) => {
        if (!this.db || !this.isInitialized) {
          reject(new Error('Database is not initialized'));
          return;
        }

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const updatedCategory = {
          ...category,
          section: category.section.trim(),
          category: category.category.trim(),
          subcategory: category.subcategory.trim(),
          compositeKey: this.generateCompositeKey(category)
        };

        const request = store.put(updatedCategory);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          if (error?.name === 'ConstraintError') {
            reject(new Error('이미 존재하는 카테고리입니다.'));
          } else {
            console.error('Failed to update category:', error?.message || event);
            reject(new Error(`Failed to update category: ${error?.message || 'Unknown error'}`));
          }
        };
      });
    } catch (error) {
      console.error('Error during category update:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('카테고리 삭제 실패'));
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      await this.ensureConnection();
      
      return new Promise((resolve, reject) => {
        if (!this.db || !this.isInitialized) {
          reject(new Error('Database is not initialized'));
          return;
        }

        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.index('order').getAll();

        request.onsuccess = () => {
          const categories = request.result || [];
          // order가 없는 경우 인덱스를 order로 사용하고 정렬
          const sortedCategories = categories
            .map((cat, index) => ({
              ...cat,
              order: typeof cat.order === 'number' ? cat.order : index
            }))
            .sort((a, b) => a.order - b.order);
          
          console.log('Retrieved categories successfully:', sortedCategories.length);
          resolve(sortedCategories);
        };

        request.onerror = (event) => {
          console.error('Failed to get categories:', event);
          reject(new Error('Failed to get categories'));
        };
        
        transaction.onerror = (event) => {
          console.error('Transaction failed:', event);
          reject(new Error('Transaction failed'));
        };
      });
    } catch (error) {
      console.error('Error during categories retrieval:', error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.db || !this.isInitialized) {
      await this.connect();
    } else if (this.connecting) {
      await this.connecting;
    }
  }
}

class TransactionDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = DB_NAME;
  private readonly storeName = STORES.TRANSACTIONS;
  private readonly version = DB_VERSION;
  private connecting: Promise<void> | null = null;
  private isInitialized = false;

  async connect(): Promise<void> {
    if (this.connecting) {
      return this.connecting;
    }

    if (this.db && this.isInitialized) {
      return Promise.resolve();
    }

    this.connecting = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = (event) => {
          const error = (event.target as IDBOpenDBRequest).error;
          console.error('TransactionDB 연결 실패:', error?.message || event);
          this.connecting = null;
          this.isInitialized = false;
          reject(new Error(`TransactionDB 연결 실패: ${error?.message || 'Unknown error'}`));
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.connecting = null;
          this.isInitialized = true;
          
          this.db.onerror = (event) => {
            const target = event.target as IDBRequest;
            console.error('Database error:', target.error);
          };
          
          resolve();
        };

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // 기존 스토어가 있으면 삭제
          if (db.objectStoreNames.contains(this.storeName)) {
            db.deleteObjectStore(this.storeName);
          }
          
          // 새로운 스토어 생성
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          console.log('Transaction store created successfully');
        };
      } catch (error) {
        console.error('Error during TransactionDB connection:', error);
        this.connecting = null;
        this.isInitialized = false;
        reject(error);
      }
    });

    return this.connecting;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      await this.ensureConnection();
      
      if (!this.db || !this.isInitialized) {
        throw new Error('Database is not initialized');
      }

      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db!.transaction([this.storeName], 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.index('date').getAll();

          request.onsuccess = () => {
            const transactions = request.result || [];
            resolve(transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          };

          request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            console.error('Failed to get transactions:', error?.message || event);
            reject(new Error(`Failed to get transactions: ${error?.message || 'Unknown error'}`));
          };
          
          transaction.onerror = (event) => {
            const error = (event.target as IDBTransaction).error;
            console.error('Transaction failed:', error?.message || event);
            reject(new Error(`Transaction failed: ${error?.message || 'Unknown error'}`));
          };
        } catch (error) {
          console.error('Error during transaction creation:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Error during transactions retrieval:', error);
      throw error;
    }
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    try {
      await this.ensureConnection();
      
      if (!this.db || !this.isInitialized) {
        throw new Error('Database is not initialized');
      }

      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db!.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.add(transaction);

          request.onsuccess = () => resolve();
          
          request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            console.error('Failed to add transaction:', error?.message || event);
            reject(new Error(`Failed to add transaction: ${error?.message || 'Unknown error'}`));
          };
          
          transaction.onerror = (event) => {
            const error = (event.target as IDBTransaction).error;
            console.error('Transaction failed:', error?.message || event);
            reject(new Error(`Transaction failed: ${error?.message || 'Unknown error'}`));
          };
        } catch (error) {
          console.error('Error during transaction creation:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Error during transaction addition:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, transaction: Transaction): Promise<void> {
    try {
      await this.ensureConnection();
      
      if (!this.db || !this.isInitialized) {
        throw new Error('Database is not initialized');
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const request = store.put({ ...transaction, id });

        request.onsuccess = () => {
          console.log('Transaction updated successfully:', id);
          resolve();
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          console.error('Failed to update transaction:', error?.message || event);
          reject(new Error(`Failed to update transaction: ${error?.message || 'Unknown error'}`));
        };
      });
    } catch (error) {
      console.error('Error during transaction update:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      await this.ensureConnection();
      
      if (!this.db || !this.isInitialized) {
        throw new Error('Database is not initialized');
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const request = store.delete(id);

        request.onsuccess = () => {
          console.log('Transaction deleted successfully:', id);
          resolve();
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          console.error('Failed to delete transaction:', error?.message || event);
          reject(new Error(`Failed to delete transaction: ${error?.message || 'Unknown error'}`));
        };
      });
    } catch (error) {
      console.error('Error during transaction deletion:', error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.db || !this.isInitialized) {
      await this.connect();
    } else if (this.connecting) {
      await this.connecting;
    }
  }
}

export const categoryDB = new CategoryDB();
export const transactionDB = new TransactionDB(); 