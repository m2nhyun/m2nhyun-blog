import { BlogDetail } from '@/features/blog-post';

interface PageProps {
    params: {
        slug: string;
    };
}

export default function BlogPostPage({ params }: PageProps) {
    return <BlogDetail slug={params.slug} />;
}

// 정적 생성을 위한 함수 (나중에 활성화 가능)
// export async function generateStaticParams() {
//     const posts = await getPosts();
//     return posts.map((post) => ({
//         slug: post.slug,
//     }));
// }
