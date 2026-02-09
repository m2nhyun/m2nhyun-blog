'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import { Post, PostCreateData, PostUpdateData } from '@/entities/post';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

const POSTS_COLLECTION = 'posts';

// 포스트 생성
export async function createPost(data: PostCreateData): Promise<string> {
    const db = getAdminDb();

    const postData = {
        ...data,
        featured: data.featured || false,
        published: data.published || false,
        views: 0,
        likes: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        publishedAt: data.published ? FieldValue.serverTimestamp() : null,
    };

    const docRef = await db.collection(POSTS_COLLECTION).add(postData);

    revalidatePath('/blog');
    return docRef.id;
}

// 포스트 목록 조회
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

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || '',
            updatedAt: data.updatedAt?.toDate().toISOString() || '',
            publishedAt: data.publishedAt?.toDate().toISOString() || null,
        } as Post;
    });
}

// 포스트 상세 조회
export async function getPost(id: string): Promise<Post | null> {
    const db = getAdminDb();
    const docRef = db.collection(POSTS_COLLECTION).doc(id);
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
        publishedAt: data.publishedAt?.toDate().toISOString() || null,
    } as Post;
}

// slug로 포스트 조회
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const db = getAdminDb();

    const snapshot = await db
        .collection(POSTS_COLLECTION)
        .where('slug', '==', slug)
        .where('published', '==', true)
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
        publishedAt: data.publishedAt?.toDate().toISOString() || null,
    } as Post;
}

// 포스트 수정
export async function updatePost(data: PostUpdateData): Promise<void> {
    const db = getAdminDb();
    const { id, ...updateData } = data;

    await db
        .collection(POSTS_COLLECTION)
        .doc(id)
        .update({
            ...updateData,
            updatedAt: FieldValue.serverTimestamp(),
            publishedAt: data.published ? FieldValue.serverTimestamp() : null,
        });

    revalidatePath('/blog');
    revalidatePath(`/blog/${data.slug}`);
}

// 포스트 삭제
export async function deletePost(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(POSTS_COLLECTION).doc(id).delete();

    revalidatePath('/blog');
}

// 조회수 증가
export async function incrementViews(id: string): Promise<void> {
    const db = getAdminDb();
    await db
        .collection(POSTS_COLLECTION)
        .doc(id)
        .update({
            views: FieldValue.increment(1),
        });
}
