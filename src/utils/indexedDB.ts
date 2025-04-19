import { Category } from '@/types/category';

const DB_NAME = 'moneyBookDB';
const DB_VERSION = 3;
const CATEGORY_STORE = 'categories';

export class CategoryDB {
  private db: IDBDatabase | null = null;

  async init() {
    if (this.db) return;

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (db.objectStoreNames.contains(CATEGORY_STORE)) {
          db.deleteObjectStore(CATEGORY_STORE);
        }

        const store = db.createObjectStore(CATEGORY_STORE, { 
          keyPath: 'id',
          autoIncrement: false
        });

        store.createIndex('uniqueComposite', 
          ['type', 'section', 'category', 'subcategory'], 
          { unique: true }
        );
      };
    });
  }

  async addCategory(category: Category): Promise<string> {
    await this.init();

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([CATEGORY_STORE], 'readwrite');
        const store = transaction.objectStore(CATEGORY_STORE);
        
        const index = store.index('uniqueComposite');
        const checkRequest = index.get([
          category.type,
          category.section.trim(),
          category.category.trim(),
          category.subcategory.trim()
        ]);

        checkRequest.onsuccess = () => {
          if (checkRequest.result) {
            reject(new Error('이미 존재하는 카테고리입니다.'));
            return;
          }

          const newCategory = {
            ...category,
            id: crypto.randomUUID(),
            section: category.section.trim(),
            category: category.category.trim(),
            subcategory: category.subcategory.trim()
          };

          const addRequest = store.add(newCategory);
          
          addRequest.onsuccess = () => resolve(newCategory.id);
          addRequest.onerror = () => reject(new Error('카테고리 추가 실패'));
        };

        checkRequest.onerror = () => reject(new Error('중복 체크 실패'));
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateCategory(category: Category): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([CATEGORY_STORE], 'readwrite');
        const store = transaction.objectStore(CATEGORY_STORE);
        
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
    await this.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([CATEGORY_STORE], 'readwrite');
        const store = transaction.objectStore(CATEGORY_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('카테고리 삭제 실패'));
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllCategories(): Promise<Category[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([CATEGORY_STORE], 'readonly');
        const store = transaction.objectStore(CATEGORY_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('카테고리 목록 조회 실패'));
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const categoryDB = new CategoryDB(); 