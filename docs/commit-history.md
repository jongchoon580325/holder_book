# 커밋 히스토리

## [01] Next.js 프로젝트 초기 설정 및 구성

### 2025-04-17

7. **개선: Fast Refresh 및 비동기 처리 최적화** (766d869)
   - webpack 설정 최적화 및 성능 개선
   - 비동기 처리 방식 개선
   - Suspense를 활용한 로딩 처리 추가
   - 컴포넌트 구조 리팩토링
   - PageHeader 컴포넌트 추가
   - FireworkEffect 및 FireworkProvider 구현
   - useFirework 커스텀 훅 개발

6. **문서: 커밋 히스토리 최신순 정렬** (현재 작업)
   - 커밋 히스토리 최신순 정렬 구조 변경
   - 커밋 번호 역순으로 수정
   - 각 커밋별 상세 내용 보강
   - 문서 가독성 개선

5. **설정: Next.js 및 의존성 버전 업데이트** (1b5a6e3)
   - Next.js 버전을 13.4.19로 업데이트
   - React 및 React DOM 버전을 18.2.0으로 설정
   - 개발 의존성 패키지들의 버전 업데이트
   - Next.js 설정에 실험적 기능(appDir) 추가

4. **디자인: 전체 색상 테마 적용** (c325842)
   - 메뉴바와 푸터 배경색을 `#bebec2`로 변경
   - 본문 텍스트 색상 설정
     - 대제목: `#ebf0ec`
     - 소제목: `#c3c7c4`
     - 배경색: `#41416e`
   - 메뉴 항목 스타일 개선
     - 활성 메뉴: `#41416e`
     - 비활성 메뉴: `#41416e/80`
   - 전역 스타일 설정 추가

3. **설정: Next.js 및 Tailwind CSS 설정 초기화** (be6e56a)
   - Next.js 설정 파일을 TypeScript에서 JavaScript로 변경
   - Tailwind CSS 및 PostCSS 설정 추가
   - 기본 페이지 스타일 및 레이아웃 구성
   - 프로젝트 메인 페이지 UI 구현

2. **기능: 기본 페이지 구조 구현** (be6e56a)
   - 메인 레이아웃 컴포넌트 생성
   - 네비게이션 바 구현
   - 푸터 컴포넌트 추가
   - 페이지 라우팅 설정

1. **Initial commit from Create Next App** (6984b85)
   - Next.js 프로젝트 생성
   - 기본 프로젝트 구조 설정
   - TypeScript 설정 추가
   - 기본 의존성 설치 