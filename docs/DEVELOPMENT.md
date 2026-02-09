# 개발 가이드

이 문서는 개발 환경 설정과 가이드라인을 설명합니다.

## 환경 설정

### 1. 요구사항

- Node.js 18+
- npm 또는 yarn

### 2. 설치

```bash
# 저장소 클론
git clone https://github.com/m2nhyun/m2nhyun-blog.git
cd m2nhyun-blog

# 의존성 설치
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin
NEXT_PUBLIC_ADMIN_UID=your_admin_uid
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 시작 |
| `npm run lint` | ESLint 검사 |

## 프로젝트 구조

```
m2nhyun-blog/
├── docs/               # 문서
├── public/             # 정적 파일
├── src/
│   ├── app/            # Next.js App Router
│   ├── widgets/        # 복합 UI 블록
│   ├── features/       # 기능 모듈
│   ├── entities/       # 엔티티 타입
│   └── shared/         # 공유 코드
├── .env.local          # 환경 변수 (git 무시)
├── next.config.js      # Next.js 설정
├── tailwind.config.js  # Tailwind 설정
├── tsconfig.json       # TypeScript 설정
└── package.json
```

## 개발 가이드라인

### 새 기능 추가

1. `src/entities/`에 타입 정의
2. `src/features/{feature}/services/`에 서비스 생성
3. `src/features/{feature}/components/`에 컴포넌트 생성
4. `src/features/{feature}/index.ts`에 export 추가
5. `src/app/`에 페이지 생성

### 타입 정의

```typescript
// entities/item/types.ts
export interface Item {
    id: string;
    title: string;
    // ... 필수 필드
    createdAt: string;
    updatedAt: string;
}

export interface ItemCreateData {
    title: string;
    // ... 생성 시 필요한 필드
}

export interface ItemUpdateData extends Partial<ItemCreateData> {
    id: string;
}
```

### 서비스 생성

```typescript
// features/item/services/itemService.ts
import { db } from '@/shared/lib/firebase/config';
import { Item, ItemCreateData } from '@/entities/item';

const COLLECTION = 'items';

export const createItem = async (data: ItemCreateData): Promise<string> => {
    // ...
};

export const getItems = async (): Promise<Item[]> => {
    // ...
};
```

### 컴포넌트 생성

```typescript
// features/item/components/ItemList.tsx
'use client';

import { useState, useEffect } from 'react';
import { getItems } from '../services/itemService';
import { Item } from '@/entities/item';

export const ItemList = () => {
    const [items, setItems] = useState<Item[]>([]);
    // ...
};
```

## 커밋 규칙

```
<type>(<scope>): <description>

feat: 새 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 스타일 변경 (기능 변화 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드/도구 변경
```

예시:
```
feat(blog): add post creation feature
fix(guestbook): fix form validation
docs: update architecture guide
```

## 브랜치 전략

- `main`: 프로덕션 브랜치
- `feat/*`: 기능 개발
- `fix/*`: 버그 수정
- `docs/*`: 문서 작업

## Firebase 설정

### Firestore 컬렉션

| 컬렉션 | 설명 |
|--------|------|
| `posts` | 블로그 포스트 |
| `guestbook` | 방명록 항목 |
| `portfolio` | 포트폴리오 항목 |

### Firestore 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 포스트: 인증된 사용자만 쓰기, 모두 읽기
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // 방명록: 모두 쓰기 가능, 모두 읽기 가능
    match /guestbook/{entryId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }

    // 포트폴리오: 인증된 사용자만 쓰기, 모두 읽기
    match /portfolio/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 문제 해결

### 빌드 에러

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### 타입 에러

```bash
# 타입 체크
npx tsc --noEmit
```

### 환경 변수 문제

- `.env.local` 파일이 있는지 확인
- 변수명이 `NEXT_PUBLIC_`으로 시작하는지 확인
- 개발 서버 재시작
