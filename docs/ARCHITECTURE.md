# 아키텍처 가이드

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처와 **Next.js Server Actions**를 결합하여 사용합니다.

## 핵심 아키텍처 결정

### Server Actions 기반 데이터 레이어

모든 데이터 작업은 Next.js Server Actions를 통해 서버에서 처리됩니다:

- **Firebase Admin SDK**: 서버에서만 실행, 보안 규칙 우회
- **Firebase Client SDK**: 클라이언트에서 인증 전용으로 사용
- **번들 크기 최적화**: 클라이언트 번들에서 Firestore 코드 제거 (~50% 감소)

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌─────────────────┐     ┌────────────────────────────┐ │
│  │   Components    │────▶│  Server Actions 호출        │ │
│  │   (React)       │     │  (함수 호출처럼 사용)        │ │
│  └─────────────────┘     └────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                     Server (Next.js)                     │
│  ┌─────────────────────────────────────────────────────┐│
│  │              Server Actions (app/actions/)          ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ ││
│  │  │ post.ts     │  │ guestbook.ts│  │ portfolio.ts│ ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘ ││
│  └─────────────────────────────────────────────────────┘│
│                              │                           │
│                              ▼                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │           Firebase Admin SDK                         ││
│  │           (shared/lib/firebase/admin.ts)             ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                     Firebase Firestore                   │
└─────────────────────────────────────────────────────────┘
```

## 레이어 구조

```
src/
├── app/                 # Next.js App Router + Server Actions
│   ├── actions/         # 🔥 Server Actions (데이터 레이어)
│   ├── blog/            # 블로그 라우트
│   └── ...
├── widgets/             # 복합 UI 블록 (Header, Footer)
├── features/            # 기능별 UI 컴포넌트
├── entities/            # 비즈니스 엔티티 (타입 정의)
└── shared/              # 공유 코드 (Firebase 설정, 유틸리티)
```

## 레이어 규칙

### 1. App Layer (`src/app/`)

Next.js App Router 페이지, 레이아웃, 그리고 **Server Actions**.

```
app/
├── actions/             # 🔥 Server Actions
│   ├── post.ts          # 블로그 CRUD
│   ├── guestbook.ts     # 방명록 CRUD
│   └── portfolio.ts     # 포트폴리오 CRUD
├── layout.tsx           # 루트 레이아웃
├── page.tsx             # 홈페이지
├── globals.css          # 전역 스타일
├── blog/
│   ├── page.tsx         # 블로그 목록
│   └── [slug]/page.tsx  # 글 상세
├── portfolio/page.tsx   # 포트폴리오
├── guestbook/page.tsx   # 방명록
└── admin/page.tsx       # 관리자
```

### 2. Widgets Layer (`src/widgets/`)

독립적인 복합 UI 블록. 여러 feature를 조합할 수 있음.

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

**UI 컴포넌트만** 포함. 데이터 로직은 Server Actions로 이동.

```
features/
├── blog-post/
│   ├── components/      # UI 컴포넌트
│   │   ├── BlogList.tsx
│   │   ├── BlogDetail.tsx
│   │   └── PostForm.tsx
│   └── index.ts
├── guestbook/
│   ├── components/
│   │   ├── GuestbookList.tsx
│   │   ├── GuestbookForm.tsx
│   │   └── GuestbookContent.tsx
│   └── index.ts
├── portfolio/
│   ├── components/
│   │   └── PortfolioContent.tsx
│   └── index.ts
├── auth/
│   ├── components/
│   ├── services/        # 인증만 클라이언트 서비스 유지
│   └── index.ts
└── theme/
    ├── context/
    └── index.ts
```

### 4. Entities Layer (`src/entities/`)

비즈니스 엔티티 타입 정의.

```
entities/
├── post/
│   ├── types.ts         # Post, PostCreateData, PostUpdateData
│   └── index.ts
├── guestbook-entry/
│   ├── types.ts         # GuestbookEntry, GuestbookEntryCreateData
│   └── index.ts
├── portfolio-item/
│   ├── types.ts         # PortfolioItem 타입
│   └── index.ts
└── user/
    ├── types.ts         # User 타입
    └── index.ts
```

### 5. Shared Layer (`src/shared/`)

공유 유틸리티 및 Firebase 설정.

```
shared/
├── lib/
│   ├── firebase/
│   │   ├── admin.ts     # 🔥 Firebase Admin SDK (서버 전용)
│   │   └── config.ts    # Firebase Client SDK (인증 전용)
│   └── index.ts         # 유틸리티 함수
├── ui/                  # 공통 UI 컴포넌트
│   ├── Button.tsx
│   ├── Skeleton.tsx
│   └── index.ts
└── constants/
    └── index.ts
```

## Import 규칙

### 허용되는 Import

| From | To (허용) |
|------|----------|
| app/actions | shared/lib/firebase/admin |
| app (pages) | features, widgets, shared, app/actions |
| widgets | features, entities, shared |
| features | entities, shared, **app/actions** |
| entities | shared |
| shared | (외부 라이브러리만) |

### 금지되는 Import

- 상위 레이어에서 하위 레이어로의 import 금지
- **Server Actions 파일에서 'use client' 컴포넌트 import 금지**
- 같은 레이어의 다른 slice로 직접 import 금지 (shared 예외)

```typescript
// ❌ 잘못된 예시 - Feature에서 다른 Feature import
import { PostForm } from '@/features/blog-post';

// ❌ 잘못된 예시 - Server Action에서 Client SDK 사용
import { db } from '@/shared/lib/firebase/config';

// ✅ 올바른 예시 - Feature에서 Server Action import
import { getPosts, createPost } from '@/app/actions/post';

// ✅ 올바른 예시 - Server Action에서 Admin SDK 사용
import { getAdminDb } from '@/shared/lib/firebase/admin';
```

## 데이터 흐름

### 읽기 (Read)

```
Component → Server Action → Admin SDK → Firestore
    ↑                                       │
    └───────────── 데이터 반환 ──────────────┘
```

```typescript
// 컴포넌트에서
'use client';
import { getPosts } from '@/app/actions/post';

useEffect(() => {
    getPosts(true).then(setPosts);
}, []);
```

### 쓰기 (Write)

```
Component → Server Action → Admin SDK → Firestore
    ↑                                       │
    │     revalidatePath() ← 캐시 무효화 ←──┘
    └───────────── 완료 확인 ──────────────┘
```

```typescript
// 컴포넌트에서
'use client';
import { createPost } from '@/app/actions/post';

const handleSubmit = async (data) => {
    await createPost(data);
    // 자동으로 캐시 무효화됨
};
```

## 모듈 Public API

각 모듈은 `index.ts`를 통해 public API를 노출합니다.

```typescript
// features/blog-post/index.ts
export { BlogList } from './components/BlogList';
export { BlogDetail } from './components/BlogDetail';
export { PostForm } from './components/PostForm';
// 서비스는 더 이상 export하지 않음 - Server Actions 사용
```

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `PostList.tsx` |
| Server Action 파일 | camelCase | `post.ts`, `guestbook.ts` |
| Server Action 함수 | camelCase | `createPost`, `getPosts` |
| 타입 | PascalCase | `Post`, `PostCreateData` |
| 폴더 | kebab-case | `blog-post`, `guestbook-entry` |
| 상수 | SCREAMING_SNAKE_CASE | `POSTS_COLLECTION` |

## 보안 아키텍처

### Firestore 보안 규칙

모든 클라이언트 접근 차단 (Admin SDK가 우회):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 환경 변수 분리

```
# 클라이언트 노출 (NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_ADMIN_UID=...

# 서버 전용 (노출 안됨)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```
