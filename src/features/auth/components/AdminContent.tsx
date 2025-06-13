'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';

export const AdminContent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Firebase Auth 상태 확인 로직 구현
        const checkAuthStatus = () => {
            try {
                // 임시로 false 설정
                setIsAuthenticated(false);
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const handleLoginComplete = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        // TODO: Firebase Auth 로그아웃 로직 구현
        setIsAuthenticated(false);
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

    if (!isAuthenticated) {
        return <LoginForm onComplete={handleLoginComplete} />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    관리자 대시보드
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 
                             rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    로그아웃
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                              bg-white dark:bg-gray-800"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        포스트 관리
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        블로그 포스트를 작성, 수정, 삭제할 수 있습니다.
                    </p>
                    <button
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md 
                                     hover:bg-blue-700 transition-colors"
                    >
                        포스트 관리
                    </button>
                </div>

                <div
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                              bg-white dark:bg-gray-800"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        방명록 관리
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        방명록 메시지를 확인하고 관리할 수 있습니다.
                    </p>
                    <button
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md 
                                     hover:bg-green-700 transition-colors"
                    >
                        방명록 관리
                    </button>
                </div>

                <div
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                              bg-white dark:bg-gray-800"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        포트폴리오 관리
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        포트폴리오 프로젝트를 추가하고 관리할 수 있습니다.
                    </p>
                    <button
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-md 
                                     hover:bg-purple-700 transition-colors"
                    >
                        포트폴리오 관리
                    </button>
                </div>
            </div>

            <div
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                          bg-white dark:bg-gray-800"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    사이트 통계
                </h3>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            12
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            총 포스트
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            45
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            방명록 메시지
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            8
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            포트폴리오 프로젝트
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            1.2K
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            월간 방문자
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
