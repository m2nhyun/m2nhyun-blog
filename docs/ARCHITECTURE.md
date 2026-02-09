# 아키텍처 가이드

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

## 레이어 구조

```
src/
├── app/                 # Next.js App Router (Pages & Layouts)
├── widgets/             # 복합 UI 블록 (Header, Footer)
├── features/            # 기능별 모듈 (비즈니스 로직)
├── entities/            # 비즈니스 엔티티 (타입 정의)
└── shared/              # 공유 코드 (유틸리티, UI 컴포넌트)
```

## 레이어 규칙

### 1. App Layer (`src/app/`)
- Next.js App Router 페이지 및 레이아웃
- 라우팅 설정
- 글로벌 스타일 및 메타데이터

```
app/
├── layout.tsx           # 루트 레이아웃
├── page.tsx             # 홈페이지
├── globals.css          # 전역 스타일
├── blog/
│   ├── page.tsx         # 블로그 목록
│   ├── create/page.tsx  # 글 작성
│   └── [slug]/page.tsx  # 글 상세
├── portfolio/page.tsx   # 포트폴리오
├── guestbook/page.tsx   # 방명록
└── admin/page.tsx       # 관리자
```

### 2. Widgets Layer (`src/widgets/`)
- 독립적인 복합 UI 블록
- 여러 feature를 조합할 수 있음

```
widgets/
├── header/
│   ├── ui/Header.tsx
│   └── index.ts
└── footer/
    ├── ui/Footer.tsx
    └── index.ts
```

### 3. Features Layer (`src/features/`)
- 비즈니스 기능 단위
- 각 feature는 독립적이어야 함
- 다른 feature에 직접 의존하지 않음

```
features/
├── blog-post/
│   ├── components/      # UI 컴포넌트
│   ├── services/        # Firebase 서비스
│   └── index.ts         # Public API
├── guestbook/
│   ├── components/
│   ├── services/
│   └── index.ts
├── portfolio/
│   ├── components/
│   ├── services/
│   └── index.ts
├── auth/
│   ├── components/
│   ├── services/
│   └── index.ts
└── theme/
    ├── context/
    └── index.ts
```

### 4. Entities Layer (`src/entities/`)
- 비즈니스 엔티티 타입 정의
- 데이터 스키마 정의

```
entities/
├── post/
│   ├── types.ts         # Post 타입
│   └── index.ts
├── guestbook-entry/
│   ├── types.ts         # GuestbookEntry 타입
│   └── index.ts
├── portfolio-item/
│   ├── types.ts         # PortfolioItem 타입
│   └── index.ts
└── user/
    ├── types.ts         # User 타입
    └── index.ts
```

### 5. Shared Layer (`src/shared/`)
- 공유 유틸리티 및 라이브러리
- 재사용 가능한 UI 컴포넌트

```
shared/
├── lib/
│   ├── firebase/        # Firebase 설정
│   └── index.ts         # 유틸리티 함수
├── ui/                  # 공통 UI 컴포넌트
│   ├── Button.tsx
│   ├── Skeleton.tsx
│   └── index.ts
└── constants/           # 상수 정의
    └── index.ts
```

## Import 규칙

### 허용되는 Import

| From | To (허용) |
|------|----------|
| app | widgets, features, shared |
| widgets | features, entities, shared |
| features | entities, shared |
| entities | shared |
| shared | (외부 라이브러리만) |

### 금지되는 Import

- 상위 레이어에서 하위 레이어로의 import 금지
- 같은 레이어의 다른 slice로 직접 import 금지 (shared 예외)

```typescript
// ❌ 잘못된 예시
import { PostService } from '@/features/blog-post'; // feature에서 다른 feature import

// ✅ 올바른 예시
import { Post } from '@/entities/post';              // feature에서 entity import
import { db } from '@/shared/lib/firebase/config';   // feature에서 shared import
```

## 모듈 Public API

각 모듈은 `index.ts`를 통해 public API를 노출합니다.

```typescript
// features/blog-post/index.ts
export { PostList } from './components/PostList';
export { PostDetail } from './components/PostDetail';
export { createPost, getPosts } from './services/postService';
```

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `PostList.tsx` |
| 서비스 | camelCase | `postService.ts` |
| 타입 | PascalCase | `Post`, `PostCreateData` |
| 폴더 | kebab-case | `blog-post`, `guestbook-entry` |
| 상수 | SCREAMING_SNAKE_CASE | `POSTS_COLLECTION` |
