'use client';

import { useState, useEffect } from 'react';

// TODO: entities/guestbook-entry에서 타입 import 예정
interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    email?: string;
    createdAt: string;
}

export const GuestbookList = () => {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: services에서 방명록 목록 가져오기 로직 구현
        const fetchEntries = async () => {
            try {
                // 임시 데이터
                const mockEntries: GuestbookEntry[] = [
                    {
                        id: '1',
                        name: '홍길동',
                        message:
                            '좋은 블로그네요! 앞으로도 유익한 글 부탁드립니다.',
                        email: 'hong@example.com',
                        createdAt: '2024-01-15T10:30:00Z',
                    },
                    {
                        id: '2',
                        name: '김철수',
                        message:
                            '정말 도움이 되는 내용들이 많아서 자주 방문하고 있습니다. 감사합니다!',
                        createdAt: '2024-01-14T15:45:00Z',
                    },
                ];

                setEntries(mockEntries);
            } catch (error) {
                console.error('Failed to fetch guestbook entries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntries();
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                방명록 ({entries.length})
            </h2>

            {entries.map((entry) => (
                <div
                    key={entry.id}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                             bg-white dark:bg-gray-800"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 
                                          rounded-full flex items-center justify-center text-white font-bold"
                            >
                                {entry.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {entry.name}
                                </h4>
                                <time className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(
                                        entry.createdAt,
                                    ).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </time>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {entry.message}
                    </p>
                </div>
            ))}
        </div>
    );
};
