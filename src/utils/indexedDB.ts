import { Category } from '@/types/category';

class CategoryDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'moneyBookDB';
  private readonly storeName = 'categories';
  private readonly version = 3;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('type', 'type', { unique: false });
          
          // 기본 카테고리 데이터 추가
          const defaultCategories = [
            // 수입 카테고리
            { type: 'INCOME', section: '근로소득', category: '급여', subcategory: '정기급여' },
            { type: 'INCOME', section: '사업소득', category: '자영업', subcategory: '순수익' },
            { type: 'INCOME', section: '기타소득', category: '투자', subcategory: '배당금' },
            
            // 지출 카테고리
            { type: 'EXPENSE', section: '생활비', category: '식비', subcategory: '식료품' },
            { type: 'EXPENSE', section: '주거비', category: '관리비', subcategory: '월세' },
            { type: 'EXPENSE', section: '교통비', category: '대중교통', subcategory: '버스/지하철' }
          ];

          defaultCategories.forEach(category => {
            store.add(category);
          });
        }
      };
    });
  }

  async getAllCategories(): Promise<Category[]> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<number> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(category);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async updateCategory(category: Category): Promise<void> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(category);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.db) {
      await this.connect();
    }
  }
}

export const categoryDB = new CategoryDB(); 