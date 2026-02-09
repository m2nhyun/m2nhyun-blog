'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import {
    PortfolioItem,
    PortfolioItemCreateData,
    PortfolioItemUpdateData,
} from '@/entities/portfolio-item';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

const PORTFOLIO_COLLECTION = 'portfolio';

// 포트폴리오 항목 생성
export async function createPortfolioItem(
    data: PortfolioItemCreateData,
): Promise<string> {
    const db = getAdminDb();

    const itemData = {
        ...data,
        status: data.status || 'completed',
        featured: data.featured || false,
        order: data.order || 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(PORTFOLIO_COLLECTION).add(itemData);

    revalidatePath('/portfolio');
    return docRef.id;
}

// 포트폴리오 목록 조회
export async function getPortfolioItems(
    featuredOnly: boolean = false,
): Promise<PortfolioItem[]> {
    const db = getAdminDb();

    let query = db.collection(PORTFOLIO_COLLECTION).orderBy('order', 'asc');

    if (featuredOnly) {
        query = db
            .collection(PORTFOLIO_COLLECTION)
            .where('featured', '==', true)
            .orderBy('order', 'asc');
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || '',
            updatedAt: data.updatedAt?.toDate().toISOString() || '',
        } as PortfolioItem;
    });
}

// 포트폴리오 항목 수정
export async function updatePortfolioItem(
    data: PortfolioItemUpdateData,
): Promise<void> {
    const db = getAdminDb();
    const { id, ...updateData } = data;

    await db
        .collection(PORTFOLIO_COLLECTION)
        .doc(id)
        .update({
            ...updateData,
            updatedAt: FieldValue.serverTimestamp(),
        });

    revalidatePath('/portfolio');
}

// 포트폴리오 항목 삭제
export async function deletePortfolioItem(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(PORTFOLIO_COLLECTION).doc(id).delete();

    revalidatePath('/portfolio');
}
