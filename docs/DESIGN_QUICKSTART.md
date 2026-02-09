# 디자인 리팩토링 빠른 시작

> **Claude에게 이 파일을 전달하면 바로 작업을 시작할 수 있습니다**

---

## 현재 핵심 파일 구조

```
src/
├── app/
│   ├── layout.tsx          ← 전체 레이아웃 (max-width 문제)
│   ├── globals.css         ← CSS 변수, 다크모드
│   └── page.tsx            ← 홈페이지
├── features/
│   ├── theme/
│   │   └── components/
│   │       ├── ThemeProvider.tsx  ← 다크모드 로직 (FOUC 원인)
│   │       └── DarkModeToggle.tsx
│   ├── blog-post/components/
│   │   ├── BlogList.tsx    ← 포스트 목록
│   │   └── PostForm.tsx    ← 폼 패턴 참고
│   ├── guestbook/components/
│   │   ├── GuestbookContent.tsx  ← 방명록 레이아웃
│   │   ├── GuestbookList.tsx     ← 방명록 목록
│   │   └── GuestbookForm.tsx     ← 방명록 폼
│   └── portfolio/components/
│       └── PortfolioContent.tsx  ← 포트폴리오
├── widgets/
│   ├── header/
│   │   ├── Header.tsx      ← 헤더 (console.log 남아있음)
│   │   └── Sidebar.tsx     ← 네비게이션 메뉴
│   └── footer/
│       └── Footer.tsx      ← 푸터
└── shared/
    ├── ui/
    │   ├── Skeleton.tsx    ← 스켈레톤 (미사용)
    │   ├── card.tsx
    │   └── menubar.tsx
    └── constants/
        └── data.ts         ← 카테고리, 소셜 링크
```

---

## 작업별 Claude 프롬프트

### DESIGN-001: 다크모드 FOUC 수정

```
DESIGN-001 작업을 시작합니다.

먼저 다음 파일들을 읽어주세요:
- docs/DESIGN_REFACTOR.md
- src/app/layout.tsx
- src/features/theme/components/ThemeProvider.tsx
- src/app/globals.css

문제: 페이지 로드 시 라이트모드가 잠깐 보였다가 다크모드로 변경됨
해결: layout.tsx에 인라인 스크립트로 localStorage 체크하여 사전 적용
```

---

### DESIGN-002: 레이아웃 시스템 개선

```
DESIGN-002 작업을 시작합니다.

먼저 다음 파일들을 읽어주세요:
- docs/DESIGN_REFACTOR.md
- src/app/layout.tsx
- src/widgets/header/Header.tsx
- src/widgets/footer/Footer.tsx
- src/features/guestbook/components/GuestbookContent.tsx
- src/features/portfolio/components/PortfolioContent.tsx

문제: layout.tsx의 max-w-[640px]로 인해 반응형 그리드 작동 안 함
해결:
1. layout.tsx에서 max-width 제거
2. 각 페이지 컴포넌트에서 적절한 max-width 적용
   - 블로그 상세: max-w-3xl
   - 블로그 목록/방명록: max-w-4xl
   - 포트폴리오/Admin: max-w-6xl
```

---

### DESIGN-005: 방명록 UI 개선

```
DESIGN-005 작업을 시작합니다.

먼저 다음 파일들을 읽어주세요:
- docs/DESIGN_REFACTOR.md
- src/features/guestbook/components/GuestbookContent.tsx
- src/features/guestbook/components/GuestbookList.tsx
- src/features/guestbook/components/GuestbookForm.tsx
- src/shared/ui/Skeleton.tsx

작업:
1. 레이아웃 개선 (모바일: 세로, 데스크톱: 적절한 배치)
2. 방명록 카드 디자인 개선
3. 스켈레톤 로딩 적용
4. 에러 시 "방명록을 불러오는데 실패했습니다" 대신 재시도 버튼 추가
```

---

### DESIGN-004: 로딩/에러 상태 통일

```
DESIGN-004 작업을 시작합니다.

먼저 다음 파일들을 읽어주세요:
- docs/DESIGN_REFACTOR.md
- src/shared/ui/Skeleton.tsx
- src/features/blog-post/components/BlogList.tsx
- src/features/guestbook/components/GuestbookList.tsx
- src/features/portfolio/components/PortfolioContent.tsx

작업:
1. 기존 Skeleton 컴포넌트 활용 (PostCardSkeleton, GuestbookCardSkeleton 등)
2. "로딩 중..." 텍스트를 스켈레톤으로 대체
3. 에러 상태 UI 통일 (재시도 버튼 포함)
```

---

## 핵심 스타일 패턴 (복사해서 사용)

### 카드 스타일
```typescript
className="p-6 border border-gray-200 dark:border-gray-700
           rounded-lg bg-white dark:bg-gray-800
           hover:shadow-md transition-shadow"
```

### Primary 버튼
```typescript
className="px-4 py-2 bg-blue-600 text-white rounded-md
           hover:bg-blue-700 transition-colors
           disabled:bg-gray-400 disabled:cursor-not-allowed"
```

### Secondary 버튼
```typescript
className="px-4 py-2 border border-gray-300 dark:border-gray-600
           text-gray-700 dark:text-gray-300 rounded-md
           hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
```

### 입력 필드
```typescript
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600
           rounded-md bg-white dark:bg-gray-800
           text-gray-900 dark:text-gray-100
           focus:outline-none focus:ring-2 focus:ring-blue-500"
```

### 페이지 컨테이너
```typescript
// 좁은 콘텐츠 (블로그 상세)
className="max-w-3xl mx-auto px-4 py-8"

// 중간 콘텐츠 (블로그 목록, 방명록)
className="max-w-4xl mx-auto px-4 py-8"

// 넓은 콘텐츠 (포트폴리오, Admin)
className="max-w-6xl mx-auto px-4 py-8"
```

---

## 다크모드 FOUC 해결 코드 (복사용)

### layout.tsx에 추가할 스크립트
```typescript
// layout.tsx의 <head> 안에 추가
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var isDark = localStorage.getItem('darkMode') === 'true';
          if (isDark) {
            document.documentElement.classList.add('dark');
          }
        } catch (e) {}
      })();
    `,
  }}
/>
```

### globals.css에 추가
```css
/* 초기 깜빡임 방지 */
html {
  background-color: #fff;
}
html.dark {
  background-color: #1f2937;
}
```

---

## 권장 작업 순서

1. **DESIGN-001** (다크모드) - 30분
2. **DESIGN-002** (레이아웃) - 1시간
3. **DESIGN-005** (방명록) - 1시간
4. **DESIGN-004** (로딩/에러) - 1.5시간

**총 예상 시간: 약 4시간**

---

## 주의사항

1. **기존 스켈레톤 컴포넌트 활용**: `src/shared/ui/Skeleton.tsx`에 이미 구현됨
2. **console.log 제거**: `Header.tsx`에 디버그 코드 남아있음
3. **max-width 충돌**: 컴포넌트에서 설정한 max-width가 부모 때문에 무시됨
4. **Footer 연도**: 2024 하드코딩 → 동적 처리 필요
