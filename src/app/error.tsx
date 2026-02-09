'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    문제가 발생했습니다
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    페이지를 로드하는 중 오류가 발생했습니다.
                    <br />
                    잠시 후 다시 시도해주세요.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                    다시 시도
                </button>
            </div>
        </div>
    );
}
