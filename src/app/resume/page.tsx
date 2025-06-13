export default function ResumePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    이력서
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    김민현의 경력과 기술 스택을 소개합니다.
                </p>
            </div>

            <div className="space-y-8">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        기술 스택
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Frontend
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                React, Next.js, TypeScript, Tailwind CSS
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Backend
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Node.js, Firebase, PostgreSQL
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        경력
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        자세한 이력서는 준비 중입니다.
                    </p>
                </section>
            </div>
        </div>
    );
}
