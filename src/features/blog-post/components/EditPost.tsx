'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPost } from '@/app/actions/post';
import { Post } from '@/entities/post';
import { PostForm } from './PostForm';

interface EditPostProps {
    postId: string;
}

export const EditPost = ({ postId }: EditPostProps) => {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPost(postId);
                if (!data) {
                    setError('포스트를 찾을 수 없습니다.');
                } else {
                    setPost(data);
                }
            } catch (err) {
                console.error('Failed to fetch post:', err);
                setError('포스트를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleEditComplete = () => {
        router.push('/admin/posts');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                    로딩 중...
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error || '포스트를 찾을 수 없습니다.'}
                    </p>
                    <button
                        onClick={() => router.push('/admin/posts')}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        포스트 목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/posts')}
                    className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
                >
                    ← 포스트 목록으로 돌아가기
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    포스트 수정
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    &ldquo;{post.title}&rdquo; 포스트를 수정합니다.
                </p>
            </div>

            <PostForm post={post} onComplete={handleEditComplete} />
        </div>
    );
};
