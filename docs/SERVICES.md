# 서비스 레이어 가이드

이 문서는 Next.js Server Actions와 Firebase Admin SDK를 사용한 데이터 레이어 구현 방법을 설명합니다.

## 아키텍처 개요

### 이전 방식 (Client SDK) vs 현재 방식 (Server Actions)

| 항목 | 이전 (Client SDK) | 현재 (Server Actions) |
|------|-------------------|----------------------|
| 실행 위치 | 브라우저 | 서버 |
| Firebase SDK | firebase/firestore | firebase-admin |
| 보안 규칙 | Firestore Rules 의존 | Admin SDK가 우회 |
| 번들 크기 | ~240KB | ~120KB |
| 인증 확인 | auth.currentUser | 서버에서 검증 |

### 장점

- **보안 강화**: API 키가 클라이언트에 노출되지 않음
- **번들 크기 감소**: ~50% 감소
- **통합 백엔드**: 별도 API 서버 불필요
- **캐시 제어**: `revalidatePath`로 정밀한 캐시 관리

## Server Actions 구조

```
src/app/actions/
├── post.ts          # 블로그 포스트 CRUD
├── guestbook.ts     # 방명록 CRUD
└── portfolio.ts     # 포트폴리오 CRUD
```

## Firebase Admin SDK 설정

### 초기화 (`shared/lib/firebase/admin.ts`)

```typescript
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let adminDb: Firestore | undefined;

const getAdminApp = (): App => {
    if (!app) {
        const existingApps = getApps();
        if (existingApps.length > 0) {
            app = existingApps[0];
        } else {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
                throw new Error('Firebase Admin 환경 변수가 설정되지 않았습니다');
            }

            app = initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        }
    }
    return app;
};

export const getAdminDb = (): Firestore => {
    if (!adminDb) {
        adminDb = getFirestore(getAdminApp());
    }
    return adminDb;
};
```

## Server Action 패턴

### 기본 템플릿

```typescript
// app/actions/item.ts
'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { Item, ItemCreateData, ItemUpdateData } from '@/entities/item';

const COLLECTION_NAME = 'items';

// Create
export async function createItem(data: ItemCreateData): Promise<string> {
    const db = getAdminDb();

    const itemData = {
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTION_NAME).add(itemData);

    revalidatePath('/items');  // 캐시 무효화
    return docRef.id;
}

// Read (List)
export async function getItems(filterActive: boolean = false): Promise<Item[]> {
    const db = getAdminDb();

    let query = db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc');

    if (filterActive) {
        query = db.collection(COLLECTION_NAME)
            .where('active', '==', true)
            .orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || '',
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || '',
    })) as Item[];
}

// Read (Single by ID)
export async function getItem(id: string): Promise<Item | null> {
    const db = getAdminDb();
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return null;
    }

    const data = docSnap.data()!;
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || '',
        updatedAt: data.updatedAt?.toDate().toISOString() || '',
    } as Item;
}

// Read (Single by Slug)
export async function getItemBySlug(slug: string): Promise<Item | null> {
    const db = getAdminDb();

    const snapshot = await db
        .collection(COLLECTION_NAME)
        .where('slug', '==', slug)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || '',
        updatedAt: data.updatedAt?.toDate().toISOString() || '',
    } as Item;
}

// Update
export async function updateItem(data: ItemUpdateData): Promise<void> {
    const db = getAdminDb();
    const { id, ...updateData } = data;

    await db.collection(COLLECTION_NAME).doc(id).update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/items');
    revalidatePath(`/items/${id}`);
}

// Delete
export async function deleteItem(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(COLLECTION_NAME).doc(id).delete();

    revalidatePath('/items');
}

// Increment Field (조회수 등)
export async function incrementViews(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(COLLECTION_NAME).doc(id).update({
        views: FieldValue.increment(1),
    });
}
```

## 실제 구현 예시

### 블로그 포스트 (`app/actions/post.ts`)

