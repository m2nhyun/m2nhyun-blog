# 디자인 리팩토링 가이드

> **목표**: 일관성 있고, 반응형이 잘 작동하며, 사용자 경험이 좋은 디자인 시스템 구축

---

## 현재 문제점 분석

### 1. 다크모드 깜빡임 (FOUC) - 심각도: 높음
**증상**: 페이지 로드 시 라이트 모드가 잠깐 보였다가 다크모드로 변경됨

**원인**: `ThemeProvider`에서 `mounted` 상태가 true가 된 후에야 다크모드 클래스 적용
```typescript
// 문제 코드
if (!mounted) {
    return <>{children}</>;  // 다크모드 없이 렌더링됨
}
```

**해결**: HTML에 인라인 스크립트로 사전 적용 필요

---

### 2. 레이아웃 제한 문제 - 심각도: 높음
**증상**: 방명록, 포트폴리오의 반응형 그리드가 작동 안 함

**원인**: `layout.tsx`에서 `max-w-[640px]` 고정
```typescript
<main className="flex-1 p-4 mx-auto max-w-[640px]">  // 너무 좁음!
```

**문제**:
- 컴포넌트에서 `max-w-4xl`, `max-w-6xl` 설정해도 부모가 640px이라 무의미
- `lg:grid-cols-2`, `md:grid-cols-3` 등 반응형 브레이크포인트 동작 안 함

---

### 3. 스타일 불일치 - 심각도: 중간

| 항목 | 현재 상태 |
|------|-----------|
| 버튼 색상 | blue-600, purple-600, green-600 혼용 |
| 카드 스타일 | 각 컴포넌트마다 다르게 정의 |
| 로딩 상태 | 텍스트만 ("로딩 중...", "포스트를 불러오는 중...") |
| 에러 상태 | 각각 다른 스타일 |
| 폼 스타일 | 인라인으로 중복 정의 |

---

### 4. 기존 컴포넌트 미활용 - 심각도: 중간
**발견**: `shared/ui/Skeleton.tsx`에 스켈레톤 컴포넌트들이 이미 있지만 사용 안 됨
- `PostCardSkeleton`, `GuestbookCardSkeleton`, `PortfolioCardSkeleton` 등

---

### 5. 기타 이슈
- Header에 `console.log(opacity)` 디버그 코드 남아있음
- Header `left-[5%] right-[5%]`와 main 콘텐츠 정렬 불일치
- Footer 2024년 하드코딩
- AboutMe 페이지 디자인 없음 (빈 페이지 가능성)

---

## 리팩토링 태스크

### DESIGN-001: 다크모드 FOUC 수정 (우선순위: P0)
| 항목 | 내용 |
|------|------|
| **설명** | 페이지 로드 시 다크모드 깜빡임 해결 |
| **난이도** | 작음 |
| **예상 시간** | 30분 |

**읽어야 할 파일:**
```
src/app/layout.tsx
src/features/theme/components/ThemeProvider.tsx
src/app/globals.css
```

**작업 내용:**
1. `layout.tsx`의 `<head>`에 인라인 스크립트 추가 (localStorage 체크)
2. CSS에 `.dark` 클래스 초기 스타일 설정
3. ThemeProvider에서 불필요한 mounted 체크 제거

---

### DESIGN-002: 레이아웃 시스템 개선 (우선순위: P0)
| 항목 | 내용 |
|------|------|
| **설명** | 반응형 레이아웃 정상 동작하도록 수정 |
| **난이도** | 중간 |
| **예상 시간** | 1시간 |

**읽어야 할 파일:**
```
src/app/layout.tsx
src/widgets/header/Header.tsx
src/widgets/footer/Footer.tsx
```

**작업 내용:**
1. `layout.tsx`에서 `max-w-[640px]` 제거, 페이지별 너비 조절
2. 콘텐츠 영역 `max-w-7xl mx-auto` 컨테이너 적용
3. Header/Footer 정렬 통일
4. 페이지별 적절한 max-width 클래스 적용:
   - 블로그 상세: `max-w-3xl`
   - 블로그 목록/방명록: `max-w-4xl`
   - 포트폴리오/Admin: `max-w-6xl`

---

### DESIGN-003: 공통 UI 컴포넌트 정리 (우선순위: P1)
| 항목 | 내용 |
|------|------|
| **설명** | 버튼, 카드, 입력 필드 등 공통 컴포넌트화 |
| **난이도** | 큼 |
| **예상 시간** | 2시간 |

**읽어야 할 파일:**
```
src/shared/ui/index.ts
src/shared/ui/Skeleton.tsx
src/shared/ui/card.tsx
src/features/blog-post/components/PostForm.tsx (폼 패턴 참고)
src/features/guestbook/components/GuestbookForm.tsx (폼 패턴 참고)
```

**새로 만들 파일:**
```
src/shared/ui/Button.tsx
src/shared/ui/Input.tsx
src/shared/ui/Textarea.tsx
src/shared/ui/FormField.tsx
src/shared/ui/ErrorMessage.tsx
src/shared/ui/LoadingSpinner.tsx
src/shared/ui/PageHeader.tsx
```

**작업 내용:**
1. 버튼 컴포넌트 (variant: primary, secondary, danger, ghost)
2. 입력 필드 컴포넌트 (라벨, 에러 메시지 포함)
3. 로딩 스피너 컴포넌트
4. 페이지 헤더 컴포넌트 (뒤로가기, 제목, 설명)

