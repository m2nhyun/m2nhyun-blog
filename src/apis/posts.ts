// src/lib/posts.ts

import { db } from '@/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
} from 'firebase/firestore';
// src/lib/posts.ts
interface Post {
    title: string;
    content: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    views: number;
    likes: number;
}
type CreatePostInput = Pick<Post, 'title' | 'content' | 'slug' | 'tags'>;

// createPost 함수 수정
export async function createPost(post: CreatePostInput) {
    const docRef = await addDoc(collection(db, 'posts'), {
        ...post,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    return docRef.id;
}
// 모든 포스트 가져오기
export async function getAllPosts() {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

// 특정 포스트 가져오기
export async function getPost(id: string) {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    };
}

// 포스트 수정
export async function updatePost(id: string, data: Partial<Post>) {
    const docRef = doc(db, 'posts', id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
}

// 포스트 삭제
export async function deletePost(id: string) {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
}
