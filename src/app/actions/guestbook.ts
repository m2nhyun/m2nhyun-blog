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

    // 복합 인덱스 없이 동작하도록 createdAt으로만 정렬 후 클라이언트에서 필터링
    const snapshot = await db
        .collection(GUESTBOOK_COLLECTION)
        .orderBy('createdAt', 'desc')
        .get();

    const entries = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || '',
            updatedAt: data.updatedAt?.toDate().toISOString() || '',
        } as GuestbookEntry;
    });

    // approvedOnly인 경우 클라이언트에서 필터링
    if (approvedOnly) {
        return entries.filter((entry) => entry.approved);
    }

    return entries;
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
