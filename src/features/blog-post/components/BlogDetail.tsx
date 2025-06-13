'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPostBySlug, incrementViews } from '../services/postService';
import { Post } from '@/entities/post';

interface BlogDetailProps {
    slug: string;
}

export const BlogDetail = ({ slug }: BlogDetailProps) => {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await getPostBySlug(slug);

                if (!fetchedPost) {
                    setError('포스트를 찾을 수 없습니다.');
                    return;
                }

                setPost(fetchedPost);

                // 조회수 증가 (비동기, 에러 무시)
                incrementViews(fetchedPost.id);
            } catch (error) {
                console.error('Error loading blog post:', error);
                setError('포스트를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                    포스트를 불러오는 중...
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {error || '포스트를 찾을 수 없습니다'}
                </h1>
                <button
                    onClick={() => router.push('/blog')}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    ← 블로그 목록으로 돌아가기
                </button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 간단한 Markdown 렌더링 (나중에 react-markdown으로 개선 가능)
    const renderMarkdown = (content: string) => {
        return content
            .replace(
                /^### (.*$)/gm,
                '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>',
            )
            .replace(
                /^## (.*$)/gm,
                '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>',
            )
            .replace(
                /^# (.*$)/gm,
                '<h1 class="text-3xl font-bold mb-6 mt-10">$1</h1>',
            )
            .replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="font-semibold">$1</strong>',
            )
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(
                /`(.*?)`/g,
                '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>',
            )
            .replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
            )
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br/>');
    };

    return (
        <article className="max-w-4xl mx-auto">
            {/* 뒤로가기 버튼 */}
            <button
                onClick={() => router.push('/blog')}
                className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
                ← 블로그 목록으로
            </button>

            {/* 포스트 헤더 */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {post.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <time dateTime={post.createdAt}>
                        {formatDate(post.createdAt)}
                    </time>
                    <span>작성자: {post.author}</span>
                    {post.views !== undefined && (
                        <span>조회 {post.views}회</span>
                    )}
                    {post.category && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                            {post.category}
                        </span>
                    )}
                </div>

                {post.excerpt && (
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
                        {post.excerpt}
                    </p>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 
                                         text-blue-800 dark:text-blue-200 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* 포스트 내용 */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none
                         prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                         prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-4
                         prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                         prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
                         prose-a:text-blue-600 dark:prose-a:text-blue-400"
            >
                <p
                    className="mb-4"
                    dangerouslySetInnerHTML={{
                        __html: renderMarkdown(post.content),
                    }}
                />
            </div>

            {/* 포스트 푸터 */}
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        마지막 수정: {formatDate(post.updatedAt)}
                    </div>

                    {/* 공유 버튼들 (나중에 추가 가능) */}
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            공유
                        </button>
                    </div>
                </div>
            </footer>
        </article>
    );
};
