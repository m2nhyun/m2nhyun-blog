# Claude 작업 가이드

> 이 문서는 Claude가 프로젝트 작업 시 **먼저 읽어야 할 파일**입니다.
> 토큰 최적화를 위해 작업별로 필요한 문서만 읽도록 설계되었습니다.

## 문서 사용법

| 상황 | 읽어야 할 문서 |
|------|---------------|
| **태스크 시작** | `TASK_INDEX.md` → 해당 태스크의 "읽어야 할 파일" 참조 |
| **간단한 수정** | `QUICK_REF.md` 만 |
| **새 기능 추가** | `QUICK_REF.md` + `ARCHITECTURE.md` |

---

## 프로젝트 현황 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| FSD 아키텍처 | ✅ 완료 | app/widgets/features/entities/shared |
| Server Actions | ✅ 완료 | `src/app/actions/` (post, guestbook, portfolio) |
| 엔티티 타입 | ✅ 완료 | Post, GuestbookEntry, PortfolioItem, User |
| Firebase Admin | ✅ 완료 | `src/shared/lib/firebase/admin.ts` |
| 다크모드 | ✅ 완료 | `features/theme` |
| 테스트 | ❌ 미구현 | - |
| 에러 바운더리 | ⚠️ 기본만 | `app/error.tsx` |

---

## 🚨 중요: 아키텍처 패턴

이 프로젝트는 **Next.js Server Actions** 패턴을 사용합니다.

```
[컴포넌트] → [Server Action] → [Firebase Admin SDK]
                  ↓
            src/app/actions/*.ts
```

**주의**: `docs/SERVICES.md`는 클라이언트 SDK 패턴이므로 참고용입니다.
실제 구현은 `src/app/actions/` 폴더의 Server Actions를 따릅니다.

---

## 작업별 가이드

### 1️⃣ 블로그 기능 수정/추가

**읽어야 할 파일:**
```
docs/CLAUDE_GUIDE.md          (현재 파일 - 필수)
src/entities/post/types.ts    (Post 타입 정의)
src/app/actions/post.ts       (Server Actions CRUD)
```

**컴포넌트 수정 시 추가:**
```
src/features/blog-post/components/BlogList.tsx
src/features/blog-post/components/BlogDetail.tsx
src/features/blog-post/components/PostForm.tsx
```

**페이지 수정 시 추가:**
```
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/admin/posts/new/page.tsx
```

---

### 2️⃣ 방명록 기능 수정/추가

**읽어야 할 파일:**
```
docs/CLAUDE_GUIDE.md                    (필수)
src/entities/guestbook-entry/types.ts   (GuestbookEntry 타입)
src/app/actions/guestbook.ts            (Server Actions)
```

**컴포넌트 수정 시 추가:**
```
src/features/guestbook/components/GuestbookList.tsx
src/features/guestbook/components/GuestbookForm.tsx
src/features/guestbook/components/GuestbookContent.tsx
```

---

### 3️⃣ 포트폴리오 기능 수정/추가

**읽어야 할 파일:**
```
docs/CLAUDE_GUIDE.md                    (필수)
src/entities/portfolio-item/types.ts    (PortfolioItem 타입)
src/app/actions/portfolio.ts            (Server Actions)
```

**컴포넌트 수정 시 추가:**
```
src/features/portfolio/components/PortfolioContent.tsx
```

---

### 4️⃣ UI/레이아웃 수정

**읽어야 할 파일:**
```
docs/CLAUDE_GUIDE.md              (필수)
docs/COMPONENTS.md                (컴포넌트 패턴)
```

**Header/Footer 수정:**
```
src/widgets/header/Header.tsx
src/widgets/header/Sidebar.tsx
src/widgets/footer/Footer.tsx
```

**공통 UI 컴포넌트:**
```
src/shared/ui/
```

---

### 5️⃣ 새로운 Feature 추가

**읽어야 할 파일:**
```
docs/CLAUDE_GUIDE.md        (필수)
docs/ARCHITECTURE.md        (FSD 구조 & import 규칙)
docs/COMPONENTS.md          (컴포넌트 패턴)
```

**참고할 기존 구현:**
```
src/features/blog-post/     (가장 완성도 높은 feature)
src/app/actions/post.ts     (Server Action 패턴)
```

---

### 6️⃣ 인증/관리자 기능

**읽어야 할 파일:**
```
docs/CLAUDE_GUIDE.md                  (필수)
src/entities/user/types.ts            (User 타입)
src/features/auth/services/authService.ts
src/shared/lib/firebase/auth.ts
```

**컴포넌트:**
```
src/features/auth/components/LoginForm.tsx
src/features/auth/components/AdminContent.tsx
```

---

## 코딩 규칙 요약

### Server Action 패턴
```typescript
// src/app/actions/example.ts
'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

export async function createItem(data: ItemCreateData): Promise<string> {
    const db = getAdminDb();
    const docRef = await db.collection('items').add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
    });
    revalidatePath('/items');
    return docRef.id;
}
```

### 컴포넌트에서 Server Action 호출
```typescript
'use client';

import { createItem } from '@/app/actions/item';

const handleSubmit = async (data: FormData) => {
    await createItem(data);
    // 성공 처리
};
```

### Import 순서
```typescript
// 1. React/Next.js
import { useState } from 'react';

// 2. Server Actions
import { getPosts } from '@/app/actions/post';

// 3. Entities
import { Post } from '@/entities/post';

// 4. Shared
import { cn } from '@/shared/utils';
```

---

## 폴더 구조 빠른 참조

```
src/
├── app/
│   ├── actions/          # ⭐ Server Actions (CRUD)
│   │   ├── post.ts
│   │   ├── guestbook.ts
│   │   └── portfolio.ts
│   ├── blog/             # 블로그 페이지
│   ├── guestbook/        # 방명록 페이지
│   ├── portfolio/        # 포트폴리오 페이지
│   └── admin/            # 관리자 페이지
├── features/
│   ├── blog-post/        # 블로그 컴포넌트
│   ├── guestbook/        # 방명록 컴포넌트
│   ├── portfolio/        # 포트폴리오 컴포넌트
│   ├── auth/             # 인증 컴포넌트 + 서비스
│   └── theme/            # 테마 (다크모드)
├── entities/             # 타입 정의
├── widgets/              # Header, Footer
└── shared/               # 공통 코드
    ├── lib/firebase/     # Firebase 설정
    ├── ui/               # 공통 UI
    └── utils/            # 유틸리티
```

---

## 자주 사용하는 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 빌드
npm run lint     # 린트 검사
```
