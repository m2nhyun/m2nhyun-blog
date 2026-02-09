import { Metadata } from 'next';
import { BlogDetail } from '@/features/blog-post';

interface PageProps {
    params: {
        slug: string;
    };
}

export const metadata: Metadata = {
    title: '블로그 포스트',
    description: '블로그 포스트를 확인하세요.',
};

export default function BlogPostPage({ params }: PageProps) {
    return <BlogDetail slug={params.slug} />;
}
