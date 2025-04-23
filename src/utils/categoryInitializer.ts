import { Category, CategoryType } from '@/types/category';
import { categoryDB } from './indexedDB';

interface RawCategory {
  type: '수입' | '지출';
  section: string;
  category: string;
  subcategory: string;
}

const defaultCategories: RawCategory[] = [
  // 수입 카테고리
  { type: '수입', section: '경상수입', category: '급여', subcategory: '월급' },
  { type: '수입', section: '경상수입', category: '급여', subcategory: '상여금' },
  { type: '수입', section: '경상수입', category: '급여', subcategory: '수당' },
  { type: '수입', section: '경상수입', category: '사업수입', subcategory: '매출액' },
  { type: '수입', section: '경상수입', category: '사업수입', subcategory: '수수료' },
  { type: '수입', section: '경상수입', category: '금융수입', subcategory: '이자수입' },
  { type: '수입', section: '경상수입', category: '금융수입', subcategory: '배당금' },
  { type: '수입', section: '경상수입', category: '임대수입', subcategory: '월세' },
  { type: '수입', section: '경상수입', category: '임대수입', subcategory: '전세' },
  { type: '수입', section: '기타수입', category: '기타', subcategory: '용돈' },
  { type: '수입', section: '기타수입', category: '기타', subcategory: '상금' },
  { type: '수입', section: '기타수입', category: '기타', subcategory: '환급금' },

  // 지출 카테고리
  { type: '지출', section: '고정지출', category: '주거비', subcategory: '월세' },
  { type: '지출', section: '고정지출', category: '주거비', subcategory: '관리비' },
  { type: '지출', section: '고정지출', category: '주거비', subcategory: '공과금' },
  { type: '지출', section: '고정지출', category: '통신비', subcategory: '휴대폰' },
  { type: '지출', section: '고정지출', category: '통신비', subcategory: '인터넷' },
  { type: '지출', section: '고정지출', category: '보험료', subcategory: '생명보험' },
  { type: '지출', section: '고정지출', category: '보험료', subcategory: '실손보험' },
  { type: '지출', section: '고정지출', category: '보험료', subcategory: '자동차보험' },
  { type: '지출', section: '생활비', category: '식비', subcategory: '식사' },
  { type: '지출', section: '생활비', category: '식비', subcategory: '간식' },
  { type: '지출', section: '생활비', category: '식비', subcategory: '커피/음료' },
  { type: '지출', section: '생활비', category: '교통비', subcategory: '대중교통' },
  { type: '지출', section: '생활비', category: '교통비', subcategory: '주유비' },
  { type: '지출', section: '생활비', category: '교통비', subcategory: '주차비' },
  { type: '지출', section: '생활비', category: '생필품', subcategory: '세면도구' },
  { type: '지출', section: '생활비', category: '생필품', subcategory: '청소용품' },
  { type: '지출', section: '문화생활', category: '여가', subcategory: '영화/공연' },
  { type: '지출', section: '문화생활', category: '여가', subcategory: '취미' },
  { type: '지출', section: '문화생활', category: '여가', subcategory: '운동' },
  { type: '지출', section: '문화생활', category: '쇼핑', subcategory: '의류' },
  { type: '지출', section: '문화생활', category: '쇼핑', subcategory: '잡화' },
  { type: '지출', section: '문화생활', category: '쇼핑', subcategory: '전자기기' },
  { type: '지출', section: '교육비', category: '학습', subcategory: '학원비' },
  { type: '지출', section: '교육비', category: '학습', subcategory: '교재비' },
  { type: '지출', section: '교육비', category: '학습', subcategory: '인강' },
  { type: '지출', section: '의료비', category: '병원', subcategory: '진료비' },
  { type: '지출', section: '의료비', category: '병원', subcategory: '약값' },
  { type: '지출', section: '의료비', category: '병원', subcategory: '검사비' },
  { type: '지출', section: '기타지출', category: '기타', subcategory: '경조사비' },
  { type: '지출', section: '기타지출', category: '기타', subcategory: '회비' }
];

export const initializeCategories = async () => {
  try {
    // DB에서 카테고리 데이터 확인
    const existingCategories = await categoryDB.getAllCategories();
    
    // 카테고리가 없을 경우에만 초기화 진행
    if (existingCategories.length === 0) {
      const categories: Category[] = defaultCategories.map((raw, index) => ({
        id: index + 1,
        type: raw.type === '수입' ? CategoryType.INCOME : CategoryType.EXPENSE,
        section: raw.section,
        category: raw.category,
        subcategory: raw.subcategory,
        order: index + 1
      }));

      await categoryDB.replaceAllCategories(categories);
      console.log('카테고리 초기화 완료');
    }
  } catch (error) {
    console.error('카테고리 초기화 중 오류 발생:', error);
    throw error;
  }
}; 