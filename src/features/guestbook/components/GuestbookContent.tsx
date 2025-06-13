'use client';

import { useState } from 'react';
import { GuestbookForm } from './GuestbookForm';
import { GuestbookList } from './GuestbookList';

export const GuestbookContent = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFormComplete = () => {
        // 폼 제출 완료 후 목록 새로고침
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    방명록
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    블로그를 방문해주셔서 감사합니다. 소중한 의견을 남겨주세요!
                </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        방명록 남기기
                    </h2>
                    <GuestbookForm onComplete={handleFormComplete} />
                </div>

                <div>
                    <GuestbookList key={refreshKey} />
                </div>
            </div>
        </div>
    );
};
