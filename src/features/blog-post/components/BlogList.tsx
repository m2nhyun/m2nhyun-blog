'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts } from '../services/postService';
import { Post } from '@/entities/post';

export const BlogList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await getPosts(true); // 게시된 포스트만
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
                setError('포스트를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">포스트를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    아직 포스트가 없습니다
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    첫 번째 포스트를 작성해보세요!
                </p>
                <Link 
                    href="/admin"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    포스트 작성하기
                </Link>
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
                    총 {posts.length}개의 포스트
                </p>
            </div>
            
            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getExcerpt = (content: string, maxLength: number = 150) => {
        if (post.excerpt) return post.excerpt;
        
        // Markdown 문법 제거
        const plainText = content
            .replace(/#{1,6}\s+/g, '') // 헤딩
            .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드
            .replace(/\*(.*?)\*/g, '$1') // 이탤릭
            .replace(/`(.*?)`/g, '$1') // 인라인 코드
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 이미지
            .replace(/\n+/g, ' ') // 줄바꿈
            .trim();
            
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    };

    return (
        <article className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href={`/blog/${post.slug}`}>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {post.title}
                            </h2>
                        </Link>
                        {post.featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 
                                           text-yellow-800 dark:text-yellow-200 rounded-full">
                                Featured
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatDate(post.createdAt)}</span>
                        <span>작성자: {post.author}</span>
                        {post.views !== undefined && (
                            <span>조회 {post.views}회</span>
                        )}
                        {post.category && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                                {post.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {getExcerpt(post.content)}
            </p>
            
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 
                                     text-blue-800 dark:text-blue-200 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
            
            <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
                자세히 보기 →
            </Link>
        </article>
    );
};
