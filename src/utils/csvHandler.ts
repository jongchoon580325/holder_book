import { Category } from '@/types/category';
import { Transaction } from '@/types/transaction';
import Papa from 'papaparse';

// CSV 한글 헤더 매핑
const CATEGORY_HEADERS = {
  type: '유형',
  section: '관',
  category: '항',
  subcategory: '목',
  order: '순서'
};

const TRANSACTION_HEADERS = {
  date: '날짜',
  type: '유형',
  section: '관',
  category: '항',
  subcategory: '목',
  amount: '금액',
  memo: '메모'
};

// 역방향 매핑 (한글 -> 영문)
const REVERSE_CATEGORY_HEADERS = Object.entries(CATEGORY_HEADERS).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

const REVERSE_TRANSACTION_HEADERS = Object.entries(TRANSACTION_HEADERS).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

// CSV 파일 읽기 (가져오기)
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      transformHeader: (header) => {
        // 한글 헤더를 영문 키로 변환
        return REVERSE_CATEGORY_HEADERS[header] || REVERSE_TRANSACTION_HEADERS[header] || header;
      },
      complete: (results) => {
        const data = results.data
          .filter(item => typeof item === 'object' && item !== null && Object.keys(item as object).length > 0) // 빈 행 제거
          .map(item => {
            const transformed: Record<string, any> = {};
            
            // 모든 필드의 앞뒤 공백 제거
            if (typeof item === 'object' && item !== null) {
              Object.entries(item as object).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  transformed[key] = value.trim();
                } else {
                  transformed[key] = value;
                }
              });
            }

            // 유형 필드 변환
            if (transformed.type) {
              transformed.type = transformed.type === '수입' ? 'income' : 
                               transformed.type === '지출' ? 'expense' : 
                               transformed.type;
            }

            return transformed;
          });
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// CSV 파일 생성 (내보내기)
export const exportToCSV = (data: any[], filename: string, isCategory: boolean = false) => {
  const BOM = '\uFEFF';
  const headers = isCategory ? CATEGORY_HEADERS : TRANSACTION_HEADERS;
  
  // 데이터가 비어있는 경우에도 헤더만 포함된 빈 CSV 생성
  const transformedData = data.length > 0 
    ? data.map(item => {
        const transformed: any = {};
        
        Object.entries(headers).forEach(([key, koreanHeader]) => {
          let value = item[key];
          
          // 특수 필드 처리
          if (key === 'type') {
            value = item[key] === 'income' ? '수입' : '지출';
          } else if (key === 'amount' && !isCategory) {
            value = typeof item[key] === 'number' ? item[key].toLocaleString() : '';
          } else if (key === 'date' && !isCategory) {
            value = item[key] || '';
          } else {
            value = item[key] || '';
          }
          
          transformed[koreanHeader] = value;
        });
        
        return transformed;
      })
    : [{}]; // 빈 객체를 포함하는 배열 전달 (헤더만 표시)

  const csv = Papa.unparse(transformedData, {
    header: true
  });
  
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // 메모리 누수 방지
};

// 거래내역 데이터 유효성 검사
export const validateTransactionData = (data: any[]): boolean => {
  if (!data || data.length === 0) return false;

  return data.every(item => {
    // 필수 필드 존재 여부 확인
    const hasRequiredFields = 
      'date' in item && 
      'type' in item && 
      'section' in item && 
      'category' in item && 
      'amount' in item;

    if (!hasRequiredFields) return false;

    // 유형 값 검증
    const validType = 
      item.type === 'income' || 
      item.type === 'expense' || 
      item.type === '수입' || 
      item.type === '지출';

    // 금액 값 검증
    const amount = String(item.amount).replace(/,/g, '').trim();
    const validAmount = !isNaN(parseFloat(amount));

    // 필수 값이 비어있지 않은지 확인
    const hasRequiredValues = 
      item.date?.trim() !== '' && 
      item.section?.trim() !== '' && 
      item.category?.trim() !== '';

    return validType && validAmount && hasRequiredValues;
  });
};

// 카테고리 데이터 유효성 검사
export const validateCategoryData = (data: any[]): boolean => {
  if (!data || data.length === 0) return false;

  return data.every(item => {
    // 필수 필드 존재 여부 확인
    const hasRequiredFields = 
      'type' in item && 
      'section' in item && 
      'category' in item;

    if (!hasRequiredFields) return false;

    // 유형 값 검증
    const validType = 
      item.type === 'income' || 
      item.type === 'expense' || 
      item.type === '수입' || 
      item.type === '지출';

    // 필수 값이 비어있지 않은지 확인
    const hasRequiredValues = 
      item.section?.trim() !== '' && 
      item.category?.trim() !== '';

    return validType && hasRequiredValues;
  });
}; 