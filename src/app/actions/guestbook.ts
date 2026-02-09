'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';
import {
    GuestbookEntry,
    GuestbookEntryCreateData,
} from '@/entities/guestbook-entry';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

const GUESTBOOK_COLLECTION = 'guestbook';

// 방명록 항목 생성
export async function createGuestbookEntry(
    data: GuestbookEntryCreateData,
): Promise<string> {
    const db = getAdminDb();

    const entryData = {
        ...data,
        email: data.email || null,
        website: data.website || null,
        approved: false, // 기본적으로 미승인 상태
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(GUESTBOOK_COLLECTION).add(entryData);

    revalidatePath('/guestbook');
    return docRef.id;
}

// 방명록 목록 조회
export async function getGuestbookEntries(
    approvedOnly: boolean = true,
): Promise<GuestbookEntry[]> {
    const db = getAdminDb();

    let query = db
        .collection(GUESTBOOK_COLLECTION)
        .orderBy('createdAt', 'desc');

    if (approvedOnly) {
        query = db
            .collection(GUESTBOOK_COLLECTION)
            .where('approved', '==', true)
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
        } as GuestbookEntry;
    });
}

// 방명록 항목 삭제
export async function deleteGuestbookEntry(id: string): Promise<void> {
    const db = getAdminDb();
    await db.collection(GUESTBOOK_COLLECTION).doc(id).delete();

    revalidatePath('/guestbook');
}

// 방명록 항목 승인
export async function approveGuestbookEntry(id: string): Promise<void> {
    const db = getAdminDb();

    await db.collection(GUESTBOOK_COLLECTION).doc(id).update({
        approved: true,
        updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/guestbook');
}
