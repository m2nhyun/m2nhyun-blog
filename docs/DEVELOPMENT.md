# 개발 가이드

이 문서는 개발 환경 설정과 가이드라인을 설명합니다.

## 환경 설정

### 1. 요구사항

- Node.js 18+
- npm 또는 yarn
- Firebase 프로젝트 (Admin SDK 서비스 계정 필요)

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
# ============================================
# 클라이언트 환경 변수 (NEXT_PUBLIC_)
# 브라우저에 노출됨 - 민감하지 않은 정보만
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# 관리자 UID (Firebase Auth에서 확인)
NEXT_PUBLIC_ADMIN_UID=your_admin_uid

# ============================================
# 서버 환경 변수 (NEXT_PUBLIC_ 없음)
# 서버에서만 접근 가능 - 민감한 정보
# ============================================
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Firebase Admin SDK 설정

1. Firebase Console → 프로젝트 설정 → 서비스 계정
2. "새 비공개 키 생성" 클릭
3. 다운로드된 JSON에서 값 추출:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

> **중요**: `FIREBASE_PRIVATE_KEY`는 `"-----BEGIN...-----END-----\n"` 형식으로, 따옴표로 감싸야 합니다.

### 5. Firestore 보안 규칙 설정

Firebase Console → Firestore → 규칙:

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

> 모든 클라이언트 접근을 차단합니다. Server Actions의 Admin SDK가 규칙을 우회합니다.

### 6. 개발 서버 실행

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
├── docs/                   # 문서
├── public/                 # 정적 파일
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── actions/        # 🔥 Server Actions
│   │   │   ├── post.ts
│   │   │   ├── guestbook.ts
│   │   │   └── portfolio.ts
│   │   ├── blog/
│   │   ├── guestbook/
│   │   ├── portfolio/
│   │   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── widgets/            # 복합 UI 블록
│   │   ├── header/
│   │   └── footer/
│   ├── features/           # 기능별 UI 컴포넌트
│   │   ├── blog-post/
│   │   ├── guestbook/
│   │   ├── portfolio/
│   │   ├── auth/
│   │   └── theme/
│   ├── entities/           # 타입 정의
│   │   ├── post/
│   │   ├── guestbook-entry/
│   │   ├── portfolio-item/
│   │   └── user/
│   └── shared/             # 공유 코드
│       ├── lib/
│       │   ├── firebase/
│       │   │   ├── admin.ts    # Admin SDK
│       │   │   └── config.ts   # Client SDK
│       │   └── index.ts
│       ├── ui/
│       └── constants/
├── .env.local              # 환경 변수 (git 무시)
├── firestore.rules         # Firestore 보안 규칙
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 개발 가이드라인

### 새 기능 추가 (Server Actions 방식)

1. `src/entities/{entity}/types.ts`에 타입 정의
2. `src/app/actions/{entity}.ts`에 Server Action 생성
3. `src/features/{feature}/components/`에 UI 컴포넌트 생성
4. `src/features/{feature}/index.ts`에 export 추가
5. `src/app/{route}/page.tsx`에 페이지 생성

### 1. 타입 정의

```typescript
// entities/item/types.ts
export interface Item {
    id: string;
    title: string;
    content: string;
    createdAt: string;  // ISO 문자열
    updatedAt: string;  // ISO 문자열
}

export interface ItemCreateData {
    title: string;
    content: string;
}

export interface ItemUpdateData extends Partial<ItemCreateData> {
    id: string;
}

// entities/item/index.ts
export * from './types';
```

### 2. Server Action 생성

```typescript
// app/actions/item.ts
'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { Item, ItemCreateData, ItemUpdateData } from '@/entities/item';

const COLLECTION = 'items';

export async function createItem(data: ItemCreateData): Promise<string> {
    const db = getAdminDb();

    const docRef = await db.collection(COLLECTION).add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/items');
    return docRef.id;
}

export async function getItems(): Promise<Item[]> {
    const db = getAdminDb();
    const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || '',
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || '',
    })) as Item[];
}
```

### 3. UI 컴포넌트 생성

```typescript
// features/item/components/ItemList.tsx
'use client';

import { useState, useEffect } from 'react';
import { getItems } from '@/app/actions/item';
import { Item } from '@/entities/item';

export const ItemList = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getItems()
            .then(setItems)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            {items.map((item) => (
                <div key={item.id}>{item.title}</div>
            ))}
        </div>
    );
};
```

### 4. Export 추가

```typescript
// features/item/index.ts
export { ItemList } from './components/ItemList';
export { ItemForm } from './components/ItemForm';
```

### 5. 페이지 생성

```typescript
// app/items/page.tsx
import { ItemList } from '@/features/item';

export default function ItemsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Items</h1>
            <ItemList />
        </div>
    );
}
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
feat(blog): add post creation with Server Actions
fix(guestbook): fix form validation error
docs: update services documentation
refactor(auth): migrate to Admin SDK
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

### 복합 인덱스 (필요 시)

Firebase Console → Firestore → 인덱스:

| 컬렉션 | 필드 1 | 필드 2 |
|--------|--------|--------|
| posts | published (ASC) | createdAt (DESC) |
| guestbook | approved (ASC) | createdAt (DESC) |
| portfolio | featured (ASC) | order (ASC) |

## 배포

### Vercel 배포

1. Vercel에 GitHub 저장소 연결
2. 환경 변수 설정 (Settings → Environment Variables):
   - 모든 `.env.local` 변수 추가
   - `FIREBASE_PRIVATE_KEY`는 줄바꿈 그대로 입력
3. Deploy

### 환경 변수 주의사항

| 변수 | 위치 | 노출 |
|------|------|------|
| `NEXT_PUBLIC_*` | 클라이언트 + 서버 | 브라우저에 노출됨 |
| `FIREBASE_*` | 서버만 | 노출 안됨 |

## 문제 해결

### 빌드 에러

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### Firebase 인증 에러

```
Error: Expected first argument to collection() to be a CollectionReference...
```

→ 컴포넌트가 아직 이전 서비스를 import하고 있음. `@/app/actions/`에서 import하도록 수정.

### Admin SDK 에러

```
Error: Firebase Admin 환경 변수가 설정되지 않았습니다
```

→ `.env.local`에 `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` 확인.

### Private Key 에러

```
Error: Error: error:0909006C:PEM routines:get_name:no start line
```

→ `FIREBASE_PRIVATE_KEY`가 따옴표로 감싸져 있는지, `\n`이 실제 줄바꿈으로 변환되는지 확인:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

### 타입 에러

```bash
# 타입 체크
npx tsc --noEmit
```

### Firestore 접근 거부

```
Error: Missing or insufficient permissions
```

→ 클라이언트에서 Firestore에 직접 접근하려고 함. Server Actions를 통해 접근하도록 수정.
