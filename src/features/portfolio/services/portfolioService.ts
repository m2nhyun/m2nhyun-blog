// features/portfolio/services/portfolioService.ts
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
    PortfolioItem,
    PortfolioItemCreateData,
    PortfolioItemUpdateData,
} from '@/entities/portfolio-item';

const PORTFOLIO_COLLECTION = 'portfolio';

// 포트폴리오 항목 생성
export const createPortfolioItem = async (
    data: PortfolioItemCreateData,
): Promise<string> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const itemData = {
            ...data,
            status: data.status || 'completed',
            featured: data.featured || false,
            order: data.order || 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(
            collection(db, PORTFOLIO_COLLECTION),
            itemData,
        );
        return docRef.id;
    } catch (error) {
        console.error('Error creating portfolio item:', error);
        throw error;
    }
};

// 포트폴리오 목록 조회
export const getPortfolioItems = async (
    featuredOnly: boolean = false,
): Promise<PortfolioItem[]> => {
    try {
        const itemsRef = collection(db, PORTFOLIO_COLLECTION);
        let q = query(
            itemsRef,
            orderBy('order', 'asc'),
            orderBy('createdAt', 'desc'),
        );

        if (featuredOnly) {
            q = query(
                itemsRef,
                where('featured', '==', true),
                orderBy('order', 'asc'),
                orderBy('createdAt', 'desc'),
            );
        }

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        })) as PortfolioItem[];
    } catch (error) {
        console.error('Error getting portfolio items:', error);
        throw error;
    }
};

// 포트폴리오 항목 수정
export const updatePortfolioItem = async (
    data: PortfolioItemUpdateData,
): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const { id, ...updateData } = data;
        const docRef = doc(db, PORTFOLIO_COLLECTION, id);

        await updateDoc(docRef, {
            ...updateData,
            updatedAt: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error updating portfolio item:', error);
        throw error;
    }
};

// 포트폴리오 항목 삭제
export const deletePortfolioItem = async (id: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const docRef = doc(db, PORTFOLIO_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting portfolio item:', error);
        throw error;
    }
};
