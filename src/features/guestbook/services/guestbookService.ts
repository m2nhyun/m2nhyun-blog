// features/guestbook/services/guestbookService.ts
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    where,
    Timestamp,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase/config';
import {
    GuestbookEntry,
    GuestbookEntryCreateData,
} from '@/entities/guestbook-entry';

const GUESTBOOK_COLLECTION = 'guestbook';

// 방명록 항목 생성
export const createGuestbookEntry = async (
    data: GuestbookEntryCreateData,
): Promise<string> => {
    try {
        const entryData = {
            ...data,
            email: data.email || null,
            website: data.website || null,
            approved: false, // 기본적으로 미승인 상태
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(
            collection(db, GUESTBOOK_COLLECTION),
            entryData,
        );
        return docRef.id;
    } catch (error) {
        console.error('Error creating guestbook entry:', error);
        throw error;
    }
};

// 방명록 목록 조회
export const getGuestbookEntries = async (
    approvedOnly: boolean = true,
): Promise<GuestbookEntry[]> => {
    try {
        const entriesRef = collection(db, GUESTBOOK_COLLECTION);
        let q = query(entriesRef, orderBy('createdAt', 'desc'));

        if (approvedOnly) {
            q = query(
                entriesRef,
                where('approved', '==', true),
                orderBy('createdAt', 'desc'),
            );
        }

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        })) as GuestbookEntry[];
    } catch (error) {
        console.error('Error getting guestbook entries:', error);
        throw error;
    }
};

// 방명록 항목 삭제
export const deleteGuestbookEntry = async (id: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const docRef = doc(db, GUESTBOOK_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting guestbook entry:', error);
        throw error;
    }
};

// 방명록 항목 승인
export const approveGuestbookEntry = async (id: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const docRef = doc(db, GUESTBOOK_COLLECTION, id);
        await updateDoc(docRef, {
            approved: true,
            updatedAt: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error approving guestbook entry:', error);
        throw error;
    }
};
