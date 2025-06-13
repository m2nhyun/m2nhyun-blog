'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { logout, onAuthStateChange, AuthUser } from '../services/authService';

export const AdminContent = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((authUser) => {
            setUser(authUser);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
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

    if (!user) {
        return <LoginForm onComplete={() => setIsLoading(true)} />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        관리자 대시보드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        환영합니다, {user.displayName || user.email}님!
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 
                             rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    로그아웃
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/posts" className="block">
                    <div
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                                  bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                        <div className="text-3xl mb-4">📝</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            포스트 관리
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            블로그 포스트를 작성, 수정, 삭제할 수 있습니다.
                        </p>
                        <div className="text-blue-600 dark:text-blue-400 font-medium">
                            관리하기 →
                        </div>
                    </div>
                </Link>

                <Link href="/admin/guestbook" className="block">
                    <div
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                                  bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                        <div className="text-3xl mb-4">💬</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            방명록 관리
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            방명록 메시지를 확인하고 관리할 수 있습니다.
                        </p>
                        <div className="text-green-600 dark:text-green-400 font-medium">
                            관리하기 →
                        </div>
                    </div>
                </Link>

                <Link href="/admin/portfolio" className="block">
                    <div
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg 
                                  bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                        <div className="text-3xl mb-4">💻</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            포트폴리오 관리
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            포트폴리오 프로젝트를 추가하고 관리할 수 있습니다.
                        </p>
                        <div className="text-purple-600 dark:text-purple-400 font-medium">
                            관리하기 →
                        </div>
                    </div>
                </Link>
            </div>

            {/* 빠른 포스트 작성 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    빠른 작업
                </h2>
                <div className="flex gap-4">
                    <Link
                        href="/admin/posts/new"
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        새 포스트 작성
                    </Link>
                    <Link
                        href="/blog"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        블로그 보기
                    </Link>
                </div>
            </div>

            {/* 통계 섹션 */}
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
                            ?
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            총 포스트
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ?
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            방명록 메시지
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            ?
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            포트폴리오 프로젝트
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            ?
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            월간 조회수
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    💡 실제 통계는 Firebase에서 데이터를 가져와 표시됩니다
                </p>
            </div>
        </div>
    );
};
