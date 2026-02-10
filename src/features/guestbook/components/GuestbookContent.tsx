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
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    방명록
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    방문해주셔서 감사합니다. 자유롭게 메시지를 남겨주세요.
                </p>
            </div>

            {/* Form Section */}
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    메시지 남기기
                </h2>
                <GuestbookForm onComplete={handleFormComplete} />
            </div>

            {/* List Section */}
            <div>
                <GuestbookList key={refreshKey} />
            </div>
        </div>
    );
};
