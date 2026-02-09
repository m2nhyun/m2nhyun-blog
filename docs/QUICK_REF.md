# 빠른 참조 (Quick Reference)

> **최소 토큰으로 작업 시작하기**
> 간단한 수정은 이 파일만 읽으면 됩니다.

---

## 핵심 경로

| 기능 | 타입 | 액션 | 컴포넌트 |
|------|------|------|----------|
| 블로그 | `entities/post/types.ts` | `app/actions/post.ts` | `features/blog-post/components/` |
| 방명록 | `entities/guestbook-entry/types.ts` | `app/actions/guestbook.ts` | `features/guestbook/components/` |
| 포트폴리오 | `entities/portfolio-item/types.ts` | `app/actions/portfolio.ts` | `features/portfolio/components/` |
| 인증 | `entities/user/types.ts` | `features/auth/services/authService.ts` | `features/auth/components/` |

---

## 타입 정의 요약

### Post
```typescript
interface Post {
    id: string;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    tags: string[];
    category?: string;
    featured: boolean;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
```

### GuestbookEntry
```typescript
interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    email?: string;
    approved: boolean;
    createdAt: string;
}
```

### PortfolioItem
```typescript
interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    category: 'web' | 'mobile' | 'desktop' | 'library' | 'design';
    status: 'completed' | 'in-progress' | 'planned';
    featured: boolean;
    order: number;
    createdAt: string;
}
```

---

## Server Action 패턴

```typescript
// src/app/actions/example.ts
'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

// CREATE
export async function createItem(data: Data): Promise<string> {
    const db = getAdminDb();
    const docRef = await db.collection('items').add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });
    revalidatePath('/items');
    return docRef.id;
}

// READ (List)
export async function getItems(): Promise<Item[]> {
    const db = getAdminDb();
    const snapshot = await db.collection('items').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
    })) as Item[];
}

// UPDATE
export async function updateItem(data: UpdateData): Promise<void> {
    const db = getAdminDb();
    const { id, ...updateData } = data;
    await db.collection('items').doc(id).update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
    });
    revalidatePath('/items');
}

// DELETE
export async function deleteItem(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection('items').doc(id).delete();
    revalidatePath('/items');
}
```

---

## 컴포넌트 패턴

### 목록 컴포넌트
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getItems } from '@/app/actions/item';

export const ItemList = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getItems().then(setItems).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div>로딩 중...</div>;
    return <div>{items.map(item => <ItemCard key={item.id} item={item} />)}</div>;
};
```

### 폼 컴포넌트
```typescript
'use client';

import { useState } from 'react';
import { createItem } from '@/app/actions/item';

export const ItemForm = ({ onComplete }: { onComplete?: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        await createItem({ title: formData.get('title') as string });
        onComplete?.();
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" required />
            <button type="submit" disabled={isSubmitting}>저장</button>
        </form>
    );
};
```

---

## Import 규칙

```typescript
// 1. React/Next
import { useState, useEffect } from 'react';
import { revalidatePath } from 'next/cache';

// 2. Actions
import { getPosts, createPost } from '@/app/actions/post';

// 3. Entities
import { Post } from '@/entities/post';

// 4. Features (같은 feature 내부)
import { PostCard } from './PostCard';

// 5. Shared
import { cn } from '@/shared/utils';
import { Button } from '@/shared/ui';
```

---

## 더 자세한 정보가 필요하면

| 문서 | 용도 |
|------|------|
| `TASK_INDEX.md` | 전체 태스크 목록 & 시작 가이드 |
| `CLAUDE_GUIDE.md` | 작업별 상세 가이드 |
| `ARCHITECTURE.md` | FSD 구조 상세 |
| `COMPONENTS.md` | 컴포넌트 패턴 상세 |
