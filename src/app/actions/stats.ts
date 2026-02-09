'use server';

import { getAdminDb } from '@/shared/lib/firebase/admin';

export interface DashboardStats {
    totalPosts: number;
    publishedPosts: number;
    totalGuestbook: number;
    pendingGuestbook: number;
    totalPortfolio: number;
    totalViews: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const db = getAdminDb();

    try {
        // 포스트 통계
        const postsSnapshot = await db.collection('posts').get();
        const posts = postsSnapshot.docs.map((doc) => doc.data());
        const totalPosts = posts.length;
        const publishedPosts = posts.filter((p) => p.published).length;
        const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

        // 방명록 통계
        const guestbookSnapshot = await db.collection('guestbook').get();
        const guestbook = guestbookSnapshot.docs.map((doc) => doc.data());
        const totalGuestbook = guestbook.length;
        const pendingGuestbook = guestbook.filter((g) => !g.approved).length;

        // 포트폴리오 통계
        const portfolioSnapshot = await db.collection('portfolio').get();
        const totalPortfolio = portfolioSnapshot.size;

        return {
            totalPosts,
            publishedPosts,
            totalGuestbook,
            pendingGuestbook,
            totalPortfolio,
            totalViews,
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return {
            totalPosts: 0,
            publishedPosts: 0,
            totalGuestbook: 0,
            pendingGuestbook: 0,
            totalPortfolio: 0,
            totalViews: 0,
        };
    }
}
