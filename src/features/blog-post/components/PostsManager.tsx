'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPosts, deletePost } from '@/app/actions/post';
import { Post } from '@/entities/post';

export const PostsManager = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const data = await getPosts(false); // 모든 포스트 (미발행 포함)
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 포스트를 삭제하시겠습니까?`)) {
            return;
        }

        setDeletingId(id);
        try {
            await deletePost(id);
            setPosts((prev) => prev.filter((post) => post.id !== id));
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setDeletingId(null);
        }
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

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin')}
                    className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
                >
                    ← 관리자 대시보드로 돌아가기
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            포스트 관리
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            총 {posts.length}개의 포스트
                        </p>
                    </div>
                    <Link
                        href="/admin/posts/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        새 포스트 작성
                    </Link>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    아직 작성된 포스트가 없습니다.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    제목
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    카테고리
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    상태
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    조회수
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    작성일
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr
                                    key={post.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {post.title}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                /{post.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {post.category || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            {post.published ? (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                                                    발행됨
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                                                    임시저장
                                                </span>
                                            )}
                                            {post.featured && (
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                                                    주요
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                                        {post.views || 0}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(
                                            post.createdAt,
                                        ).toLocaleDateString('ko-KR')}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                            >
                                                보기
                                            </Link>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                            >
                                                수정
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        post.id,
                                                        post.title,
                                                    )
                                                }
                                                disabled={
                                                    deletingId === post.id
                                                }
                                                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                                            >
                                                {deletingId === post.id
                                                    ? '삭제 중...'
                                                    : '삭제'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
