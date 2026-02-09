# 서비스 레이어 가이드

이 문서는 Firebase 서비스 패턴과 CRUD 구현 방법을 설명합니다.

## 서비스 구조

각 feature의 서비스는 다음 위치에 있습니다:

```
features/{feature-name}/
└── services/
    └── {feature}Service.ts
```

## Firebase 설정

```typescript
// shared/lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## CRUD 서비스 패턴

### 기본 템플릿

```typescript
// features/{feature}/services/{feature}Service.ts
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    Timestamp,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase/config';
import { Item, ItemCreateData, ItemUpdateData } from '@/entities/item';

const COLLECTION_NAME = 'items';

// Create
export const createItem = async (data: ItemCreateData): Promise<string> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const itemData = {
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), itemData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
};

// Read (List)
export const getItems = async (filter?: boolean): Promise<Item[]> => {
    try {
        const itemsRef = collection(db, COLLECTION_NAME);
        let q = query(itemsRef, orderBy('createdAt', 'desc'));

        if (filter) {
            q = query(
                itemsRef,
                where('active', '==', true),
                orderBy('createdAt', 'desc'),
            );
        }

        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        })) as Item[];
    } catch (error) {
        console.error('Error getting items:', error);
        throw error;
    }
};

// Read (Single)
export const getItem = async (id: string): Promise<Item | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString(),
            } as Item;
        }

        return null;
    } catch (error) {
        console.error('Error getting item:', error);
        throw error;
    }
};

// Update
export const updateItem = async (data: ItemUpdateData): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const { id, ...updateData } = data;
        const docRef = doc(db, COLLECTION_NAME, id);

        await updateDoc(docRef, {
            ...updateData,
            updatedAt: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Delete
export const deleteItem = async (id: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};
```

## 인증 서비스

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

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    isAdmin: boolean;
}

// 로그인
export const loginWithEmail = async (
    email: string,
    password: string,
): Promise<AuthUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: isAdmin(user.uid),
    };
};

// 로그아웃
export const logout = async (): Promise<void> => {
    await signOut(auth);
};

// 인증 상태 감지
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (user: User | null) => {
        if (user && isAdmin(user.uid)) {
            callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                isAdmin: true,
            });
        } else {
            callback(null);
        }
    });
};
```

## 에러 처리

서비스에서 에러는 throw하고, 컴포넌트에서 처리합니다:

```typescript
// 서비스
export const getItems = async (): Promise<Item[]> => {
    try {
        // ...
    } catch (error) {
        console.error('Error getting items:', error);
        throw error; // 에러를 throw
    }
};

// 컴포넌트
useEffect(() => {
    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
        } catch (error) {
            setError('데이터를 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    fetchItems();
}, []);
```

## Timestamp 변환

Firebase Timestamp를 ISO 문자열로 변환:

```typescript
// Firestore에서 읽을 때
const data = docSnap.data();
return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString(),
};

// Firestore에 쓸 때
const itemData = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
};
```

## 쿼리 예시

### 필터링

```typescript
const q = query(
    collection(db, 'posts'),
    where('published', '==', true),
    where('category', '==', 'tech'),
);
```

### 정렬

```typescript
const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
);
```

### 복합 쿼리

```typescript
const q = query(
    collection(db, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
);
```

> **참고**: 복합 쿼리는 Firebase에서 복합 인덱스가 필요할 수 있습니다.
