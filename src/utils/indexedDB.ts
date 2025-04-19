import { Category } from '@/types/category';

class CategoryDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'moneyBookDB';
  private readonly storeName = 'categories';
  private readonly version = 4; // 버전 업데이트

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('DB 연결 실패'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('order', 'order', { unique: false });
        } else {
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          if (transaction) {
            const store = transaction.objectStore(this.storeName);
            if (!store.indexNames.contains('order')) {
              store.createIndex('order', 'order', { unique: false });
            }
          }
        }
      };
    });
  }

  async addCategory(category: Category): Promise<void> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      // 현재 최대 order 값을 찾아서 새 카테고리의 order를 설정
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        const newCategory = { ...category, order: countRequest.result };
        const request = store.add(newCategory);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('카테고리 추가 실패'));
      };
    });
  }

  async updateCategory(category: Category): Promise<void> {
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const updatedCategory = {
          ...category,
          section: category.section.trim(),
          category: category.category.trim(),
          subcategory: category.subcategory.trim()
        };

        const request = store.put(updatedCategory);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('카테고리 수정 실패'));
      } catch (error) {
        reject(error);
      }
    });
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
    await this.ensureConnection();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.index('order').getAll(); // order 인덱스로 정렬하여 가져오기

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('카테고리 목록 조회 실패'));
      };
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.db) {
      await this.connect();
    }
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error('DB 초기화 실패:', event);
        reject(event);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('order', 'order', { unique: false });
        } else {
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          if (transaction) {
            const store = transaction.objectStore(this.storeName);
            if (!store.indexNames.contains('order')) {
              store.createIndex('order', 'order', { unique: false });
            }
          }
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
    });
  }
}

export const categoryDB = new CategoryDB(); 