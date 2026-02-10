'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    getGuestbookEntries,
    deleteGuestbookEntry,
    approveGuestbookEntry,
} from '@/app/actions/guestbook';
import { GuestbookEntry } from '@/entities/guestbook-entry';

export const GuestbookManager = () => {
    const router = useRouter();
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await getGuestbookEntries(false); // 모든 항목 (미승인 포함)
            setEntries(data);
        } catch (error) {
            console.error('Failed to fetch entries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await approveGuestbookEntry(id);
            setEntries((prev) =>
                prev.map((entry) =>
                    entry.id === id ? { ...entry, approved: true } : entry,
                ),
            );
        } catch (error) {
            console.error('Failed to approve entry:', error);
            alert('승인 중 오류가 발생했습니다.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}"님의 방명록을 삭제하시겠습니까?`)) {
            return;
        }

        setProcessingId(id);
        try {
            await deleteGuestbookEntry(id);
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
        } catch (error) {
            console.error('Failed to delete entry:', error);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredEntries = entries.filter((entry) => {
        if (filter === 'pending') return !entry.approved;
        if (filter === 'approved') return entry.approved;
        return true;
    });

    const pendingCount = entries.filter((e) => !e.approved).length;

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
                            방명록 관리
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            총 {entries.length}개의 방명록
                            {pendingCount > 0 && (
                                <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                                    ({pendingCount}개 승인 대기)
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* 필터 */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            filter === 'all'
                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        전체 ({entries.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        승인 대기 ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            filter === 'approved'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        승인됨 ({entries.length - pendingCount})
                    </button>
                </div>
            </div>

            {filteredEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {filter === 'pending'
                        ? '승인 대기 중인 방명록이 없습니다.'
                        : filter === 'approved'
                          ? '승인된 방명록이 없습니다.'
                          : '아직 작성된 방명록이 없습니다.'}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                        <div
                            key={entry.id}
                            className={`p-4 border rounded-lg ${
                                entry.approved
                                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                    : 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {entry.name}
                                        </span>
                                        {entry.email && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                ({entry.email})
                                            </span>
                                        )}
                                        {!entry.approved && (
                                            <span className="px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded">
                                                승인 대기
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {entry.message}
                                    </p>
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            entry.createdAt,
                                        ).toLocaleString('ko-KR')}
                                        {entry.website && (
                                            <a
                                                href={entry.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-gray-600 dark:text-gray-400 hover:underline"
                                            >
                                                웹사이트
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    {!entry.approved && (
                                        <button
                                            onClick={() =>
                                                handleApprove(entry.id)
                                            }
                                            disabled={processingId === entry.id}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                        >
                                            {processingId === entry.id
                                                ? '처리 중...'
                                                : '승인'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleDelete(entry.id, entry.name)
                                        }
                                        disabled={processingId === entry.id}
                                        className="px-3 py-1 text-sm text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
