'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPortfolioItems } from '@/app/actions/portfolio';
import { PortfolioItem } from '@/entities/portfolio-item';
import { PortfolioForm } from './PortfolioForm';

interface EditPortfolioProps {
    itemId: string;
}

export const EditPortfolio = ({ itemId }: EditPortfolioProps) => {
    const router = useRouter();
    const [item, setItem] = useState<PortfolioItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const items = await getPortfolioItems(false);
                const found = items.find((i) => i.id === itemId);
                if (!found) {
                    setError('포트폴리오를 찾을 수 없습니다.');
                } else {
                    setItem(found);
                }
            } catch (err) {
                console.error('Failed to fetch portfolio item:', err);
                setError('포트폴리오를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    const handleEditComplete = () => {
        router.push('/admin/portfolio');
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

    if (error || !item) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error || '포트폴리오를 찾을 수 없습니다.'}
                    </p>
                    <button
                        onClick={() => router.push('/admin/portfolio')}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        포트폴리오 목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/portfolio')}
                    className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
                >
                    ← 포트폴리오 목록으로 돌아가기
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    포트폴리오 수정
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    &ldquo;{item.title}&rdquo; 프로젝트를 수정합니다.
                </p>
            </div>

            <PortfolioForm item={item} onComplete={handleEditComplete} />
        </div>
    );
};
