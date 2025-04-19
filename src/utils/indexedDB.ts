import { Category } from '@/types/category';

class CategoryDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'moneyBookDB';
  private readonly storeName = 'categories';
  private readonly version = 4; // 버전 업데이트
  private connecting: Promise<void> | null = null;

  async connect(): Promise<void> {
    // 이미 연결 중이면 해당 Promise를 반환
    if (this.connecting) {
      return this.connecting;
    }

    // 이미 연결되어 있으면 바로 반환
    if (this.db) {
      return Promise.resolve();
    }

    this.connecting = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = (event) => {
          console.error('DB 연결 실패:', event);
          this.connecting = null;
          reject(new Error('DB 연결 실패'));
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.connecting = null;
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
      } catch (error) {
        this.connecting = null;
        reject(error);
      }
    });

    return this.connecting;
  }

  async addCategory(category: Category): Promise<void> {
    try {
      await this.ensureConnection();
      
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('DB가 초기화되지 않았습니다.'));
          return;
        }

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        // 현재 최대 order 값을 찾아서 새 카테고리의 order를 설정
        const countRequest = store.count();
        
        countRequest.onsuccess = () => {
          const newCategory = { ...category, order: countRequest.result };
          const request = store.add(newCategory);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(new Error('카테고리 추가 실패'));
        };

        countRequest.onerror = () => reject(new Error('카테고리 수 조회 실패'));
        
        transaction.onerror = () => reject(new Error('트랜잭션 실패'));
      });
    } catch (error) {
      console.error('카테고리 추가 중 오류:', error);
      throw error;
    }
  }

  async updateCategory(category: Category): Promise<void> {
    try {
      await this.ensureConnection();
      
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('DB가 초기화되지 않았습니다.'));
          return;
        }

        const transaction = this.db.transaction([this.storeName], 'readwrite');
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
        
        transaction.onerror = () => reject(new Error('트랜잭션 실패'));
      });
    } catch (error) {
      console.error('카테고리 수정 중 오류:', error);
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
        if (!this.db) {
          reject(new Error('DB가 초기화되지 않았습니다.'));
          return;
        }

        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.index('order').getAll();

        request.onsuccess = () => {
          const categories = request.result || [];
          // order가 없는 경우 인덱스를 order로 사용
          const sortedCategories = categories.map((cat, index) => ({
            ...cat,
            order: cat.order ?? index
          }));
          resolve(sortedCategories);
        };

        request.onerror = () => reject(new Error('카테고리 목록 조회 실패'));
        transaction.onerror = () => reject(new Error('트랜잭션 실패'));
      });
    } catch (error) {
      console.error('카테고리 목록 조회 중 오류:', error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.db && !this.connecting) {
      await this.connect();
    } else if (this.connecting) {
      await this.connecting;
    }
  }
}

export const categoryDB = new CategoryDB(); 