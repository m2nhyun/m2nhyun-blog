'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from './PostForm';

export const CreatePost = () => {
    const router = useRouter();

    const handlePostComplete = () => {
        // 포스트 작성 완료 후 관리자 페이지로 리다이렉트
        router.push('/admin');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin')}
                    className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
                >
                    ← 관리자 대시보드로 돌아가기
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    새 포스트 작성
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    새로운 블로그 포스트를 작성해보세요. Markdown 문법을
                    지원합니다.
                </p>
            </div>

            <PostForm onComplete={handlePostComplete} />
        </div>
    );
};
