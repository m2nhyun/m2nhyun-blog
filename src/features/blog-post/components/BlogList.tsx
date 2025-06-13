'use client';

import { useState, useEffect } from 'react';

// TODO: entities/post에서 타입 import 예정
interface Post {
    id: string;
    title: string;
    content: string;
    slug: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export const BlogList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: services에서 포스트 목록 가져오기 로직 구현
        const fetchPosts = async () => {
            try {
                // 임시 데이터
                const mockPosts: Post[] = [
                    {
                        id: '1',
                        title: '첫 번째 블로그 포스트',
                        content: '블로그를 시작합니다...',
                        slug: 'first-blog-post',
                        tags: ['시작', '블로그'],
                        createdAt: '2024-01-01',
                        updatedAt: '2024-01-01',
                    },
                ];

                setPosts(mockPosts);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                    로딩 중...
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    아직 포스트가 없습니다
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    첫 번째 포스트를 작성해보세요!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    블로그 포스트
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    최신 포스트들을 확인해보세요
                </p>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {post.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {post.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 
                                             text-blue-800 dark:text-blue-200 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString(
                                'ko-KR',
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};
