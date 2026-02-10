'use client';

import { useState, useEffect } from 'react';
import { GuestbookEntry } from '@/entities/guestbook-entry';
import { getGuestbookEntries } from '@/app/actions/guestbook';
import { GuestbookListSkeleton } from '@/shared/ui';

export const GuestbookList = () => {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await getGuestbookEntries(true);
                setEntries(data);
            } catch (err) {
                console.error('Failed to fetch guestbook entries:', err);
                setError('방명록을 불러오는데 실패했습니다');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntries();
    }, []);

    if (isLoading) {
        return <GuestbookListSkeleton />;
    }

    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        getGuestbookEntries(true)
            .then(setEntries)
            .catch(() => setError('방명록을 불러오는데 실패했습니다'))
            .finally(() => setIsLoading(false));
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    아직 방명록이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    첫 번째 방명록을 남겨주세요!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    전체 방명록
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {entries.length}개
                </span>
            </div>

            <div className="space-y-3">
                {entries.map((entry) => (
                    <div
                        key={entry.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                                {entry.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        {entry.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(
                                            entry.createdAt,
                                        ).toLocaleDateString('ko-KR', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {entry.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
