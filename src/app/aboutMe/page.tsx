export default function AboutMePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    About Me
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    안녕하세요! 프론트엔드 개발자 김민현입니다.
                </p>
            </div>

            <div className="space-y-8">
                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        소개
                    </h2>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <p>
                            사용자 경험을 중시하는 프론트엔드 개발자입니다.
                            깔끔하고 직관적인 인터페이스를 만들기 위해 항상
                            노력하고 있습니다.
                        </p>
                        <p>
                            최신 기술 스택을 활용하여 성능이 뛰어나고 유지보수가
                            쉬운 웹 애플리케이션을 개발합니다.
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        관심사
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                개발
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                React, TypeScript, Next.js 등 모던 웹 기술
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                취미
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                새로운 기술 학습, 오픈소스 기여
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
