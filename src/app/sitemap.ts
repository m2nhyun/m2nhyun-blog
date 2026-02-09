import { MetadataRoute } from 'next';
import { getPosts } from '@/features/blog-post/services/postService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://m2nhyun-blog.vercel.app';

    // 정적 페이지
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/guestbook`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // 동적 페이지 (블로그 포스트)
    try {
        const posts = await getPosts(true);
        const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...staticPages, ...postPages];
    } catch {
        return staticPages;
    }
}
