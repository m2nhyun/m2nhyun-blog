'use client';

import { useRouter } from 'next/navigation';
import { PortfolioForm } from './PortfolioForm';

export const CreatePortfolio = () => {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/admin/portfolio');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/portfolio')}
                    className="text-gray-700 dark:text-gray-300 hover:underline mb-4"
                >
                    ← 포트폴리오 목록으로 돌아가기
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    새 프로젝트 추가
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    새로운 포트폴리오 프로젝트를 추가합니다.
                </p>
            </div>

            <PortfolioForm onComplete={handleComplete} />
        </div>
    );
};