```typescript
'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { Post, PostCreateData, PostUpdateData } from '@/entities/post';

const POSTS_COLLECTION = 'posts';

export async function getPosts(publishedOnly: boolean = true): Promise<Post[]> {
    const db = getAdminDb();

    let query = db.collection(POSTS_COLLECTION).orderBy('createdAt', 'desc');

    if (publishedOnly) {
        query = db
            .collection(POSTS_COLLECTION)
            .where('published', '==', true)
            .orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || '',
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || '',
    })) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const db = getAdminDb();

    const snapshot = await db
        .collection(POSTS_COLLECTION)
        .where('slug', '==', slug)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || '',
        updatedAt: data.updatedAt?.toDate().toISOString() || '',
    } as Post;
}

export async function createPost(data: PostCreateData): Promise<string> {
    const db = getAdminDb();

    const postData = {
        ...data,
        author: 'admin',
        views: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(POSTS_COLLECTION).add(postData);

    revalidatePath('/blog');
    revalidatePath('/admin');

    return docRef.id;
}

export async function updatePost(data: PostUpdateData): Promise<void> {
    const db = getAdminDb();
    const { id, ...updateData } = data;

    await db.collection(POSTS_COLLECTION).doc(id).update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${updateData.slug || ''}`);
    revalidatePath('/admin');
}

export async function deletePost(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(POSTS_COLLECTION).doc(id).delete();

    revalidatePath('/blog');
    revalidatePath('/admin');
}

export async function incrementViews(postId: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(POSTS_COLLECTION).doc(postId).update({
        views: FieldValue.increment(1),
    });
}
```

## 컴포넌트에서 사용하기

### 목록 조회

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/app/actions/post';
import { Post } from '@/entities/post';

export const BlogList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts(true);  // Server Action 호출
                setPosts(data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // 렌더링...
};
```

### 생성/수정

```typescript
'use client';

import { createPost, updatePost } from '@/app/actions/post';

export const PostForm = ({ post }: { post?: Post }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: PostFormData) => {
        setIsSubmitting(true);

        try {
            if (post) {
                await updatePost({ ...data, id: post.id });
            } else {
                await createPost(data);
            }
            // 성공 처리
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 폼 렌더링...
};
```

## 인증 서비스 (클라이언트 유지)

인증은 여전히 클라이언트에서 처리합니다:

```typescript
// features/auth/services/authService.ts
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '@/shared/lib/firebase/config';
import { isAdmin } from '@/shared/lib';

export const loginWithEmail = async (
    email: string,
    password: string,
): Promise<AuthUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // ...
};

export const logout = async (): Promise<void> => {
    await signOut(auth);
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (user: User | null) => {
        // ...
    });
};
```

## 클라이언트 SDK 설정 (인증 전용)

Proxy 패턴으로 lazy initialization:

```typescript
// shared/lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;

const getFirebaseApp = (): FirebaseApp => {
    if (typeof window === 'undefined') {
        throw new Error('Firebase Client SDK는 클라이언트에서만 사용 가능합니다');
    }
    if (!app) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    }
    return app;
};

// Proxy로 lazy initialization
export const auth: Auth = new Proxy({} as Auth, {
    get(_, prop) {
        if (!authInstance) {
            authInstance = getAuth(getFirebaseApp());
        }
        return (authInstance as unknown as Record<string | symbol, unknown>)[prop];
    },
});
```

## 캐시 무효화

### revalidatePath 사용

```typescript
import { revalidatePath } from 'next/cache';

// 생성/수정/삭제 후 관련 경로 무효화
export async function createPost(data: PostCreateData): Promise<string> {
    // ... 생성 로직

    revalidatePath('/blog');           // 목록 페이지
    revalidatePath('/admin');          // 관리자 페이지

    return docRef.id;
}

export async function updatePost(data: PostUpdateData): Promise<void> {
    // ... 수정 로직

    revalidatePath('/blog');
    revalidatePath(`/blog/${data.slug}`);  // 상세 페이지
    revalidatePath('/admin');
}
```

## Timestamp 변환

### Admin SDK Timestamp

```typescript
import { FieldValue } from 'firebase-admin/firestore';

// 저장 시
const data = {
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
};

// 읽기 시
const item = {
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString() || '',
    updatedAt: doc.data().updatedAt?.toDate().toISOString() || '',
};
```

## 에러 처리

```typescript
'use server';

export async function createPost(data: PostCreateData): Promise<string> {
    try {
        const db = getAdminDb();
        // ... 생성 로직
        return docRef.id;
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('포스트 생성에 실패했습니다');
    }
}
```

## Firestore 보안 규칙

Admin SDK가 보안 규칙을 우회하므로, 클라이언트 접근 완전 차단:

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

## 쿼리 예시

### 필터링 + 정렬

```typescript
const snapshot = await db
    .collection('posts')
    .where('published', '==', true)
    .where('category', '==', 'tech')
    .orderBy('createdAt', 'desc')
    .get();
```

### 제한 + 페이지네이션

```typescript
const snapshot = await db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
```

### 복합 인덱스

복합 쿼리 사용 시 Firebase Console에서 인덱스 생성 필요:
- `posts`: `published` (ASC) + `createdAt` (DESC)
