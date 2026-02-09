import { Metadata } from 'next';
import { BlogDetail } from '@/features/blog-post';
import { getPostBySlug } from '@/features/blog-post/services/postService';

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    try {
        const post = await getPostBySlug(params.slug);

        if (!post) {
            return {
                title: '포스트를 찾을 수 없습니다',
            };
        }

        return {
            title: post.title,
            description: post.excerpt || post.content?.substring(0, 160),
            openGraph: {
                title: post.title,
                description: post.excerpt || post.content?.substring(0, 160),
                type: 'article',
                publishedTime: post.publishedAt,
                modifiedTime: post.updatedAt,
                authors: [post.author],
                tags: post.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content?.substring(0, 160),
            },
        };
    } catch {
        return {
            title: '포스트',
        };
    }
}

export default function BlogPostPage({ params }: PageProps) {
    return <BlogDetail slug={params.slug} />;
}