---

### DESIGN-004: 로딩/에러 상태 통일 (우선순위: P1)
| 항목 | 내용 |
|------|------|
| **설명** | 스켈레톤 UI 적용 및 에러 상태 통일 |
| **난이도** | 중간 |
| **예상 시간** | 1.5시간 |

**읽어야 할 파일:**
```
src/shared/ui/Skeleton.tsx
src/features/blog-post/components/BlogList.tsx
src/features/guestbook/components/GuestbookList.tsx
src/features/portfolio/components/PortfolioContent.tsx
```

**작업 내용:**
1. 기존 스켈레톤 컴포넌트 활용
2. "로딩 중..." 텍스트를 스켈레톤으로 대체
3. 에러 상태 공통 컴포넌트 적용
4. 빈 상태(Empty State) 디자인 통일

---

### DESIGN-005: 방명록 UI 개선 (우선순위: P1)
| 항목 | 내용 |
|------|------|
| **설명** | 방명록 레이아웃 및 디자인 개선 |
| **난이도** | 중간 |
| **예상 시간** | 1시간 |

**읽어야 할 파일:**
```
src/features/guestbook/components/GuestbookContent.tsx
src/features/guestbook/components/GuestbookList.tsx
src/features/guestbook/components/GuestbookForm.tsx
```

**작업 내용:**
1. 모바일: 세로 레이아웃 (폼 → 목록)
2. 데스크톱: 가로 레이아웃 또는 단일 컬럼
3. 방명록 카드 디자인 개선
4. 폼 위치 조정 (목록 상단 또는 하단)

---

### DESIGN-006: 헤더/푸터 정리 (우선순위: P2)
| 항목 | 내용 |
|------|------|
| **설명** | 네비게이션 개선 및 정리 |
| **난이도** | 작음 |
| **예상 시간** | 45분 |

**읽어야 할 파일:**
```
src/widgets/header/Header.tsx
src/widgets/header/Sidebar.tsx
src/widgets/footer/Footer.tsx
src/shared/constants/data.ts
```

**작업 내용:**
1. Header에서 `console.log` 제거
2. 네비게이션 메뉴 개선 (Sidebar → 모바일 햄버거 메뉴)
3. Footer 연도 동적 처리
4. Header/main 콘텐츠 정렬 통일

---

### DESIGN-007: 색상 시스템 정리 (우선순위: P2)
| 항목 | 내용 |
|------|------|
| **설명** | 일관된 색상 테마 적용 |
| **난이도** | 중간 |
| **예상 시간** | 1시간 |

**읽어야 할 파일:**
```
src/app/globals.css
tailwind.config.ts
```

**작업 내용:**
1. Primary 색상 통일 (blue-600 계열)
2. 성공/에러/경고 색상 정의
3. CSS 변수로 테마 색상 관리
4. 다크모드 색상 최적화

---

## 권장 작업 순서

```
1. DESIGN-001 (다크모드 FOUC) ← 가장 눈에 띄는 문제
   ↓
2. DESIGN-002 (레이아웃) ← 반응형 기반
   ↓
3. DESIGN-005 (방명록) ← 즉시 보이는 개선
   ↓
4. DESIGN-004 (로딩/에러) ← UX 개선
   ↓
5. DESIGN-003 (공통 컴포넌트) ← 코드 정리
   ↓
6. DESIGN-006 (헤더/푸터)
   ↓
7. DESIGN-007 (색상 시스템)
```

---

## 디자인 원칙 (작업 시 참고)

### 1. 반응형 브레이크포인트
```
sm: 640px   - 모바일 가로
md: 768px   - 태블릿
lg: 1024px  - 데스크톱
xl: 1280px  - 와이드
```

### 2. 간격 시스템
```
gap-2 (8px)   - 작은 요소 간격
gap-4 (16px)  - 기본 간격
gap-6 (24px)  - 섹션 내 간격
gap-8 (32px)  - 섹션 간 간격
gap-12 (48px) - 큰 섹션 간격
```

### 3. 색상 용도
```
blue-600    - Primary 액션 (버튼, 링크)
green-600   - 성공/승인
yellow-600  - 경고/대기
red-600     - 에러/삭제
gray-*      - 텍스트, 배경, 보더
```

### 4. 카드 기본 스타일
```typescript
className="p-6 border border-gray-200 dark:border-gray-700
           rounded-lg bg-white dark:bg-gray-800
           hover:shadow-md transition-shadow"
```

---

## 파일 구조 제안

```
src/shared/
├── ui/
│   ├── index.ts           # 모든 UI 컴포넌트 export
│   ├── Button.tsx         # 새로 추가
│   ├── Input.tsx          # 새로 추가
│   ├── Textarea.tsx       # 새로 추가
│   ├── FormField.tsx      # 새로 추가
│   ├── LoadingSpinner.tsx # 새로 추가
│   ├── ErrorMessage.tsx   # 새로 추가
│   ├── PageHeader.tsx     # 새로 추가
│   ├── EmptyState.tsx     # 새로 추가
│   ├── Skeleton.tsx       # 기존 (활용)
│   ├── card.tsx           # 기존
│   ├── menubar.tsx        # 기존
│   └── switch.tsx         # 기존
└── styles/
    └── design-tokens.ts   # 색상, 간격 상수 (선택)
```
