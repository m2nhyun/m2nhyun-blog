'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    getPortfolioItems,
    deletePortfolioItem,
} from '@/app/actions/portfolio';
import { PortfolioItem } from '@/entities/portfolio-item';

const categoryLabels: Record<PortfolioItem['category'], string> = {
    web: '웹',
    mobile: '모바일',
    desktop: '데스크톱',
    library: '라이브러리',
    design: '디자인',
};

const statusLabels: Record<PortfolioItem['status'], string> = {
    completed: '완료',
    'in-progress': '진행 중',
    planned: '계획됨',
};

const statusColors: Record<PortfolioItem['status'], string> = {
    completed:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'in-progress':
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    planned: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export const PortfolioManager = () => {
    const router = useRouter();
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const data = await getPortfolioItems(false);
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch portfolio items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) {
            return;
        }

        setDeletingId(id);
        try {
            await deletePortfolioItem(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to delete portfolio item:', error);
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
                    className="text-gray-700 dark:text-gray-300 hover:underline mb-4"
                >
                    ← 관리자 대시보드로 돌아가기
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            포트폴리오 관리
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            총 {items.length}개의 프로젝트
                        </p>
                    </div>
                    <Link
                        href="/admin/portfolio/new"
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                        새 프로젝트 추가
                    </Link>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    아직 등록된 포트폴리오가 없습니다.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {item.title}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    #{item.order}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {item.description}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {item.technologies.slice(0, 3).map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {item.technologies.length > 3 && (
                                    <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                                        +{item.technologies.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    className={`px-2 py-0.5 text-xs rounded ${statusColors[item.status]}`}
                                >
                                    {statusLabels[item.status]}
                                </span>
                                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                                    {categoryLabels[item.category]}
                                </span>
                                {item.featured && (
                                    <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                                        주요
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                {item.githubUrl && (
                                    <a
                                        href={item.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {item.liveUrl && (
                                    <a
                                        href={item.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        Live
                                    </a>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                    href={`/admin/portfolio/${item.id}/edit`}
                                    className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    수정
                                </Link>
                                <button
                                    onClick={() =>
                                        handleDelete(item.id, item.title)
                                    }
                                    disabled={deletingId === item.id}
                                    className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                                >
                                    {deletingId === item.id
                                        ? '삭제 중...'
                                        : '삭제'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
